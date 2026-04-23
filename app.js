const $=id=>document.getElementById(id);

/* ===== PLANETS (proportions closer to reality) ===== */
/* real AU: Mer .39, Ven .72, Ear 1, Mar 1.52, Jup 5.2, Sat 9.5, Ura 19.2, Nep 30 */
/* compressed for display but keeping relative order & inner-packed / outer-spread feel */
const P=[
  {id:'sun',name:'太阳',emoji:'☀️',color:'#ffb300',r:32,oR:0,spd:0,desc:'太阳系中心'},
  {id:'mercury',name:'水星',emoji:'🪨',color:'#9e9e9e',r:3.5,oR:52,spd:.0018,desc:'寂静岩石世界',ecc:.12},
  {id:'venus',name:'金星',emoji:'🌕',color:'#e8b84e',r:5.5,oR:72,spd:.0012,desc:'金色迷雾之星',ecc:.04},
  {id:'earth',name:'地球',emoji:'🌍',color:'#4a9eff',r:6,oR:98,spd:.0008,desc:'我们的家园',ecc:.05},
  {id:'mars',name:'火星',emoji:'🔴',color:'#d4553a',r:4,oR:130,spd:.0005,desc:'红色荒原',ecc:.09},
  {id:'jupiter',name:'木星',emoji:'🟠',color:'#c88040',r:18,oR:210,spd:.00018,desc:'风暴巨人',ecc:.05},
  {id:'saturn',name:'土星',emoji:'🪐',color:'#d4b870',r:15,oR:290,spd:.0001,desc:'光环之王',ecc:.06},
  {id:'uranus',name:'天王星',emoji:'🔵',color:'#68c8d8',r:9,oR:360,spd:.00005,desc:'冰蓝世界',ecc:.05},
  {id:'neptune',name:'海王星',emoji:'🫧',color:'#4070d0',r:8.5,oR:420,spd:.00003,desc:'深蓝深渊',ecc:.01}
];
const ES={cosmos:{bg:'#040407',bg2:'#080810',bg3:'#0c0c16',card:'#08080e',accent:'#8b7cf7',scene:'cosmos',sc:'220,225,240'},beach:{bg:'#0a1518',bg2:'#0e1a20',bg3:'#122028',card:'#0c1820',accent:'#48b5c4',scene:'ocean',sc:'200,225,235'},volcano:{bg:'#100806',bg2:'#180c08',bg3:'#1e100c',card:'#140a08',accent:'#e8623e',scene:'lava',sc:'245,200,165'},iceland:{bg:'#080c10',bg2:'#0c1016',bg3:'#10141c',card:'#0a0e14',accent:'#64c8d4',scene:'snow',sc:'205,230,240'},forest:{bg:'#060a08',bg2:'#0a100c',bg3:'#0e1610',card:'#080e08',accent:'#5cb870',scene:'forest',sc:'185,220,195'},desert:{bg:'#110f0a',bg2:'#16130e',bg3:'#1c1712',card:'#14110c',accent:'#d4a05a',scene:'sand',sc:'235,215,180'},shanghai:{bg:'#080a12',bg2:'#0c0e18',bg3:'#10141e',card:'#0a0c16',accent:'#e0a850',scene:'city',sc:'225,210,175'},sky:{bg:'#0a0e1a',bg2:'#0e1222',bg3:'#12162a',card:'#0c1020',accent:'#6ba8e0',scene:'clouds',sc:'215,230,250'}};
let curES='cosmos',viewMode='solar';
/* ship config */
const SHIP={id:'ship',name:'星际飞船',emoji:'🚀',color:'#a78bfa',desc:'登上飞船，记录旅途'};

/* ===== INTRO — Ship Launch Animation ===== */
(function(){
  const seen=sessionStorage.getItem('xpz_intro'),ov=$('intro');
  if(seen){ov.classList.add('gone');return}
  const ic=$('introC'),ix=ic.getContext('2d');
  let W=ic.width=innerWidth,H=ic.height=innerHeight;
  const cx0=W/2,cy0=H/2;

  // star field (will become speed lines)
  const stars=[];for(let i=0;i<600;i++)stars.push({
    x:(Math.random()-.5)*W*2,y:(Math.random()-.5)*H*2,z:Math.random()*1500+100,
    r:Math.random()*.6+.2,c:Math.random()>.7?'255,250,230':'200,215,245'
  });

  // nebula patches to fly through
  const nebs=[
    {x:W*.3,y:H*.3,rx:120,ry:80,c:'80,50,150',rot:.3},
    {x:W*.7,y:H*.6,rx:100,ry:60,c:'40,60,140',rot:-.2},
    {x:W*.5,y:H*.2,rx:80,ry:50,c:'70,30,110',rot:.5}
  ];

  let startT=null;const dur=5500;

  function drawShip(ix,cx,cy,size,thrust,alpha){
    ix.save();ix.globalAlpha=alpha;ix.translate(cx,cy);ix.rotate(-Math.PI/2); // pointing up
    const S=size;
    // engine thrust
    if(thrust>0){
      const flk=.6+.4*Math.sin(Date.now()*.015);
      for(const ey of [-S*.22,S*.22]){
        const egR=S*2*flk*thrust;
        const eg=ix.createRadialGradient(-S*.85,ey,0,-S*.85,ey,egR);
        eg.addColorStop(0,`rgba(160,220,255,${.5*thrust})`);
        eg.addColorStop(.3,`rgba(120,180,255,${.2*thrust})`);
        eg.addColorStop(1,'rgba(60,120,255,0)');
        ix.beginPath();ix.arc(-S*.85,ey,egR,0,Math.PI*2);ix.fillStyle=eg;ix.fill();
        // flame
        const fLen=S*(1.2+flk*.5)*thrust;
        ix.beginPath();ix.moveTo(-S*.78,ey-S*.08);ix.lineTo(-S*.78-fLen,ey);ix.lineTo(-S*.78,ey+S*.08);
        const fg=ix.createLinearGradient(-S*.78,ey,-S*.78-fLen,ey);
        fg.addColorStop(0,'rgba(200,235,255,.8)');fg.addColorStop(.4,'rgba(120,180,255,.35)');fg.addColorStop(1,'rgba(60,100,255,0)');
        ix.fillStyle=fg;ix.fill();
      }
    }
    // hull
    ix.beginPath();
    ix.moveTo(S*1.1,0);
    ix.bezierCurveTo(S*.8,-S*.12,S*.3,-S*.2,-S*.1,-S*.22);
    ix.lineTo(-S*.75,-S*.18);ix.lineTo(-S*.8,0);ix.lineTo(-S*.75,S*.18);ix.lineTo(-S*.1,S*.22);
    ix.bezierCurveTo(S*.3,S*.2,S*.8,S*.12,S*1.1,0);ix.closePath();
    const hg=ix.createLinearGradient(0,-S*.3,0,S*.3);
    hg.addColorStop(0,'#d0c8f0');hg.addColorStop(.5,'#a098c8');hg.addColorStop(1,'#7068a0');
    ix.fillStyle=hg;ix.fill();ix.strokeStyle='rgba(220,210,250,.45)';ix.lineWidth=.8;ix.stroke();
    // cockpit
    ix.beginPath();ix.moveTo(S*.85,0);
    ix.bezierCurveTo(S*.7,-S*.08,S*.45,-S*.1,S*.3,-S*.07);ix.lineTo(S*.3,S*.07);
    ix.bezierCurveTo(S*.45,S*.1,S*.7,S*.08,S*.85,0);ix.closePath();
    ix.fillStyle='rgba(140,200,250,.5)';ix.fill();
    // wings
    ix.beginPath();ix.moveTo(S*.1,-S*.2);ix.lineTo(-S*.45,-S*.7);ix.lineTo(-S*.65,-S*.65);ix.lineTo(-S*.55,-S*.4);ix.lineTo(-S*.15,-S*.22);ix.closePath();
    ix.fillStyle='rgba(110,100,170,.6)';ix.fill();
    ix.beginPath();ix.moveTo(S*.1,S*.2);ix.lineTo(-S*.45,S*.7);ix.lineTo(-S*.65,S*.65);ix.lineTo(-S*.55,S*.4);ix.lineTo(-S*.15,S*.22);ix.closePath();
    ix.fillStyle='rgba(100,90,160,.6)';ix.fill();
    // nacelles
    for(const ey of [-S*.22,S*.22]){
      ix.beginPath();ix.moveTo(-S*.2,ey-S*.06);ix.lineTo(-S*.78,ey-S*.05);ix.lineTo(-S*.82,ey);ix.lineTo(-S*.78,ey+S*.05);ix.lineTo(-S*.2,ey+S*.06);ix.closePath();
      ix.fillStyle='rgba(110,100,160,.6)';ix.fill();
    }
    ix.restore();
  }

  function drawIntro(now){
    if(!startT)startT=now;
    const el=(now-startT)/dur;
    if(el>1){endIntro();return}

    /* phases:
       0.00-0.15: ship appears at bottom, engines ignite
       0.15-0.50: ship accelerates upward, camera follows
       0.50-0.80: warp speed — stars become long lines, ship shrinks to center
       0.80-1.00: fade to solar view */

    const accelP=Math.max(0,Math.min(1,(el-.05)/.45)); // 0.05-0.50
    const warpP=Math.max(0,Math.min(1,(el-.50)/.30));   // 0.50-0.80
    const fadeP=Math.max(0,Math.min(1,(el-.82)/.18));    // 0.82-1.00
    const speed=accelP*accelP*3+warpP*20; // accelerating
    const thrust=Math.min(1,accelP*2);

    // clear: full clear before warp, trail effect during warp
    if(warpP>.05){
      ix.fillStyle=`rgba(4,4,8,${warpP>.4?.12:.2})`;ix.fillRect(0,0,W,H);
    } else {
      ix.clearRect(0,0,W,H);
      ix.fillStyle='#040408';ix.fillRect(0,0,W,H);
    }

    // nebulae (fly through them)
    nebs.forEach(n=>{
      const ny=n.y+speed*60;
      const wrappedY=((ny%H)+H)%H;
      const a=(.08-warpP*.05)*Math.max(0,1-fadeP);
      if(a<=0)return;
      ix.save();ix.translate(n.x,wrappedY);ix.rotate(n.rot);
      const g=ix.createRadialGradient(0,0,0,0,0,n.rx*1.3);
      g.addColorStop(0,`rgba(${n.c},${a})`);g.addColorStop(.5,`rgba(${n.c},${a*.5})`);g.addColorStop(1,`rgba(${n.c},0)`);
      ix.beginPath();ix.ellipse(0,0,n.rx*1.3,n.ry*1.3,0,0,Math.PI*2);ix.fillStyle=g;ix.fill();ix.restore();
    });

    // star field → speed lines
    stars.forEach(s=>{
      s.z-=speed*8;
      if(s.z<=0){s.z=1500;s.x=(Math.random()-.5)*W*2;s.y=(Math.random()-.5)*H*2}
      const sx=cx0+s.x/s.z*400;
      const sy=cy0+s.y/s.z*400;
      if(sx<-50||sx>W+50||sy<-50||sy>H+50)return;
      const prevZ=s.z+speed*8;
      const psx=cx0+s.x/prevZ*400;
      const psy=cy0+s.y/prevZ*400;
      const bright=Math.min(1,(1500-s.z)/1000);
      const baseA=warpP>.05?bright*(.6+warpP*.4):bright*.7+.15;
      const a=baseA*Math.max(0,1-fadeP*.5);

      if(warpP>.1){
        // speed lines
        const lineLen=Math.min(120,Math.sqrt((sx-psx)**2+(sy-psy)**2)*warpP*4);
        const ang=Math.atan2(sy-cy0,sx-cx0);
        ix.beginPath();ix.moveTo(sx,sy);
        ix.lineTo(sx-Math.cos(ang)*lineLen,sy-Math.sin(ang)*lineLen);
        ix.strokeStyle=`rgba(${s.c},${a*.7})`;ix.lineWidth=.4+bright*1.2;ix.stroke();
      } else {
        // normal stars with twinkle
        const tw=.7+.3*Math.sin(now*.003+s.z);
        ix.beginPath();ix.arc(sx,sy,s.r*(bright+.3)*tw,0,Math.PI*2);
        ix.fillStyle=`rgba(${s.c},${a*tw})`;ix.fill();
      }
    });

    // ship
    const shipAlpha=Math.min(1,el/.06)*Math.max(0,1-fadeP*1.5);
    if(shipAlpha>0){
      const shipY_start=H*.72;
      const shipY_mid=cy0;
      const shipY=el<.5?shipY_start-(shipY_start-shipY_mid)*accelP*accelP:cy0;
      const shipScale=Math.max(12,45*(1-warpP*.6));
      // slight vibration during acceleration
      const vib=thrust>.3?Math.sin(now*.05)*2.5*thrust:0;
      drawShip(ix,cx0+vib,shipY,shipScale,thrust,shipAlpha);
    }

    // screen shake during warp initiation
    if(warpP>.0&&warpP<.3){
      const shk=Math.sin(now*.08)*3*(1-warpP/.3);
      ic.style.transform=`translate(${shk}px,${shk*.5}px)`;
    }else{ic.style.transform=''}

    // central warp flash
    if(warpP>.0&&warpP<.2){
      const fa=Math.sin(warpP/.2*Math.PI)*.35;
      const fg=ix.createRadialGradient(cx0,cy0,0,cx0,cy0,W*.4);
      fg.addColorStop(0,`rgba(180,220,255,${fa})`);fg.addColorStop(.3,`rgba(120,160,255,${fa*.5})`);fg.addColorStop(1,'rgba(60,100,255,0)');
      ix.beginPath();ix.arc(cx0,cy0,W*.4,0,Math.PI*2);ix.fillStyle=fg;ix.fill();
    }

    // fade to black at end
    if(fadeP>0){
      ix.fillStyle=`rgba(5,5,8,${fadeP})`;ix.fillRect(0,0,W,H);
    }

    requestAnimationFrame(drawIntro);
  }

  // text
  setTimeout(()=>$('iTxt').classList.add('on'),300);
  setTimeout(()=>{$('iTxt').classList.remove('on');$('iTxt').classList.add('off')},3000);
  function endIntro(){
    ic.style.transform='';
    ov.classList.add('out');
    setTimeout(()=>{ov.classList.add('gone');rSolar()},1200);
    sessionStorage.setItem('xpz_intro','1');
  }
  requestAnimationFrame(drawIntro);
})();

