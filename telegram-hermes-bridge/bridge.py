"""
Telegram -> Hermes/Project bridge for The Cosmo Packaging.

SAFETY MODEL (read this before changing anything):
- Only the single Telegram user in TELEGRAM_ALLOWED_USER_ID is obeyed. Everyone
  else is ignored and logged.
- NO arbitrary shell execution. Only a fixed allow-list of read-only commands.
- The only external binary ever invoked is `hermes` with FIXED args
  (`--help` / `--version`) for capability/health checks. User-supplied text
  (<task>, <slug>) is NEVER passed as shell arguments — it only ever becomes
  prompt text inside a task file.
- Default behaviour for agent commands is "prepare a task file", not "auto-run
  the agent". This guarantees the bridge itself never edits project files.
- Secrets come from .env. Nothing is hard-coded.
"""

import os
import re
import time
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import requests
from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent
load_dotenv(HERE / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
ALLOWED_USER_ID = os.getenv("TELEGRAM_ALLOWED_USER_ID", "").strip()
PROJECT_DIR = Path(os.getenv("COSMO_PROJECT_DIR", "").strip())
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434/v1").strip()
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5-coder:3b").strip()

API = f"https://api.telegram.org/bot{BOT_TOKEN}"
TASKS_DIR = PROJECT_DIR / ".agent-tasks"
LOG_DIR = HERE / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "bridge.log"

SLUG_RE = re.compile(r"[^a-z0-9-]+")


# ----------------------------------------------------------------------------- helpers
def log(line: str) -> None:
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
    entry = f"[{stamp}] {line}"
    print(entry, flush=True)
    try:
        with LOG_FILE.open("a", encoding="utf-8") as fh:
            fh.write(entry + "\n")
    except OSError:
        pass


def safe_slug(text: str) -> str:
    return SLUG_RE.sub("-", text.strip().lower()).strip("-")[:60] or "task"


def tg(method: str, **params):
    try:
        r = requests.post(f"{API}/{method}", json=params, timeout=40)
        return r.json()
    except requests.RequestException as exc:
        log(f"telegram error on {method}: {exc}")
        return {}


def send(chat_id: int, text: str) -> None:
    # Telegram hard-limits messages to 4096 chars.
    for i in range(0, len(text), 3500):
        tg("sendMessage", chat_id=chat_id, text=text[i : i + 3500])


def run_fixed(args, timeout=15):
    """Run a FIXED command list (no shell, no user input). Returns (ok, output)."""
    try:
        proc = subprocess.run(
            args, cwd=str(PROJECT_DIR), capture_output=True, text=True,
            timeout=timeout, shell=False,
        )
        return True, (proc.stdout or proc.stderr or "").strip()
    except FileNotFoundError:
        return False, "not installed / not on PATH"
    except subprocess.TimeoutExpired:
        return False, "timed out"
    except OSError as exc:
        return False, str(exc)


def hermes_help():
    return run_fixed(["hermes", "--help"], timeout=20)


def hermes_supports_noninteractive() -> bool:
    ok, out = hermes_help()
    if not ok:
        return False
    low = out.lower()
    return any(flag in low for flag in ("--prompt", "-p,", "noninteractive", "non-interactive", " run ", "exec"))


def ollama_status():
    base = OLLAMA_BASE_URL.replace("/v1", "")
    try:
        r = requests.get(f"{base}/api/tags", timeout=5)
        if r.ok:
            models = [m.get("name") for m in r.json().get("models", [])]
            return True, models
        return False, []
    except requests.RequestException:
        return False, []


def write_task_file(name: str, prompt: str) -> Path:
    TASKS_DIR.mkdir(exist_ok=True)
    date = datetime.now().strftime("%Y-%m-%d")
    path = TASKS_DIR / f"{date}-{name}.md"
    path.write_text(prompt, encoding="utf-8")
    return path


SOURCE_OF_TRUTH = (
    "You are working on The Cosmo Packaging website (Next.js static export in "
    "cosmo-next/). Use CLAUDE.md / AGENTS.md / business-ops/automation-lab/"
    "WEBSITE-ARCHITECTURE-LOCKED.md as the source of truth. Read-only / audit / "
    "plan task — DO NOT edit, create, delete, deploy, or push anything."
)


def make_task(chat_id: int, name: str, body: str) -> None:
    """Default safe path: write a prompt file, tell the owner to run Hermes."""
    prompt = f"# {name}\n\n{SOURCE_OF_TRUTH}\n\n{body}\n"
    path = write_task_file(safe_slug(name), prompt)
    rel = path.relative_to(PROJECT_DIR)
    send(
        chat_id,
        f"Task file created:\n{rel}\n\nOpen Hermes in the project folder "
        f"(model {OLLAMA_MODEL}) and run this task. Output stays on the laptop.",
    )
    log(f"task file written: {path.name}")


# ----------------------------------------------------------------------------- commands
def cmd_start(chat_id, _arg):
    send(chat_id, "Cosmo bridge online. Read-only / audit / plan mode. Send /help for commands.")


def cmd_help(chat_id, _arg):
    send(chat_id, (
        "Commands (all read-only):\n"
        "/status - bridge, project, Ollama, Hermes health\n"
        "/project - project folder summary\n"
        "/cosmo_lock - locked project rules summary\n"
        "/cosmo_plan <task> - plan only, no edits\n"
        "/cosmo_homepage - audit homepage\n"
        "/cosmo_product <slug> - audit one product page\n"
        "/cosmo_taxonomy - audit Product/Style/Materials separation\n"
        "/cosmo_seo <slug> - SEO QA on one page\n"
        "/cosmo_final_qa - final QA vs project rules\n"
        "/help - this list"
    ))


def cmd_status(chat_id, _arg):
    proj_ok = PROJECT_DIR.exists()
    oll_ok, models = ollama_status()
    her_ok, her_out = hermes_help()
    model_line = OLLAMA_MODEL
    if oll_ok and models:
        model_line = OLLAMA_MODEL + (" (loaded)" if OLLAMA_MODEL in models else f" (not pulled; have: {', '.join(models[:4])})")
    send(chat_id, (
        "STATUS\n"
        f"- Bridge: running\n"
        f"- Project path: {'OK ' + str(PROJECT_DIR) if proj_ok else 'MISSING'}\n"
        f"- Ollama: {'reachable' if oll_ok else 'unreachable'} ({OLLAMA_BASE_URL})\n"
        f"- Hermes: {'reachable' if her_ok else 'unreachable / not on PATH'}\n"
        f"- Model: {model_line}"
    ))


def cmd_project(chat_id, _arg):
    if not PROJECT_DIR.exists():
        send(chat_id, "Project path missing. Check COSMO_PROJECT_DIR in .env.")
        return
    items = []
    for entry in sorted(PROJECT_DIR.iterdir()):
        if entry.name.startswith("."):
            continue
        items.append(f"{'[dir] ' if entry.is_dir() else '      '}{entry.name}")
    send(chat_id, "PROJECT SUMMARY (read-only)\n" + "\n".join(items[:40]))


def cmd_lock(chat_id, _arg):
    out = ["LOCKED RULES (read-only summary)"]
    for rel in ("CLAUDE.md", "AGENTS.md", "business-ops/automation-lab/WEBSITE-ARCHITECTURE-LOCKED.md"):
        p = PROJECT_DIR / rel
        if p.exists():
            head = p.read_text(encoding="utf-8", errors="ignore").strip().splitlines()
            snippet = "\n".join(head[:20])
            out.append(f"\n--- {rel} ---\n{snippet}")
        else:
            out.append(f"\n--- {rel} --- (not found)")
    send(chat_id, "\n".join(out))


def cmd_plan(chat_id, arg):
    if not arg:
        send(chat_id, "Usage: /cosmo_plan <task>")
        return
    body = (
        f"Create a plan only. Do not edit files.\nTask: {arg}\n\nReturn:\n"
        "1. understanding\n2. files likely needing edits\n3. implementation plan\n"
        "4. risks\n5. acceptance checklist"
    )
    make_task(chat_id, f"cosmo-plan-{safe_slug(arg)}", body)


def cmd_homepage(chat_id, _arg):
    make_task(chat_id, "cosmo-audit-homepage", (
        "Audit the homepage (cosmo-next/src/app/page.tsx + its components) ONLY. "
        "Check structure vs the locked architecture (Hero, Boxes by Style with all "
        "13 styles, Our Products = real products only, Guides section, sample-kit "
        "with no public pricing). List issues + recommended fixes. No file edits."
    ))


def cmd_product(chat_id, arg):
    if not arg:
        send(chat_id, "Usage: /cosmo_product <slug>")
        return
    slug = safe_slug(arg)
    make_task(chat_id, f"cosmo-audit-product-{slug}", (
        f"Audit the single product page /products/{slug}/ "
        f"(cosmo-next/src/app/products/[slug]/page.tsx for slug '{slug}'). Check: "
        "title, images + quote form above the fold, style-aware MOQ, recommended "
        "styles/materials/finishes, FAQs, breadcrumbs, no public pricing. List "
        "issues + fixes. No file edits."
    ))


def cmd_taxonomy(chat_id, _arg):
    make_task(chat_id, "cosmo-audit-taxonomy", (
        "Audit the Product / Style / Materials & Finishes separation. Confirm "
        "structural items (mylar, tuck, magnetic, mailer, display, labels, etc) are "
        "treated as Styles and excluded from 'Packaging by Product' listings, the 13 "
        "style pages + materials-finishes page exist, and Explore More shows the "
        "right siblings. List any leaks/cannibalization. No file edits."
    ))


def cmd_seo(chat_id, arg):
    if not arg:
        send(chat_id, "Usage: /cosmo_seo <slug>")
        return
    slug = safe_slug(arg)
    make_task(chat_id, f"cosmo-seo-{slug}", (
        f"Run SEO QA on the page for '{slug}'. Check: unique title + meta "
        "description, self-canonical, single H1, breadcrumb + relevant JSON-LD, "
        "unique body copy (no thin/duplicate), internal links, no banned/middleman "
        "wording, no fixed public prices. List issues + fixes. No file edits."
    ))


def cmd_final_qa(chat_id, _arg):
    make_task(chat_id, "cosmo-final-qa", (
        "Run a final QA of the website against the locked project rules "
        "(WEBSITE-ARCHITECTURE-LOCKED.md + AGENTS.md): taxonomy separation, product "
        "page formula, no public pricing, sourcing/coordination wording (no "
        "manufacturer claims), nav, sample-kit copy, sitemap/robots, build green. "
        "Return a pass/fail checklist with any blockers. No file edits."
    ))


HANDLERS = {
    "/start": cmd_start, "/help": cmd_help, "/status": cmd_status,
    "/project": cmd_project, "/cosmo_lock": cmd_lock, "/cosmo_plan": cmd_plan,
    "/cosmo_homepage": cmd_homepage, "/cosmo_product": cmd_product,
    "/cosmo_taxonomy": cmd_taxonomy, "/cosmo_seo": cmd_seo,
    "/cosmo_final_qa": cmd_final_qa,
}


def handle(update: dict) -> None:
    msg = update.get("message") or update.get("edited_message")
    if not msg:
        return
    user_id = str((msg.get("from") or {}).get("id", ""))
    chat_id = (msg.get("chat") or {}).get("id")
    text = (msg.get("text") or "").strip()

    if user_id != ALLOWED_USER_ID:
        log(f"DENIED user_id={user_id} text={text[:60]!r}")
        return  # silent ignore for unauthorized users
    if not text.startswith("/"):
        send(chat_id, "Send a command. /help for the list.")
        return

    parts = text.split(maxsplit=1)
    cmd = parts[0].split("@")[0].lower()  # strip @botname if present
    arg = parts[1].strip() if len(parts) > 1 else ""
    handler = HANDLERS.get(cmd)
    log(f"OK user={user_id} cmd={cmd} arg={arg[:40]!r}")
    if handler:
        handler(chat_id, arg)
    else:
        send(chat_id, f"Unknown command {cmd}. /help for the list.")


# ----------------------------------------------------------------------------- main loop
def main() -> None:
    problems = []
    if not BOT_TOKEN:
        problems.append("TELEGRAM_BOT_TOKEN")
    if not ALLOWED_USER_ID:
        problems.append("TELEGRAM_ALLOWED_USER_ID")
    if not str(PROJECT_DIR):
        problems.append("COSMO_PROJECT_DIR")
    if problems:
        raise SystemExit(f"Missing .env values: {', '.join(problems)}. Copy .env.example to .env and fill it.")

    log(f"bridge started. project={PROJECT_DIR} model={OLLAMA_MODEL}")
    offset = None
    while True:
        try:
            resp = requests.get(
                f"{API}/getUpdates",
                params={"timeout": 30, "offset": offset},
                timeout=40,
            ).json()
        except requests.RequestException as exc:
            log(f"poll error: {exc}")
            time.sleep(5)
            continue

        for update in resp.get("result", []):
            offset = update["update_id"] + 1
            try:
                handle(update)
            except Exception as exc:  # never crash the loop on one bad message
                log(f"handler crash: {exc}")


if __name__ == "__main__":
    main()
