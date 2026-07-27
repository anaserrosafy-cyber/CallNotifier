import { db, ref, onValue } from "./firebase.js";

const history = document.getElementById("history");

function badge(item){

    if(item.type==="sms")
        return '<span class="badge sms">💬 SMS</span>';

    switch(item.status){

        case "ringing":
            return '<span class="badge call">📞 Appel entrant</span>';

        case "answered":
            return '<span class="badge answered">🟢 Répondu</span>';

        case "ended":
            return '<span class="badge answered">☎️ Terminé</span>';

        case "missed":
            return '<span class="badge missed">❌ Manqué</span>';

        default:
            return '<span class="badge call">📞 Appel</span>';
    }

}

function formatTime(ts){

    if(!ts) return "";

    return new Date(Number(ts)*1000).toLocaleString("fr-FR");

}

function render(list){

    history.innerHTML="";

    if(list.length===0){

        history.innerHTML='<div class="empty">Aucun événement</div>';
        return;

    }

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

${
item.type==="sms"
?
`<div class="message" style="display:block;">
${item.text || ""}
</div>`
:
""
}

<div class="time">

🕒 ${formatTime(item.time)}

</div>

</div>

`;

    });

}

onValue(ref(db,"calls"),snapshot=>{

    const data=snapshot.val();

    if(!data){

        render([]);
        return;

    }

    const list=Object.values(data);

    list.sort((a,b)=>Number(b.time)-Number(a.time));

    render(list);

});