/* ===== SOLAR CANVAS ===== */
const sc=$('solarC'),sx=sc.getContext('2d');
let sW,sH,sCx,sCy,sScale=1,sStars=[],sNebulae=[],sGalaxies=[],hov=null,pPos=[];
function rSolar(){
  sW=sc.width=innerWidth;sH=sc.height=innerHeight;sCx=sW/2;sCy=sH/2;
  sScale=Math.min(sW/900,sH/800,1.2);if(sScale<.45)sScale=.45;
  // multi-layer stars — EXTREME MODE: max density, max size, always bright
  sStars=[];
  const area=sW*sH;
  const dens=area/1e6;
  const N1=Math.round(14400*dens), N2=Math.round(7200*dens), N3=Math.round(4000*dens), N4=Math.round(2560*dens), N5=Math.round(1120*dens);
  // Layer 1: background dust — never dim, always visible
  for(let i=0;i<N1;i++)sStars.push({x:Math.random()*sW,y:Math.random()*sH,r:Math.random()*1.4+1.3,a:Math.random()*.15+.8,o:Math.random()*1e3,s:.0004+Math.random()*.0008,c:'220,230,250',sp:0,amp:.2});
  // Layer 2: mid stars — strong presence
  for(let i=0;i<N2;i++)sStars.push({x:Math.random()*sW,y:Math.random()*sH,r:Math.random()*2.2+1.9,a:Math.random()*.1+.9,o:Math.random()*1e3,s:.0008+Math.random()*.0015,c:'235,243,255',sp:0,amp:.2});
  // Layer 3: bright colored stars
  for(let i=0;i<N3;i++){const colors=['245,250,255','255,238,190','225,237,255','255,205,170','205,230,255','255,220,205','255,190,175','255,240,220'];sStars.push({x:Math.random()*sW,y:Math.random()*sH,r:Math.random()*2.6+2.6,a:Math.random()*.1+.92,o:Math.random()*1e3,s:.0012+Math.random()*.003,c:colors[Math.floor(Math.random()*colors.length)],sp:0,amp:.25})}
  // Layer 4: sparkle stars — HUGE bright cross rays
  for(let i=0;i<N4;i++){const colors=['255,255,255','240,248,255','255,250,230','220,240,255'];sStars.push({x:Math.random()*sW,y:Math.random()*sH,r:Math.random()*2.3+3.8,a:Math.random()*.08+.96,o:Math.random()*1e3,s:.002+Math.random()*.007,c:colors[Math.floor(Math.random()*colors.length)],sp:1,amp:.3})}
  // Layer 5: pulse hero stars — massive halo
  for(let i=0;i<N5;i++){const colors=['255,255,255','245,250,255','255,245,235','255,240,220'];sStars.push({x:Math.random()*sW,y:Math.random()*sH,r:Math.random()*2.8+4.8,a:1,o:Math.random()*1e3,s:.0005+Math.random()*.001,c:colors[Math.floor(Math.random()*colors.length)],sp:2,amp:.25})}
  // nebulae / cosmic clouds — brighter, more saturated
  sNebulae=[];
  sNebulae.push({x:sW*.15,y:sH*.2,rx:sW*.22,ry:sH*.15,c:'110,60,180',a:.09,rot:.2});
  sNebulae.push({x:sW*.82,y:sH*.15,rx:sW*.16,ry:sH*.11,c:'60,90,200',a:.08,rot:-.3});
  sNebulae.push({x:sW*.08,y:sH*.75,rx:sW*.18,ry:sH*.13,c:'130,50,160',a:.08,rot:.5});
  sNebulae.push({x:sW*.9,y:sH*.7,rx:sW*.13,ry:sH*.17,c:'50,80,190',a:.075,rot:-.1});
  sNebulae.push({x:sW*.5,y:sH*.5,rx:sW*.3,ry:sH*.2,c:'70,50,150',a:.04,rot:.1});
  // milky way band (diagonal) — brighter
  sNebulae.push({x:sW*.35,y:sH*.1,rx:sW*.45,ry:sH*.05,c:'120,110,170',a:.06,rot:-.45});
  sNebulae.push({x:sW*.55,y:sH*.18,rx:sW*.4,ry:sH*.045,c:'110,100,165',a:.055,rot:-.45});
  sNebulae.push({x:sW*.7,y:sH*.85,rx:sW*.35,ry:sH*.05,c:'115,95,160',a:.06,rot:-.45});
  // distant galaxies
  sGalaxies=[];
  for(let i=0;i<5;i++)sGalaxies.push({x:Math.random()*sW,y:Math.random()*sH*.4+sH*.05,r:2+Math.random()*3,a:Math.random()*.08+.03,rot:Math.random()*Math.PI});
}
rSolar();

function lc(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgb(${Math.min(255,r+a*255|0)},${Math.min(255,g+a*255|0)},${Math.min(255,b+a*255|0)})`}
function dc(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgb(${Math.max(0,r-a*255|0)},${Math.max(0,g-a*255|0)},${Math.max(0,b-a*255|0)})`}

