// 卓奕荣 · 作品集网站 · JS







/* ===== TEXT MASK REVEAL (safe) ===== */


function initIntro(){
  const intro=document.querySelector(".site-intro");
  if(!intro)return;
  const content=intro.querySelector(".intro-content");
  const ringWrap=intro.querySelector(".intro-ring-wrap");
  const bar=intro.querySelector(".intro-bar-wrap");
  const fill=intro.querySelector(".intro-bar-fill");
  setTimeout(()=>{content.classList.add("show")},150);
  setTimeout(()=>{ringWrap.classList.add("show")},400);
  setTimeout(()=>{bar.classList.add("show")},1000);
  let p=0;
  const bi=setInterval(()=>{p+=Math.random()*8+3;if(p>=100){p=100;clearInterval(bi)};fill.style.width=p+"%"},80);
  setTimeout(()=>{
    content.classList.add("intro-glitch");
    setTimeout(()=>{
      intro.classList.add("exit");
      setTimeout(()=>{intro.style.display="none"},600);
    },500);
  },1600);
}

/* ===== ATMOSPHERE ===== */
function injectAtmosphere(){
  if(innerWidth<768)return
  const b=document.body
  const n=document.createElement("div");n.className="noise-overlay";b.appendChild(n)
  const s=document.createElement("div");s.className="scanlines";b.appendChild(s)
  const h=document.querySelector(".hero")
  if(h){setTimeout(()=>h.classList.add("hero-ready"),100)
    for(let i=0;i<4;i++){const r=document.createElement("div");r.className="hero-frame-bracket "+["tl","tr","bl","br"][i];h.appendChild(r)}
    ;["layer-far","layer-mid","layer-near"].forEach(c=>{const d=document.createElement("div");d.className="hero-3d-layer "+c;h.appendChild(d)})
  }
}

/* ===== CURSOR ===== */
function initCursor(){
  if(innerWidth<768)return
  const r=document.createElement("div");r.className="cursor-ring";document.body.appendChild(r);const r2=document.createElement("div");r2.className="cursor-ring-2";document.body.appendChild(r2)
  let mx=-100,my=-100,rx=-100,ry=-100,rx2=-100,ry2=-100
  document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY})
  document.addEventListener("mouseleave",()=>r.style.opacity="0")
  document.addEventListener("mouseenter",()=>r.style.opacity="1")
  document.querySelectorAll("a,button,.btn,.gallery-item,.work-card,.filter-btn,.close").forEach(el=>{
    el.addEventListener("mouseenter",()=>{r.style.width="40px";r.style.height="40px";r.style.borderColor="rgba(0,212,255,0.7)";r.style.boxShadow="0 0 30px rgba(0,212,255,0.15)";r.style.background="rgba(0,212,255,0.04)"})
    el.addEventListener("mouseleave",()=>{r.style.width="30px";r.style.height="30px";r.style.borderColor="rgba(0,212,255,0.4)";r.style.boxShadow="0 0 20px rgba(0,212,255,0.08)";r.style.background="transparent"})
  });
  (function a(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;r.style.left=rx+"px";r.style.top=ry+"px";rx2+=(mx-rx2)*0.04;ry2+=(my-ry2)*0.04;r2.style.left=rx2+"px";r2.style.top=ry2+"px";requestAnimationFrame(a)})()
}

/* ===== VIGNETTE ===== */
function initVignette(){
  if(innerWidth<768)return
  const v=document.createElement("div");v.className="mouse-vignette";document.body.appendChild(v)
  document.addEventListener("mousemove",e=>{v.style.background="radial-gradient(circle at "+(e.clientX/innerWidth*100)+"% "+(e.clientY/innerHeight*100)+"%,transparent 15%,rgba(0,0,0,0.35) 80%)"})
}

