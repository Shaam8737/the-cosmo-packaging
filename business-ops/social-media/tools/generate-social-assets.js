const fs = require("fs");
const path = require("path");
const sharp = require(path.resolve(__dirname, "../../../cosmo-next/node_modules/sharp"));

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets");
const NAVY = "#151A38";
const CREAM = "#F2F2F2";
const BLUE = "#6199F7";
const GOLD = "#C8A45C";
const INK = "#161616";
const MUTED = "#AEB5CB";

const ensure = (p) => fs.mkdirSync(p, { recursive: true });
const esc = (s) => String(s)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock(text, x, y, {
  max = 28, size = 72, lineHeight = 1.05, fill = CREAM,
  weight = 700, family = "Arial, Helvetica, sans-serif",
  letterSpacing = 0, anchor = "start"
} = {}) {
  const lines = Array.isArray(text) ? text : wrap(text, max);
  const tspans = lines.map((line, i) =>
    `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineHeight}">${esc(line)}</tspan>`
  ).join("");
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}" text-anchor="${anchor}">${tspans}</text>`;
}

function wordmark(x, y, scale = 1, light = true) {
  const color = light ? CREAM : NAVY;
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <text x="0" y="0" fill="${color}" font-family="Georgia, 'Times New Roman', serif" font-size="58" letter-spacing="7">COSMO</text>
      <circle cx="251" cy="-13" r="5.5" fill="${GOLD}"/>
    </g>`;
}

function footer(page, total, width = 1080, light = true) {
  const color = light ? CREAM : NAVY;
  const muted = light ? MUTED : "#6E7488";
  return `
    <line x1="72" y1="1264" x2="${width - 72}" y2="1264" stroke="${light ? "#33395D" : "#D5D9E4"}" stroke-width="2"/>
    <text x="72" y="1310" fill="${muted}" font-family="Arial" font-size="22" letter-spacing="3">THECOSMOPACKAGING.COM</text>
    <text x="${width - 72}" y="1310" text-anchor="end" fill="${color}" font-family="Arial" font-size="24">${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>`;
}

function arrow(x1, y1, x2, y2, color = BLUE) {
  return `<path d="M${x1} ${y1} H${x2 - 24} M${x2 - 44} ${y2 - 20} L${x2 - 24} ${y2} L${x2 - 44} ${y2 + 20}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const icons = {
  ruler: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"><rect x="0" y="24" width="190" height="66" rx="12"/><path d="M28 24v22m28-22v13m28-13v22m28-22v13m28-13v22m28-22v13"/></g>`,
  quantity: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5"><rect x="22" y="8" width="82" height="82" rx="12"/><rect x="88" y="44" width="82" height="82" rx="12"/><rect x="154" y="80" width="82" height="82" rx="12"/></g>`,
  box: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"><path d="M20 58L112 8l92 50-92 52z"/><path d="M20 58v104l92 52 92-52V58M112 110v104"/></g>`,
  artwork: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"><path d="M34 8h120l50 50v148H34z"/><path d="M154 8v50h50"/><circle cx="82" cy="92" r="20"/><path d="M56 170l42-45 30 28 24-25 34 42z"/></g>`,
  delivery: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"><path d="M12 44h132v92H12zM144 78h47l31 34v24h-78z"/><circle cx="62" cy="150" r="18"/><circle cx="178" cy="150" r="18"/><path d="M35 18h85"/></g>`,
  save: (x, y, s = 1, c = BLUE) => `<path transform="translate(${x} ${y}) scale(${s})" d="M26 12h112v160l-56-38-56 38z" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`,
  target: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5"><circle cx="100" cy="100" r="82"/><circle cx="100" cy="100" r="48"/><circle cx="100" cy="100" r="13"/><path d="M100 18V0M182 100h18M100 182v18M18 100H0"/></g>`,
  proof: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"><path d="M32 8h120l48 48v150H32z"/><path d="M152 8v48h48"/><path d="M68 104l28 28 62-70"/><path d="M68 166h92"/></g>`,
  check: (x, y, s = 1, c = BLUE) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><circle cx="100" cy="100" r="82"/><path d="M54 102l30 31 65-73"/></g>`
};

function baseSvg(width, height, bg, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    ${body}
  </svg>`;
}

async function writeSvgPng(svg, svgPath, pngPath) {
  ensure(path.dirname(svgPath));
  fs.writeFileSync(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
}

async function createContactSheet(files, outPath, cols = 4, thumbW = 270, thumbH = 338) {
  const rows = Math.ceil(files.length / cols);
  const gap = 18;
  const width = cols * thumbW + (cols + 1) * gap;
  const height = rows * thumbH + (rows + 1) * gap;
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(files[i]).resize(thumbW, thumbH, { fit: "contain", background: CREAM }).toBuffer();
    composites.push({
      input: buf,
      left: gap + (i % cols) * (thumbW + gap),
      top: gap + Math.floor(i / cols) * (thumbH + gap)
    });
  }
  await sharp({
    create: { width, height, channels: 4, background: "#D9DCE7" }
  }).composite(composites).png().toFile(outPath);
}

function coverSlide(kicker, title, subtitle, page, total, accent = "01") {
  return baseSvg(1080, 1350, NAVY, `
    ${wordmark(72, 105, 0.66)}
    <text x="1008" y="100" text-anchor="end" fill="${MUTED}" font-family="Arial" font-size="22" letter-spacing="4">${esc(kicker.toUpperCase())}</text>
    <rect x="72" y="190" width="150" height="52" rx="26" fill="${BLUE}"/>
    <text x="147" y="224" text-anchor="middle" fill="${NAVY}" font-family="Arial" font-size="22" font-weight="700">${accent}</text>
    ${textBlock(title, 72, 440, { max: 21, size: 92, lineHeight: 1.02 })}
    ${textBlock(subtitle, 72, 850, { max: 48, size: 32, lineHeight: 1.35, fill: MUTED, weight: 400 })}
    ${arrow(72, 1090, 235, 1090)}
    <text x="260" y="1100" fill="${CREAM}" font-family="Arial" font-size="26">Swipe to review</text>
    ${footer(page, total)}
  `);
}

function detailSlide({ num, title, body, icon, page, total, note }) {
  return baseSvg(1080, 1350, CREAM, `
    ${wordmark(72, 100, 0.58, false)}
    <text x="1008" y="100" text-anchor="end" fill="#656C83" font-family="Arial" font-size="22" letter-spacing="4">PACKAGING CHECKLIST</text>
    <circle cx="850" cy="360" r="165" fill="#E4E9F5"/>
    ${icon(735, 245, 1.05, NAVY)}
    <text x="72" y="390" fill="${BLUE}" font-family="Georgia" font-size="108">${String(num).padStart(2, "0")}</text>
    ${textBlock(title, 72, 560, { max: 22, size: 70, lineHeight: 1.05, fill: NAVY })}
    ${textBlock(body, 72, 790, { max: 46, size: 34, lineHeight: 1.4, fill: "#444B63", weight: 400 })}
    ${note ? `<rect x="72" y="1080" width="936" height="92" rx="18" fill="${NAVY}"/>
      <text x="108" y="1137" fill="${CREAM}" font-family="Arial" font-size="26">${esc(note)}</text>` : ""}
    ${footer(page, total, 1080, false)}
  `);
}

function ctaSlide(title, body, page, total) {
  return baseSvg(1080, 1350, NAVY, `
    ${wordmark(72, 105, 0.66)}
    ${icons.save(740, 230, 1.28, BLUE)}
    ${textBlock(title, 72, 455, { max: 20, size: 86, lineHeight: 1.04 })}
    ${textBlock(body, 72, 805, { max: 44, size: 34, lineHeight: 1.42, fill: MUTED, weight: 400 })}
    <rect x="72" y="1050" width="520" height="94" rx="47" fill="${CREAM}"/>
    <text x="332" y="1108" text-anchor="middle" fill="${NAVY}" font-family="Arial" font-size="28" font-weight="700">SAVE THIS CHECKLIST</text>
    ${footer(page, total)}
  `);
}

function processSlide({ num, title, body, icon, page, total, dieline = false }) {
  const visual = dieline ? `
    <g transform="translate(615 215)" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round">
      <rect x="110" y="120" width="175" height="210" rx="4"/>
      <rect x="110" y="0" width="175" height="120" rx="4"/>
      <rect x="110" y="330" width="175" height="120" rx="4"/>
      <rect x="0" y="120" width="110" height="210" rx="4"/>
      <rect x="285" y="120" width="110" height="210" rx="4"/>
      <path d="M0 120L55 72l55 48M395 120l55-48v258l-55-40M110 0L66-42h263L285 0M110 450l-44 42h263l-44-42" stroke="${BLUE}" stroke-dasharray="12 10"/>
      <path d="M110 120h175M110 330h175M110 120v210M285 120v210" stroke="${GOLD}" stroke-dasharray="8 8"/>
      <circle cx="197" cy="225" r="45" stroke="${BLUE}"/>
      <text x="197" y="236" text-anchor="middle" fill="${NAVY}" stroke="none" font-family="Georgia" font-size="32">C</text>
    </g>` : `<circle cx="820" cy="395" r="180" fill="#E3E8F4"/>${icon(710, 280, 1.05, NAVY)}`;
  return baseSvg(1080, 1350, CREAM, `
    ${wordmark(72, 100, 0.58, false)}
    <text x="1008" y="100" text-anchor="end" fill="#656C83" font-family="Arial" font-size="22" letter-spacing="4">PROOF WORKFLOW</text>
    ${visual}
    <text x="72" y="360" fill="${BLUE}" font-family="Georgia" font-size="108">${String(num).padStart(2, "0")}</text>
    ${textBlock(title, 72, 600, { max: 20, size: 72, lineHeight: 1.05, fill: NAVY })}
    ${textBlock(body, 72, 835, { max: 44, size: 34, lineHeight: 1.4, fill: "#444B63", weight: 400 })}
    ${footer(page, total, 1080, false)}
  `);
}

function liDocSlide({ num, title, body, icon, page, total, cover = false, cta = false }) {
  if (cover) return coverSlide("Beauty-brand brief", title, body, page, total, "6 DECISIONS");
  if (cta) return ctaSlide(title, body, page, total);
  return detailSlide({ num, title, body, icon, page, total, note: "Separate what is confirmed from what still needs guidance." });
}

async function exportSet(dirName, slides) {
  const dir = path.join(OUT, dirName);
  ensure(dir);
  const pngs = [];
  for (let i = 0; i < slides.length; i++) {
    const base = `${String(i + 1).padStart(2, "0")}`;
    const svgPath = path.join(dir, `${base}.svg`);
    const pngPath = path.join(dir, `${base}.png`);
    await writeSvgPng(slides[i], svgPath, pngPath);
    pngs.push(pngPath);
  }
  await createContactSheet(pngs, path.join(dir, "contact-sheet.png"));
  return pngs;
}

async function generatePosts() {
  const ig01 = [
    coverSlide("Quote-ready", "Before you request a packaging quote", "Prepare these five details for a clearer first conversation.", 1, 7, "5 DETAILS"),
    detailSlide({ num: 1, title: "Product dimensions", body: "Share the exact product size, including caps, pumps, applicators, or inserts.", icon: icons.ruler, page: 2, total: 7 }),
    detailSlide({ num: 2, title: "Estimated quantity", body: "A realistic quantity range helps narrow down suitable packaging options.", icon: icons.quantity, page: 3, total: 7 }),
    detailSlide({ num: 3, title: "Packaging format", body: "Folding carton, rigid box, mailer, PR kit—or describe the problem you need the packaging to solve.", icon: icons.box, page: 4, total: 7 }),
    detailSlide({ num: 4, title: "Artwork status", body: "Confirm whether brand files are print-ready or whether you need design support.", icon: icons.artwork, page: 5, total: 7 }),
    detailSlide({ num: 5, title: "Finish + delivery", body: "Note preferred finishes, destination, and your target delivery date.", icon: icons.delivery, page: 6, total: 7 }),
    ctaSlide("A clearer brief creates a clearer conversation.", "Save this checklist for your next beauty-product launch, then request a quote when you are ready.", 7, 7)
  ];

  const ig03 = [
    coverSlide("Proof workflow", "From packaging idea to approved proof", "Five review stages that keep the project clear.", 1, 7, "5 STAGES"),
    processSlide({ num: 1, title: "Brief", body: "Confirm the product, objective, quantity, format, and timing.", icon: icons.artwork, page: 2, total: 7 }),
    processSlide({ num: 2, title: "Structure", body: "Define the box style, dimensions, inserts, and opening experience.", icon: icons.box, page: 3, total: 7 }),
    processSlide({ num: 3, title: "Dieline", body: "Place artwork against the correct structural template and respect folds, cuts, and safe areas.", icon: icons.box, page: 4, total: 7, dieline: true }),
    processSlide({ num: 4, title: "Proof", body: "Review copy, colors, alignment, finish placement, and required information.", icon: icons.proof, page: 5, total: 7 }),
    processSlide({ num: 5, title: "Quality check", body: "Confirm the approved specification before the order moves forward.", icon: icons.check, page: 6, total: 7 }),
    ctaSlide("Slow down at proofing.", "A clear approval record helps the final packaging move forward with clarity. Save this workflow.", 7, 7)
  ];

  const li02 = [
    liDocSlide({ cover: true, title: "The beauty-brand packaging brief", body: "Six decisions to prepare before your first packaging conversation.", page: 1, total: 8 }),
    liDocSlide({ num: 1, title: "The product", body: "Exact dimensions, weight, fragility, and every component that must fit.", icon: icons.ruler, page: 2, total: 8 }),
    liDocSlide({ num: 2, title: "The objective", body: "Retail shelf, ecommerce shipping, PR gifting, launch kit, or subscription.", icon: icons.target, page: 3, total: 8 }),
    liDocSlide({ num: 3, title: "The quantity", body: "Expected initial run and the likely reorder pattern.", icon: icons.quantity, page: 4, total: 8 }),
    liDocSlide({ num: 4, title: "The structure", body: "Preferred format—or the practical problem the packaging needs to solve.", icon: icons.box, page: 5, total: 8 }),
    liDocSlide({ num: 5, title: "The creative", body: "Brand files, required copy, artwork status, and finish references.", icon: icons.artwork, page: 6, total: 8 }),
    liDocSlide({ num: 6, title: "The logistics", body: "Destination, target date, and any sample or approval requirements.", icon: icons.delivery, page: 7, total: 8 }),
    liDocSlide({ cta: true, title: "Make the first conversation more useful.", body: "Save this six-part brief for your next skincare, cosmetics, PR-kit, or ecommerce launch.", page: 8, total: 8 })
  ];

  const ig01Pngs = await exportSet("posts/IG-01-quote-checklist", ig01);
  const ig03Pngs = await exportSet("posts/IG-03-proof-workflow", ig03);
  const li02Pngs = await exportSet("posts/LI-02-packaging-brief", li02);

  const li01 = baseSvg(1200, 1200, NAVY, `
    ${wordmark(78, 115, 0.72)}
    <text x="1120" y="110" text-anchor="end" fill="${MUTED}" font-family="Arial" font-size="22" letter-spacing="4">POINT OF VIEW</text>
    <rect x="78" y="230" width="1044" height="2" fill="#33395D"/>
    ${textBlock("Packaging is part of product positioning.", 78, 445, { max: 20, size: 90, lineHeight: 1.03 })}
    <rect x="78" y="830" width="18" height="150" rx="9" fill="${BLUE}"/>
    ${textBlock("Start with structure. Use print and finishing to reinforce the brand promise.", 130, 865, { max: 48, size: 32, lineHeight: 1.35, fill: MUTED, weight: 400 })}
    <text x="78" y="1118" fill="${CREAM}" font-family="Arial" font-size="23" letter-spacing="3">THECOSMOPACKAGING.COM</text>
  `);
  const li01Dir = path.join(OUT, "posts/LI-01-positioning");
  ensure(li01Dir);
  await writeSvgPng(li01, path.join(li01Dir, "LI-01-positioning.svg"), path.join(li01Dir, "LI-01-positioning.png"));

  const htmlPages = li02Pngs.map((p) => `<section><img src="${p.replaceAll("\\", "/")}"></section>`).join("\n");
  fs.writeFileSync(path.join(OUT, "posts/LI-02-packaging-brief/print.html"), `<!doctype html>
  <html><head><meta charset="utf-8"><style>
  @page { size: 8in 10in; margin: 0; }
  * { box-sizing: border-box; } body { margin: 0; }
  section { width: 8in; height: 10in; page-break-after: always; overflow: hidden; }
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
  </style></head><body>${htmlPages}</body></html>`, "utf8");
}

async function generateProfileAssets() {
  const dir = path.join(OUT, "profile");
  ensure(dir);
  const profile = baseSvg(1080, 1080, NAVY, `
    <circle cx="540" cy="540" r="392" fill="none" stroke="${CREAM}" stroke-width="13"/>
    <text x="515" y="685" text-anchor="middle" fill="${CREAM}" font-family="Georgia, serif" font-size="480">C</text>
    <circle cx="695" cy="650" r="34" fill="${GOLD}"/>
  `);
  await writeSvgPng(profile, path.join(dir, "cosmo-profile-master.svg"), path.join(dir, "cosmo-profile-master-1080.png"));
  await sharp(Buffer.from(profile)).resize(800, 800).png().toFile(path.join(dir, "cosmo-profile-linkedin-800.png"));
  await sharp(Buffer.from(profile)).resize(320, 320).png().toFile(path.join(dir, "cosmo-profile-instagram-320.png"));

  const banner = baseSvg(1584, 396, NAVY, `
    <path d="M1040 -70L1584 270M1170 -70L1584 190M1310 -70L1584 95" stroke="#2D345B" stroke-width="2"/>
    <rect x="1035" y="72" width="400" height="252" rx="28" fill="none" stroke="${BLUE}" stroke-width="2"/>
    <rect x="1092" y="127" width="286" height="142" rx="16" fill="none" stroke="${CREAM}" stroke-width="3"/>
    ${wordmark(96, 116, 0.78)}
    ${textBlock("Custom beauty packaging for US brands", 96, 218, { max: 37, size: 43, lineHeight: 1.12 })}
    <text x="96" y="308" fill="${MUTED}" font-family="Arial" font-size="22" letter-spacing="2">SKINCARE  •  COSMETICS  •  PR KITS  •  MAILERS  •  RIGID BOXES</text>
    <text x="96" y="352" fill="${BLUE}" font-family="Arial" font-size="22" letter-spacing="3">THECOSMOPACKAGING.COM</text>
  `);
  await writeSvgPng(banner, path.join(dir, "linkedin-banner-1584x396.svg"), path.join(dir, "linkedin-banner-1584x396.png"));

  const highlightDefs = [
    ["Products", icons.box],
    ["Samples", icons.quantity],
    ["Process", icons.proof],
    ["Offers", icons.target]
  ];
  const reviewFiles = [];
  for (const [name, icon] of highlightDefs) {
    const art = baseSvg(1080, 1080, NAVY, `
      <circle cx="540" cy="475" r="250" fill="#202748" stroke="${CREAM}" stroke-width="7"/>
      ${icon(422, 357, 1.05, CREAM)}
      <text x="540" y="850" text-anchor="middle" fill="${CREAM}" font-family="Arial" font-size="58" font-weight="700">${name}</text>
      <circle cx="540" cy="940" r="10" fill="${GOLD}"/>
    `);
    const slug = name.toLowerCase();
    const svgPath = path.join(dir, `highlight-${slug}.svg`);
    const pngPath = path.join(dir, `highlight-${slug}.png`);
    await writeSvgPng(art, svgPath, pngPath);
    reviewFiles.push(pngPath);
  }
  await createContactSheet(reviewFiles, path.join(dir, "highlight-covers-contact-sheet.png"), 4, 250, 250);
}

async function generateTemplates() {
  const dir = path.join(OUT, "templates");
  ensure(dir);
  const templates = [
    ["carousel-cover", coverSlide("Content pillar", "Your clear carousel headline goes here", "One supporting sentence that explains the value.", 1, 7, "TOPIC")],
    ["checklist", detailSlide({ num: 1, title: "Checklist item", body: "Use this area for one concise, practical explanation.", icon: icons.check, page: 2, total: 7, note: "Optional supporting note or reminder." })],
    ["text-quote", baseSvg(1080, 1350, NAVY, `
      ${wordmark(72, 105, 0.66)}
      <text x="1008" y="100" text-anchor="end" fill="${MUTED}" font-family="Arial" font-size="22" letter-spacing="4">POINT OF VIEW</text>
      <path d="M88 320h120" stroke="${BLUE}" stroke-width="9" stroke-linecap="round"/>
      ${textBlock("A strong point of view belongs here.", 72, 500, { max: 18, size: 94, lineHeight: 1.03 })}
      ${textBlock("Add one short explanation that makes the statement practical.", 72, 930, { max: 43, size: 34, lineHeight: 1.4, fill: MUTED, weight: 400 })}
      ${footer(1, 1)}
    `)]
  ];
  const previews = [];
  for (const [name, art] of templates) {
    const svgPath = path.join(dir, `${name}-template.svg`);
    const pngPath = path.join(dir, `${name}-preview.png`);
    await writeSvgPng(art, svgPath, pngPath);
    previews.push(pngPath);
  }
  await createContactSheet(previews, path.join(dir, "templates-contact-sheet.png"), 3, 300, 375);
}

async function main() {
  ensure(OUT);
  await generatePosts();
  await generateProfileAssets();
  await generateTemplates();
  console.log(`Generated social assets in ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

