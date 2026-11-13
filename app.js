const IMG={
  1:"images/lamborghini-aventador-s.jpg",2:"images/rolls-royce-cullinan.jpg",3:"images/ferrari-portofino-m.jpg",4:"images/rolls-royce-ghost.jpg",5:"images/mid-engine-coupe.jpg",6:"images/bugatti-chiron.jpg"
};
const LISTINGS=[
 {id:1,make:'Lamborghini',model:'Aventador',variant:'S Coupe · 6.5L V12',year:2018,km:14200,price:48500000,fuel:'Petrol',trans:'7-speed ISR',owners:1,color:'Rosso Mars',city:'Mumbai',body:'Coupe',img:1,score:'204/212',seller:'Private owner',power:'740 hp',
  desc:'Single owner, garage kept. Full Lamborghini service record, new Pirelli P Zero tyres fitted at 12,000 km. Front-axle lift fitted from new.',feat:['Front axle lift','Carbon trim','Sport exhaust','Reverse camera'],age:3},
 {id:2,make:'Rolls-Royce',model:'Cullinan',variant:'6.75L Twin-turbo V12',year:2019,km:21800,price:59000000,fuel:'Petrol',trans:'8-speed auto',owners:1,color:'Arctic White',city:'Delhi NCR',body:'SUV',img:2,score:'209/212',seller:'Verified dealer',power:'563 hp',
  desc:'Chauffeur-maintained for the first owner. Starlight headliner, rear theatre configuration and a clean accident history. Authorised service every 10,000 km.',feat:['Starlight headliner','Rear theatre','Adaptive air suspension','Night vision'],age:5},
 {id:3,make:'Ferrari',model:'Portofino M',variant:'3.9L Twin-turbo V8 Convertible',year:2022,km:6400,price:34000000,fuel:'Petrol',trans:'8-speed DCT',owners:1,color:'Grigio Titanio',city:'Bengaluru',body:'Convertible',img:3,score:'211/212',seller:'Private owner',power:'612 hp',
  desc:'Red leather interior with the carbon-fibre driving zone. Ferrari warranty valid to 2027. Bought new from the Mumbai dealership and driven mostly on weekends.',feat:['Ferrari warranty','Carbon driving zone','Red leather','Heated seats'],age:2},
 {id:4,make:'Rolls-Royce',model:'Ghost',variant:'6.6L Twin-turbo V12',year:2018,km:32500,price:32000000,fuel:'Petrol',trans:'8-speed auto',owners:2,color:'Pearl White',city:'Hyderabad',body:'Sedan',img:4,score:'198/212',seller:'Verified dealer',power:'563 hp',
  desc:'Bespoke copper-finish wheels and tan interior. Two owners, complete service history. Minor stone chips on the bonnet noted in the inspection report.',feat:['Bespoke wheels','Tan leather','Lambswool mats','Rear refrigerator'],age:4},
 {id:5,make:'Supercar',model:'Mid-engine Coupe',variant:'Carbon pack · Rear wing',year:2021,km:9800,price:28500000,fuel:'Petrol',trans:'7-speed DCT',owners:1,color:'Glacier White',city:'Pune',body:'Coupe',img:5,score:'201/212',seller:'Private owner',power:'600 hp',
  desc:'Track-day ready with the optional rear wing and forged wheels. Owner has kept it in a climate-controlled garage. Ceramic coating applied in 2023.',feat:['Rear wing','Forged wheels','Ceramic coating','Sport seats'],age:1},
 {id:6,make:'Bugatti',model:'Chiron',variant:'8.0L Quad-turbo W16',year:2019,km:3100,price:260000000,fuel:'Petrol',trans:'7-speed DSG',owners:1,color:'Black and Blue Carbon',city:'Mumbai',body:'Coupe',img:6,score:'212/212',seller:'Verified dealer',power:'1,479 hp',
  desc:'Two-tone exposed carbon with blue accents. Fewer than 3,200 km on the clock, factory service up to date and delivered with both keys and the full tool roll.',feat:['Exposed carbon','Two keys','Tool roll','Factory service'],age:6}
];
const $=s=>document.querySelector(s);
const state={q:'',make:'All',budget:0,sort:'new',body:'All',fav:new Set()};
try{JSON.parse(localStorage.getItem('vr-fav')||'[]').forEach(i=>state.fav.add(i))}catch(e){}
function saveFav(){try{localStorage.setItem('vr-fav',JSON.stringify([...state.fav]))}catch(e){}}

