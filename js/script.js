/* Troque pelo número real da BL3: DDI + DDD + número, só dígitos */
const NUMERO = "5584987015394";

document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(a.dataset.wa);
  a.target = "_blank"; a.rel = "noopener";
});

const box = document.getElementById("msgs");
const script = [
  ["u", "Oi! Consigo marcar uma visita amanhã?"],
  ["b", "Oi! Amanhã tenho 10h ou 15h livres. Qual prefere?"],
  ["u", "15h"],
  ["b", "Pronto, marquei amanhã às 15h. Te lembro 2 horas antes."],
  ["ok", "Agenda atualizada"]
];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let run = 0;
const wait = ms => new Promise(r => setTimeout(r, ms));
function add(t, txt){
  const d = document.createElement("div");
  d.className = t === "ok" ? "ok" : "m " + t;
  d.textContent = t === "ok" ? "✓ " + txt : txt;
  box.appendChild(d); return d;
}
async function play(){
  const id = ++run; box.innerHTML = "";
  if (reduce){ script.forEach(s => add(s[0], s[1])); return; }
  await wait(900);
  for (const [t, txt] of script){
    if (id !== run) return;
    if (t === "b"){
      const ty = add("b", ""); ty.className = "m b typing"; ty.innerHTML = "<i></i><i></i><i></i>";
      await wait(1100); if (id !== run) return; ty.remove();
    } else await wait(700);
    add(t, txt);
  }
}
document.getElementById("replay").addEventListener("click", play);