function dSolar(t){
  if(viewMode!=='solar'){requestAnimationFrame(dSolar);return}
  sx.clearRect(0,0,sW,sH);

  // === breathing + parallax camera transform ===
  camX+=(camTX-camX)*CAM_EASE;
  camY+=(camTY-camY)*CAM_EASE;
  const breath=1+Math.sin(t*.0003)*.006; // subtle scale pulsation
  const breathRot=Math.sin(t*.00018)*.002; // micro rotation
  sx.save();
  sx.translate(sW/2+camX,sH/2+camY);
  sx.rotate(breathRot);
  sx.scale(breath,breath);
  sx.translate(-sW/2,-sH/2);

  // nebulae / milky way (behind everything)
  sNebulae.forEach(n=>{
    const pulse=n.a*(.7+.3*Math.sin(t*.00008+n.rot*10));
    sx.save();sx.translate(n.x,n.y);sx.rotate(n.rot);
    const g=sx.createRadialGradient(0,0,0,0,0,Math.max(n.rx,n.ry));
    g.addColorStop(0,`rgba(${n.c},${pulse})`);
    g.addColorStop(.5,`rgba(${n.c},${pulse*.4})`);
    g.addColorStop(1,`rgba(${n.c},0)`);
    sx.beginPath();sx.ellipse(0,0,n.rx,n.ry,0,0,Math.PI*2);
    sx.fillStyle=g;sx.fill();sx.restore();
  });

  // distant galaxies (tiny spirals)
  sGalaxies.forEach(g=>{
    sx.save();sx.translate(g.x,g.y);sx.rotate(g.rot+t*.00002);
    const gr=sx.createRadialGradient(0,0,0,0,0,g.r*3);
    gr.addColorStop(0,`rgba(200,210,240,${g.a})`);gr.addColorStop(.4,`rgba(180,190,220,${g.a*.4})`);gr.addColorStop(1,'rgba(150,160,200,0)');
    sx.beginPath();sx.ellipse(0,0,g.r*3,g.r*1.5,0,0,Math.PI*2);sx.fillStyle=gr;sx.fill();
    // core
    sx.beginPath();sx.arc(0,0,g.r*.5,0,Math.PI*2);sx.fillStyle=`rgba(230,235,255,${g.a*1.5})`;sx.fill();
    sx.restore();
  });

  // stars — MAX GLOW: bigger halo, stronger core, always visible
  sx.save();sx.globalCompositeOperation='lighter';
  sStars.forEach(s=>{
    const amp=s.amp||.4;
    const f=(1-amp)+amp*(.5+.5*Math.sin(t*s.s+s.o));
    const a=Math.min(1,s.a*f);
    // base halo — MASSIVE (10x) for 1/3 screen glow coverage
    const hg=sx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*10);
    hg.addColorStop(0,`rgba(${s.c},${a*.95})`);
    hg.addColorStop(.2,`rgba(${s.c},${a*.5})`);
    hg.addColorStop(.5,`rgba(${s.c},${a*.18})`);
    hg.addColorStop(.8,`rgba(${s.c},${a*.05})`);
    hg.addColorStop(1,`rgba(${s.c},0)`);
    sx.beginPath();sx.arc(s.x,s.y,s.r*10,0,Math.PI*2);sx.fillStyle=hg;sx.fill();
    // bright core — double draw for punch
    sx.beginPath();sx.arc(s.x,s.y,s.r,0,Math.PI*2);sx.fillStyle=`rgba(${s.c},${Math.min(1,a*1.2)})`;sx.fill();
    sx.beginPath();sx.arc(s.x,s.y,s.r*.5,0,Math.PI*2);sx.fillStyle=`rgba(255,255,255,${a*.9})`;sx.fill();
    // sparkle: cross rays (8-way, super long)
    if(s.sp===1){const rl=s.r*14*f;const rd=s.r*9*f;sx.beginPath();sx.moveTo(s.x-rl,s.y);sx.lineTo(s.x+rl,s.y);sx.moveTo(s.x,s.y-rl);sx.lineTo(s.x,s.y+rl);sx.strokeStyle=`rgba(${s.c},${a*.8})`;sx.lineWidth=1.3;sx.stroke();sx.beginPath();sx.moveTo(s.x-rd,s.y-rd);sx.lineTo(s.x+rd,s.y+rd);sx.moveTo(s.x+rd,s.y-rd);sx.lineTo(s.x-rd,s.y+rd);sx.strokeStyle=`rgba(${s.c},${a*.5})`;sx.lineWidth=.9;sx.stroke()}
    // pulse: HUGE breathing halo (20x)
    if(s.sp===2){const pf=.4+.6*(.5+.5*Math.sin(t*s.s+s.o));const pa=s.a*pf;const hg2=sx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*20);hg2.addColorStop(0,`rgba(${s.c},${pa*.6})`);hg2.addColorStop(.25,`rgba(${s.c},${pa*.28})`);hg2.addColorStop(.55,`rgba(${s.c},${pa*.1})`);hg2.addColorStop(.85,`rgba(${s.c},${pa*.02})`);hg2.addColorStop(1,`rgba(${s.c},0)`);sx.beginPath();sx.arc(s.x,s.y,s.r*20,0,Math.PI*2);sx.fillStyle=hg2;sx.fill()}
  });
  sx.restore();

  // orbit lines — elliptical with eccentricity
  P.forEach(p=>{if(!p.oR)return;
    const a=p.oR*sScale;          // semi-major axis
    const e=p.ecc||0;
    const b=a*Math.sqrt(1-e*e);   // semi-minor axis
    const oRy=b*.45;              // perspective squash
    const oRx=a;
    const cx_off=a*e*sScale*.3;   // slight offset for eccentricity
    // outer glow
    sx.beginPath();sx.ellipse(sCx+cx_off,sCy,oRx,oRy,0,0,Math.PI*2);sx.strokeStyle='rgba(140,160,220,.04)';sx.lineWidth=3;sx.stroke();
    // main ring
    sx.beginPath();sx.ellipse(sCx+cx_off,sCy,oRx,oRy,0,0,Math.PI*2);sx.strokeStyle='rgba(150,170,230,.09)';sx.lineWidth=.7;sx.stroke();
  });

  // planets
  pPos=[];
  P.forEach(p=>{
    const ang=t*p.spd;
    const e=p.ecc||0;
    const a=p.oR*sScale;
    const b=a*Math.sqrt(1-e*e);
    const cx_off=p.oR?a*e*.3:0;
    const px=p.oR?sCx+cx_off+Math.cos(ang)*a:sCx;
    const py=p.oR?sCy+Math.sin(ang)*b*.45:sCy;
    const pr=p.r*sScale;
    pPos.push({...p,px,py,pr,ang});const ih=hov===p.id;
    // sun corona
    if(p.id==='sun'){
      const g1=sx.createRadialGradient(px,py,pr*.2,px,py,pr*5);
      g1.addColorStop(0,`rgba(255,200,60,${.08+.03*Math.sin(t*.0008)})`);g1.addColorStop(.3,'rgba(255,160,40,.04)');g1.addColorStop(1,'rgba(255,120,20,0)');
      sx.beginPath();sx.arc(px,py,pr*5,0,Math.PI*2);sx.fillStyle=g1;sx.fill();
      const g2=sx.createRadialGradient(px,py,pr*.5,px,py,pr*2.5);
      g2.addColorStop(0,`rgba(255,220,80,${.15+.05*Math.sin(t*.001)})`);g2.addColorStop(1,'rgba(255,180,40,0)');
      sx.beginPath();sx.arc(px,py,pr*2.5,0,Math.PI*2);sx.fillStyle=g2;sx.fill();
    }
    // hover glow
    else if(ih){const g=sx.createRadialGradient(px,py,pr,px,py,pr*3.5);g.addColorStop(0,p.color+'30');g.addColorStop(1,p.color+'00');sx.beginPath();sx.arc(px,py,pr*3.5,0,Math.PI*2);sx.fillStyle=g;sx.fill()}
    // saturn rings (behind when above)
    if(p.id==='saturn'){sx.save();sx.translate(px,py);sx.beginPath();sx.ellipse(0,0,pr*2.4,pr*.7,-.12,0,Math.PI*2);sx.strokeStyle=`rgba(212,184,112,${ih?.25:.1})`;sx.lineWidth=pr*.28;sx.stroke();sx.beginPath();sx.ellipse(0,0,pr*1.7,pr*.5,-.12,0,Math.PI*2);sx.strokeStyle=`rgba(200,170,100,${ih?.15:.06})`;sx.lineWidth=pr*.1;sx.stroke();sx.restore()}
    // planet body
    const g=sx.createRadialGradient(px-pr*.3,py-pr*.3,0,px,py,pr);
    g.addColorStop(0,lc(p.color,.3));g.addColorStop(.65,p.color);g.addColorStop(1,dc(p.color,.3));
    sx.beginPath();sx.arc(px,py,pr*(ih?1.15:1),0,Math.PI*2);sx.fillStyle=g;sx.fill();
    // earth surface hint
    if(p.id==='earth'){
      sx.save();sx.globalAlpha=.3;
      sx.beginPath();sx.arc(px-pr*.2,py-pr*.15,pr*.35,0,Math.PI*2);sx.fillStyle='rgba(80,160,60,.5)';sx.fill();
      sx.beginPath();sx.arc(px+pr*.25,py+pr*.1,pr*.22,0,Math.PI*2);sx.fillStyle='rgba(80,160,60,.4)';sx.fill();
      sx.restore();
      // MOON orbiting earth
      const mAng=t*.002;const mDist=pr*3.2;
      const mx=px+Math.cos(mAng)*mDist;
      const my=py+Math.sin(mAng)*mDist*.4;
      const mr=Math.max(2,pr*.22);
      // moon orbit line
      sx.beginPath();sx.ellipse(px,py,mDist,mDist*.4,0,0,Math.PI*2);sx.strokeStyle='rgba(255,255,255,.02)';sx.lineWidth=.5;sx.stroke();
      // moon body
      const mg=sx.createRadialGradient(mx-mr*.2,my-mr*.2,0,mx,my,mr);
      mg.addColorStop(0,'#e8e4dc');mg.addColorStop(.6,'#b8b0a4');mg.addColorStop(1,'#7a746c');
      sx.beginPath();sx.arc(mx,my,mr,0,Math.PI*2);sx.fillStyle=mg;sx.fill();
      // moon shadow
      const ms=sx.createLinearGradient(mx+mr*.2,my,mx+mr,my);
      ms.addColorStop(0,'rgba(0,0,10,0)');ms.addColorStop(1,'rgba(0,0,10,.35)');
      sx.beginPath();sx.arc(mx,my,mr,0,Math.PI*2);sx.fillStyle=ms;sx.fill();
    }
    // planet name
    if(ih||p.id==='sun'){sx.fillStyle=ih?'rgba(255,255,255,.85)':'rgba(255,255,255,.18)';sx.font=`${Math.max(9,10*sScale)}px -apple-system,sans-serif`;sx.textAlign='center';sx.fillText(p.name,px,py+pr+14*sScale)}
  });

  // ===== SHIP =====
  // fly outside the outermost orbit (neptune oR=420)
  const outerR=430*sScale; // just beyond neptune
  const sht=t*.00012;
  // orbit angle + wobble
  const shipOrbitAng=sht*1.2;
  const wobbleR=outerR*.18; // slight radial wobble
  const rDist=outerR+40*sScale+Math.sin(sht*2.3)*wobbleR;
  const shipX=sCx+Math.cos(shipOrbitAng)*rDist+Math.sin(sht*3.1)*15;
  const shipY=sCy+Math.sin(shipOrbitAng)*rDist*.45+Math.cos(sht*2.7)*10;
  const sht2=sht+.001;
  const shipOrbitAng2=sht2*1.2;
  const rDist2=outerR+40*sScale+Math.sin(sht2*2.3)*wobbleR;
  const shipX2=sCx+Math.cos(shipOrbitAng2)*rDist2+Math.sin(sht2*3.1)*15;
  const shipY2=sCy+Math.sin(shipOrbitAng2)*rDist2*.45+Math.cos(sht2*2.7)*10;
  const shipAng=Math.atan2(shipY2-shipY,shipX2-shipX);
  const S=Math.max(14,22*sScale); // base unit
  dSolar._shipPos={x:shipX,y:shipY,sz:S};

  sx.save();sx.translate(shipX,shipY);sx.rotate(shipAng);

  // === engine exhaust particles ===
  if(!dSolar._exh)dSolar._exh=[];
  for(let i=0;i<2;i++){
    const ey=(i===0?-1:1)*S*.22;
    dSolar._exh.push({x:-S*.85,y:ey,vx:-(1.5+Math.random()*2),vy:(Math.random()-.5)*.6,life:1,r:1+Math.random()*1.5});
  }
  // draw particles in ship-local coords
  dSolar._exh=dSolar._exh.filter(p=>{
    p.x+=p.vx;p.y+=p.vy;p.life-=.04;if(p.life<=0)return false;
    sx.beginPath();sx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    sx.fillStyle=`rgba(100,180,255,${p.life*.35})`;sx.fill();return true;
  });

  // === engine glow (two engines) ===
  const flk=.6+.4*Math.sin(t*.012);
  for(const ey of [-S*.22,S*.22]){
    const egR=S*(shipHov?1.8:1.2)*flk;
    const eg=sx.createRadialGradient(-S*.85,ey,0,-S*.85,ey,egR);
    eg.addColorStop(0,`rgba(140,200,255,${shipHov?.3:.15})`);
    eg.addColorStop(.3,`rgba(100,160,255,${shipHov?.15:.06})`);
    eg.addColorStop(1,'rgba(60,120,255,0)');
    sx.beginPath();sx.arc(-S*.85,ey,egR,0,Math.PI*2);sx.fillStyle=eg;sx.fill();
    // flame cone
    sx.beginPath();sx.moveTo(-S*.78,ey-S*.06);
    sx.lineTo(-S*(1.05+flk*.25),ey);
    sx.lineTo(-S*.78,ey+S*.06);sx.closePath();
    const fgr=sx.createLinearGradient(-S*.78,ey,-S*(1.05+flk*.25),ey);
    fgr.addColorStop(0,'rgba(180,220,255,.55)');fgr.addColorStop(.5,'rgba(100,160,255,.25)');fgr.addColorStop(1,'rgba(60,100,255,0)');
    sx.fillStyle=fgr;sx.fill();
  }

  // === main hull (streamlined fuselage) ===
  sx.beginPath();
  sx.moveTo(S*1.1,0); // nose tip
  sx.bezierCurveTo(S*.8,-S*.12,S*.3,-S*.2,-S*.1,-S*.22); // top fuselage curve
  sx.lineTo(-S*.75,-S*.18); // rear top
  sx.lineTo(-S*.8,0);       // rear center
  sx.lineTo(-S*.75,S*.18);  // rear bottom
  sx.lineTo(-S*.1,S*.22);   // bottom fuselage
  sx.bezierCurveTo(S*.3,S*.2,S*.8,S*.12,S*1.1,0); // bottom curve to nose
  sx.closePath();
  const hg=sx.createLinearGradient(0,-S*.3,0,S*.3);
  hg.addColorStop(0,shipHov?'#c8c0e8':'#a098c0');
  hg.addColorStop(.4,shipHov?'#9890c8':'#787098');
  hg.addColorStop(.6,shipHov?'#8880b8':'#686088');
  hg.addColorStop(1,shipHov?'#706898':'#504868');
  sx.fillStyle=hg;sx.fill();
  // hull edge highlight
  sx.strokeStyle=shipHov?'rgba(200,190,240,.5)':'rgba(160,150,200,.2)';sx.lineWidth=.6;sx.stroke();
  // center line (panel seam)
  sx.beginPath();sx.moveTo(S*.9,0);sx.lineTo(-S*.7,0);
  sx.strokeStyle='rgba(255,255,255,.06)';sx.lineWidth=.3;sx.stroke();

  // === cockpit canopy ===
  sx.beginPath();
  sx.moveTo(S*.85,0);
  sx.bezierCurveTo(S*.7,-S*.08,S*.45,-S*.1,S*.3,-S*.07);
  sx.lineTo(S*.3,S*.07);
  sx.bezierCurveTo(S*.45,S*.1,S*.7,S*.08,S*.85,0);
  sx.closePath();
  const cg=sx.createLinearGradient(S*.3,-S*.1,S*.3,S*.1);
  cg.addColorStop(0,shipHov?'rgba(160,220,255,.65)':'rgba(120,180,230,.35)');
  cg.addColorStop(.5,shipHov?'rgba(100,180,240,.5)':'rgba(80,140,200,.25)');
  cg.addColorStop(1,shipHov?'rgba(80,150,220,.4)':'rgba(60,120,180,.2)');
  sx.fillStyle=cg;sx.fill();
  // canopy glint
  sx.beginPath();sx.moveTo(S*.75,-S*.02);sx.lineTo(S*.6,-S*.05);sx.lineTo(S*.55,-S*.02);
  sx.strokeStyle='rgba(255,255,255,.35)';sx.lineWidth=.4;sx.stroke();

  // === wings (swept-back delta) ===
  // top wing
  sx.beginPath();
  sx.moveTo(S*.1,-S*.2);
  sx.lineTo(-S*.45,-S*.7);
  sx.lineTo(-S*.65,-S*.65);
  sx.lineTo(-S*.55,-S*.4);
  sx.lineTo(-S*.15,-S*.22);sx.closePath();
  const wg1=sx.createLinearGradient(0,-S*.2,0,-S*.7);
  wg1.addColorStop(0,shipHov?'#8880b8':'#605888');
  wg1.addColorStop(1,shipHov?'#5850a0':'#383060');
  sx.fillStyle=wg1;sx.fill();
  sx.strokeStyle=shipHov?'rgba(180,170,230,.3)':'rgba(120,110,170,.15)';sx.lineWidth=.4;sx.stroke();
  // wing stripe
  sx.beginPath();sx.moveTo(-S*.05,-S*.22);sx.lineTo(-S*.5,-S*.58);
  sx.strokeStyle=`rgba(140,120,220,${shipHov?.25:.1})`;sx.lineWidth=1.2;sx.stroke();

  // bottom wing
  sx.beginPath();
  sx.moveTo(S*.1,S*.2);
  sx.lineTo(-S*.45,S*.7);
  sx.lineTo(-S*.65,S*.65);
  sx.lineTo(-S*.55,S*.4);
  sx.lineTo(-S*.15,S*.22);sx.closePath();
  const wg2=sx.createLinearGradient(0,S*.2,0,S*.7);
  wg2.addColorStop(0,shipHov?'#7870a8':'#504878');
  wg2.addColorStop(1,shipHov?'#484090':'#302850');
  sx.fillStyle=wg2;sx.fill();
  sx.strokeStyle=shipHov?'rgba(180,170,230,.3)':'rgba(120,110,170,.15)';sx.lineWidth=.4;sx.stroke();
  sx.beginPath();sx.moveTo(-S*.05,S*.22);sx.lineTo(-S*.5,S*.58);
  sx.strokeStyle=`rgba(140,120,220,${shipHov?.25:.1})`;sx.lineWidth=1.2;sx.stroke();

  // === engine nacelles (two pods) ===
  for(const ey of [-S*.22,S*.22]){
    sx.beginPath();
    sx.moveTo(-S*.2,ey-S*.06);
    sx.lineTo(-S*.78,ey-S*.05);
    sx.lineTo(-S*.82,ey);
    sx.lineTo(-S*.78,ey+S*.05);
    sx.lineTo(-S*.2,ey+S*.06);sx.closePath();
    const ng=sx.createLinearGradient(0,ey-S*.06,0,ey+S*.06);
    ng.addColorStop(0,shipHov?'#9088b8':'#686080');
    ng.addColorStop(1,shipHov?'#6860a0':'#484068');
    sx.fillStyle=ng;sx.fill();
    sx.strokeStyle=shipHov?'rgba(180,170,230,.25)':'rgba(130,120,180,.12)';sx.lineWidth=.4;sx.stroke();
    // intake ring
    sx.beginPath();sx.arc(-S*.78,ey,S*.045,0,Math.PI*2);
    sx.strokeStyle=`rgba(140,200,255,${shipHov?.4:.15})`;sx.lineWidth=.6;sx.stroke();
  }

  // === nose highlight ===
  const nh=sx.createRadialGradient(S*.9,0,0,S*.7,0,S*.3);
  nh.addColorStop(0,`rgba(255,255,255,${shipHov?.12:.05})`);nh.addColorStop(1,'rgba(255,255,255,0)');
  sx.beginPath();sx.arc(S*.8,0,S*.25,0,Math.PI*2);sx.fillStyle=nh;sx.fill();

  // === hover shield glow ===
  if(shipHov){
    const sg=sx.createRadialGradient(0,0,S*.3,0,0,S*1.6);
    sg.addColorStop(0,'rgba(140,120,220,.08)');sg.addColorStop(.5,'rgba(120,100,200,.03)');sg.addColorStop(1,'rgba(100,80,180,0)');
    sx.beginPath();sx.ellipse(0,0,S*1.6,S*1,0,0,Math.PI*2);sx.fillStyle=sg;sx.fill();
  }

  sx.restore();
  // ship label
  if(shipHov){sx.fillStyle='rgba(200,190,240,.9)';sx.font=`bold ${Math.max(10,11*sScale)}px -apple-system,sans-serif`;sx.textAlign='center';sx.fillText('🚀 星际飞船',shipX,shipY+S*1.1+14*sScale)}

  // occasional shooting star
  if(!dSolar._ss)dSolar._ss=[];
  if(Math.random()<.003)dSolar._ss.push({x:Math.random()*sW,y:Math.random()*sH*.3,vx:3+Math.random()*4,vy:1.5+Math.random()*2,life:1,len:40+Math.random()*60});
  dSolar._ss=dSolar._ss.filter(s=>{s.x+=s.vx;s.y+=s.vy;s.life-=.015;if(s.life<=0)return false;
    const g=sx.createLinearGradient(s.x,s.y,s.x-s.vx*s.len*.15,s.y-s.vy*s.len*.15);
    g.addColorStop(0,`rgba(220,235,255,${s.life*.4})`);g.addColorStop(1,'rgba(200,220,255,0)');
    sx.beginPath();sx.moveTo(s.x,s.y);sx.lineTo(s.x-s.vx*s.len*.15,s.y-s.vy*s.len*.15);
    sx.strokeStyle=g;sx.lineWidth=.6+s.life*.5;sx.stroke();return true});

  sx.restore(); // end breathing + parallax transform
  requestAnimationFrame(dSolar);
}
requestAnimationFrame(dSolar);

