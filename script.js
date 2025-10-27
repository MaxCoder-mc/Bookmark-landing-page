// ======= Menu (nav) =======
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");
const menuImg = menuToggle.querySelector("img");
const brandLogo = document.querySelector(".brand-logo img");
const overlay = document.getElementById("pageOverlay");
const headerNav = document.getElementById("header-nav");
const socialLinks = document.querySelector(".nav .social-links");

function openMenu() {
  menuImg.src = "./images/icon-close.svg";
  menuToggle.setAttribute("aria-label", "Close menu");
  menuToggle.setAttribute("aria-expanded", "true");
  brandLogo.src = "./images/logo-bookmark-light.svg";
  headerNav.setAttribute("aria-hidden", "false");

  nav.classList.add("nav-panel");
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  socialLinks.classList.remove("hidden");
  socialLinks.setAttribute("aria-hidden", "false");

  // move focus into nav
  const firstLink = headerNav.querySelector("a");
  firstLink?.focus();
}

function closeMenu() {
  menuImg.src = "./images/icon-hamburger.svg";
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.setAttribute("aria-expanded", "false");
  brandLogo.src = "./images/logo-bookmark.svg";
  headerNav.setAttribute("aria-hidden", "true");

  nav.classList.remove("nav-panel");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  socialLinks.classList.add("hidden");
  socialLinks.setAttribute("aria-hidden", "true");

  menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  if (nav.classList.contains("nav-panel")) closeMenu();
  else openMenu();
});

// close on overlay click & Escape
overlay.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("nav-panel")) closeMenu();
});

// close when clicking a link (delegated)
headerNav.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});

// close on resize to large screens
function handleResize() {
  if (window.innerWidth >= 1200) closeMenu();
}
window.addEventListener("resize", handleResize, { passive: true });

// ======= Tabs (ARIA + keyboard) =======
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[id^="panel-"]'));

function activateTab(index, setFocus = true) {
  tabs.forEach((t, i) => {
    const selected = i === index;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    t.classList.toggle("active", selected);

    const panel = panels[i];
    if (panel) {
      panel.classList.toggle("active", selected);
      panel.hidden = !selected;
    }
  });
  if (setFocus) tabs[index].focus();
}

tabs.forEach((tab, idx) => {
  tab.addEventListener("click", () => activateTab(idx, false));

  tab.addEventListener("keydown", (e) => {
    const key = e.key;
    let newIndex = idx;
    if (key === "ArrowRight") newIndex = (idx + 1) % tabs.length;
    else if (key === "ArrowLeft")
      newIndex = (idx - 1 + tabs.length) % tabs.length;
    else if (key === "Home") newIndex = 0;
    else if (key === "End") newIndex = tabs.length - 1;
    else return;

    e.preventDefault();
    activateTab(newIndex);
  });
});

// ensure panels reflect initial active class
panels.forEach((p, i) => {
  p.hidden = !p.classList.contains("active");
});

// ======= FAQ accordion =======
const faqButtons = Array.from(document.querySelectorAll(".faq-question"));
faqButtons.forEach((btn) => {
  const answerId = btn.getAttribute("aria-controls");
  const answer = document.getElementById(answerId);

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    if (answer) {
      answer.setAttribute("aria-hidden", String(expanded));
    }
    btn.closest(".faq-item")?.classList.toggle("active", !expanded);
  });

  // support Enter / Space activation
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
});

// ======= Email validation =======
const ctaForm = document.getElementById("ctaForm");
const emailInput = document.getElementById("email");
const errorMsg = document.getElementById("error-message");
const errorIcon = document.querySelector(".error-icon");
const inputGroup = document.getElementById("inputGroup");

ctaForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const valid = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email);

  if (!valid) {
    emailInput.classList.add("error");
    inputGroup.classList.add("error");
    emailInput.setAttribute("aria-invalid", "true");
    errorMsg.textContent = "Whoops, make sure it’s an email";
    errorMsg.setAttribute("aria-hidden", "false");
    errorIcon.style.display = "inline-block";
    errorMsg.style.display = "block";
    // focus the input so screen reader user hears message
    emailInput.focus();
  } else {
    emailInput.classList.remove("error");
    inputGroup.classList.remove("error");
    emailInput.removeAttribute("aria-invalid");
    errorMsg.textContent = "";
    errorMsg.setAttribute("aria-hidden", "true");
    errorIcon.style.display = "none";
    errorMsg.style.display = "none";

    // handle submit (uncomment if you want native submit)
    // ctaForm.submit();
    console.log("Form valid — submit here");
  }
});
