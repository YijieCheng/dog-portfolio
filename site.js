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
  document.body.appendChild(ring);

  let mx=innerWidth/2,my=innerHeight/2,seen=false;
  // 初始定位到视口中心并隐藏：页面刷新后鼠标未动时，圆点不再卡在左上角闪烁
  ring.style.transform='translate(-50%,-50%) translate3d('+mx+'px,'+my+'px,0)';
  ring.style.opacity='0';
  // 直接跟随，无缓动延迟；仅用 transform 定位（合成层，跟手）
  window.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(!seen){seen=true;ring.style.opacity='1';}
    ring.style.transform='translate(-50%,-50%) translate3d('+mx+'px,'+my+'px,0)';
  },{passive:true});

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
    if(seen&&!window._cursorGrab){
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
  document.addEventListener('mouseleave',()=>{ring.style.opacity='0';});
  document.addEventListener('mouseenter',()=>{if(seen)ring.style.opacity='1';});

  /* iframe/video 会吞掉 mousemove，自定义光标会卡在边缘：
     进入时隐藏自定义光标（恢复原生），离开时再显示。
     capture 阶段监听，动态插入的播放器也能覆盖。 */
  function isMedia(t){return t&&(t.tagName==='IFRAME'||t.tagName==='VIDEO');}
  document.addEventListener('mouseenter',e=>{
    if(isMedia(e.target)){ring.classList.add('hide');}
  },true);
  document.addEventListener('mouseleave',e=>{
    if(isMedia(e.target)){ring.classList.remove('hide');}
  },true);
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

/* ---------- Mobile menu：≡ 打开全屏覆层，导航项自 header 克隆 ---------- */
function initMobileMenu(){
  const header=document.querySelector('.site-header'); if(!header) return;
  const ico=header.querySelector('.menu-ico'); if(!ico) return;
  const links=[...header.querySelectorAll('nav a')];
  const page=location.pathname.split('/').pop()||'index.html';

  const ov=document.createElement('div');
  ov.className='m-menu';
  ov.setAttribute('aria-hidden','true');
  ov.innerHTML=
    '<div class="m-top"><span class="m-logo">ARCHIVE<span class="dot-accent">.</span></span>'+
    '<button class="m-close" aria-label="关闭菜单">✕</button></div>'+
    '<nav class="m-nav">'+links.map((a,i)=>{
      const href=a.getAttribute('href');
      const now=href.split('#')[0]===page?' class="now"':'';
      return '<a href="'+href+'"'+now+' style="transition-delay:'+(60+i*50)+'ms">'+a.textContent+'</a>';
    }).join('')+'</nav>'+
    '<div class="m-foot">© 2026 Archive Studio · 文旅影像</div>';
  document.body.appendChild(ov);

  function open(){ov.classList.add('open');ov.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('menu-lock');}
  function close(){ov.classList.remove('open');ov.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('menu-lock');}
  ico.addEventListener('click',open);
  ov.querySelector('.m-close').addEventListener('click',close);
  ov.addEventListener('click',e=>{if(e.target.tagName==='A')close();}); // 同页 hash 跳转也要收起
  addEventListener('keydown',e=>{if(e.key==='Escape')close();});
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
  /* 小屏收紧展开距离/加快侧卡衰减，拖拽增益按手指行程调高 */
  var mob=matchMedia('(max-width:720px)').matches;
  var CFG={SPREAD:mob?180:300,DEPTH:mob?150:200,ANGLE:mob?30:34,SCALE_FALL:mob?0.16:0.13,
           LIFT:mob?12:16,FADE:mob?0.38:0.30,
           AUTO:0.0032,DRAG_K:mob?0.0060:0.0042,INERTIA:0.92,HOVER_SCALE:0.10,HOVER_LERP:0.10};
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
          edgeFade=Math.max(0,Math.min(1,(N/2-a)/0.75)),
          op=(Math.max(0.12,1-a*CFG.FADE)+c.hover*0.3)*edgeFade;
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

function initSite(){ initCursor(); initHeader(); initReveal(); initMobileMenu(); attachImgFallback(); }
document.addEventListener('DOMContentLoaded',initSite);