/* ===== SOLAR INTERACTION ===== */
// parallax camera offset (smooth-tracked mouse position)
let camTX=0,camTY=0,camX=0,camY=0; // target & current
const CAM_RANGE=35; // max px offset
const CAM_EASE=.04; // smoothing factor
let shipHov=false;
sc.addEventListener('mousemove',e=>{
  const rawX=e.clientX,rawY=e.clientY;let fPl=null;shipHov=false;
  // parallax: map mouse to camera offset
  camTX=((rawX/sW)-.5)*-2*CAM_RANGE;
  camTY=((rawY/sH)-.5)*-2*CAM_RANGE;
  // compensate for camera transform when hit-testing
  const mx=rawX-camX,my=rawY-camY;
  // check ship first
  if(dSolar._shipPos){const sp=dSolar._shipPos,hr=sp.sz?sp.sz*1.5:30,dx=mx-sp.x,dy=my-sp.y;if(dx*dx+dy*dy<hr*hr){shipHov=true}}
  // check planets for info display only
  if(!shipHov){
    for(let i=pPos.length-1;i>=0;i--){const p=pPos[i],dx=mx-p.px,dy=my-p.py,hr=Math.max(p.pr*2.5,20);if(dx*dx+dy*dy<hr*hr){fPl=p;break}}
  }
  if(shipHov){hov=null;sc.style.cursor='pointer';$('piN').textContent='🚀 星际飞船';$('piD').textContent=SHIP.desc;$('piH').style.display='';$('pi').style.left=(e.clientX+14)+'px';$('pi').style.top=(e.clientY-55)+'px';$('pi').classList.add('on')}
  else if(fPl&&fPl.id!=='sun'){hov=fPl.id;sc.style.cursor='default';$('piN').textContent=fPl.emoji+' '+fPl.name;$('piD').textContent=fPl.desc;$('piH').style.display='none';$('pi').style.left=(e.clientX+14)+'px';$('pi').style.top=(e.clientY-55)+'px';$('pi').classList.add('on')}
  else{hov=null;sc.style.cursor='default';$('pi').classList.remove('on')}
});
sc.addEventListener('mouseleave',()=>{hov=null;shipHov=false;$('pi').classList.remove('on');camTX=0;camTY=0});
sc.addEventListener('click',()=>{if(shipHov)enterShip()});
// mobile: gyroscope parallax
if(window.DeviceOrientationEvent){
  window.addEventListener('deviceorientation',e=>{
    if(e.gamma==null)return;
    camTX=Math.max(-CAM_RANGE,Math.min(CAM_RANGE,e.gamma*1.2));
    camTY=Math.max(-CAM_RANGE,Math.min(CAM_RANGE,(e.beta-45)*.8));
  });
}
// mobile: touch drag parallax
sc.addEventListener('touchmove',e=>{
  const t=e.touches[0];if(!t)return;
  camTX=((t.clientX/sW)-.5)*-2*CAM_RANGE;
  camTY=((t.clientY/sH)-.5)*-2*CAM_RANGE;
},{passive:true});
sc.addEventListener('touchend',()=>{camTX=0;camTY=0});
// mobile: tap to enter ship or show planet info
sc.addEventListener('touchstart',e=>{
  const t=e.touches[0];if(!t)return;
  const mx=t.clientX-camX,my=t.clientY-camY;
  if(dSolar._shipPos){const sp=dSolar._shipPos,hr=sp.sz?sp.sz*2:40,dx=mx-sp.x,dy=my-sp.y;if(dx*dx+dy*dy<hr*hr){enterShip();return}}
  for(let i=pPos.length-1;i>=0;i--){const p=pPos[i],dx=mx-p.px,dy=my-p.py,hr=Math.max(p.pr*3,25);if(dx*dx+dy*dy<hr*hr&&p.id!=='sun'){
    $('piN').textContent=p.emoji+' '+p.name;$('piD').textContent=p.desc;$('piH').style.display='none';
    $('pi').style.left=Math.min(t.clientX+10,sW-180)+'px';$('pi').style.top=(t.clientY-70)+'px';$('pi').classList.add('on');
    setTimeout(()=>$('pi').classList.remove('on'),2500);return;
  }}
},{passive:true});

