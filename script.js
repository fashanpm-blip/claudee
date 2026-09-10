(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("primary-nav");

  if (navToggle && header && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Открыть меню");
      }
    });
  }

  // Booking form
  var form = document.getElementById("bookingForm");
  if (!form) return;

  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  var validators = {
    name: function (value) {
      return value.trim().length >= 2 ? "" : "Укажи имя (минимум 2 символа)";
    },
    contact: function (value) {
      return value.trim().length >= 5 ? "" : "Оставь Telegram, телефон или e-mail для связи";
    },
    topic: function (value) {
      return value ? "" : "Выбери направление";
    }
  };

  function showFieldError(field, message) {
    var input = document.getElementById(field);
    var errorEl = document.getElementById(field + "Error");
    if (!input || !errorEl) return;
    errorEl.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(field) {
    var input = document.getElementById(field);
    if (!input || !validators[field]) return true;
    var message = validators[field](input.value);
    showFieldError(field, message);
    return !message;
  }

  ["name", "contact", "topic"].forEach(function (field) {
    var input = document.getElementById(field);
    if (input) {
      input.addEventListener("blur", function () {
        validateField(field);
      });
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var isValid = ["name", "contact", "topic"].reduce(function (acc, field) {
      return validateField(field) && acc;
    }, true);

    if (!isValid) {
      status.textContent = "Проверь поля, отмеченные красным.";
      status.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Отправляем...";
    status.textContent = "";
    status.className = "form-status";

    // No backend is connected yet — this simulates submission locally.
    // Replace with a real request (fetch to your API / form service) when ready.
    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").textContent = "Отправить заявку";
      status.textContent = "Заявка получена! Я свяжусь с тобой в ближайшее время.";
      status.className = "form-status success";
      form.reset();
    }, 700);
  });
})();
