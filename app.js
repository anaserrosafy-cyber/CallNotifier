import { db, ref, onValue } from "./firebase.js";

const history = document.getElementById("history");

function badge(item){

    if(item.type==="sms")
        return '<span class="badge sms">💬 SMS</span>';

    if(item.status==="missed")
        return '<span class="badge missed">❌ Manqué</span>';

    if(item.status==="answered")
        return '<span class="badge answered">🟢 Répondu</span>';

    if(item.status==="ended")
        return '<span class="badge answered">☎️ Terminé</span>';

    return '<span class="badge call">📞 Appel</span>';

}

function formatTime(timestamp){

    if(!timestamp) return "";

    const date = new Date(Number(timestamp)*1000);

    return date.toLocaleString("fr-FR");

}

onValue(ref(db,"calls"), snapshot=>{

    history.innerHTML="";

    const data=snapshot.val();

    if(!data){

        history.innerHTML='<div class="empty">Aucun appel</div>';

        return;

    }

    const list=Object.values(data);

    list.sort((a,b)=>Number(b.time)-Number(a.time));

    list.forEach(item=>{

        history.innerHTML+=`

<div class="card">

<div class="top">

${badge(item)}

</div>

<div class="name">

${item.name || "Numéro inconnu"}

</div>

<div class="number">

${item.number || ""}

</div>

<div class="message"
style="${item.type==="sms"?"display:block":"display:none"}">

${item.text || ""}

</div>

<div class="time">

🕒 ${formatTime(item.time)}

</div>

</div>

`;

    });

});