/* ===== ENTER/EXIT SHIP ===== */
function enterShip(){
  const tr=$('ptrans'),ring=$('ptRing');ring.style.background=SHIP.color;tr.classList.add('on');$('pnav').classList.add('hide');
  setTimeout(()=>{
    curES='cosmos';applyT(ES.cosmos);
    viewMode='content';$('solar').classList.add('off');$('nav').classList.add('on');$('hero').classList.add('on');$('qSec').classList.add('on');$('mc').classList.add('on');$('footer').classList.add('on');$('backBtn').style.display='flex';
    $('npE').textContent='🚀';$('npN').textContent='飞船';$('hDesc').textContent='在浩瀚宇宙里，留一颗属于自己的星';
    cv.width=innerWidth;cv.height=innerHeight;initScene(ES.cosmos);
    loadPosts().then(()=>{render();initRev()});
    if(isAdmin)$('pbar').style.display='block';
    setTimeout(()=>{tr.classList.remove('on');ring.style.width='0';ring.style.height='0'},200);
  },650);
}
function backToSolar(){
  viewMode='solar';savePosts();window.scrollTo({top:0});
  $('solar').classList.remove('off');['nav','hero','qSec','mc','footer'].forEach(id=>$(id).classList.remove('on'));
  $('backBtn').style.display='none';$('pnav').classList.remove('hide');
  if(isAdmin)$('pbar').style.display='none';
  document.documentElement.style.setProperty('--bg','#050508');document.body.style.background='#050508';
}
function getTheme(){return ES[curES]}
function applyT(t){if(!t)return;const r=document.documentElement;['bg','bg2','bg3','card','accent'].forEach(k=>r.style.setProperty('--'+k,t[k]));const h=t.accent,rr=parseInt(h.slice(1,3),16),gg=parseInt(h.slice(3,5),16),bb=parseInt(h.slice(5,7),16);r.style.setProperty('--accent2',`rgb(${Math.min(255,rr+30)},${Math.min(255,gg+30)},${Math.min(255,bb+30)})`);r.style.setProperty('--accent-g',`rgba(${rr},${gg},${bb},.2)`);document.body.style.background=t.bg}
function eSub(n){if(!ES[n])return;curES=n;localStorage.setItem('xpz_es',n);applyT(ES[n]);document.querySelectorAll('#esub button').forEach(b=>b.classList.toggle('a',b.dataset.s===n));cv.width=innerWidth;cv.height=innerHeight;initScene(ES[n])}

addEventListener('resize',()=>{rSolar();if(viewMode==='content'){cv.width=innerWidth;cv.height=innerHeight;initScene(getTheme())}});

/* ===== 腾讯云开发 CloudBase INIT ===== */
// ⚠️ 请替换为你自己的 CloudBase 环境 ID 和 Publishable Key
// 注册地址: https://console.cloud.tencent.com/tcb（微信扫码即可）
// 1. 创建免费环境后，在 环境配置 > API Key 配置 中生成 Publishable Key
// 2. 在 环境配置 > 安全配置 中添加你的域名（如 xxx.github.io）
const TCB_ENV_ID = 'xingxingdexiaopozhan-d3acdbae4a3';
const TCB_ACCESS_KEY = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMWRjMzFlLWI0ZDAtNDQ4Yi1hNzZmLWIwY2M2M2Q4MTQ5OCJ9.eyJpc3MiOiJodHRwczovL3hpbmd4aW5nZGV4aWFvcG96aGFuLWQzYWNkYmFlNGEzLmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJ4aW5neGluZ2RleGlhb3Bvemhhbi1kM2FjZGJhZTRhMyIsImV4cCI6NDA4MDQyMzYyNSwiaWF0IjoxNzc2NzQwNDI1LCJub25jZSI6InNubVpma200U0RXTGdqSkU1NXBUYUEiLCJhdF9oYXNoIjoic25tWmZrbTRTRFdMZ2pKRTU1cFRhQSIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJ4aW5neGluZ2RleGlhb3Bvemhhbi1kM2FjZGJhZTRhMyIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJ1c2VyX3R5cGUiOiIiLCJjbGllbnRfdHlwZSI6ImNsaWVudF91c2VyIiwiaXNfc3lzdGVtX2FkbWluIjpmYWxzZX0.l6W26whGJNLoG3vNBGNxYBRYJY9kDlJ4x6rMOO5IEPxYS_jnVljJCORebVyCmiKDhLQseDOSSs73GBWnfyW3hC3z_syrDgquVtzi2mX6bWUveUx9j42k96xyX4t4FvfXlKhFfyHUOtq8MRO83PlWCoWFGFgVlvJwwyLbzVgRjeeDpanIiBRzn9JvGctWvdwd80NnoIpuJmxUNCrSxtblHAzEFlkObm1UKXExCJendM6wfikkKI3g0xlZcZuYmOJ_B4rHb_HjN2miN0YWxzllRHc49tJeMBgAr7sZU1N9YaYjVZ-1Q-wL9Y3WdQXJ9tb0mVU_lAaxKLt8hR7ok09V1Q';
let _tcbApp = null, _tcbDb = null, _tcbReady = false;
let _tcbInitPromise = null;
if(typeof cloudbase !== 'undefined' && TCB_ENV_ID !== 'YOUR_ENV_ID'){
  // 用 accessKey (Publishable Key) 初始化 SDK
  _tcbApp = cloudbase.init({ env: TCB_ENV_ID, accessKey: TCB_ACCESS_KEY });
  _tcbDb = _tcbApp.database();
  _tcbInitPromise = (async()=>{
    try{
      // accessKey 仅初始化 SDK，还需要登录才能操作资源
      const auth = _tcbApp.auth({ persistence: 'local' });
      // 检查是否已有登录态
      let loggedIn = false;
      try{
        const loginState = await auth.getLoginState();
        if(loginState) loggedIn = true;
      }catch(e){}
      if(!loggedIn){
        // 匿名登录
        if(auth.anonymousAuthProvider){
          await auth.anonymousAuthProvider().signIn();
        }else if(auth.signInAnonymously){
          await auth.signInAnonymously();
        }
      }
      // 验证数据库可访问
      await _tcbDb.collection('posts').limit(1).get();
      _tcbReady = true;
      console.log('CloudBase ready (accessKey + anonymous)');
    }catch(e){
      console.warn('accessKey + anonymous failed:', e.message || e);
      // 降级：不带 accessKey 重试
      try{
        _tcbApp = cloudbase.init({ env: TCB_ENV_ID });
        _tcbDb = _tcbApp.database();
        const auth2 = _tcbApp.auth({ persistence: 'local' });
        const loginState2 = await auth2.getLoginState();
        if(!loginState2){
          if(auth2.anonymousAuthProvider){
            await auth2.anonymousAuthProvider().signIn();
          }else if(auth2.signInAnonymously){
            await auth2.signInAnonymously();
          }
        }
        await _tcbDb.collection('posts').limit(1).get();
        _tcbReady = true;
        console.log('CloudBase ready (fallback anonymous)');
      }catch(e2){
        console.error('CloudBase all auth failed:', e2.message || e2);
        _tcbReady = false;
      }
    }
  })();
}else{
  _tcbInitPromise = Promise.resolve();
}

/* ===== STORAGE (CloudBase Cloud) ===== */
// fileID (cloud://env.xxx/path) → 永久 CDN HTTPS 链接
function fileIDToURL(fileID){
  if(!fileID || !fileID.startsWith('cloud://')) return fileID;
  // cloud://envId.bucket/path → https://bucket.tcb.qcloud.la/path
  const rest = fileID.slice(8); // 去掉 "cloud://"
  const dot = rest.indexOf('.');
  const slash = rest.indexOf('/');
  if(dot<0||slash<0) return fileID;
  const bucket = rest.slice(dot+1, slash);
  const path = rest.slice(slash+1);
  return 'https://'+bucket+'.tcb.qcloud.la/'+path;
}

// 把文件（图片/视频）上传到 CloudBase 云存储，返回永久 CDN URL
async function uploadFile(dataURL, name){
  try{
    if(_tcbInitPromise) await _tcbInitPromise;
    if(!_tcbReady) return dataURL;
    // dataURL → Blob → File
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8 = new Uint8Array(bstr.length);
    for(let i=0;i<bstr.length;i++) u8[i]=bstr.charCodeAt(i);
    const blob = new Blob([u8], {type: mime});
    const ext = mime.split('/')[1] || 'bin';
    const fileName = 'posts/' + (name || ('upload_'+Date.now()+'.'+ext));
    const result = await _tcbApp.uploadFile({
      cloudPath: fileName,
      filePath: blob
    });
    if(result.fileID){
      // 优先用 getTempFileURL（公有读时返回永久链接）
      try{
        const urlRes = await _tcbApp.getTempFileURL({ fileList: [result.fileID] });
        if(urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL){
          return urlRes.fileList[0].tempFileURL;
        }
      }catch(e2){ console.warn('getTempFileURL failed, using CDN URL', e2); }
      // 兜底：直接构造 CDN 链接
      return fileIDToURL(result.fileID);
    }
    return dataURL;
  }catch(e){
    console.error('Upload failed:', e);
    return dataURL; // fallback: return original dataURL
  }
}

async function loadPosts(){
  try{
    // 等待 CloudBase 初始化完成
    if(_tcbInitPromise) await _tcbInitPromise;
    if(!_tcbReady){
      // CloudBase not configured, fallback to localStorage
      try{const s=localStorage.getItem('xpz_ship');posts=s?JSON.parse(s):[]}catch(e2){posts=[]}
      return;
    }
    const res = await _tcbDb.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();
    posts = (res.data || []).map(d => ({
      id: d.postId || d._id,
      _id: d._id,
      text: d.text || '',
      files: d.files || [],
      tags: d.tags || [],
      date: d.date || '',
      time: d.time || '',
      likes: d.likes || 0,
      liked: false,  // liked/saved per-device, stored in localStorage
      saved: false,
      comments: d.comments || []
    }));
    // 修复文件链接：把 cloud:// fileID 转为可访问的 HTTPS URL
    // 同时尝试批量刷新临时链接
    try{
      const allFileIDs = [];
      posts.forEach(p => {
        p.files.forEach(f => {
          if(f.data && f.data.startsWith('cloud://')) allFileIDs.push(f.data);
        });
      });
      if(allFileIDs.length > 0 && _tcbApp){
        // 分批获取（每批最多50个）
        const batches = [];
        for(let i=0;i<allFileIDs.length;i+=50) batches.push(allFileIDs.slice(i,i+50));
        const urlMap = {};
        for(const batch of batches){
          try{
            const r = await _tcbApp.getTempFileURL({ fileList: batch });
            if(r.fileList) r.fileList.forEach(item => {
              if(item.tempFileURL) urlMap[item.fileID] = item.tempFileURL;
            });
          }catch(e){ console.warn('Batch getTempFileURL failed', e); }
        }
        // 用获取到的链接替换 fileID，获取不到的用 CDN 兜底
        posts.forEach(p => {
          p.files.forEach(f => {
            if(f.data && f.data.startsWith('cloud://')){
              f.data = urlMap[f.data] || fileIDToURL(f.data);
            }
          });
        });
      }
    }catch(e){ console.warn('File URL refresh failed', e); }
    // restore per-device liked/saved state
    try{
      const local = JSON.parse(localStorage.getItem('xpz_local_state')||'{}');
      posts.forEach(p => {
        if(local[p.id]){
          p.liked = !!local[p.id].liked;
          p.saved = !!local[p.id].saved;
        }
      });
    }catch(e){}
  }catch(e){
    console.error('Load posts failed:', e);
    try{const s=localStorage.getItem('xpz_ship');posts=s?JSON.parse(s):[]}catch(e2){posts=[]}
  }
}

function saveLocalState(){
  try{
    const state = {};
    posts.forEach(p => { state[p.id] = { liked: p.liked, saved: p.saved }; });
    localStorage.setItem('xpz_local_state', JSON.stringify(state));
  }catch(e){}
}

async function savePosts(){
  saveLocalState();
  if(!_tcbReady){
    try{localStorage.setItem('xpz_ship',JSON.stringify(posts))}catch(e){toast('存储不足')}
  }
}

async function cloudAddPost(postData){
  if(_tcbInitPromise) await _tcbInitPromise;
  if(!_tcbReady) return;
  try{
    // Upload files to cloud first
    const cloudFiles = [];
    for(const f of postData.files){
      if(f.data && f.data.startsWith('data:')){
        const url = await uploadFile(f.data, f.name);
        cloudFiles.push({ type: f.type, data: url, name: f.name });
      } else {
        cloudFiles.push(f);
      }
    }
    await _tcbDb.collection('posts').add({
      postId: postData.id,
      text: postData.text,
      files: cloudFiles,
      tags: postData.tags,
      date: postData.date,
      time: postData.time,
      likes: postData.likes,
      comments: postData.comments,
      createdAt: new Date()
    });
  }catch(e){ console.error('Cloud save failed:', e); }
}

