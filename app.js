import { db, ref, onValue } from "./firebase.js";

const history = document.getElementById("history");
const stats = document.getElementById("stats");
const search = document.getElementById("search");

let allEvents = [];

function badge(item) {

    if (item.type === "sms")
        return '<span class="badge sms">💬 SMS</span>';

    switch (item.status) {

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

function formatTime(timestamp) {

    if (!timestamp) return "";

    return new Date(Number(timestamp) * 1000).toLocaleString("fr-FR");

}

function render(list) {

    history.innerHTML = "";

    stats.textContent = `${list.length} événement(s)`;

    if (list.length === 0) {

        history.innerHTML = '<div class="empty">Aucun résultat</div>';
        return;

    }

    list.forEach(item => {
        const icon =
item.type==="sms"
?
"💬"
:
item.status==="missed"
?
"❌"
:
item.status==="answered"
?
"🟢"
:
item.status==="ended"
?
"☎️"
:
"📞";

        history.innerHTML += `

<div class="card">

    <div class="top">

        <div style="
display:flex;
justify-content:space-between;
align-items:center;">

<div style="
font-size:32px;">
${icon}
</div>

${badge(item)}

</div>

    </div>

    <div class="name">

        ${item.name || "Numéro inconnu"}

    </div>

    <div class="number">

        ${item.number || ""}

    </div>

    ${
        item.type === "sms"
        ? `<div class="message" style="display:block;">
            ${item.text || ""}
           </div>`
        : ""
    }

    <div class="time">

        🕒 ${formatTime(item.time)}

    </div>

</div>

`;

    });

}

onValue(ref(db, "calls"), snapshot => {

    const data = snapshot.val();

    if (!data) {

        allEvents = [];
        render([]);
        return;

    }

    allEvents = Object.values(data);

    allEvents.sort((a, b) => Number(b.time) - Number(a.time));

    render(allEvents);

});

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = allEvents.filter(item => {

        const name = (item.name || "").toLowerCase();

        const number = (item.number || "").toLowerCase();

        return name.includes(value) || number.includes(value);

    });

    render(filtered);

});