/* carrinho */
const CATALOGO = [
  {id:"agente",n:"Agente de IA",d:"Atende 24/7"},
  {id:"site",n:"Site",d:"Institucional, rápido e bonito"},
  {id:"landing",n:"Landing page",d:"Uma página para vender uma oferta"},
  {id:"saas",n:"SaaS",d:"SaaS para gestão"},
  {id:"app",n:"Aplicativo",d:"Android e iPhone"}
];
const carrinho = new Map();
const $ = id => document.getElementById(id);
function total(){ let t = 0; carrinho.forEach(q => t += q); return t; }
function pintar(){
  const n = total();
  $("badge").hidden = !n; $("badge").textContent = n;
  $("items").querySelectorAll("li").forEach(li => { const q = carrinho.get(li.dataset.id) || 0; li.querySelector(".add").hidden = q > 0; li.querySelector(".qty").hidden = q === 0; li.querySelector(".qn").textContent = q; });
  document.querySelectorAll("[data-add]").forEach(b => { const on = carrinho.has(b.dataset.add); b.setAttribute("aria-pressed", on); b.textContent = on ? "No carrinho ✓ Remover" : "Adicionar ao carrinho"; });
  const lista = CATALOGO.filter(c => carrinho.has(c.id)).map(c => "• " + carrinho.get(c.id) + "x " + c.n).join("\n");
  $("checkout").setAttribute("aria-disabled", String(!n));
  $("checkout").href = n ? "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent("Olá! Vim pelo site do Instagram. Tenho interesse em:\n" + lista) : "#";
  $("checkout").textContent = n ? "Finalizar no WhatsApp (" + n + ")" : "Escolha um item para finalizar";
  $("cartbtn").setAttribute("aria-label", "Abrir carrinho, " + n + (n === 1 ? " item" : " itens"));
}
function alternar(id){ if (carrinho.has(id)) carrinho.delete(id); else carrinho.set(id, 1); pintar(); }
function mudar(id, d){ const q = (carrinho.get(id) || 0) + d; if (q <= 0) carrinho.delete(id); else carrinho.set(id, Math.min(q, 99)); pintar(); }
CATALOGO.forEach(c => {
  const li = document.createElement("li"), t = document.createElement("div"), b = document.createElement("b"), s = document.createElement("small");
  li.dataset.id = c.id; t.className = "t"; b.textContent = c.n; s.textContent = c.d; t.append(b, s);
  const add = document.createElement("button"); add.type = "button"; add.className = "add"; add.textContent = "Adicionar"; add.addEventListener("click", () => mudar(c.id, 1));
  const qty = document.createElement("div"); qty.className = "qty"; qty.hidden = true;
  const menos = document.createElement("button"), mais = document.createElement("button"), qn = document.createElement("span");
  menos.type = mais.type = "button"; menos.textContent = "−"; mais.textContent = "+";
  menos.setAttribute("aria-label", "Diminuir quantidade: " + c.n); mais.setAttribute("aria-label", "Aumentar quantidade: " + c.n);
  qn.className = "qn"; qn.setAttribute("aria-live", "polite");
  menos.addEventListener("click", () => mudar(c.id, -1)); mais.addEventListener("click", () => mudar(c.id, 1));
  qty.append(menos, qn, mais); li.append(t, add, qty); $("items").appendChild(li);
});
document.querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", () => alternar(b.dataset.add)));
function abrir(v){
  $("drawer").classList.toggle("open", v); $("scrim").classList.toggle("open", v);
  (v ? $("cclose") : $("cartbtn")).focus();
}
$("cartbtn").addEventListener("click", () => abrir(true));
$("cclose").addEventListener("click", () => abrir(false));
$("scrim").addEventListener("click", () => abrir(false));
addEventListener("keydown", e => { if (e.key === "Escape" && $("drawer").classList.contains("open")) abrir(false); });
$("checkout").target = "_blank"; $("checkout").rel = "noopener";
$("checkout").addEventListener("click", e => { if (!carrinho.size) e.preventDefault(); });
/* frases rotativas */
const FRASES = [
  {t:"Agente de IA que atende seus clientes 24/7",i:'<rect x="5" y="9" width="14" height="11" rx="3"/><path d="M12 3v3M9 14h.01M15 14h.01"/>'},
  {t:"Sites rápidos e bonitos que passam confiança",i:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/>'},
  {t:"Landing pages feitas para vender",i:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 9h16M8 14h8"/>'},
  {t:"SaaS para gestão do seu negócio",i:'<path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5"/>'},
  {t:"Aplicativos para Android e iPhone",i:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'}
];
const rx = $("rx"), dots = $("dots");
FRASES.forEach(() => dots.appendChild(document.createElement("i")));
let fi = 0;
function mostrar(){
  const f = FRASES[fi];
  $("ri").innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + f.i + '</svg>';
  $("rt").textContent = f.t;
  [...dots.children].forEach((d, k) => d.classList.toggle("on", k === fi));
}
mostrar();
if (!reduce) setInterval(() => {
  rx.className = "rx out";
  setTimeout(() => { fi = (fi + 1) % FRASES.length; mostrar(); rx.className = "rx in"; }, 320);
}, 3400);

/* barra muda de cor ao rolar e acompanha a seção em que a pessoa está */
const nav = document.querySelector(".top"), lk = document.querySelector(".lk");
const links = [...lk.querySelectorAll("a")], alvos = ["servicos","como","para-quem","faq","contato"];
let trava = 0, homeOn = false, atual = null;
function marcar(a){
  links.forEach(l => l.classList.toggle("on", l === a));
  if (a && a !== atual) lk.scrollTo({left: a.offsetLeft - lk.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth"});
  atual = a;
}
function espiar(){
  const sc = scrollY > $("topo").offsetHeight - 60;
  nav.classList.toggle("sc", sc); document.documentElement.classList.toggle("sc", sc);
  if (Date.now() < trava) return;
  let cur = null;
  alvos.forEach(id => { const el = $(id); if (el && el.getBoundingClientRect().top <= innerHeight * .32) cur = id; });
  if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = "contato";
  if (cur) homeOn = false;
  marcar(cur ? links.find(l => l.getAttribute("href") === "#" + cur) : (homeOn ? links[0] : null));
}
function irTopo(e){ e.preventDefault(); scrollTo({top: 0, behavior: "smooth"}); }
links.forEach(a => a.addEventListener("click", e => {
  trava = Date.now() + 1000; homeOn = a === links[0]; marcar(a);
  if (homeOn) irTopo(e);
}));
document.querySelector(".brand").addEventListener("click", e => { trava = Date.now() + 1000; homeOn = false; marcar(null); irTopo(e); });
addEventListener("scroll", espiar, {passive:true}); addEventListener("resize", espiar);
espiar();

/* depoimentos: só aparecem quando houver depoimentos reais aqui */
const DEPOIMENTOS = []; // {texto:"...", nome:"...", cargo:"...", empresa:"..."}
DEPOIMENTOS.forEach(d => {
  const box = document.createElement("div"), q = document.createElement("q"), c = document.createElement("cite");
  box.className = "dep"; q.textContent = d.texto; c.textContent = [d.nome, d.cargo, d.empresa].filter(Boolean).join(", ");
  box.append(q, c); $("depoimentos").appendChild(box);
});

/* formulário curto -> WhatsApp já preenchido */
const CAMPOS = ["f-nome","f-emp","f-porte","f-nec"];
function msgForm(){
  const l = ["Olá! Vim pelo site do Instagram.", "Nome: " + $("f-nome").value.trim(), "Empresa: " + $("f-emp").value.trim(), "Porte: " + $("f-porte").value, "Necessidade: " + $("f-nec").value];
  if (carrinho.size) l.push("Itens do carrinho: " + CATALOGO.filter(c => carrinho.has(c.id)).map(c => carrinho.get(c.id) + "x " + c.n).join(", "));
  return l.join("\n");
}
function linkForm(){ $("enviar").href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(msgForm()); }
CAMPOS.forEach(id => { $(id).addEventListener("input", linkForm); $(id).addEventListener("change", linkForm); });
$("orc").addEventListener("submit", e => e.preventDefault());
$("enviar").addEventListener("click", e => {
  const faltam = CAMPOS.filter(id => !$(id).value.trim());
  CAMPOS.forEach(id => $(id).setAttribute("aria-invalid", String(!$(id).value.trim())));
  $("ferr").hidden = !faltam.length;
  if (faltam.length){ e.preventDefault(); $(faltam[0]).focus(); return; }
  linkForm();
});

pintar();
play();
