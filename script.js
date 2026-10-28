/* Interactions et préparation des demandes WhatsApp */
(() => {
  "use strict";

  // Numéro fourni par l'établissement, au format international sans espaces.
  const WHATSAPP_NUMBER = "2250705021780";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        nav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        nav.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const whatsappUrl = message =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    link.href = whatsappUrl("Bonjour CARE BEAUTY BY MARY, je souhaite obtenir des informations sur vos prestations et prendre rendez-vous.");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const dateInput = document.querySelector("#date");
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    dateInput.min = localToday;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  const serviceSelect = document.querySelector("#service");
  if (requestedService && serviceSelect) {
    const match = Array.from(serviceSelect.options).find(option =>
      option.text.toLowerCase() === requestedService.toLowerCase()
    );
    if (match) serviceSelect.value = match.value;
    else if (/visage/i.test(requestedService)) serviceSelect.value = "Soin du visage";
    else if (/manucure|ongle/i.test(requestedService)) serviceSelect.value = "Manucure";
    else if (/beauté|beaute/i.test(requestedService)) serviceSelect.value = "Rituel beauté";
  }

  const form = document.querySelector("#booking-form");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const service = String(data.get("service") || "").trim();
      const date = String(data.get("date") || "").trim();
      const time = String(data.get("time") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const message = String(data.get("message") || "").trim();
      const feedback = document.querySelector("#form-feedback");

      if (!name || !service || !date || !time) {
        if (feedback) feedback.textContent = "Veuillez remplir les champs obligatoires.";
        return;
      }

      const dateFormatted = new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
      const lines = [
        "Bonjour CARE BEAUTY BY MARY, je souhaite demander un rendez-vous.",
        "",
        `Nom : ${name}`,
        phone ? `Téléphone : ${phone}` : null,
        `Soin souhaité : ${service}`,
        `Date souhaitée : ${dateFormatted}`,
        `Heure souhaitée : ${time}`,
        message ? `Précisions : ${message}` : null,
        "",
        "Merci de me confirmer vos disponibilités."
      ].filter(Boolean);

      if (feedback) feedback.textContent = "WhatsApp va s'ouvrir avec votre demande. Envoyez le message pour nous contacter.";
      window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
    });
  }
})();
