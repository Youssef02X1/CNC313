/* ============================================
   CNC 313 — Complexe Noreyni Coiffure
   Script principal : script.js
   ============================================ */

// ============================================
// 🔧 CONFIGURATION — À MODIFIER
// ============================================

// Remplacez par votre vrai numéro WhatsApp (sans +, sans espaces)
// Exemple Sénégal : 221771234567
const WA_NUMBER = '221779913729';


// ============================================
// MENU MOBILE
// ============================================

function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}


// ============================================
// NAVIGATION — effet au scroll
// ============================================

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 60) {
    nav.style.padding = '12px 5%';
  } else {
    nav.style.padding = '18px 5%';
  }
});


// ============================================
// CALENDRIER
// ============================================

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril',
  'Mai', 'Juin', 'Juillet', 'Août',
  'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

let currentDate  = new Date();
let selectedDate = null;
let selectedTime = null;

/**
 * Génère et affiche les jours du mois courant
 */
function renderCalendar() {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById('calMonth').textContent =
    `${MONTHS_FR[month]} ${year}`;

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today       = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';

  // Cases vides avant le 1er du mois
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  // Jours du mois
  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(year, month, d);
    const isPast  = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSelected = selectedDate &&
                       date.getTime() === selectedDate.getTime();

    let cls = 'cal-day';
    if (isPast)      cls += ' disabled';
    if (isToday)     cls += ' today';
    if (isSelected)  cls += ' selected';

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    html += `<div class="${cls}" ${
      !isPast
        ? `onclick="selectDate(this, '${dateStr}', ${year}, ${month}, ${d})"`
        : ''
    }>${d}</div>`;
  }

  document.getElementById('calDays').innerHTML = html;
}

/**
 * Sélectionne un jour dans le calendrier
 */
function selectDate(el, dateStr, y, m, d) {
  selectedDate = new Date(y, m, d);
  document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  // Feedback visuel sur mobile
  el.style.transform = 'scale(1.15)';
  setTimeout(() => { el.style.transform = ''; }, 150);
}

// Navigation mois précédent / suivant
document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Initialisation du calendrier au chargement
renderCalendar();


// ============================================
// CRÉNEAUX HORAIRES
// ============================================

/**
 * Sélectionne un créneau horaire
 * @param {HTMLElement} el - L'élément cliqué
 */
function selectTime(el) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedTime = el.textContent.trim();
}


// ============================================
// RÉSERVATION — Envoi vers WhatsApp
// ============================================

/**
 * Valide le formulaire et ouvre WhatsApp avec un message pré-rempli
 */
function sendToWhatsApp() {
  const name    = document.getElementById('clientName').value.trim();
  const phone   = document.getElementById('clientPhone').value.trim();
  const service = document.getElementById('serviceSelect').value;

  // Validations
  if (!name) {
    showToast('⚠️ Veuillez entrer votre nom');
    return;
  }
  if (!service) {
    showToast('⚠️ Veuillez choisir une prestation');
    return;
  }
  if (!selectedDate) {
    showToast('⚠️ Veuillez choisir une date');
    return;
  }
  if (!selectedTime) {
    showToast('⚠️ Veuillez choisir un horaire');
    return;
  }

  // Formatage de la date en français
  const dateStr = selectedDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric'
  });

  // Construction du message WhatsApp
  const msg = `*Bonjour CNC 313 !* 👋

Je souhaite prendre un rendez-vous :

👤 *Nom :* ${name}
📱 *Téléphone :* ${phone || 'Non renseigné'}
✂️ *Prestation :* ${service}
📅 *Date :* ${dateStr}
🕐 *Heure :* ${selectedTime}

Merci de confirmer ma réservation. 🙏`;

  const url = `https://wa.me/${779913729}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}


// ============================================
// ABONNEMENTS — Envoi vers WhatsApp
// ============================================

/**
 * Ouvre WhatsApp avec un message de demande d'abonnement
 * @param {string} plan  - Durée du plan (ex: "6 mois")
 * @param {string} price - Prix du plan (ex: "18 000 FCFA")
 */
function subscribeWhatsApp(plan, price) {
  const msg = `*Bonjour CNC 313 !* 👋

Je suis intéressé(e) par l'*abonnement ${plan}* à *${price}*.

Pouvez-vous me donner plus d'informations et me guider pour souscrire ?

Merci ! 🙏`;

  const url = `https://wa.me/${779913729}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}


// ============================================
// TOAST (notifications légères)
// ============================================

let toastTimer = null;

/**
 * Affiche une notification temporaire en bas de l'écran
 * @param {string} msg     - Texte à afficher
 * @param {number} duration - Durée d'affichage en ms (défaut : 3000)
 */
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}
