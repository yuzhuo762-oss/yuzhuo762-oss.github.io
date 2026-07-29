// 极光流场 · Canvas
const Aurora={c:null,ctx:null,t:0,m:{x:.5,y:.5,ix:.5,iy:.5},b:[],s:[],
init(id){
  this.c=document.getElementById(id)
  if(!this.c)return
  this.ctx=this.c.getContext('2d')
  this.resize();this.create();this.bind();this.anim()
},
resize(){const p=this.c.parentElement;this.c.width=p.offsetWidth;this.c.height=p.offsetHeight},
create(){
  const colors=[[0,100,255,80,0,200],[50,180,255,150,50,255],[0,200,255,100,100,255],[30,150,255,200,50,200],[0,120,255,120,0,255]]
  this.b=[];this.s=[]
  for(let i=0;i<5;i++){
    this.b.push({p:[],c:colors[i],sp:.3+Math.random()*.4,of:i*1.5,amp:40+Math.random()*60,f:.002+Math.random()*.003,by:(this.c.height/6)*(i+1)})
  }
  const t=['triangle','square','circle','hexagon']
  for(let i=0;i<12;i++){
    this.s.push({tp:t[i%4],x:Math.random()*this.c.width,y:Math.random()*this.c.height,sz:15+Math.random()*30,rot:Math.random()*6.28,rs:(Math.random()-.5)*.02,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,ph:Math.random()*6.28,op:.08+Math.random()*.12})
  }
},
bind(){
  const m=(x,y)=>{const r=this.c.getBoundingClientRect();this.m.ix=(x-r.left)/r.width;this.m.iy=(y-r.top)/r.height}
  this.c.addEventListener('mousemove',e=>m(e.clientX,e.clientY))
  this.c.addEventListener('touchmove',e=>{const t=e.touches[0];m(t.clientX,t.clientY)},{passive:true})
  this.c.addEventListener('mouseleave',()=>{this.m.ix=.5;this.m.iy=.5})
  window.addEventListener('resize',()=>this.resize())
},
drawShp(ctx,tp,x,y,sz,rot){
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle='rgba(0,212,255,0.2)';ctx.lineWidth=1
  ctx.beginPath()
  for(let i=0;i<(tp==='triangle'?3:tp==='square'?4:tp==='hexagon'?6:32);i++){
    const a=i/(tp==='triangle'?3:tp==='square'?4:tp==='hexagon'?6:32)*6.28-1.57
    const px=Math.cos(a)*sz,py=Math.sin(a)*sz
    i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)
  }
  tp==='circle'&&ctx.closePath();ctx.stroke();ctx.restore()
},
anim(){
  this.t+=.008;const w=this.c.width,h=this.c.height,ctx=this.ctx
  this.m.x+=(this.m.ix-this.m.x)*.05;this.m.y+=(this.m.iy-this.m.y)*.05
  ctx.clearRect(0,0,w,h)
  // Aurora bands
  for(const b of this.b){
    const pts=[],seg=60,mx=(this.m.x-.5)*2,my=(this.m.y-.5)*2
    for(let i=0;i<=seg;i++){
      const t=i/seg,x=t*w
      const y=b.by+Math.sin(x*b.f+this.t*b.sp+b.of)*b.amp+Math.sin(x*b.f*2+this.t*b.sp*.7+b.of+1)*b.amp*.4+my*80*(.5-Math.abs(t-.5))
      pts.push({x:x+mx*100*(.5-Math.abs(t-.5)),y})
    }
    for(let p=0;p<3;p++){
      ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y)
      for(let i=1;i<pts.length;i++){const xc=(pts[i-1].x+pts[i].x)/2,yc=(pts[i-1].y+pts[i].y)/2;ctx.quadraticCurveTo(pts[i-1].x,pts[i-1].y,xc,yc)}
      ctx.lineTo(pts[pts.length-1].x,h);ctx.lineTo(pts[0].x,h);ctx.closePath()
      const al=.08-p*.025,g=ctx.createLinearGradient(0,b.by-80,0,b.by+80)
      g.addColorStop(0,`rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);g.addColorStop(.4,`rgba(${b.c[0]},${b.c[1]},${b.c[2]},${al})`)
      g.addColorStop(.6,`rgba(${b.c[3]},${b.c[4]},${b.c[5]},${al})`);g.addColorStop(1,`rgba(${b.c[3]},${b.c[4]},${b.c[5]},0)`)
      ctx.fillStyle=g;ctx.filter=p===0?'blur(20px)':p===1?'blur(10px)':'none';ctx.fill()
    }
    ctx.filter='none'
  }
  // Connection lines
  for(let i=0;i<this.b.length;i++){for(let j=i+1;j<this.b.length;j++){
    for(let k=0;k<10;k++){const t=k/10,x=t*w
      const y1=this.b[i].by+Math.sin(x*this.b[i].f+this.t*this.b[i].sp+this.b[i].of)*this.b[i].amp+Math.sin(x*this.b[i].f*2+this.t*this.b[i].sp*.7+this.b[i].of+1)*this.b[i].amp*.4
      const y2=this.b[j].by+Math.sin(x*this.b[j].f+this.t*this.b[j].sp+this.b[j].of)*this.b[j].amp+Math.sin(x*this.b[j].f*2+this.t*this.b[j].sp*.7+this.b[j].of+1)*this.b[j].amp*.4
      ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='rgba(0,212,255,0.02)';ctx.lineWidth=1;ctx.stroke()
    }
  }}
  // Shapes
  for(const s of this.s){
    s.x+=s.vx+(this.m.x-.5)*.1;s.y+=s.vy+(this.m.y-.5)*.1;s.rot+=s.rs
    if(s.x<-50)s.x=w+50;if(s.x>w+50)s.x=-50;if(s.y<-50)s.y=h+50;if(s.y>h+50)s.y=-50
    this.drawShp(ctx,s.tp,s.x,s.y,s.sz,s.rot)
  }
  // Mouse glow particles
  for(let i=0;i<30;i++){const t=i/30,a=t*6.28+this.t
    const px=this.m.x*w+Math.cos(a+this.t)*(60+Math.sin(this.t*2+i)*30)
    const py=this.m.y*h+Math.sin(a+this.t)*(60+Math.sin(this.t*2+i)*30)
    ctx.beginPath();ctx.arc(px,py,2,0,6.28);ctx.fillStyle=`rgba(0,212,255,${.15+Math.sin(this.t*3+i)*.08})`;ctx.fill()
  }
  // Center glow
  const g=ctx.createRadialGradient(this.m.x*w,this.m.y*h,0,this.m.x*w,this.m.y*h,200)
  g.addColorStop(0,'rgba(0,212,255,0.06)');g.addColorStop(.5,'rgba(0,212,255,0.02)');g.addColorStop(1,'rgba(0,212,255,0)')
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h)
  requestAnimationFrame(()=>this.anim())
}}
document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('particle-canvas'))Aurora.init('particle-canvas')})
