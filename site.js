const mobile = matchMedia("(max-width: 760px)");
const menu = document.querySelector(".menu");
const navigation = document.querySelector("#navigation");

function setMenu(open = false) {
  menu.hidden = !mobile.matches;
  menu.setAttribute("aria-expanded", String(mobile.matches && open));
  navigation.hidden = mobile.matches && !open;
}

setMenu();
mobile.addEventListener("change", () => setMenu());
menu.addEventListener("click", () => setMenu(navigation.hidden));
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobile.matches && !navigation.hidden) {
    setMenu();
    menu.focus();
  }
});

const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const tasks = [...document.querySelectorAll(".todo input")];
const replay = document.querySelector("#replay");
const taskStatus = document.querySelector("#task-status");
let taskTimers = [];

function updateTasks() {
  const done = tasks.every((task) => task.checked);
  taskStatus.textContent = done ? "Consider it handled." : "";
}

function cancelTasks() {
  taskTimers.forEach(clearTimeout);
  taskTimers = [];
}

function playTasks() {
  cancelTasks();
  tasks.forEach((task, index) => {
    task.checked = motionPreference.matches;
    if (!motionPreference.matches) {
      taskTimers.push(setTimeout(() => {
        task.checked = true;
        updateTasks();
      }, 550 + index * 650));
    }
  });
  updateTasks();
}

tasks.forEach((task) => task.addEventListener("change", () => {
  cancelTasks();
  updateTasks();
}));
replay.hidden = false;
replay.addEventListener("click", playTasks);
playTasks();

const heroArt = document.querySelector(".hero-art");
function setMotion() {
  document.documentElement.classList.toggle("motion", !motionPreference.matches);
  if (motionPreference.matches) {
    cancelTasks();
    heroArt.style.removeProperty("--drift");
  }
}
setMotion();
motionPreference.addEventListener("change", setMotion);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add("in-view");
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.55 });
  document.querySelectorAll(".sort-board, .process ol").forEach((target) => observer.observe(target));
} else {
  document.querySelectorAll(".sort-board, .process ol").forEach((target) => target.classList.add("in-view"));
}
let frame = 0;
window.addEventListener("scroll", () => {
  if (motionPreference.matches || mobile.matches || frame || scrollY > 850) return;
  frame = requestAnimationFrame(() => {
    heroArt.style.setProperty("--drift", Math.min(scrollY * 0.055, 23) + "px");
    frame = 0;
  });
}, { passive: true });

const sampleDescriptions = {
  forms: "An intake form that collects the project details you need before you start.",
  newsletter: "A newsletter layout with room for an opening note, a featured story and business updates.",
  event: "An invitation concept for a fundraiser, with matching materials for the event itself.",
  landing: "A one-page event site that gives visitors the details and a clear place to register.",
  resources: "A short downloadable workbook with prompts and room to write down a next step.",
  documents: "An event run of show that keeps the schedule, responsibilities and handoffs in one place."
};
const dialog = document.querySelector("#sample-dialog");
let sampleTrigger;
document.querySelectorAll(".sample").forEach((button) => {
  button.addEventListener("click", () => {
    sampleTrigger = button;
    dialog.className = button.classList[1];
    document.querySelector("#sample-title").textContent = button.querySelector(".sample-label").firstChild.textContent.trim();
    document.querySelector("#sample-preview").replaceChildren(button.querySelector(".sample-paper").cloneNode(true));
    document.querySelector("#sample-description").textContent = sampleDescriptions[button.dataset.sample];
    dialog.showModal();
  });
});
dialog.addEventListener("close", () => sampleTrigger?.focus());

const inquiry = document.querySelector("#inquiry");
document.querySelector("[data-inquiry]").addEventListener("click", () => {
  inquiry.value = "starter";
});
document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const subject = fields.get("inquiry") === "starter" ? "$97 Starter Project inquiry" : "MT Creative Consulting inquiry";
  const body = [
    "Name: " + fields.get("name").trim(),
    "Email: " + fields.get("email").trim(),
    "",
    fields.get("message").trim()
  ].join("\r\n");
  document.querySelector("#form-status").textContent = "Send the prepared message from your email app when you're ready.";
  window.location.href = "mailto:hello@mtcreativeconsulting.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
});
document.querySelector("#year").textContent = new Date().getFullYear();
