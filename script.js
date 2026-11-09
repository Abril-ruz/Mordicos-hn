const $=id=>document.getElementById(id);
const KC={cachorro:14,pequena:10,adulto:28,grande:52,senior:24,sens:21}; // kcal estimadas por pieza
const T={
cachorro:{n:'Cachorro',gv:'Banano y zanahoria',bv:'Manzana y avena',gc:'Pavo y zanahoria',bc:'Pollo y calabaza'},
adulto:{n:'Adulto',gv:'Calabaza y zanahoria',bv:'Camote y manzana',gc:'Res y calabaza',bc:'Res y zanahoria'},
pequena:{n:'Raza pequeña',gv:'Banano y avena',bv:'Calabaza y zanahoria',gc:'Pollo y arroz',bc:'Pavo y manzana'},
grande:{n:'Raza grande',gv:'Camote y avena',bv:'Manzana y calabaza',gc:'Res y camote',bc:'Res y camote'},
senior:{n:'Senior',gv:'Calabaza y avena',bv:'Camote y zanahoria',gc:'Pavo y calabaza',bc:'Pollo y zanahoria'},
sens:{n:'Sensibilidad digestiva',gv:'Arroz y calabaza',bv:'Banano y arroz',gc:'Pollo y arroz',bc:'Pavo y calabaza'}};
const IMG={'cachorro-gv':'img/vegetariana-cachorro.jpg','adulto-gv':'img/vegetariana-adulto.jpg','adulto-gc':'img/carne-adulto.jpg'};
const rer=k=>70*Math.pow(k,.75);
const fmt=x=>x.toLocaleString('es-HN',{maximumFractionDigits:1});
function pieces(snack,t,f){const n=Math.max(1,Math.floor(snack/KC[t]));return n+(f==='b'?(n>1?' cuadros':' cuadro'):(n>1?' galletas':' galleta'))}
$('f').addEventListener('submit',e=>{e.preventDefault();
const w=parseFloat($('w').value),bcs=+$('b').value,sz=$('sz').value,f=$('fm').value,al=$('al').value,pr=$('pr').value;
const age=$('eu').value==='m'?(+$('ed').value)/12:+$('ed').value;
const pup=age<1,sen=age>=7,nm=$('n').value.trim()||'Tu perro';
let ideal=pup?null:w/(1+0.1*(bcs-5));
const ref=pup?w:ideal;
let fac=pup?2:($('st').value==='1'?1.6:1.8);
if(sen&&!pup)fac=Math.min(fac,1.4);
if(!pup)fac+=+$('ac').value;
if(bcs>5)fac=1;
const daily=rer(ref)*fac,snack=daily*.1;
let t=pup?'cachorro':$('sd').checked?'sens':sen?'senior':sz==='p'?'pequena':sz==='g'?'grande':'adulto';
let p=pr==='x'?(bcs>=7?'v':'c'):pr;
const notes=[];
const bad=r=>al==='ave'?/Pollo|Pavo/.test(r):al==='res'?/Res/.test(r):false;
let name;
const pick=(pp,ff)=>T[t][(ff==='g'?'g':'b')+pp];
let pf=f;name=pick(p,f);
if(p==='c'&&bad(name)){const o=f==='g'?'b':'g';if(!bad(pick('c',o))){pf=o;name=pick('c',o);notes.push('Cambiamos el formato para evitar el ingrediente al que es alérgico.')}else{p='v';name=pick('v',f);notes.push('Por su alergia, te recomendamos la línea vegetariana.')}}
if(pr==='x'&&bcs>=7)notes.push('Recomendamos la línea vegetariana por su peso.');
const ph=pf==='g'?IMG[t+'-g'+p]:null;
let st,cl,msg;
if(pup){st='En crecimiento';cl='ok';msg='Los cachorros cambian de peso cada semana, por eso calculamos con su peso actual.'}
else{const d=(w-ideal)/ideal*100;
if(bcs===5){st='Peso ideal';cl='ok';msg=`${nm} está en un buen peso. ¡Sigue así!`}
else if(bcs<5){st='Bajo peso';cl='warn';msg=`${nm} necesita subir unos ${fmt(ideal-w)} kg. Consulta al veterinario para descartar causas.`}
else{st=bcs>=9?'Obesidad':'Sobrepeso';cl=bcs>=9?'bad':'warn';msg=`${nm} debería bajar unos ${fmt(w-ideal)} kg. Hazlo de forma gradual y con apoyo veterinario.`}}
const line=p==='v'?'Línea vegetariana':'Línea con carne';
const fn=pf==='g'?'Galleta':'Bizcocho';
$('res').innerHTML=`<span class="pill ${cl}">${st}</span><p style="margin:10px 0 0">${msg}</p>
<div class="stat"><div><b>${pup?fmt(w):fmt(ideal)} kg</b><span>${pup?'peso actual':'peso ideal estimado'}</span></div><div><b>${Math.round(daily)}</b><span>kcal al día</span></div><div><b>${Math.round(snack)}</b><span>kcal máx. en snacks</span></div></div>
<div class="rec">${ph?`<img src="${ph}" alt="">`:'<div class="ph">🦴</div>'}<div><small>${line} · ${T[t].n}</small><h3>${name}</h3><p>${fn} · hasta <b>${pieces(snack,t,pf)}</b> al día, repartidos.</p></div></div>
<ul class="notes">${notes.map(x=>`<li>${x}</li>`).join('')}<li>Contiene huevo${pf==='b'?' y yogur':''}.</li><li>Cálculo estimado; no sustituye la opinión de tu veterinario.</li></ul>`;
});
$('tb').innerHTML=[2,5,10,15,25,35,45].map(k=>{const d=rer(k)*1.6,s=d*.1,t=k<=10?'pequena':k<=25?'adulto':'grande';
return `<tr><td><b>${k} kg</b></td><td>${Math.round(d)} kcal</td><td>${Math.round(s)} kcal</td><td>${T[t].n}</td><td>${pieces(s,t,'g')}</td></tr>`}).join('');