/* ===== RIPPLE ===== */
function initRipple(){
  if(innerWidth<768)return
  document.addEventListener("click",e=>{
    const r=document.createElement("div");r.className="click-ripple"
    r.style.left=e.clientX+"px";r.style.top=e.clientY+"px"
    document.body.appendChild(r);r.addEventListener("animationend",()=>r.remove())
  })
}

/* ===== BREATHING ===== */
function initBreathing(){
  if(innerWidth<768)return
  document.querySelectorAll(".work-card").forEach((c,i)=>c.classList.add(i%2===0?"breathing":"breathing-delayed"))
}

/* ===== HERO 3D ===== */
function initHero3D(){
  if(innerWidth<768)return
  const layers=document.querySelectorAll(".hero-3d-layer");if(!layers.length)return
  document.addEventListener("mousemove",e=>{
    const cx=(e.clientX/innerWidth-0.5)*2,cy=(e.clientY/innerHeight-0.5)*2
    layers.forEach((l,i)=>{const d=[0.02,0.05,0.1][i];l.style.transform="translate("+(cx*innerWidth*d)+"px,"+(cy*innerHeight*d)+"px)"})
    const hc=document.querySelector(".hero-content");if(hc)hc.style.transform="translate("+(cx*5)+"px,"+(cy*5)+"px)"
  })
}

/* ===== PARALLAX ===== */
function initParallax(){
  const hero=document.querySelector(".hero");if(!hero)return
  window.addEventListener("scroll",()=>{const p=scrollY/hero.offsetHeight;if(p<1)hero.style.opacity=1-p*0.4},{passive:true})
}

/* ===== REVEAL ===== */
function initReveal(){
  const o=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible","revealed");o.unobserve(e.target)}})},{threshold:0.08,rootMargin:"0px 0px -30px 0px"});
  document.querySelectorAll(".reveal,.diagonal-reveal,.grow-in,.work-card").forEach(e=>o.observe(e))
}

