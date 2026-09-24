/* ==========================================================================
   DAVENPORT BOOKS — script.js

   WHAT THIS FILE DOES
   0.  FORM_CONFIG          <-- settings for the contact form (EDIT ME)
   0b. NEWSLETTER_CONFIG    <-- settings for the newsletter signup (EDIT ME)
   1.  Mobile menu          opens/closes the menu on small screens
   2.  Footer year          keeps the copyright year up to date
   3.  Scroll reveal        fades sections in as you scroll
   4.  Active link          highlights the menu link for the section you're viewing
   5.  Service multi-select ticks checkboxes in the contact form, and lets
                            service-card links pre-tick a matching checkbox
   6.  Contact form         handles the form submit (with honeypot check)
   7.  Newsletter signup    handles the footer newsletter (with honeypot check)

   Everything is plain JavaScript: no libraries, no build step.
   ========================================================================== */

"use strict";


/* ==========================================================================
   0. CONTACT FORM SETTINGS  (EDIT ME)

   mode decides what happens when someone presses "Send message":

   "mailto"   Opens the visitor's email app with the message already written,
              addressed to the email below. Works right now with no backend.
              (Limitation: it only works if the visitor has an email app set up.)

   "endpoint" Sends the form to an online form service (Formspree, Web3Forms,
              and similar). Paste the address they give you into `endpoint`
              below. See README.md, "Connect the contact form".

   "demo"     Sends nothing. Shows a message saying the form isn't connected.
              Handy while you're still building the site.
   ========================================================================== */
const FORM_CONFIG = {
  mode: "mailto",                                   // "mailto", "endpoint", or "demo"
  email: "jeffrey.davenport.000@gmail.com",         // where "mailto" messages go
  subject: "New enquiry from the Davenport Books website",
  endpoint: ""                                      // e.g. "https://formspree.io/f/your-form-id"
};


/* ==========================================================================
   0b. NEWSLETTER SETTINGS  (EDIT ME)

   Same three modes as the contact form:
     "mailto"   Opens the visitor's email app with a subscribe request
                addressed to the email below. Works right now, no backend.
     "endpoint" Sends the email to a newsletter service (Buttondown,
                MailerLite, Mailchimp, etc.). Paste their URL into endpoint.
     "demo"     Shows a "not connected yet" message.
   ========================================================================== */
const NEWSLETTER_CONFIG = {
  mode: "mailto",                                   // "mailto", "endpoint", or "demo"
  email: "jeffrey.davenport.000@gmail.com",         // where "mailto" requests go
  subject: "Newsletter signup from the Davenport Books website",
  endpoint: ""                                      // e.g. "https://buttondown.email/api/emails/embed-subscribe/your-username"
};


/* ==========================================================================
   1. MOBILE MENU
   The button (.nav-toggle) shows or hides the menu (#site-nav) on phones.
   The CSS does the visual work; this code flips a class and updates the
   aria-expanded attribute so screen readers know if the menu is open.
   ========================================================================== */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

function setMenuOpen(isOpen) {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  siteNav.classList.toggle("is-open", isOpen);
}

if (navToggle && siteNav) {
  // Click the button: open if closed, close if open
  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  // Choosing a link closes the menu
  siteNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  // Pressing Escape closes the menu and returns focus to the button
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  // If the window grows to desktop size, reset the menu
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (event) {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}


/* ==========================================================================
   2. FOOTER YEAR
   Fills <span id="year"> with the current year.
   ========================================================================== */
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ==========================================================================
   3. SCROLL REVEAL
   Any element with class="reveal" fades in the first time it scrolls into view.
   To stop an element animating, remove class="reveal" from it in the HTML.
   ========================================================================== */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);          // only animate once
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  // Very old browsers: just show everything
  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });
}


/* ==========================================================================
   4. ACTIVE MENU LINK
   Highlights the menu link for the section currently in the middle of the
   screen. Menu links are matched to sections by their href (#services, etc.).
   ========================================================================== */
const menuLinks = Array.from(document.querySelectorAll(".nav-list a"));
const sectionToLink = new Map();

menuLinks.forEach(function (link) {
  const href = link.getAttribute("href") || "";
  const hash = href.indexOf("#");
  if (hash === -1) return;
  const id = href.slice(hash + 1);
  if (!id) return;
  const section = document.getElementById(id);
  if (section) {
    sectionToLink.set(section, link);
  }
});

if ("IntersectionObserver" in window && sectionToLink.size > 0) {
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        menuLinks.forEach(function (link) {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        });

        const activeLink = sectionToLink.get(entry.target);
        if (activeLink) {
          activeLink.classList.add("is-active");
          activeLink.setAttribute("aria-current", "true");
        }
      });
    },
    // Only counts a section as "current" when it crosses the middle of the screen
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sectionToLink.forEach(function (link, section) {
    sectionObserver.observe(section);
  });
}


