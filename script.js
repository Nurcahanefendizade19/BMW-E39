window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");

let mx = 0,
  my = 0;
let rx = 0,
  ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
});

function animate() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll("a, button, li").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    ring.style.width = "54px";
    ring.style.height = "54px";
  });
  el.addEventListener("mouseleave", () => {
    ring.style.width = "35px";
    ring.style.height = "35px";
  });
});

//CAROUSEL//

document.addEventListener("DOMContentLoaded", function () {
  const cards = [
    {
      bg: "#534AB7",
      tag: "#CECBF6",
      tagText: "#3C3489",
      title: "BMW E39 - ƏFSANƏNİN BAŞLANĞICI",
      desc: "Klassik dizayn və gücün mükəmməl balansıç hər baxışda tarix hiss olunur.",
      icon: "◈",
    },
    {
      bg: "#0F6E56",
      tag: "#9FE1CB",
      tagText: "#085041",
      title: "Saf Alman dəqiqliyi",
      desc: "E39 hər detalında mühəndislik sənətini və keyfiyyətin nümayiş etdirir.",
      icon: "⚡",
    },
    {
      bg: "#993C1D",
      tag: "#F5C4B3",
      tagText: "#4A1B0C",
      title: "Yolun kralı",
      desc: "Sükan arxasında otur və hiss et - bu maşın sadəcə sürülmür, idarə olunur.",
      icon: "◎",
    },
    {
      bg: "#185FA5",
      tag: "#B5D4F4",
      tagText: "#042C53",
      title: "Klassik amma hələdə güclü",
      desc: "Yumşaq sürüş, güclü mühərrik və unudulmaz sürmə təcrübəsi.",
      icon: "◉",
    },
    {
      bg: "#854F0B",
      tag: "#FAC775",
      tagText: "#412402",
      title: "Komfort və performans bir yerdə",
      desc: "Mükəmməl oxunaqlılıq üçün növ seçimi və ölçü nisbəti.",
      icon: "Aa",
    },
    {
      bg: "#A32D2D",
      tag: "#F7C1C1",
      tagText: "#501313",
      title: "Əsl BMw ruhu",
      desc: "E39 - Sürətç prestij və xarakterin tək bir avtomobildə birləşməsi.",
      icon: "◑",
    },
  ];

  let cur = 0,
    paused = false,
    timer;
  const track = document.getElementById("track");
  const dotsEl = document.getElementById("dots");

  function buildDots() {
    dotsEl.innerHTML = "";
    cards.forEach((_, i) => {
      const d = document.createElement("div");
      d.className = "dot" + (i === cur ? " active" : "");
      d.style.background = i === cur ? cards[cur].bg : "";
      d.onclick = () => goTo(i);
      dotsEl.appendChild(d);
    });
  }

  function render() {
    track.innerHTML = "";
    [-1, 0, 1].forEach((pos) => {
      const idx = (((cur + pos) % cards.length) + cards.length) % cards.length;
      const c = cards[idx];
      const div = document.createElement("div");
      div.className = "card";
      const isCenter = pos === 0;
      const scale = isCenter ? 1 : 0.72;
      const tx = pos * 210;
      const tz = isCenter ? 0 : -90;
      const opacity = isCenter ? 1 : 0.45;
      const ry = isCenter ? 0 : pos < 0 ? 18 : -18;
      div.style.cssText = `background:${c.bg};left:50%;top:50%;transform:translateX(calc(-50% + ${tx}px)) translateY(-50%) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale});opacity:${opacity};z-index:${isCenter ? 10 : 5};filter:${isCenter ? "none" : "saturate(0.5) brightness(0.85)"};color:#fff;box-shadow:${isCenter ? "0 24px 48px rgba(0,0,0,0.25)" : "none"};`;
      div.innerHTML = `
        <div class="card-inner">
          <div class="card-tag" style="background:${c.tag};color:${c.tagText}">${c.icon} &nbsp; Kart ${idx + 1}</div>
          <p class="card-title" style="color:#fff">${c.title}</p>
          <p class="card-desc" style="color:rgba(255,255,255,0.75)">${c.desc}</p>
        </div>
        <div class="card-footer">
          <span class="card-num">${idx + 1} / ${cards.length}</span>
          <div class="card-arrow">&#8594;</div>
        </div>`;
      div.addEventListener("click", () =>
        goTo(isCenter ? (cur + 1) % cards.length : idx),
      );
      track.appendChild(div);
    });
    buildDots();
  }

  function goTo(idx) {
    cur = ((idx % cards.length) + cards.length) % cards.length;
    render();
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    if (!paused)
      timer = setInterval(() => goTo((cur + 1) % cards.length), 3000);
  }

  document.getElementById("prev").onclick = () =>
    goTo((cur - 1 + cards.length) % cards.length);
  document.getElementById("next").onclick = () =>
    goTo((cur + 1) % cards.length);

  const wrap = document.getElementById("wrap");
  wrap.addEventListener("mouseenter", () => {
    paused = true;
    clearInterval(timer);
  });
  wrap.addEventListener("mouseleave", () => {
    paused = false;
    resetTimer();
  });

  let ts;
  wrap.addEventListener(
    "touchstart",
    (e) => {
      ts = e.touches[0].clientX;
    },
    { passive: true },
  );
  wrap.addEventListener("touchend", (e) => {
    const diff = ts - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40)
      goTo(
        diff > 0
          ? (cur + 1) % cards.length
          : (cur - 1 + cards.length) % cards.length,
      );
  });

  render();
  resetTimer();
});