/* ===== STAGGER ===== */
function initStagger(){
  document.querySelectorAll(".stagger-children").forEach(e=>{const o=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");o.unobserve(e.target)}})},{threshold:0.1});o.observe(e)})
}

/* ===== MORPH ===== */
function initMorph(){
  document.querySelectorAll(".section-morph").forEach(e=>{const o=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in-view");else e.target.classList.remove("in-view")})},{threshold:0.2});o.observe(e)})
}

/* ===== PROGRESS ===== */
function initProgress(){
  const b=document.createElement("div");b.className="scroll-progress";document.body.appendChild(b)
  window.addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-innerHeight;b.style.width=(h>0?scrollY/h*100:0)+"%"},{passive:true})
}

/* ===== ORBS ===== */
function initOrbs(){
  if(innerWidth<768)return
  for(let i=1;i<=3;i++){const o=document.createElement("div");o.className="orb orb-"+i;document.body.appendChild(o)}
}

/* ===== NAV ===== */
function initNav(){
  const n=document.querySelector(".navbar"),h=document.querySelector(".nav-hamburger"),l=document.querySelector(".nav-links")
  let t=false
  window.addEventListener("scroll",()=>{if(!t){requestAnimationFrame(()=>{n.classList.toggle("scrolled",scrollY>50);t=false});t=true}},{passive:true})
  if(h){h.addEventListener("click",()=>{h.classList.toggle("open");l.classList.toggle("open")})}
  const cp=location.pathname
  if(l)l.querySelectorAll("a").forEach(a=>{const h=a.getAttribute("href");if(h===cp||(cp.startsWith("/works/")&&h==="/works.html")||((cp==="/"||cp.endsWith("index.html"))&&h==="/"))a.classList.add("active")})
}

/* ===== LIGHTBOX ===== */
function initLightbox(){
  const lb=document.getElementById("lightbox");if(!lb)return
  const img=lb.querySelector("img"),close=lb.querySelector(".close")
  document.querySelectorAll(".gallery-item,.work-card-image").forEach(item=>{item.addEventListener("click",()=>{const i=item.querySelector("img");if(!i||!i.src)return;img.src=(i.dataset.full||i.src);img.alt=i.alt||"";lb.classList.add("open");document.body.style.overflow="hidden"})})
  const cl=()=>{lb.classList.remove("open");document.body.style.overflow=""}
  if(close)close.addEventListener("click",cl)
  lb.addEventListener("click",e=>{if(e.target===lb)cl()})
  document.addEventListener("keydown",e=>{if(e.key==="Escape")cl()})
}

/* ===== FILTER ===== */
function initFilter(){
  const btns=document.querySelectorAll(".filter-btn");if(!btns.length)return
  btns.forEach(btn=>{btn.addEventListener("click",()=>{
    const f=btn.dataset.filter
    btns.forEach(b=>b.classList.remove("active"));btn.classList.add("active")
    document.querySelectorAll(".work-card").forEach(c=>{if(f==="all"||c.dataset.category===f){c.style.display=""}else{c.style.display="none"}})
  })})
}

/* ===== MAGNETIC ===== */
function initMagnetic(){
  if(innerWidth<768)return
  document.querySelectorAll(".btn").forEach(btn=>{
    btn.addEventListener("mousemove",e=>{const r=btn.getBoundingClientRect();btn.style.transform="translate("+((e.clientX-r.left-r.width/2)*0.25)+"px,"+((e.clientY-r.top-r.height/2)*0.25)+"px)";btn.style.boxShadow="0 0 30px rgba(0,212,255,0.2)"})
    btn.addEventListener("mouseleave",()=>{btn.style.transform="";btn.style.boxShadow=""})
  })
}

/* ===== NAVIGATION ===== */
function navigateTo(url){const o=document.querySelector(".page-transition");if(o){o.classList.add("active");setTimeout(()=>{location.href=url},500)}else{location.href=url}}








/* ===== EMAIL CHOOSER ===== */
function initEmailChooser(){
  const chooser=document.getElementById("emailChooser");
  if(!chooser)return;
  const closeBtn=chooser.querySelector(".email-chooser-close");
  const backdrop=chooser.querySelector(".email-chooser-backdrop");
  const open=()=>chooser.classList.add("open");
  const close=()=>chooser.classList.remove("open");
  document.querySelectorAll(".email-trigger").forEach(btn=>{
    btn.addEventListener("click",e=>{e.preventDefault();open()});
  });
  if(closeBtn)closeBtn.addEventListener("click",close);
  if(backdrop)backdrop.addEventListener("click",close);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
}

document.addEventListener("DOMContentLoaded",()=>{
  initIntro()
  initEmailChooser()
  initReveal()
  initMorph()
  injectAtmosphere()
  initNav()
  initLightbox()
  initFilter()
  initCursor()
  initVignette()
  initRipple()
  initProgress()
  initOrbs()
  initMagnetic()
  initHero3D()
  initParallax()
  initStagger()
  initBreathing()
});

/* ===== EMAIL CHOOSER ===== */
function initEmailChooser(){
  const chooser=document.getElementById("emailChooser");
  if(!chooser)return;
  const closeBtn=chooser.querySelector(".email-chooser-close");
  const backdrop=chooser.querySelector(".email-chooser-backdrop");
  const open=()=>chooser.classList.add("open");
  const close=()=>chooser.classList.remove("open");
  document.querySelectorAll(".email-trigger").forEach(btn=>{
    btn.addEventListener("click",e=>{e.preventDefault();open()});
  });
  if(closeBtn)closeBtn.addEventListener("click",close);
  if(backdrop)backdrop.addEventListener("click",close);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
}

document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('a[href^="/"],a[href^="./"]').forEach(a=>{if(!a.hasAttribute("target")&&a.hostname===location.hostname){const h=a.getAttribute("href");if(h&&!h.startsWith("#")&&!h.startsWith("http")){a.addEventListener("click",e=>{if(!e.metaKey&&!e.ctrlKey){e.preventDefault();navigateTo(h)}})}}})})