function inr(n){
  if(n>=1e7) return '₹'+(n/1e7).toFixed(n%1e7===0?0:2).replace(/\.?0+$/,'')+' Cr';
  return '₹'+(n/1e5).toFixed(1).replace(/\.0$/,'')+' L';
}
function full(n){return '₹'+Number(n).toLocaleString('en-IN')}
function km(n){return Number(n).toLocaleString('en-IN')+' km'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3200)}

/* hero feature */
(function(){
  const c=LISTINGS[5];
  $('#feature').innerHTML=`<img src="${IMG[c.img]}" alt="${esc(c.make+' '+c.model)} parked outside a house">
   <div class="plate"><div><div class="mono">${c.year} · ${km(c.km)} · ${esc(c.city)}</div><h3>${esc(c.make)} ${esc(c.model)}</h3></div><div class="price">${inr(c.price)}</div></div>`;
  $('#feature').style.cursor='pointer';
  $('#feature').addEventListener('click',()=>openSheet(c.id));
})();

/* filters */
(function(){
  const makes=['All',...new Set(LISTINGS.map(l=>l.make))];
  $('#make').innerHTML=makes.map(m=>`<option value="${esc(m)}">${m==='All'?'All makes':esc(m)}</option>`).join('');
  const bodies=['All','Coupe','Convertible','Sedan','SUV'];
  $('#chips').innerHTML=bodies.map(b=>`<button class="chip" type="button" data-b="${b}" aria-pressed="${b==='All'}">${b==='All'?'All bodies':b}</button>`).join('');
})();
$('#q').addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase();render()});
$('#make').addEventListener('change',e=>{state.make=e.target.value;render()});
$('#budget').addEventListener('change',e=>{state.budget=+e.target.value;render()});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;render()});
$('#chips').addEventListener('click',e=>{
  const b=e.target.closest('.chip');if(!b)return;
  state.body=b.dataset.b;
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c===b));
  render();
});

function render(){
  let rows=LISTINGS.filter(l=>
    (state.make==='All'||l.make===state.make)&&
    (state.body==='All'||l.body===state.body)&&
    (!state.budget||l.price<=state.budget)&&
    (!state.q||(l.make+' '+l.model+' '+l.variant+' '+l.city).toLowerCase().includes(state.q)));
  const s=state.sort;
  rows.sort((a,b)=>s==='lo'?a.price-b.price:s==='hi'?b.price-a.price:s==='km'?a.km-b.km:a.age-b.age);
  $('#count').textContent=rows.length+(rows.length===1?' car':' cars');
  $('#grid').innerHTML=rows.length?rows.map(card).join(''):'<div class="empty">No cars match these filters. Clear the search or widen the budget.</div>';
}
function card(l){
  const fav=state.fav.has(l.id);
  return `<article class="card" data-id="${l.id}" tabindex="0" aria-label="${esc(l.make+' '+l.model)}, ${inr(l.price)}">
    <div class="ph"><img src="${l.imgData||IMG[l.img]}" alt="${esc(l.make+' '+l.model)}" loading="lazy">
      ${l.pending?'<span class="tag new">In review</span>':`<span class="tag">${esc(l.seller)}</span>`}
      <button class="heart" type="button" data-fav="${l.id}" aria-pressed="${fav}" aria-label="Save ${esc(l.make+' '+l.model)}"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9z"/></svg></button></div>
    <div class="body">
      <div><h3>${esc(l.make)} ${esc(l.model)}</h3><div class="variant">${esc(l.variant)}</div></div>
      <div class="specs mono"><span>${l.year}</span><span>${km(l.km)}</span><span>${esc(l.fuel)}</span><span>${l.owners} owner${l.owners>1?'s':''}</span></div>
      <div class="foot"><div><div class="price">${inr(l.price)}</div><div class="mono" style="color:var(--muted)">${esc(l.city)}</div></div>
        <span class="score"><i></i>${l.pending?'Awaiting inspection':'Inspected '+esc(l.score)}</span></div>
    </div></article>`;
}
$('#grid').addEventListener('click',e=>{
  const h=e.target.closest('[data-fav]');
  if(h){e.stopPropagation();const id=+h.dataset.fav;state.fav.has(id)?state.fav.delete(id):state.fav.add(id);saveFav();h.setAttribute('aria-pressed',state.fav.has(id));toast(state.fav.has(id)?'Saved to your shortlist':'Removed from your shortlist');return}
  const c=e.target.closest('.card');if(c)openSheet(+c.dataset.id);
});
$('#grid').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('card'))openSheet(+e.target.dataset.id)});

