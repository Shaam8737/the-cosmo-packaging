const fs = require("fs");
const path = require("path");

const out = path.resolve(__dirname, "../assets/week-01/reels");
fs.mkdirSync(out, { recursive: true });

const reels = [
  {
    id: "R01-cheap-online",
    eyebrow: "BEAUTY FOUNDER CHECK",
    hook: "Why your product looks cheap online",
    beats: [
      ["01", "Weak hierarchy", "If every detail shouts, nothing feels premium."],
      ["02", "Poor product fit", "Empty space and loose inserts weaken presentation."],
      ["03", "No range system", "Every SKU should feel like part of one brand."],
    ],
    close: "Fix the structure. Then refine the finish.",
    cta: "SAVE THIS • LINK IN BIO FOR A QUOTE"
  },
  {
    id: "R02-packaging-mistakes",
    eyebrow: "3 PACKAGING MISTAKES",
    hook: "Beautiful packaging can still fail",
    beats: [
      ["01", "Choosing finish first", "Start with product, use case, and structure."],
      ["02", "Crowding the front", "Give the brand and product name room to lead."],
      ["03", "Skipping proof checks", "Review folds, copy, color, and finish placement."],
    ],
    close: "Premium means intentional—not overloaded.",
    cta: "SAVE BEFORE YOUR NEXT LAUNCH"
  },
  {
    id: "R03-budget-decisions",
    eyebrow: "PACKAGING BUDGET",
    hook: "Your budget should buy decisions—not decoration",
    beats: [
      ["01", "The right structure", "A format built around the product and journey."],
      ["02", "A cleaner proof", "Clear artwork, hierarchy, folds, and finish notes."],
      ["03", "Purposeful upgrades", "Use premium details only where they add value."],
    ],
    close: "Spend first on clarity, fit, and consistency.",
    cta: "PLAN YOUR QUOTE • LINK IN BIO"
  },
  {
    id: "R04-before-sampling",
    eyebrow: "BEFORE YOU SAMPLE",
    hook: "Do these 3 things first",
    beats: [
      ["01", "Measure the full product", "Include caps, pumps, applicators, and inserts."],
      ["02", "Name the job", "Retail, ecommerce, PR gifting, or a launch kit?"],
      ["03", "Prepare your files", "Logo, required copy, references, and artwork status."],
    ],
    close: "A clearer brief creates a more useful sample.",
    cta: "DM “SAMPLE” OR USE THE LINK IN BIO"
  }
];

function esc(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function html(r) {
  const beatScenes = r.beats.map((b, i) => `
    <section class="scene s${i + 2}">
      <div class="ghost">${b[0]}</div>
      <div class="top"><span>COSMO<span class="gold">.</span></span><small>${esc(r.eyebrow)}</small></div>
      <div class="content">
        <div class="num">${b[0]}</div>
        <h2>${esc(b[1])}</h2>
        <p>${esc(b[2])}</p>
        <div class="diagram"><i></i><i></i><i></i></div>
      </div>
    </section>`).join("");
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#151A38}
body{font-family:Arial,Helvetica,sans-serif;color:#F2F2F2}
.reel{position:relative;width:1080px;height:1920px;background:#151A38;overflow:hidden}
.scene{position:absolute;inset:0;padding:100px 86px 120px;background:#151A38;opacity:0;animation:scene 3s both}
.s1{animation-delay:0s}.s2{animation-delay:3s}.s3{animation-delay:6s}.s4{animation-delay:9s}
.top{display:flex;justify-content:space-between;align-items:center;font-family:Georgia,serif;font-size:48px;letter-spacing:7px}
.top small{font:600 19px Arial;letter-spacing:4px;color:#BEC5D9}.gold{color:#C8A45C}
.rule{width:100%;height:2px;background:#343B63;margin-top:55px;transform-origin:left;animation:rule 3s both}
.s1 .rule{animation-delay:.18s}
.hook{display:flex;flex-direction:column;justify-content:center;height:1370px}
h1,h2{margin:0;letter-spacing:-.045em;line-height:.98;font-weight:900}
h1{font-size:130px;max-width:920px;animation:hook .8s .28s both}
.sub{margin-top:60px;font-size:32px;line-height:1.35;color:#BEC5D9;max-width:760px;animation:up .55s .62s both}
.swipe{margin-top:80px;color:#6199F7;font-weight:700;letter-spacing:3px;animation:up .45s .82s both}
.content{height:1460px;display:flex;flex-direction:column;justify-content:center;position:relative}
.num{font:400 138px Georgia;color:#6199F7;animation:num .65s .25s both}
h2{font-size:112px;max-width:860px;margin-top:48px;animation:up .65s .45s both}
p{font-size:39px;line-height:1.38;color:#BEC5D9;max-width:810px;margin:65px 0 0;animation:up .55s .68s both}
.diagram{display:flex;gap:22px;margin-top:95px;animation:up .45s .9s both}
.diagram i{display:block;width:170px;height:18px;border-radius:9px;background:#6199F7}.diagram i:nth-child(2){width:110px;background:#F2F2F2}.diagram i:nth-child(3){width:70px;background:#C8A45C}
.ghost{position:absolute;right:-40px;bottom:80px;font:400 720px Georgia;color:#1D2345;line-height:1}
.close{display:flex;flex-direction:column;justify-content:center;height:1400px}
.close h2{font-size:116px;animation:hook .8s .25s both}
.cta{margin-top:85px;border:3px solid #6199F7;border-radius:60px;padding:32px 42px;width:max-content;font-size:25px;font-weight:800;letter-spacing:2px;animation:up .55s .65s both}
.url{position:absolute;left:86px;bottom:90px;font-size:22px;letter-spacing:4px;color:#BEC5D9}
@keyframes scene{0%{opacity:0;transform:translateX(70px);filter:blur(10px)}10%{opacity:1;transform:none;filter:none}88%{opacity:1;transform:none;filter:none}100%{opacity:0;transform:translateX(-55px);filter:blur(8px)}}
@keyframes hook{from{opacity:0;transform:translateY(80px) scale(.96)}to{opacity:1;transform:none}}
@keyframes up{from{opacity:0;transform:translateY(45px)}to{opacity:1;transform:none}}
@keyframes num{from{opacity:0;transform:translateX(-70px) rotate(-6deg)}to{opacity:1;transform:none}}
@keyframes rule{from{transform:scaleX(0)}to{transform:scaleX(1)}}
</style></head><body>
<main class="reel">
  <section class="scene s1">
    <div class="top"><span>COSMO<span class="gold">.</span></span><small>${esc(r.eyebrow)}</small></div>
    <div class="rule"></div>
    <div class="hook"><h1>${esc(r.hook)}</h1><div class="sub">A 12-second packaging check for beauty brands.</div><div class="swipe">WATCH THE 3-POINT FIX →</div></div>
  </section>
  ${beatScenes}
  <section class="scene s4">
    <div class="top"><span>COSMO<span class="gold">.</span></span><small>NEXT STEP</small></div>
    <div class="close"><h2>${esc(r.close)}</h2><div class="cta">${esc(r.cta)}</div></div>
    <div class="url">THECOSMOPACKAGING.COM</div>
  </section>
</main>
<script>setTimeout(()=>document.body.dataset.finished="true",12000)</script>
</body></html>`;
}

for (const r of reels) {
  const dir = path.join(out, r.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html(r));
}
console.log(`Created ${reels.length} reel compositions in ${out}`);
