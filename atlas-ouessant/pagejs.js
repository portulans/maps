var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("activetab");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

function setupResponsiveNavbar() {
  var responsiveBreakpoint = 900;

  var header = document.querySelector(".header");
  var nav = header ? header.querySelector(".header-right") : null;

  if (!header || !nav) {
    return;
  }

  var toggle = header.querySelector(".nav-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span class="nav-toggle__icon" aria-hidden="true"></span>';
    header.insertBefore(toggle, nav);
  }

  function closeNav() {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    var openDropdowns = header.querySelectorAll(".dropdown.is-open");
    openDropdowns.forEach(function (el) {
      el.classList.remove("is-open");
    });
  }

  toggle.addEventListener("click", function () {
    var isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    if (!header.contains(event.target)) {
      closeNav();
    }
  });

  var dropdownLinks = header.querySelectorAll(".dropdown > .dropbtn");
  dropdownLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (window.innerWidth > responsiveBreakpoint) {
        return;
      }

      event.preventDefault();
      var dropdown = link.parentElement;
      var isOpen = dropdown.classList.contains("is-open");

      var openDropdowns = header.querySelectorAll(".dropdown.is-open");
      openDropdowns.forEach(function (el) {
        el.classList.remove("is-open");
      });

      if (!isOpen) {
        dropdown.classList.add("is-open");
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > responsiveBreakpoint) {
      closeNav();
    }
  });
}

setupResponsiveNavbar();