//SLIDER 2//
const slides = document.querySelectorAll(".slide");
const infos = document.querySelectorAll(".info-item");
const dots = document.querySelectorAll(".dot");
let cur = 1,
  busy = false;
const n = slides.length;

function cls(i) {
  const d = (i - cur + n) % n;
  if (d === 0) return "center";
  if (d === 1) return "sright";
  if (d === n - 1) return "sleft";
  if (d === 2) return "hideright";
  return "hideleft";
}

function render() {
  slides.forEach((s, i) => {
    s.className = "slide " + cls(i);
  });
  infos.forEach((inf, i) => {
    inf.classList.toggle("active", i === cur);
  });
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === cur);
  });
}

function go(idx) {
  if (busy) return;
  busy = true;
  cur = (idx + n) % n;
  render();
  setTimeout(() => {
    busy = false;
  }, 800);
}

let auto = setInterval(() => go(cur + 1), 3500);
function resetAuto() {
  clearInterval(auto);
  auto = setInterval(() => go(cur + 1), 3500);
}

slides.forEach((s, i) => {
  s.addEventListener("click", () => {
    if (i !== cur) {
      go(i);
      resetAuto();
    }
  });
});
dots.forEach((d) => {
  d.addEventListener("click", () => {
    go(+d.dataset.d);
    resetAuto();
  });
});

let tx = 0;
document.querySelector(".gallery").addEventListener(
  "touchstart",
  (e) => {
    tx = e.touches[0].clientX;
  },
  { passive: true },
);
document.querySelector(".gallery").addEventListener(
  "touchend",
  (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) {
      go(cur + (dx < 0 ? 1 : -1));
      resetAuto();
    }
  },
  { passive: true },
);
//SLIDER BITDI//

/*REFRESH NONE */
document.querySelector(".form").addEventListener("submit", function (e) {
  e.preventDefault();
});
/*BRAND*/
const devName = document.querySelector(".dev-name");
const devText = document.querySelector(".dev-text");

const brandObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        devName.style.animation = "none";
        devText.style.animation = "none";
        devName.style.opacity = "0";
        devText.style.opacity = "0";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            devText.style.animation = "fadeInSlow 2s ease forwards";
            devName.style.animation = "luxuryGlow 3s ease 0.5s forwards";
          });
        });
      }
    });
  },
  { threshold: 0.3 },
);

brandObserver.observe(document.querySelector(".elaqe"));