/* ==========================================================================
   5. SERVICE MULTI-SELECT  +  SERVICE LINKS -> FORM
   - The trigger button toggles a dropdown panel of checkboxes.
   - The chips / summary above the trigger reflect what is selected.
   - Links with data-service="..." (the service card links) tick the
     matching checkbox and refresh the display.
   ========================================================================== */
const serviceMultiselect = document.getElementById("service-multiselect");
const serviceTrigger     = document.getElementById("cf-service-trigger");
const servicePanel       = document.getElementById("cf-service-panel");
const serviceValue       = document.getElementById("cf-service-value");

const serviceCheckboxes = serviceMultiselect
  ? Array.from(serviceMultiselect.querySelectorAll('input[name="service"]'))
  : [];

// Returns the values of every ticked checkbox, in DOM order.
function getSelectedServices() {
  return serviceCheckboxes
    .filter(function (cb) { return cb.checked; })
    .map(function (cb) { return cb.value; });
}

// Redraws the trigger's chips / placeholder / summary.
function renderServiceValue() {
  if (!serviceValue) return;
  const selected = getSelectedServices();
  serviceValue.innerHTML = "";

  if (selected.length === 0) {
    const span = document.createElement("span");
    span.className = "multiselect-placeholder";
    span.textContent = "Choose services";
    serviceValue.appendChild(span);
    return;
  }

  if (selected.length <= 2) {
    selected.forEach(function (value) {
      const chip = document.createElement("span");
      chip.className = "multiselect-chip";
      chip.textContent = value;
      serviceValue.appendChild(chip);
    });
  } else {
    const summary = document.createElement("span");
    summary.className = "multiselect-summary";
    summary.textContent = selected.length + " services selected";
    serviceValue.appendChild(summary);
  }
}

function setServicePanelOpen(isOpen) {
  if (!serviceTrigger || !servicePanel) return;
  serviceTrigger.setAttribute("aria-expanded", String(isOpen));
  servicePanel.hidden = !isOpen;
}

if (serviceMultiselect && serviceTrigger && servicePanel) {
  renderServiceValue();

  // Open / close on trigger click
  serviceTrigger.addEventListener("click", function () {
    const isOpen = serviceTrigger.getAttribute("aria-expanded") === "true";
    setServicePanelOpen(!isOpen);
  });

  // Refresh chips whenever a checkbox changes
  serviceCheckboxes.forEach(function (cb) {
    cb.addEventListener("change", renderServiceValue);
  });

  // Clicking outside closes the dropdown
  document.addEventListener("click", function (event) {
    if (!serviceMultiselect.contains(event.target)) {
      setServicePanelOpen(false);
    }
  });

  // Escape closes and returns focus to the trigger
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      serviceTrigger.getAttribute("aria-expanded") === "true"
    ) {
      setServicePanelOpen(false);
      serviceTrigger.focus();
    }
  });

  // If the form is reset (e.g. after a successful endpoint submit), refresh chips
  const formForReset = document.getElementById("contact-form");
  if (formForReset) {
    formForReset.addEventListener("reset", function () {
      setTimeout(renderServiceValue, 0);
    });
  }
}

// Service card links tick the matching checkbox
document.querySelectorAll("[data-service]").forEach(function (link) {
  link.addEventListener("click", function () {
    if (!serviceMultiselect) return;

    const wanted = link.getAttribute("data-service");
    const matching = serviceCheckboxes.filter(function (cb) {
      return cb.value === wanted;
    });

    if (matching.length > 0) {
      matching.forEach(function (cb) { cb.checked = true; });
      renderServiceValue();
    }
  });
});


/* ==========================================================================
   6. CONTACT FORM
   BACKEND CONNECTION POINT: this is where the form is handled.
   Which branch runs depends on FORM_CONFIG.mode at the top of this file.
   ========================================================================== */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Shows a message under the button. type is "success", "error", or "" (neutral).
function showFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = "form-status" + (type ? " is-" + type : "");
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async function (event) {
    // Stop the browser's normal form submit. The browser has already checked
    // the "required" fields by the time we get here.
    event.preventDefault();

    const formData = new FormData(contactForm);

    // Honeypot check: real visitors never fill this. If it has a value,
    // this is almost certainly a bot — pretend to succeed and stop.
    if (formData.get("website")) {
      showFormStatus("Thank you! Your message has been sent.", "success");
      return;
    }

    const services = formData.getAll("service");
    const values = Object.fromEntries(formData.entries());
    const submitButton = contactForm.querySelector("button[type='submit']");

    // The checkboxes are not marked `required` individually, so validate here.
    if (services.length === 0) {
      showFormStatus("Please choose at least one service.", "error");
      if (serviceTrigger) serviceTrigger.focus();
      return;
    }

    /* ---------- Mode: "mailto" (opens the visitor's email app) ---------- */
    if (FORM_CONFIG.mode === "mailto") {
      const body =
        "Name: " + values.name + "\n" +
        "Email: " + values.email + "\n" +
        "Needs help with: " + services.join(", ") + "\n\n" +
        "Message:\n" + values.message;

      window.location.href =
        "mailto:" + FORM_CONFIG.email +
        "?subject=" + encodeURIComponent(FORM_CONFIG.subject) +
        "&body=" + encodeURIComponent(body);

      showFormStatus(
        "Your email app should open with your message ready to send. " +
        "If it doesn't, please email " + FORM_CONFIG.email + " directly.",
        "success"
      );
      return;
    }

    /* ---------- Mode: "endpoint" (sends to an online form service) ---------- */
    if (FORM_CONFIG.mode === "endpoint" && FORM_CONFIG.endpoint) {
      submitButton.disabled = true;
      showFormStatus("Sending...", "");

      try {
        const response = await fetch(FORM_CONFIG.endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error("The form service returned status " + response.status);
        }

        contactForm.reset();
        showFormStatus("Thank you! Your message has been sent.", "success");
      } catch (error) {
        console.error("Form error:", error);
        showFormStatus(
          "Sorry, something went wrong. Please try again or email " +
          FORM_CONFIG.email + " directly.",
          "error"
        );
      } finally {
        submitButton.disabled = false;
      }
      return;
    }

    /* ---------- Mode: "demo" (or "endpoint" with no address set) ---------- */
    showFormStatus(
      "Demo mode: this form isn't connected yet, so nothing was sent. " +
      "See README.md to connect it.",
      ""
    );
  });
}


/* ==========================================================================
   7. NEWSLETTER SIGNUP
   Same pattern as the contact form. Silently does nothing on pages where
   the newsletter form isn't present.
   ========================================================================== */
const newsletterForm = document.getElementById("newsletter-form");
const newsletterStatus = document.getElementById("newsletter-status");

function showNewsletterStatus(message, type) {
  if (!newsletterStatus) return;
  newsletterStatus.textContent = message;
  newsletterStatus.className = "form-status" + (type ? " is-" + type : "");
}

if (newsletterForm && newsletterStatus) {
  newsletterForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(newsletterForm);

    // Honeypot check (same idea as the contact form)
    if (formData.get("website")) {
      showNewsletterStatus("Thanks — you're on the list.", "success");
      return;
    }

    const email = (formData.get("email") || "").trim();
    const submitButton = newsletterForm.querySelector("button[type='submit']");

    if (!email) {
      showNewsletterStatus("Please enter your email address.", "error");
      return;
    }

    /* ---------- Mode: "mailto" ---------- */
    if (NEWSLETTER_CONFIG.mode === "mailto") {
      const body =
        "Please add me to the Davenport Books newsletter list.\n\n" +
        "Email: " + email;

      window.location.href =
        "mailto:" + NEWSLETTER_CONFIG.email +
        "?subject=" + encodeURIComponent(NEWSLETTER_CONFIG.subject) +
        "&body=" + encodeURIComponent(body);

      showNewsletterStatus(
        "Your email app should open to confirm. If it doesn't, email " +
        NEWSLETTER_CONFIG.email + " directly.",
        "success"
      );
      return;
    }

    /* ---------- Mode: "endpoint" ---------- */
    if (NEWSLETTER_CONFIG.mode === "endpoint" && NEWSLETTER_CONFIG.endpoint) {
      submitButton.disabled = true;
      showNewsletterStatus("Subscribing...", "");

      try {
        const response = await fetch(NEWSLETTER_CONFIG.endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error("Newsletter service returned status " + response.status);
        }

        newsletterForm.reset();
        showNewsletterStatus("Thanks — you're on the list.", "success");
      } catch (error) {
        console.error("Newsletter error:", error);
        showNewsletterStatus(
          "Sorry, something went wrong. Please try again or email " +
          NEWSLETTER_CONFIG.email + ".",
          "error"
        );
      } finally {
        submitButton.disabled = false;
      }
      return;
    }

    /* ---------- Mode: "demo" ---------- */
    showNewsletterStatus("Demo mode: newsletter isn't connected yet.", "");
  });
}