/* detail sheet */
let lastFocus=null;
function emi(price,down,months,rate){
  const p=price*(1-down/100),r=rate/1200;
  return Math.round(p*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1));
}
function openSheet(id){
  const l=LISTINGS.find(x=>x.id===id);if(!l)return;
  lastFocus=document.activeElement;
  $('#sheet').innerHTML=`
  <button class="icon-btn x" type="button" id="close" aria-label="Close">✕</button>
  <div class="sheet-grid">
    <div class="big"><img src="${l.imgData||IMG[l.img]}" alt="${esc(l.make+' '+l.model)}"></div>
    <div class="info">
      <div class="eyebrow">${esc(l.city)} · ${esc(l.seller)}</div>
      <h2 id="d-title">${esc(l.make)} ${esc(l.model)}</h2>
      <div style="color:var(--muted);margin-top:-8px">${esc(l.variant)}</div>
      <div class="price" style="font-size:2rem">${full(l.price)}</div>
      <dl class="kv">
        <dt>Year</dt><dd>${l.year}</dd>
        <dt>Odometer</dt><dd>${km(l.km)}</dd>
        <dt>Power</dt><dd>${esc(l.power||'—')}</dd>
        <dt>Transmission</dt><dd>${esc(l.trans)}</dd>
        <dt>Colour</dt><dd>${esc(l.color)}</dd>
        <dt>Owners</dt><dd>${l.owners}</dd>
        <dt>Inspection</dt><dd style="color:var(--good)">${l.pending?'Awaiting booking':esc(l.score)+' points passed'}</dd>
      </dl>
    </div>
  </div>
  <div class="lower">
    <div>
      <h3>Owner's notes</h3><p style="margin:0 0 16px;color:var(--muted)">${esc(l.desc||'No notes added yet.')}</p>
      ${l.feat&&l.feat.length?`<h3>Highlights</h3><ul class="feat">${l.feat.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:''}
      <h3 style="margin-top:22px">Finance estimate</h3>
      <div class="emi">
        <div class="row"><span>Down payment</span><b id="e-down-v">30%</b></div>
        <input type="range" id="e-down" min="10" max="80" value="30" aria-label="Down payment percent">
        <div class="row"><span>Tenure</span><b id="e-ten-v">48 months</b></div>
        <input type="range" id="e-ten" min="12" max="84" step="12" value="48" aria-label="Tenure in months">
        <div class="row" style="border-top:1px solid var(--line);padding-top:8px"><span>Monthly instalment at 9.5%</span><b class="mono" id="e-out"></b></div>
      </div>
    </div>
    <div>
      <h3>Make an offer</h3>
      <form id="offerForm" class="sellf" style="grid-template-columns:1fr;gap:12px" novalidate>
        <div class="field"><label for="o-name">Your name</label><input id="o-name" required autocomplete="name"><div class="err" data-for="o-name"></div></div>
        <div class="field"><label for="o-phone">Phone number</label><input id="o-phone" type="tel" required autocomplete="tel" placeholder="98xxxxxxxx"><div class="err" data-for="o-phone"></div></div>
        <div class="field"><label for="o-amt">Your offer (₹)</label><input id="o-amt" type="number" required value="${Math.round(l.price*0.97/1000)*1000}"><div class="err" data-for="o-amt"></div></div>
        <button class="btn solid block" type="submit">Send offer</button>
        <button class="btn block" type="button" id="book">Book a viewing</button>
      </form>
      <p class="mono" style="color:var(--muted);margin:14px 0 0">Payment is held in escrow until the RC transfer is complete.</p>
    </div>
  </div>`;
  const up=()=>{const d=+$('#e-down').value,t=+$('#e-ten').value;$('#e-down-v').textContent=d+'%';$('#e-ten-v').textContent=t+' months';$('#e-out').textContent=full(emi(l.price,d,t,9.5))};
  $('#e-down').addEventListener('input',up);$('#e-ten').addEventListener('input',up);up();
  $('#close').addEventListener('click',closeSheet);
  $('#book').addEventListener('click',()=>toast('Viewing request noted for '+l.make+' '+l.model));
  $('#offerForm').addEventListener('submit',e=>{
    e.preventDefault();
    const ok=validate([['o-name',v=>v.length>1,'Enter your name'],['o-phone',v=>/^[0-9+\s-]{8,15}$/.test(v),'Enter a valid phone number'],['o-amt',v=>+v>0,'Enter an amount']]);
    if(!ok)return;
    toast('Offer of '+inr(+$('#o-amt').value)+' noted for the '+l.model);
    e.target.reset();
  });
  const v=$('#veil');v.classList.add('open');v.setAttribute('aria-hidden','false');v.scrollTop=0;
  document.body.style.overflow='hidden';$('#close').focus();
}
function closeSheet(){
  const v=$('#veil');v.classList.remove('open');v.setAttribute('aria-hidden','true');document.body.style.overflow='';
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
$('#veil').addEventListener('click',e=>{if(e.target.id==='veil')closeSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#veil').classList.contains('open'))closeSheet()});

/* validation */
function validate(rules){
  let ok=true;
  rules.forEach(([id,fn,msg])=>{
    const el=document.getElementById(id),er=document.querySelector(`.err[data-for="${id}"]`);
    const good=fn((el.value||'').trim());
    if(er)er.textContent=good?'':msg;
    if(!good&&ok){el.focus();}
    if(!good)ok=false;
  });
  return ok;
}

/* sell form */
let sellImg=null;
const drop=$('#drop');
function loadFile(f){
  if(!f||!f.type.startsWith('image/'))return;
  const r=new FileReader();
  r.onload=()=>{
    const im=new Image();
    im.onload=()=>{
      const s=Math.min(1,1100/im.width),c=document.createElement('canvas');
      c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      sellImg=c.toDataURL('image/jpeg',.82);
      $('#s-prev').src=sellImg;drop.classList.add('has');
    };
    im.src=r.result;
  };
  r.readAsDataURL(f);
}
$('#s-photo').addEventListener('change',e=>loadFile(e.target.files[0]));
['dragover','dragenter'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('on')}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('on')}));
drop.addEventListener('drop',e=>loadFile(e.dataTransfer.files[0]));

$('#sellForm').addEventListener('submit',e=>{
  e.preventDefault();
  const ok=validate([
    ['s-make',v=>v.length>1,'Enter the make'],['s-model',v=>v.length>1,'Enter the model'],
    ['s-year',v=>+v>=1990&&+v<=2026,'Enter a year from 1990 to 2026'],
    ['s-km',v=>v!==''&&+v>=0,'Enter the odometer reading'],
    ['s-price',v=>+v>=100000,'Enter an asking price'],['s-city',v=>v.length>1,'Enter the city']]);
  if(!ok)return;
  const l={id:Date.now(),make:$('#s-make').value.trim(),model:$('#s-model').value.trim(),variant:'Owner listing',
    year:+$('#s-year').value,km:+$('#s-km').value,price:+$('#s-price').value,fuel:'Petrol',trans:'—',owners:+$('#s-owner').value,
    color:'—',city:$('#s-city').value.trim(),body:$('#s-body').value,img:5,imgData:sellImg||IMG[5],score:'',seller:'You',
    desc:$('#s-desc').value.trim(),feat:[],age:-1,pending:true};
  LISTINGS.unshift(l);
  const m=[...new Set(LISTINGS.map(x=>x.make))];
  $('#make').innerHTML=['All',...m].map(x=>`<option value="${esc(x)}">${x==='All'?'All makes':esc(x)}</option>`).join('');
  state.q='';state.make='All';state.body='All';state.budget=0;state.sort='new';
  $('#q').value='';$('#budget').value='0';$('#sort').value='new';
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.b==='All'));
  render();e.target.reset();sellImg=null;drop.classList.remove('has');
  toast('Your '+l.make+' '+l.model+' is listed and waiting for inspection');
  document.getElementById('browse').scrollIntoView();
});

/* theme */
$('#theme').addEventListener('click',()=>{
  const r=document.documentElement,cur=r.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  r.dataset.theme=cur==='dark'?'light':'dark';
});
render();