async function cloudDeletePost(postId){
  if(_tcbInitPromise) await _tcbInitPromise;
  if(!_tcbReady) return;
  try{
    const res = await _tcbDb.collection('posts').where({ postId: postId }).get();
    if(res.data && res.data.length){
      await _tcbDb.collection('posts').doc(res.data[0]._id).remove();
    }
  }catch(e){ console.error('Cloud delete failed:', e); }
}

async function cloudUpdatePost(postId, fields){
  if(_tcbInitPromise) await _tcbInitPromise;
  if(!_tcbReady) return;
  try{
    const res = await _tcbDb.collection('posts').where({ postId: postId }).get();
    if(res.data && res.data.length){
      await _tcbDb.collection('posts').doc(res.data[0]._id).update(fields);
    }
  }catch(e){ console.error('Cloud update failed:', e); }
}

/* ===== CONTENT BG CANVAS ===== */
const cv=$('stars'),cx=cv.getContext('2d');
let sP=[],sS=[],lt=0;

function initScene(t){
  if(!t)return;const s=t.scene,W=cv.width,H=cv.height,tc=t.sc||'220,225,240';sP=[];sS=[];
  const dens=(W*H)/1e6;
  const starN=s==='cosmos'||s==='deep'?Math.round(2200*dens):s==='ocean'||s==='snow'||s==='forest'?Math.round(120*dens):s==='sand'||s==='city'?Math.round(80*dens):Math.round(350*dens);
  const starH=s==='ocean'?H*.4:s==='forest'?H*.3:H;
  for(let i=0;i<starN;i++){
    const colors=s==='cosmos'||s==='deep'?['220,230,255','240,245,255','255,245,220','200,220,255','255,225,190','230,245,255','255,200,180']:[tc];
    const c=colors[Math.floor(Math.random()*colors.length)];
    const bright=s==='cosmos'||s==='deep'?Math.random()*.25+.72:Math.random()*.35+.4;
    sP.push({T:'s',x:Math.random()*W,y:Math.random()*starH,r:Math.random()*(s==='cosmos'?2.0:1.2)+.9,a:bright,o:Math.random()*1e3,v:.0004+Math.random()*.0012,c});
  }
  // cosmos/deep: rich nebulae + milky way
  if(s==='cosmos'||s==='deep'){
    // large nebulae — brighter, more saturated
    const nebColors=['120,70,200','90,60,180','60,90,200','150,60,170','80,100,200','110,40,150','130,80,190'];
    for(let i=0;i<12;i++){
      const nc=nebColors[i%nebColors.length];
      sP.push({T:'nb',x:Math.random()*W,y:Math.random()*H,r:100+Math.random()*180,a:.06+Math.random()*.06,c:nc,o:Math.random()*1e3});
    }
    // milky way band — brighter overlapping soft ellipses
    for(let i=0;i<8;i++){
      const mx=W*(.1+i*.1)+Math.random()*40;
      const my=H*(.8-.08*i)+Math.random()*30;
      sP.push({T:'mw',x:mx,y:my,rx:70+Math.random()*90,ry:25+Math.random()*20,rot:-.45+Math.random()*.1,a:.05+Math.random()*.04,c:`${80+Math.random()*40|0},${70+Math.random()*30|0},${130+Math.random()*40|0}`,o:Math.random()*1e3});
    }
    // bright star clusters along milky way — brighter now
    for(let i=0;i<80;i++){
      const cx=W*(.1+Math.random()*.8);
      const cy=H*(.5+(.5-cx/W)*.5)+Math.random()*60-30;
      sP.push({T:'s',x:cx,y:cy,r:Math.random()*1.0+.6,a:Math.random()*.3+.55,o:Math.random()*1e3,v:.0005+Math.random()*.001,c:'235,240,255'});
    }
    // sparkle stars — BIG MASSIVE count
    const spN=Math.round(280*dens), puN=Math.round(90*dens);
    for(let i=0;i<spN;i++){
      const colors=['255,255,255','240,248,255','255,250,230','220,235,255','255,230,200'];
      sP.push({T:'sp',x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+2.2,a:Math.random()*.15+.9,o:Math.random()*1e3,v:.0018+Math.random()*.006,c:colors[Math.floor(Math.random()*colors.length)]});
    }
    // pulse stars — hero stars, huge halo
    for(let i=0;i<puN;i++){
      const colors=['255,255,255','245,250,255','255,245,235','255,230,200'];
      sP.push({T:'pu',x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+2.8,a:Math.random()*.1+.95,o:Math.random()*1e3,v:.0004+Math.random()*.0009,c:colors[Math.floor(Math.random()*colors.length)]});
    }
  }
  if(s==='ocean'){for(let i=0;i<3;i++)sP.push({T:'wl',y:H*(.42+i*.04),a:.05-.01*i,v:.0008+i*.0003,amp:8+i*4,o:i*50,c:`100,${200-i*15},${230-i*10}`});for(let i=0;i<80;i++)sP.push({T:'w',x:Math.random()*W,y:H*.4+Math.random()*H*.6,r:Math.random()*1.5+.3,a:Math.random()*.15+.03,o:Math.random()*1e3,sx:Math.random()*.2-.1})}
  if(s==='lava'||s==='ember'){for(let i=0;i<100;i++)sP.push({T:'em',x:Math.random()*W,y:H+Math.random()*40,r:Math.random()*2+.4,a:Math.random()*.4+.2,sy:-.3-Math.random()*.6,sx:Math.random()*.4-.2,life:Math.random(),o:Math.random()*1e3});for(let i=0;i<10;i++)sP.push({T:'gl',x:Math.random()*W,y:H*(.6+Math.random()*.4),r:30+Math.random()*40,a:.02+Math.random()*.03,o:Math.random()*1e3})}
  if(s==='snow'||s==='ice')for(let i=0;i<120;i++)sP.push({T:'sn',x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.3,a:Math.random()*.25+.06,sy:.1+Math.random()*.2,sx:Math.random()*.2-.1,o:Math.random()*1e3});
  if(s==='forest'){for(let i=0;i<40;i++)sP.push({T:'ff',x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.8,a:0,ma:Math.random()*.4+.15,o:Math.random()*1e3,tx:Math.random()*W,ty:Math.random()*H,ph:Math.random()*6.28,tr:[]});for(let i=0;i<20;i++)sP.push({T:'lf',x:Math.random()*W,y:-20-Math.random()*80,r:Math.random()*3+1.5,a:Math.random()*.15+.04,sy:.15+Math.random()*.25,sx:.08+Math.random()*.15,rot:Math.random()*6.28,rs:Math.random()*.02-.01,o:Math.random()*1e3,c:Math.random()>.5?'80,140,50':'60,120,40'})}
  if(s==='sand')for(let i=0;i<100;i++)sP.push({T:'du',x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.2,a:Math.random()*.12+.02,sx:.08+Math.random()*.25,sy:Math.random()*.08-.04,o:Math.random()*1e3});
  if(s==='city')for(let i=0;i<100;i++){const cols=['255,200,100','255,180,80','200,220,255','180,200,255'];sP.push({T:'lt',x:Math.random()*W,y:H*(.3+Math.random()*.7),r:Math.random()*1.5+.4,a:Math.random()*.2+.03,c:cols[Math.floor(Math.random()*cols.length)],o:Math.random()*1e3,v:.0005+Math.random()*.002})}
  if(s==='clouds')for(let i=0;i<18;i++){const bs=[];for(let j=0;j<3+Math.floor(Math.random()*3);j++)bs.push({dx:(j-1.5)*25+Math.random()*15,dy:Math.random()*15-7,r:20+Math.random()*35});sP.push({T:'cl',x:Math.random()*W*1.4-W*.2,y:Math.random()*H,a:.03+Math.random()*.03,sx:.012+Math.random()*.03,o:Math.random()*1e3,bs})}
  if(s==='rock'||s==='golden'||s==='storm'||s==='ring')for(let i=0;i<60;i++)sP.push({T:'du',x:Math.random()*W,y:Math.random()*H,r:Math.random()*1+.2,a:Math.random()*.1+.02,sx:Math.random()*.15-.07,sy:Math.random()*.06-.03,o:Math.random()*1e3});
}

