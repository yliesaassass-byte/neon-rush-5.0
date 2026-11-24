const $=id=>document.getElementById(id);const plan=[
{day:"LUNDI",name:"Haut du corps A",desc:"Renforcement équilibré • échauffement 8–10 min • 2 à 3 séries par exercice • garde 2 à 3 répétitions en réserve",ex:[["Développé poitrine machine","Pectoraux"],["Tirage vertical prise confortable","Dos"],["Rowing assis poulie","Dos"],["Développé épaules haltères léger","Épaules"],["Extension triceps à la poulie","Triceps"],["Curl biceps haltères","Biceps"]]},
{day:"MARDI",name:"Bas du corps A",desc:"Jambes et stabilité • échauffement 8–10 min • amplitude confortable et mouvement contrôlé",ex:[["Goblet squat","Jambes"],["Presse à jambes","Quadriceps"],["Soulevé de terre roumain avec haltères légers","Ischio-jambiers"],["Pont fessier","Hanches"],["Mollets debout","Mollets"],["Dead bug","Tronc"]]},
{day:"MERCREDI",name:"Cardio • Mobilité • Tronc",desc:"Séance facile à modérée • tu dois pouvoir parler pendant le cardio • pas de recherche d'épuisement",ex:[["Vélo ou marche inclinée tranquille","Cardio"],["Mobilité des hanches","Mobilité"],["Mobilité thoracique et épaules","Mobilité"],["Bird dog","Stabilité"],["Gainage latéral adapté","Tronc"]]},
{day:"VENDREDI",name:"Haut du corps B",desc:"Deuxième séance du haut • varie les angles sans chercher à soulever le maximum",ex:[["Pompes inclinées ou machine poitrine","Pectoraux"],["Tirage horizontal poitrine appuyée","Dos"],["Tirage vertical prise neutre","Dos"],["Élévations latérales légères","Épaules"],["Face pull léger","Arrière d'épaules"],["Curl marteau","Biceps"],["Extension triceps à la corde","Triceps"]]},
{day:"SAMEDI",name:"Bas du corps B",desc:"Jambes et équilibre • privilégie la stabilité, une bonne posture et une récupération suffisante",ex:[["Step-up bas avec appui si besoin","Jambes"],["Fentes arrière assistées","Jambes"],["Leg curl machine","Ischio-jambiers"],["Extension de jambes légère","Quadriceps"],["Pont fessier","Hanches"],["Pallof press","Tronc"]]}];
let data=JSON.parse(localStorage.getItem("neonRushV2")||'{"sets":[]}'),w=0,e=0,target=3,sid="";
data.water=data.water||[];data.meals=data.meals||[];data.bodyWeights=data.bodyWeights||[];
const persist=()=>localStorage.setItem("neonRushV2",JSON.stringify(data));const date=()=>new Date().toLocaleDateString("fr-FR");
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
function page(id){document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("sel",x.dataset.page===id));if(id==="home")home();if(id==="history")history();window.scrollTo(0,0)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>page(b.dataset.page));document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>page(b.dataset.back));
function home(){$("totalSets").textContent=data.sets.length;$("totalExercises").textContent=new Set(data.sets.map(s=>s.w+"-"+s.e)).size;$("homePlan").innerHTML=plan.map(x=>`<div class="item"><div><b>${x.day} — ${x.name}</b><small>${x.ex.length} exercices</small></div><span class="tag">Programme</span></div>`).join("")}
function workouts(){$("workouts").innerHTML=plan.map((x,i)=>`<button class="item" data-w="${i}"><div><b>${x.day} — ${x.name}</b><small>${x.desc} • ${x.ex.length} exercices</small></div><span class="tag">Ouvrir →</span></button>`).join("");document.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>openWorkout(+b.dataset.w))}
function openWorkout(i){w=i;$("sessionDay").textContent=plan[w].day;$("sessionName").textContent=plan[w].name;$("sessionDesc").textContent=plan[w].desc;$("exercises").innerHTML=plan[w].ex.map((x,i)=>`<button class="item" data-e="${i}"><div><b>${x[0]}</b><small>${x[1]}</small></div><span class="tag">Saisir →</span></button>`).join("");document.querySelectorAll("[data-e]").forEach(b=>b.onclick=()=>logger(+b.dataset.e));page("session")}
function previous(){const arr=data.sets.filter(s=>s.w===w&&s.e===e&&s.sid!==sid);let groups={};arr.forEach(s=>(groups[s.sid]??=[]).push(s));let keys=Object.keys(groups).sort((a,b)=>Math.max(...groups[b].map(x=>x.ts))-Math.max(...groups[a].map(x=>x.ts)));return keys.length?groups[keys[0]]:[]}
function logger(i){e=i;sid=`${w}-${e}-${Date.now()}`;$("exerciseName").textContent=plan[w].ex[e][0];$("setTarget").value=3;$("setup").classList.remove("hidden");$("entry").classList.add("hidden");$("done").classList.add("hidden");$("advice").classList.add("hidden");const p=previous();$("previous").textContent=p.length?p.map((s,i)=>`S${i+1} : ${s.weight} kg × ${s.reps}`).join(" · "):"Pas encore de séance précédente enregistrée pour cet exercice.";renderCurrent();page("logger")}
function current(){return data.sets.filter(s=>s.sid===sid)}
function progress(){let n=current().length;$("setNo").textContent=`Série ${n+1}`;$("setCount").textContent=`${n}/${target}`;$("bar").style.width=`${n/target*100}%`}
$("begin").onclick=()=>{target=Math.max(1,Math.min(10,parseInt($("setTarget").value)||1));$("setup").classList.add("hidden");$("entry").classList.remove("hidden");progress()}
$("saveSet").onclick=()=>{let weight=Number($("weight").value),reps=Number($("reps").value);if($("weight").value===""||$("reps").value===""||weight<0||reps<1)return toast("Entre le poids et les répétitions");let old=previous(),n=current().length,eff=$("effort").value;let s={w,e,sid,target,series:n+1,weight,reps,eff,note:$("note").value,ts:Date.now(),date:date()};data.sets.push(s);persist();let msg=eff==="trop"?"La série était trop difficile : choisis une charge plus légère ou moins de répétitions la prochaine fois.":eff==="difficile"?"Série exigeante : récupère suffisamment et ne force pas si ta technique se dégrade.":old[n]&&reps<old[n].reps?"Tu as fait moins de répétitions que la dernière fois. Les performances varient : récupère et reste à l'écoute de tes sensations.":eff==="facile"?"Série maîtrisée : conserve une exécution propre. N'augmente pas la charge si tu n'es pas sûr de ta technique.":"Série enregistrée. Garde un mouvement contrôlé et une récupération suffisante.";$("advice").innerHTML=`<b>✳ Conseil du coach</b><p>${msg}</p>`;$("advice").classList.remove("hidden");$("weight").value="";$("reps").value="";$("note").value="";renderCurrent();if(n+1>=target){$("entry").classList.add("hidden");$("done").classList.remove("hidden");$("done").textContent=`Tes ${target} séries sont enregistrées !`}else progress();toast("Série enregistrée")}
function renderCurrent(){
 const sets=current().sort((a,b)=>a.ts-b.ts);
 sets.forEach((s,i)=>s.series=i+1);
 persist();
 $("thisSets").innerHTML=sets.map(s=>`<div class="item"><div><b>Série ${s.series}</b><small>${s.weight} kg × ${s.reps} répétitions</small></div><div class="rowActions"><span class="tag">${s.eff}</span><button class="deleteSet" type="button" data-delete-set="${s.ts}" aria-label="Supprimer la série ${s.series}" title="Supprimer cette série">×</button></div></div>`).join("")||'<p class="muted">Aucune série enregistrée pour cette séance.</p>';
 document.querySelectorAll("[data-delete-set]").forEach(b=>b.onclick=()=>{
   const stamp=Number(b.dataset.deleteSet);
   data.sets=data.sets.filter(s=>!(s.sid===sid&&s.ts===stamp));
   data.sets.filter(s=>s.sid===sid).sort((a,b)=>a.ts-b.ts).forEach((s,i)=>s.series=i+1);
   persist();renderCurrent();
   $("done").classList.add("hidden");
   if(current().length<target){$("entry").classList.remove("hidden");progress()}
   toast("Série supprimée");
 });
}
function history(){
 $("historyList").innerHTML=data.sets.slice().reverse().map(s=>`<div class="card"><b>${plan[s.w]?.ex[s.e]?.[0]||"Exercice"}</b><p class="muted">${s.date} • Série ${s.series} • ${s.weight} kg × ${s.reps}</p></div>`).join("")||'<p class="muted">Tes performances apparaîtront ici.</p>';
 renderWeightHistory();
}
function renderWeightHistory(){
 const box=$("weightHistory");if(!box)return;
 box.innerHTML=data.bodyWeights.slice().sort((a,b)=>b.ts-a.ts).map(x=>`<div class="item"><div><b>${cleanText(x.value)} kg</b><small>${cleanText(x.date)}</small></div><button class="deleteSet" type="button" data-delete-weight="${x.ts}" aria-label="Supprimer cette mesure">×</button></div>`).join("")||'<p class="muted">Aucune mesure enregistrée.</p>';
 document.querySelectorAll("[data-delete-weight]").forEach(b=>b.onclick=()=>{data.bodyWeights=data.bodyWeights.filter(x=>x.ts!==Number(b.dataset.deleteWeight));persist();renderWeightHistory();toast("Mesure supprimée")});
}
$("bodyWeightDate").value=new Date().toISOString().slice(0,10);
$("saveBodyWeight").onclick=()=>{
 const value=Number($("bodyWeight").value),dateValue=$("bodyWeightDate").value;
 if(!Number.isFinite(value)||value<=0||value>500||!dateValue)return toast("Vérifie la valeur et la date");
 data.bodyWeights.push({value,date:new Date(dateValue+"T12:00:00").toLocaleDateString("fr-FR"),ts:Date.now()});
 persist();$("bodyWeight").value="";renderWeightHistory();toast("Mesure enregistrée");
};
$("csv").onclick=()=>{let rows=[["date","jour","exercice","serie","charge_kg","repetitions"],...data.sets.map(s=>[s.date,plan[s.w]?.day||"",plan[s.w]?.ex[s.e]?.[0]||"",s.series,s.weight,s.reps]),[],["date","mesure_poids_kg"],...data.bodyWeights.map(x=>[x.date,x.value])];let csv=rows.map(r=>r.join(";")).join("\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="neon-rush.csv";a.click()}
const faq=[{k:["avant","pré","entrainement","sport"],t:"Avant l'entraînement",a:"Choisis un repas ou une collation que tu digères bien et qui te donne de l'énergie : par exemple un fruit avec un yaourt, ou du pain avec un accompagnement. Adapte selon ton appétit et le temps avant la séance."},{k:["après","post","récupération","recuperation"],t:"Après l'entraînement",a:"Prends un repas habituel et varié avec une source de protéines, des féculents et des fruits ou légumes. Bois de l'eau et laisse à ton corps le temps de récupérer."},{k:["eau","boire","hydrat","soif"],t:"Hydratation",a:"Bois régulièrement au cours de la journée. Pendant l'activité, adapte-toi à la chaleur, à la durée de l'effort et à ta soif. L'eau suffit généralement pour les séances ordinaires."},{k:["équilibr","equilibr","repas","assiette"],t:"Repas équilibré",a:"Une base simple : une source de protéines, des féculents, des légumes ou fruits et une matière grasse. Varie les aliments et ajuste les quantités à ta faim et à ton activité."},{k:["collation","snack","goûter","gouter"],t:"Collations",a:"Selon ta faim, tu peux choisir un fruit, un yaourt, du pain, des céréales ou des fruits à coque si tu n'y es pas allergique. Une collation n'est pas obligatoire."},{k:["protéine","proteine"],t:"Protéines",a:"On trouve des protéines dans les œufs, produits laitiers, poissons, viandes, légumineuses et tofu. Une alimentation variée aide à couvrir les besoins : inutile d'en consommer des quantités excessives."}];
function todayWater(){return data.water.filter(x=>x.date===date()).reduce((a,x)=>a+x.ml,0)}
function renderNutrition(){
 const total=todayWater();$("waterTotal").textContent=total.toLocaleString("fr-FR")+" ml";$("waterBar").style.width=Math.min(100,total/2000*100)+"%";
 const logs=data.water.filter(x=>x.date===date());$("waterHistory").textContent=logs.length?logs.length+" ajout(s) enregistré(s) aujourd'hui.":"Aucune boisson notée aujourd'hui.";
 $("mealHistory").innerHTML=data.meals.filter(x=>x.date===date()).slice().reverse().map(m=>{
   const mealText=m.text||m.food||(m.items||[]).map(x=>x.name).join(", ")||"Repas noté";
   return `<div class="food-result"><h4>${cleanText(m.type)}</h4><p>${cleanText(mealText)}</p>${m.note?`<p class="muted">${cleanText(m.note)}</p>`:""}<p class="muted">${cleanText(m.date)}</p></div>`;
 }).join("")||'<p class="muted">Tes repas notés aujourd’hui apparaîtront ici.</p>';
}
function addWater(ml){if(!Number.isFinite(ml)||ml<=0||ml>1500)return toast("Entre une quantité entre 1 et 1 500 ml");data.water.push({ml,date:date(),ts:Date.now()});persist();renderNutrition();toast("Hydratation enregistrée")}
document.querySelectorAll("[data-water]").forEach(b=>b.onclick=()=>addWater(Number(b.dataset.water)));
$("addWater").onclick=()=>{addWater(Number($("waterCustom").value));$("waterCustom").value=""};
function cleanText(v){return String(v||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
$("saveMeal").onclick=()=>{
 const textValue=$("mealText").value.trim();
 if(!textValue)return toast("Écris ce que tu as mangé");
 data.meals.push({type:$("mealType").value,text:textValue,note:$("mealNote").value.trim(),date:date(),ts:Date.now()});
 persist();$("mealText").value="";$("mealNote").value="";renderNutrition();toast("Repas enregistré");
};
function ask(){let q=$("question").value.trim().toLocaleLowerCase("fr"),f=faq.find(x=>x.k.some(k=>q.includes(k)));$("answer").innerHTML=!q?"Écris une question pour commencer.":f?`<b>${f.t}</b><br>${f.a}`:"Je n'ai pas de réponse précise dans mon aide intégrée. Essaie une question sur les repas, les collations, les protéines ou l'hydratation. Pour une question médicale ou un régime particulier, demande conseil à un professionnel qualifié.";$("answer").classList.remove("hidden")}
$("ask").onclick=ask;$("question").addEventListener("keydown",ev=>{if(ev.key==="Enter")ask()});document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{$("question").value=b.dataset.q;ask()});
document.querySelector('[data-page="nutrition"]').addEventListener("click",renderNutrition);
home();workouts();history();renderNutrition();
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});