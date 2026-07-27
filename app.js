import { db, ref, onValue } from "./firebase.js";

const history = document.getElementById("history");
const stats = document.getElementById("stats");
const search = document.getElementById("search");

let allEvents = [];
let initialized = false;

// ---------- Sons ----------
const callSound = new Audio("sounds/call.mp3");
const smsSound = new Audio("sounds/sms.mp3");

// ---------- Badge ----------
function badge(item) {

    if (item.type === "sms") {
        return '<span class="badge sms">💬 SMS reçu</span>';
    }

    switch (item.status) {

        case "ringing":
            return '<span class="badge call">📞 Appel entrant</span>';

        case "ended":
            return '<span class="badge answered">☎️ Appel terminé</span>';

        case "missed":
            return '<span class="badge missed">❌ Appel manqué</span>';

        default:
            return '<span class="badge call">📞 Appel</span>';
    }
}

// ---------- Icône ----------
function icon(item) {

    if (item.type === "sms") return "💬";

    switch (item.status) {

        case "ringing":
            return "📞";

        case "ended":
            return "☎️";

        case "missed":
            return "❌";

        default:
            return "📞";
    }
}

// ---------- Date ----------
function formatTime(timestamp) {

    if (!timestamp) return "";

    return new Date(Number(timestamp) * 1000).toLocaleString("fr-FR");

}

// ---------- Affichage ----------
function render(list) {

    history.innerHTML = "";

    stats.textContent = `${list.length} événement(s)`;

    if (list.length === 0) {

        history.innerHTML =
        `<div class="empty">
            Aucun événement
        </div>`;

        return;
    }

    list.forEach(item => {

        history.innerHTML += `

<div class="card">

    <div class="top">

        <div style="display:flex;align-items:center;gap:12px;">

            <div style="font-size:34px;">
                ${icon(item)}
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

// ---------- Firebase ----------
onValue(ref(db, "events"), snapshot => {

    const data = snapshot.val();

    if (!data) {

        allEvents = [];
        render([]);
        return;

    }

    const previousCount = allEvents.length;

    allEvents = Object.values(data);

    allEvents.sort((a, b) => Number(b.time) - Number(a.time));

    // Nouveau événement
    if (initialized && allEvents.length > previousCount) {

        const newest = allEvents[0];

        if (newest.type === "sms") {

            smsSound.play().catch(() => {});

        } else {

            callSound.play().catch(() => {});

        }

        // Animation
        document.body.animate(
            [
                { opacity: 0.75 },
                { opacity: 1 }
            ],
            {
                duration: 300
            }
        );

    }

    initialized = true;

    render(allEvents);

});

// ---------- Recherche ----------
search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = allEvents.filter(item => {

        const name = (item.name || "").toLowerCase();

        const number = (item.number || "").toLowerCase();

        const text = (item.text || "").toLowerCase();

        return (
            name.includes(value) ||
            number.includes(value) ||
            text.includes(value)
        );

    });

    render(filtered);

});
