/* ============================================================
   SHARED BEHAVIOR — 全站交互
   自定义光标 · 辉光球色彩 morph · 滚动揭示 · header 隐显 · 图片兜底
   连续值（光标/辉光球）一律 rAF + lerp，绝不用 CSS transition 追手。
   ============================================================ */

/* ---------- 图片兜底：加载失败隐藏，露出底层渐变 ---------- */
function attachImgFallback(root){
  (root||document).querySelectorAll('img[data-fallback]').forEach(im=>{
    if(im._fb) return; im._fb=1;
    im.addEventListener('error',()=>{im.style.display='none';},{once:true});
  });
}

/* ---------- 自定义光标：ring 慢跟 + dot 快跟，hover 扩张 ---------- */
function initCursor(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const ring=document.createElement('div'); ring.className='cursor-ring';
  const dot=document.createElement('div');  dot.className='cursor-dot';
  document.body.appendChild(ring); document.body.appendChild(dot);

  let mx=innerWidth/2,my=innerHeight/2, rx=mx,ry=my, dx=mx,dy=my;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});

  function hoverable(el){
    let n=el;
    while(n && n!==document.body){
      if(n.dataset && (n.dataset.hover!==undefined || n.dataset.textline!==undefined)) return true;
      if(n.tagName==='A'||n.tagName==='BUTTON'||(n.classList&&(n.classList.contains('cf-card')||n.classList.contains('tile')||n.classList.contains('play')))) return true;
      n=n.parentElement;
    }
    return false;
  }
  (function loop(){
    rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18;
    dx+=(mx-dx)*0.40; dy+=(my-dy)*0.40;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    dot.style.left=dx+'px';  dot.style.top=dy+'px';
    if(!window._cursorGrab){
      const el=document.elementFromPoint(mx,my);
      ring.classList.toggle('expand', !!(el&&hoverable(el)));
    }
    requestAnimationFrame(loop);
  })();

  window._setCursorGrab=function(on){
    window._cursorGrab=on;
    ring.classList.toggle('grab',on);
    if(on) ring.classList.remove('expand');
  };
  document.addEventListener('mouseleave',()=>{ring.style.opacity='0';dot.style.opacity='0';});
  document.addEventListener('mouseenter',()=>{ring.style.opacity='1';dot.style.opacity='1';});
}

/* ---------- 辉光球：紫 → 粉 平滑 morph（lerp 0.04/帧）---------- */
function initOrb(orb){
  if(!orb || orb._init) return; orb._init=1;
  const purple=[[108,48,210,.85],[100,40,200,.55],[90,30,185,.28],[80,20,170,.08]];
  const pink  =[[200,110,220,.85],[195,90,215,.55],[185,70,205,.28],[175,55,195,.08]];
  let cur=0; orb._target=0;
  const L=(a,b,t)=>a+(b-a)*t;
  (function tick(){
    cur+=(orb._target-cur)*0.04;
    const s=[];
    for(let i=0;i<4;i++){
      s.push('rgba('+Math.round(L(purple[i][0],pink[i][0],cur))+','+Math.round(L(purple[i][1],pink[i][1],cur))+','+Math.round(L(purple[i][2],pink[i][2],cur))+','+L(purple[i][3],pink[i][3],cur).toFixed(2)+')');
    }
    orb.style.background='radial-gradient(circle at 38% 36%,'+s[0]+' 0%,'+s[1]+' 28%,'+s[2]+' 50%,'+s[3]+' 72%,transparent 100%)';
    requestAnimationFrame(tick);
  })();
  // 光标靠近辉光球时变粉
  window.addEventListener('mousemove',e=>{
    const r=orb.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2, rad=r.width*0.4;
    const dx=e.clientX-cx, dy=e.clientY-cy;
    orb._target=(dx*dx+dy*dy<rad*rad)?1:0;
  },{passive:true});
}

/* ---------- sticky header：下滚隐藏，上滚显示，越过首屏加底 ---------- */
function initHeader(){
  const h=document.querySelector('.site-header'); if(!h) return;
  let last=0;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    h.classList.toggle('hide', y>last && y>200);
    h.classList.toggle('scrolled', y>40);
    last=y;
  },{passive:true});
}

/* ---------- 滚动揭示：错峰淡入 ---------- */
function initReveal(){
  const els=document.querySelectorAll('.reveal:not(.in)');
  if(!('IntersectionObserver' in window)||!els.length){els.forEach(e=>e.classList.add('in'));return;}
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(e=>{
      if(e.isIntersecting){
        const d=e.target.dataset.delay||0;
        e.target.style.transitionDelay=d+'ms';
        e.target.classList.add('in'); io.unobserve(e.target);
      }
    });
  },{threshold:.12});
  els.forEach(e=>io.observe(e));
}

/* ============================================================
   COVERFLOW — 3D 旋转入场 + coverflow 轮播（首页/分类页共用）
   initCoverflow({stage, track, items}) — items: [{img,top,no,cn,en,go,href,dur,play}]
   进场：滚动到视野 → 环形轨道旋转，再衔接 coverflow。
   ============================================================ */