function draw(t){
  const W=cv.width,H=cv.height;lt=t;cx.clearRect(0,0,W,H);
  sP.forEach(p=>{
    if(p.T==='s'){const f=.4+.6*(.5+.5*Math.sin(t*p.v+p.o));const a=Math.min(1,p.a*f);cx.save();cx.globalCompositeOperation='lighter';const hg=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);hg.addColorStop(0,`rgba(${p.c},${a*.7})`);hg.addColorStop(.3,`rgba(${p.c},${a*.25})`);hg.addColorStop(1,`rgba(${p.c},0)`);cx.beginPath();cx.arc(p.x,p.y,p.r*6,0,Math.PI*2);cx.fillStyle=hg;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(${p.c},${a})`;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.r*.5,0,Math.PI*2);cx.fillStyle=`rgba(255,255,255,${a*.85})`;cx.fill();cx.restore()}
    else if(p.T==='sp'){cx.save();cx.globalCompositeOperation='lighter';const f=.4+.6*(.5+.5*Math.sin(t*p.v+p.o));const a=Math.min(1,p.a*f);const hg0=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);hg0.addColorStop(0,`rgba(${p.c},${a*.85})`);hg0.addColorStop(.35,`rgba(${p.c},${a*.3})`);hg0.addColorStop(1,`rgba(${p.c},0)`);cx.beginPath();cx.arc(p.x,p.y,p.r*6,0,Math.PI*2);cx.fillStyle=hg0;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(${p.c},${a})`;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.r*.5,0,Math.PI*2);cx.fillStyle=`rgba(255,255,255,${a*.9})`;cx.fill();const rl=p.r*10*f;const rd=p.r*6.5*f;cx.beginPath();cx.moveTo(p.x-rl,p.y);cx.lineTo(p.x+rl,p.y);cx.moveTo(p.x,p.y-rl);cx.lineTo(p.x,p.y+rl);cx.strokeStyle=`rgba(${p.c},${a*.7})`;cx.lineWidth=1.0;cx.stroke();cx.beginPath();cx.moveTo(p.x-rd,p.y-rd);cx.lineTo(p.x+rd,p.y+rd);cx.moveTo(p.x+rd,p.y-rd);cx.lineTo(p.x-rd,p.y+rd);cx.strokeStyle=`rgba(${p.c},${a*.35})`;cx.lineWidth=.7;cx.stroke();cx.restore()}
    else if(p.T==='pu'){cx.save();cx.globalCompositeOperation='lighter';const pf=.4+.6*(.5+.5*Math.sin(t*p.v+p.o));const pa=Math.min(1,p.a*pf);const hg=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*12);hg.addColorStop(0,`rgba(${p.c},${pa*.5})`);hg.addColorStop(.35,`rgba(${p.c},${pa*.18})`);hg.addColorStop(.7,`rgba(${p.c},${pa*.05})`);hg.addColorStop(1,`rgba(${p.c},0)`);cx.beginPath();cx.arc(p.x,p.y,p.r*12,0,Math.PI*2);cx.fillStyle=hg;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.r*(1+pf*.3),0,Math.PI*2);cx.fillStyle=`rgba(${p.c},${pa})`;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.r*.5,0,Math.PI*2);cx.fillStyle=`rgba(255,255,255,${pa*.9})`;cx.fill();cx.restore()}
    else if(p.T==='nb'){const a=p.a*(.5+.5*Math.sin(t*.00015+p.o));const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(${p.c},${a})`);g.addColorStop(.5,`rgba(${p.c},${a*.5})`);g.addColorStop(1,`rgba(${p.c},0)`);cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=g;cx.fill()}
    else if(p.T==='mw'){const a=p.a*(.6+.4*Math.sin(t*.0001+p.o));cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);const g=cx.createRadialGradient(0,0,0,0,0,Math.max(p.rx,p.ry));g.addColorStop(0,`rgba(${p.c},${a})`);g.addColorStop(.4,`rgba(${p.c},${a*.5})`);g.addColorStop(1,`rgba(${p.c},0)`);cx.beginPath();cx.ellipse(0,0,p.rx,p.ry,0,0,Math.PI*2);cx.fillStyle=g;cx.fill();cx.restore()}
    else if(p.T==='wl'){cx.beginPath();const a=p.a*(.5+.5*Math.sin(t*.0003+p.o));for(let x=0;x<=W;x+=4){const y=p.y+Math.sin(x*.008+t*p.v+p.o)*p.amp;x?cx.lineTo(x,y):cx.moveTo(x,y)}cx.strokeStyle=`rgba(${p.c},${a})`;cx.lineWidth=.7;cx.stroke()}
    else if(p.T==='w'){p.x+=p.sx;if(p.x>W+10)p.x=-10;if(p.x<-10)p.x=W+10;cx.beginPath();cx.arc(p.x,p.y+Math.sin(t*.001+p.o)*.3,p.r,0,Math.PI*2);cx.fillStyle=`rgba(100,200,230,${p.a*(.6+.4*Math.sin(t*.0008+p.o))})`;cx.fill()}
    else if(p.T==='em'){p.x+=p.sx+Math.sin(t*.003+p.o)*.3;p.y+=p.sy;p.life-=.0005;if(p.life<=0||p.y<-20){p.y=H+Math.random()*30;p.x=Math.random()*W;p.life=1}const a=p.a*p.life;cx.beginPath();cx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);cx.fillStyle=`rgba(${200+p.life*55|0},${Math.max(0,150*p.life-30)|0},${20*p.life|0},${a})`;cx.fill()}
    else if(p.T==='gl'){const a=p.a*(.5+.5*Math.sin(t*.0004+p.o));const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(255,100,20,${a})`);g.addColorStop(1,'rgba(255,60,10,0)');cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=g;cx.fill()}
    else if(p.T==='sn'){p.x+=p.sx+Math.sin(t*.001+p.o)*.4;p.y+=p.sy;if(p.y>H+10){p.y=-10;p.x=Math.random()*W}if(p.x>W+10)p.x=-10;if(p.x<-10)p.x=W+10;cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(210,230,245,${p.a*(.6+.4*Math.sin(t*.0006+p.o))})`;cx.fill()}
    else if(p.T==='ff'){p.ph+=.003;const dx=p.tx-p.x,dy=p.ty-p.y;p.x+=dx*.003+Math.sin(p.ph)*.3;p.y+=dy*.003+Math.cos(p.ph*.7)*.3;if(Math.abs(dx)<20&&Math.abs(dy)<20){p.tx=Math.random()*W;p.ty=Math.random()*H}p.a=p.ma*(.3+.7*Math.abs(Math.sin(t*.001+p.o)));p.tr.push({x:p.x,y:p.y,a:p.a});if(p.tr.length>10)p.tr.shift();p.tr.forEach((tp,i)=>{cx.beginPath();cx.arc(tp.x,tp.y,p.r*.3,0,Math.PI*2);cx.fillStyle=`rgba(180,255,100,${tp.a*(i/p.tr.length)*.25})`;cx.fill()});const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);g.addColorStop(0,`rgba(180,255,100,${p.a})`);g.addColorStop(1,'rgba(130,200,60,0)');cx.beginPath();cx.arc(p.x,p.y,p.r*3,0,Math.PI*2);cx.fillStyle=g;cx.fill()}
    else if(p.T==='lf'){p.x+=p.sx+Math.sin(t*.001+p.o)*.3;p.y+=p.sy;p.rot+=p.rs;if(p.y>H+20){p.y=-20;p.x=Math.random()*W}cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.beginPath();cx.ellipse(0,0,p.r,p.r*.5,0,0,Math.PI*2);cx.fillStyle=`rgba(${p.c},${p.a})`;cx.fill();cx.restore()}
    else if(p.T==='du'){p.x+=p.sx;p.y+=p.sy+Math.sin(t*.001+p.o)*.15;if(p.x>W+10){p.x=-10;p.y=Math.random()*H}cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(210,180,130,${p.a*(.5+.5*Math.sin(t*.0007+p.o))})`;cx.fill()}
    else if(p.T==='lt'){const f=.4+.6*Math.abs(Math.sin(t*p.v+p.o));cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(${p.c},${p.a*f})`;cx.fill()}
    else if(p.T==='cl'){p.x+=p.sx;const tw=p.bs.reduce((m,b)=>Math.max(m,Math.abs(b.dx)+b.r),0)*2;if(p.x>W+tw)p.x=-tw;const a=p.a*(.6+.4*Math.sin(t*.0002+p.o));p.bs.forEach(b=>{const bx=p.x+b.dx,by=p.y+b.dy;const g=cx.createRadialGradient(bx,by,0,bx,by,b.r);g.addColorStop(0,`rgba(130,160,200,${a})`);g.addColorStop(1,'rgba(90,120,160,0)');cx.beginPath();cx.arc(bx,by,b.r,0,Math.PI*2);cx.fillStyle=g;cx.fill()})}
  });
  const theme=getTheme();
  if(theme&&(theme.scene==='cosmos'||theme.scene==='deep'||theme.scene==='sand')){
    if(Math.random()<.012)sS.push({x:Math.random()*W,y:Math.random()*H*.4,len:45+Math.random()*80,sp:3+Math.random()*6,ang:Math.PI/6+Math.random()*.35,life:1,w:.6+Math.random()*1});
    const tc=theme.sc||'220,225,240';
    sS=sS.filter(s=>{s.x+=Math.cos(s.ang)*s.sp;s.y+=Math.sin(s.ang)*s.sp;s.life-=.012;if(s.life<=0)return false;const g=cx.createLinearGradient(s.x,s.y,s.x-Math.cos(s.ang)*s.len,s.y-Math.sin(s.ang)*s.len);g.addColorStop(0,`rgba(${tc},${s.life})`);g.addColorStop(1,`rgba(${tc},0)`);cx.beginPath();cx.moveTo(s.x,s.y);cx.lineTo(s.x-Math.cos(s.ang)*s.len,s.y-Math.sin(s.ang)*s.len);cx.strokeStyle=g;cx.lineWidth=s.w;cx.stroke();return true});
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* ===== STATE ===== */
let isAdmin=false,posts=[],qF=[],fF=[];
let myNick=localStorage.getItem('xpz_nick')||'';
const ADMIN_PWD_KEY='xpz_admin_pwd';
let adminPwdHash=localStorage.getItem(ADMIN_PWD_KEY);
async function hashPwd(p){const e=new TextEncoder().encode(p);const b=await crypto.subtle.digest('SHA-256',e);return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}

/* ===== QUOTES ===== */
const quotes=[{t:'我们都是阴沟里的虫子，但总还是得有人仰望星空。',s:'奥斯卡·王尔德'},{t:'想象力比知识更重要。',s:'爱因斯坦'},{t:'万物皆有裂痕，那是光照进来的地方。',s:'莱昂纳德·科恩'},{t:'不要温和地走进那个良夜。',s:'迪伦·托马斯'},{t:'每个人都是一颗星，闪耀着自己独特的光芒。',s:'未知'}];
(function(){const d=Math.floor(Date.now()/(1e3*3600*24))%quotes.length;$('qTxt').textContent=quotes[d].t;$('qSrc').textContent='— '+quotes[d].s})();

/* ===== ADMIN ===== */
function tryAdmin(){if(isAdmin){exitAdmin();return}if(!adminPwdHash){showSetPwd();return}showPwdModal()}
function startCreate(){if(isAdmin){openFull();return}window._pwdOk='openFull';if(!adminPwdHash){showSetPwd();return}showPwdModal()}
function showPwdModal(){$('pwdM').classList.add('active');$('pwdInp').value='';$('pwdInp').type='password';$('pwdInp').placeholder='••••••';$('pwdErr').classList.remove('show');document.querySelector('.pwd-box h3').textContent='🔐 管理员验证';document.querySelector('.pwd-box p').textContent='输入密码以进入管理模式';setTimeout(()=>$('pwdInp').focus(),100);window._pwdAct='verify'}
function showSetPwd(){$('pwdM').classList.add('active');$('pwdInp').value='';$('pwdInp').placeholder='设置管理密码...';$('pwdErr').classList.remove('show');document.querySelector('.pwd-box h3').textContent='🔑 首次设置密码';document.querySelector('.pwd-box p').textContent='设置密码，只有你能进入管理模式';setTimeout(()=>$('pwdInp').focus(),100);window._pwdAct='set'}
function closePwd(){$('pwdM').classList.remove('active');window._pwdOk=null}
async function checkPwd(){const v=$('pwdInp').value;if(!v){$('pwdInp').classList.add('shake');setTimeout(()=>$('pwdInp').classList.remove('shake'),400);return}if(window._pwdAct==='set'){if(v.length<2){$('pwdErr').textContent='密码至少2位';$('pwdErr').classList.add('show');return}adminPwdHash=await hashPwd(v);localStorage.setItem(ADMIN_PWD_KEY,adminPwdHash);const a=window._pwdOk;closePwd();enterAdmin();if(a==='openFull')setTimeout(()=>openFull(),300);toast('密码已设置 ✦');return}const h=await hashPwd(v);if(h===adminPwdHash){const a=window._pwdOk;closePwd();enterAdmin();if(a==='openFull')setTimeout(()=>openFull(),300)}else{$('pwdErr').textContent='密码不正确';$('pwdErr').classList.add('show');$('pwdInp').classList.add('shake');setTimeout(()=>$('pwdInp').classList.remove('shake'),400);$('pwdInp').value='';$('pwdInp').focus()}}
function enterAdmin(){isAdmin=true;$('mBtn').textContent='退出管理';$('mBtn').style.display='';$('mBtn').classList.add('on');if(viewMode==='content')$('pbar').style.display='block';const cb=$('createBtn');if(cb)cb.style.display='';render();toast('✨ 管理员模式')}
function exitAdmin(){isAdmin=false;$('mBtn').textContent='进入管理';$('mBtn').style.display='none';$('mBtn').classList.remove('on');$('pbar').style.display='none';const cb=$('createBtn');if(cb)cb.style.display='none';render();toast('👀 访客模式')}
function goContent(){$('mc').scrollIntoView({behavior:'smooth'})}

/* ===== FILE READING ===== */
function readFiles(files,ft,arr,cb){let n=files.length;Array.from(files).forEach(f=>{const t=ft||(f.type.startsWith('video')?'video':'image');const r=new FileReader();r.onload=e=>{arr.push({type:t,data:e.target.result,name:f.name});n--;if(!n)cb()};r.readAsDataURL(f)})}

/* ===== QUICK PUBLISH ===== */
const qInp=$('qInp');qInp.addEventListener('input',updQ);
function updQ(){$('qSend').disabled=!qInp.value.trim()&&!qF.length}
function hQF(e,t){readFiles(e.target.files,t,qF,()=>{renderQPv();updQ()});e.target.value=''}
function renderQPv(){$('qPv').innerHTML=qF.map((f,i)=>`<div class="pvt">${f.type==='image'?`<img src="${f.data}">`:`<video src="${f.data}" muted></video>`}<button class="pvx" onclick="event.stopPropagation();rmQF(${i})">×</button></div>`).join('');updateBadge('qImgBtn',qF.filter(f=>f.type==='image').length);updateBadge('qVidBtn',qF.filter(f=>f.type==='video').length)}
function updateBadge(id,c){const b=$(id);let bd=b.querySelector('.badge');if(c>0){if(!bd){bd=document.createElement('span');bd.className='badge';b.appendChild(bd)}bd.textContent=c}else if(bd)bd.remove()}
function rmQF(i){qF.splice(i,1);renderQPv();updQ()}
function qPost(){const t=qInp.value.trim();if(!t&&!qF.length)return;addPost(t,'',[...qF]);qInp.value='';qF=[];renderQPv();updQ()}

/* ===== FULL PUBLISH ===== */
function openFull(){$('fov').classList.add('active');$('fTxt').focus();document.body.style.overflow='hidden'}
function closeFull(){$('fov').classList.remove('active');document.body.style.overflow='';$('fTxt').value='';$('fTags').value='';$('fPv').innerHTML='';$('fHint').textContent='';$('fSub').disabled=true;fF=[]}
$('fTxt').addEventListener('input',updF);
function updF(){$('fSub').disabled=!$('fTxt').value.trim()&&!fF.length;$('fHint').textContent=fF.length?fF.length+' 个文件':''}
function hFF(e,t){readFiles(e.target.files,t,fF,()=>{renderFPv();updF()});e.target.value=''}
function renderFPv(){$('fPv').innerHTML=fF.map((f,i)=>`<div class="pvt">${f.type==='image'?`<img src="${f.data}">`:`<video src="${f.data}" muted></video>`}<button class="pvx" onclick="rmFF(${i})">×</button></div>`).join('')}
function rmFF(i){fF.splice(i,1);renderFPv();updF()}
function fPost(){const t=$('fTxt').value.trim(),tg=$('fTags').value.trim();if(!t&&!fF.length)return;addPost(t,tg,[...fF]);closeFull()}
const dz=$('dz');dz.addEventListener('click',()=>$('fImg').click());dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov')});dz.addEventListener('dragleave',()=>dz.classList.remove('dov'));dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');readFiles(e.dataTransfer.files,null,fF,()=>{renderFPv();updF()})});

/* ===== POSTS ===== */
function addPost(text,tags,files){
  const now=new Date();
  const postData={id:Date.now(),text,files,tags:tags?tags.split(/\s+/).filter(Boolean):[],date:now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric'}),time:now.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}),likes:0,liked:false,saved:false,comments:[]};
  posts.unshift(postData);
  render();toast('发布中...');
  cloudAddPost(postData).then(()=>{
    // reload from cloud to get the files with CDN URLs
    return loadPosts();
  }).then(()=>{
    render();toast('已发布 ✦');
  }).catch(()=>{
    savePosts();toast('已发布（本地）');
  });
}
function delPost(id){if(!confirm('确定删除？'))return;posts=posts.filter(p=>p.id!==id);cloudDeletePost(id);savePosts().then(()=>{render();toast('已删除')}).catch(()=>{render();toast('已删除')})}
function likeP(id){const p=posts.find(x=>x.id===id);if(!p)return;p.liked=!p.liked;p.likes+=(p.liked?1:-1);saveLocalState();cloudUpdatePost(id,{likes:p.likes});render()}
function saveP(id){const p=posts.find(x=>x.id===id);if(!p)return;p.saved=!p.saved;saveLocalState();render();toast(p.saved?'已收藏 ⭐':'取消收藏')}
function shareP(id){navigator.clipboard?.writeText(location.href+'#p-'+id);toast('链接已复制')}
function togCmt(id){const el=document.querySelector(`[data-cmt="${id}"]`);if(el)el.classList.toggle('open')}
function startReply(pid,ci){const p=posts.find(x=>x.id===pid);if(!p)return;const c=p.comments[ci];if(!c)return;const bar=document.querySelector(`[data-rb="${pid}"]`),tx=document.querySelector(`[data-rbt="${pid}"]`),inp=document.querySelector(`[data-ci="${pid}"]`);if(!bar||!tx||!inp)return;bar.classList.add('active');bar.dataset.replyIdx=ci;tx.innerHTML=`回复 <b style="color:var(--text)">@${esc(c.author)}</b>：${esc(c.text.slice(0,40))}${c.text.length>40?'...':''}`;inp.focus();const sec=document.querySelector(`[data-cmt="${pid}"]`);if(sec)sec.classList.add('open')}
function cancelReply(pid){const bar=document.querySelector(`[data-rb="${pid}"]`);if(bar){bar.classList.remove('active');delete bar.dataset.replyIdx}}
function addCmt(id){const nE=document.querySelector(`[data-cn="${id}"]`),tE=document.querySelector(`[data-ci="${id}"]`),bar=document.querySelector(`[data-rb="${id}"]`);if(!tE||!tE.value.trim())return;const nick=nE?.value.trim();if(!nick){toast('请先填写你的名字 ✏️');if(nE){nE.focus();nE.classList.add('shake');setTimeout(()=>nE.classList.remove('shake'),400)}return}myNick=nick;localStorage.setItem('xpz_nick',nick);const p=posts.find(x=>x.id===id);if(!p)return;const newComment={author:nick,text:tE.value.trim(),time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})};const rIdx=bar?.dataset.replyIdx;if(rIdx!=null&&p.comments[rIdx]){const rc=p.comments[rIdx];newComment.replyTo={author:rc.author,text:rc.text.slice(0,80)}}p.comments.push(newComment);cloudUpdatePost(id,{comments:p.comments});savePosts().then(()=>{render();setTimeout(()=>{const el=document.querySelector(`[data-cmt="${id}"]`);if(el)el.classList.add('open')},50)})}

function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}

/* ===== RENDER ===== */
function render(){
  const tl=$('tl'),em=$('emp');$('cnt').textContent=posts.length+' 篇';
  if(!posts.length){tl.innerHTML='';em.style.display='block';initRev();return}em.style.display='none';
  tl.innerHTML=posts.map(p=>{
    let media='';
    if(p.files.length===1){const f=p.files[0];media=f.type==='video'?`<div class="pm" onclick="togVid(this)"><video src="${f.data}" loop playsinline preload="metadata"></video><div class="play"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>`:`<div class="pm" onclick="oLB('image','${f.data}')"><img src="${f.data}"></div>`}
    else if(p.files.length>=2){const cnt=Math.min(p.files.length,9),cls='g'+cnt;const items=p.files.slice(0,cnt).map(f=>f.type==='video'?`<div class="gi" onclick="oLB('video','${f.data}')"><video src="${f.data}" muted preload="metadata" style="pointer-events:none"></video></div>`:`<div class="gi" onclick="oLB('image','${f.data}')"><img src="${f.data}"></div>`).join('');const extra=p.files.length>9?`<span class="mcnt">+${p.files.length-9}</span>`:'';media=`<div class="pm"><div class="gal ${cls}">${items}</div>${extra}</div>`}
    const tags=p.tags?.length?`<div class="pc-tags">${p.tags.map(t=>`<span class="pc-tag">#${esc(t)}</span>`).join('')}</div>`:'';
    const visCmts=isAdmin?p.comments:p.comments.filter(c=>c.author===myNick);
    const cmts=visCmts.map((c,ci)=>{
      const origIdx=p.comments.indexOf(c);
      const quote=c.replyTo?`<div class="cmt-quote"><span class="cmt-quote-name">@${esc(c.replyTo.author)}</span>${esc(c.replyTo.text)}</div>`:'';
      return`<div class="cmt"><div class="cmt-av">${c.author[0]}</div><div class="cmt-b"><div class="cmt-top"><span class="cmt-name">${esc(c.author)}</span><span class="cmt-time">${c.time||''}</span></div><div class="cmt-txt">${esc(c.text)}</div>${quote}<button class="cmt-reply-btn" onclick="startReply(${p.id},${origIdx})">回复</button></div></div>`
    }).join('');
    return`<article class="post reveal" id="p-${p.id}"><div class="post-dot"></div><div class="post-date">${p.date} ${p.time||''}</div><div class="post-card">${media}${p.text?`<div class="pc"><div class="pc-text">${esc(p.text)}</div>${tags}</div>`:(tags?`<div class="pc">${tags}</div>`:'')}<div class="sbar"><button class="sb ${p.liked?'liked':''}" onclick="likeP(${p.id})"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg><span>${p.likes||''}</span></button><button class="sb" onclick="togCmt(${p.id})"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span>${visCmts.length||''}</span></button><button class="sb share" onclick="shareP(${p.id})"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button><span class="sb-sp"></span><button class="sb ${p.saved?'saved':''}" onclick="saveP(${p.id})"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg></button>${isAdmin?`<button class="sb" onclick="delPost(${p.id})" style="color:var(--faint)"><svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>`:''}</div><div class="cmt-sec" data-cmt="${p.id}"><div class="cmt-list">${cmts}</div><div class="cmt-reply-bar" data-rb="${p.id}"><span class="rb-tx" data-rbt="${p.id}"></span><button class="rb-x" onclick="cancelReply(${p.id})">×</button></div><div class="cmt-form"><input class="cmt-nick" data-cn="${p.id}" placeholder="你的名字" value="${esc(myNick)}" required><input class="cmt-inp" data-ci="${p.id}" placeholder="留个言吧..." onkeydown="if(event.key==='Enter')addCmt(${p.id})"><button class="cmt-go" onclick="addCmt(${p.id})"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></div></div></div></article>`}).join('');
  initRev();
}

/* ===== VIDEO ===== */
function togVid(el){const v=el.querySelector('video'),pb=el.querySelector('.play');if(!v)return;if(v.paused){v.muted=false;v.play();if(pb)pb.style.opacity='0'}else{v.pause();if(pb)pb.style.opacity='1'}}

/* ===== LIGHTBOX ===== */
function oLB(type,src){const c=$('lbC');c.innerHTML=type==='video'?`<video src="${src}" controls autoplay style="max-width:92%;max-height:88vh;border-radius:14px;outline:none" onclick="event.stopPropagation()"></video>`:`<img class="lb-media" src="${src}" onclick="event.stopPropagation()">`;$('lb').classList.add('active');document.body.style.overflow='hidden'}
function xLB(){$('lb').classList.remove('active');document.body.style.overflow='';const v=$('lbC').querySelector('video');if(v)v.pause();$('lbC').innerHTML=''}

/* ===== TOAST/NAV/REVEAL ===== */
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
addEventListener('scroll',()=>{$('nav').classList.toggle('scrolled',scrollY>80)});
function initRev(){const ob=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');ob.unobserve(e.target)}})},{threshold:.06,rootMargin:'0px 0px -25px 0px'});document.querySelectorAll('.reveal').forEach(el=>ob.observe(el))}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeFull();xLB();closePwd()}
  // hidden admin shortcut: Cmd/Ctrl + Shift + K
  if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==='k'){e.preventDefault();tryAdmin()}
});

// hidden admin door: tap logo 5 times rapidly OR long-press 1.5s (mobile friendly)
(function(){
  let _tc=0,_tt=0,_lp=null;
  const logo=document.querySelector('.nav-logo');
  if(!logo)return;
  logo.addEventListener('click',()=>{
    const now=Date.now();
    if(now-_tt>2000){_tc=0}
    _tt=now;_tc++;
    if(_tc>=5){_tc=0;tryAdmin()}
  });
  // long press for mobile
  logo.addEventListener('touchstart',e=>{
    _lp=setTimeout(()=>{_lp=null;tryAdmin()},1500);
  },{passive:true});
  logo.addEventListener('touchend',()=>{if(_lp){clearTimeout(_lp);_lp=null}});
  logo.addEventListener('touchmove',()=>{if(_lp){clearTimeout(_lp);_lp=null}});
})();

/* ===== SHIP NAV BUTTON ===== */
(function(){
  const nav=$('pnav');
  const btn=document.createElement('button');btn.className='pnav-btn';
  btn.innerHTML=`<span class="pnav-e">🚀</span><span class="pnav-n">登上飞船</span>`;
  btn.addEventListener('click',()=>enterShip());
  nav.appendChild(btn);
})();