function initCoverflow(opts){
  var track=opts.stage.querySelector('.track')||opts.track,
      stage=opts.stage, items=opts.items||[];
  if(!stage||!track) return;
  var CFG={SPREAD:300,DEPTH:200,ANGLE:34,SCALE_FALL:0.13,LIFT:16,FADE:0.30,
           AUTO:0.0032,DRAG_K:0.0042,INERTIA:0.92,HOVER_SCALE:0.10,HOVER_LERP:0.10};
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  var cards=items.map(function(it,i){
    var el=document.createElement('a');
    el.className='cf-card';el.href=it.href;
    el.setAttribute('draggable','false');
    el.addEventListener('dragstart',function(e){e.preventDefault();});
    el.innerHTML=
      '<div class="cf-img ph"><img draggable="false" data-fallback src="'+it.img+'" alt=""></div>'+
      '<div class="cf-glass"></div>'+
      (it.play?'<span class="play sm cf-play"></span>':'')+
      (it.dur?'<span class="dur-badge">'+it.dur+'</span>':'')+
      '<div class="cf-top">'+(it.top||'')+'</div>'+
      '<div class="cf-body"><div class="cf-no">'+(it.no||'')+'</div><div class="cf-cn">'+it.cn+'</div>'+
      '<div class="cf-en">'+(it.en||'')+'</div><div class="cf-go">'+(it.go||'View →')+'</div></div>';
    track.appendChild(el);
    return {el:el,hover:0};
  });
  attachImgFallback(track);
  var N=cards.length;
  function wrap(o){var h=N/2;return ((o+h)%N+N)%N-h;}

  var pos=0,vel=0,dragging=false,hoveredIdx=null,lastX=0,downX=0,moved=0;

  var INTRO_DUR=2000, SPIN_TURNS=1.25;
  var RX=Math.min(540,innerWidth*0.34), RY=210;
  var introStarted=false, introT=0, introStart=0;
  function easeOutCubic(t){return 1-Math.pow(1-t,3);}
  function easeInOutCubic(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function startIntro(){if(introStarted)return;introStarted=true;introStart=performance.now();}
  if(reduce){introStarted=true;introT=1;}
  else{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){startIntro();io.disconnect();}});
    },{threshold:0.4});
    io.observe(stage);
  }

  function frame(){
    if(introStarted&&introT<1){introT=Math.min((performance.now()-introStart)/INTRO_DUR,1);}
    var blend=reduce?1:easeInOutCubic(introT);
    var spinExtra=reduce?0:(SPIN_TURNS*N)*(1-easeOutCubic(introT));
    var fadeIn=reduce?1:Math.min(1,introT*2.6);

    if(!dragging&&hoveredIdx===null&&!reduce&&introT>=1)pos+=CFG.AUTO;
    if(!dragging){pos+=vel;vel*=CFG.INERTIA;if(Math.abs(vel)<0.00002)vel=0;}
    var posEff=pos+spinExtra;
    cards.forEach(function(c,i){
      var o=wrap(i-posEff),a=Math.abs(o);
      var target=(hoveredIdx===i&&!dragging&&introT>=1)?1:0;
      c.hover+=(target-c.hover)*CFG.HOVER_LERP;
      var tx=o*CFG.SPREAD, tz=-a*CFG.DEPTH+c.hover*60, ty=a*CFG.LIFT,
          ry=Math.max(-55,Math.min(55,-o*CFG.ANGLE)),
          sc=Math.max(0.55,1-a*CFG.SCALE_FALL)+c.hover*CFG.HOVER_SCALE,
          op=Math.max(0.12,1-a*CFG.FADE)+c.hover*0.3;
      var ang=(i-posEff)/N*Math.PI*2;
      var rtx=Math.sin(ang)*RX, rty=-Math.cos(ang)*RY, rsc=0.7;
      var rop=fadeIn*(0.45+0.55*((Math.cos(ang)+1)/2));
      var TX=rtx+(tx-rtx)*blend, TY=rty+(ty-rty)*blend, TZ=(tz)*blend,
          RYv=ry*blend, SC=rsc+(sc-rsc)*blend, OP=rop+(op-rop)*blend;
      c.el.style.transform='translate(-50%,-50%) translate3d('+TX+'px,'+TY+'px,'+TZ+'px) rotateY('+RYv+'deg) scale('+SC+')';
      c.el.style.opacity=Math.min(1,OP);
      var rz=Math.round((Math.cos(ang)+1)*100);
      c.el.style.zIndex=String(Math.round((200-a*10+c.hover*50)*blend + rz*(1-blend)));
      c.el.classList.toggle('is-center',a<0.5&&blend>0.6);
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  stage.addEventListener('dragstart',function(e){e.preventDefault();});
  stage.addEventListener('pointerdown',function(e){
    e.preventDefault();
    dragging=true;vel=0;lastX=e.clientX;downX=e.clientX;moved=0;
    if(window._setCursorGrab)window._setCursorGrab(true);
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove',function(e){
    if(!dragging)return;
    var dx=e.clientX-lastX;lastX=e.clientX;moved+=Math.abs(dx);
    var d=-dx*CFG.DRAG_K;pos+=d;vel=d*0.8;
  });
  function up(e){
    if(!dragging)return;dragging=false;
    if(window._setCursorGrab)window._setCursorGrab(false);
    if(moved<6){
      var el=document.elementFromPoint(e.clientX,e.clientY);
      while(el&&el!==stage){if(el.classList&&el.classList.contains('cf-card')){location.href=el.getAttribute('href');return;}el=el.parentElement;}
    }
  }
  stage.addEventListener('pointerup',up);
  stage.addEventListener('pointercancel',function(){dragging=false;if(window._setCursorGrab)window._setCursorGrab(false);});
  cards.forEach(function(c,i){
    c.el.addEventListener('pointerenter',function(){hoveredIdx=i;});
    c.el.addEventListener('pointerleave',function(){if(hoveredIdx===i)hoveredIdx=null;});
    c.el.addEventListener('click',function(e){if(moved>=6)e.preventDefault();});
  });
}

function initSite(){ initCursor(); initHeader(); initReveal(); attachImgFallback(); }
document.addEventListener('DOMContentLoaded',initSite);
