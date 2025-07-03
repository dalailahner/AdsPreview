import lorem from "./assets/modules/lorem.js";
import injectAds from "./assets/modules/injectAds.js";
import config from "./config.json" with { type: "json" };

// VARIABLES
const parser = new DOMParser();
const viewport = new Map().set("oldWidth", window.innerWidth);
const promises = [];
const queryString = window.location.search.toUpperCase();
const queryArr = queryString.replace(/[^\w\d-]/g, "").split("-");
const lerpAmount = 0.125;
let scrollPos = 0;

if (window.location.search !== queryString) {
  window.location.search = queryString;
}

setupSite().then(() => {
  console.log("inserting ads...");
  injectAds.inject(queryArr, config).then(() => {
    setTimeout(() => {
      // desktop:
      document.querySelector("#page").scrollTo({ top: injectAds.getTopmostAdPos(), left: 0, behavior: "smooth" });
      // mobile :
      scrollPos = injectAds.getTopmostAdPos();
    }, 750);
  });
});

//___________
// EVENTS
window.addEventListener("handleHeader", (event) => {
  const headerEl = document.querySelector("header");
  if (headerEl.classList.contains("isSticky")) {
    if (event.detail.direction > 0) {
      headerEl.classList.add("hide");
      return;
    }
    if (event.detail.direction < 0) {
      headerEl.classList.remove("hide");
    }
  }
});

window.addEventListener("resize", (event) => {
  viewport.set("newWidth", window.innerWidth);
  if (queryArr.includes("DESKTOP")) {
    if (viewport.get("oldWidth") >= 1024 && viewport.get("newWidth") <= 1024) {
      window.location.reload();
    }
    if (viewport.get("oldWidth") <= 1024 && viewport.get("newWidth") >= 1024) {
      window.location.reload();
    }
  }
  if (queryArr.includes("MOBILE")) {
    if (viewport.get("oldWidth") <= 768 && viewport.get("newWidth") >= 768) {
      window.location.reload();
    }
    if (viewport.get("oldWidth") >= 768 && viewport.get("newWidth") <= 768) {
      window.location.reload();
    }
  }
  viewport.set("oldWidth", viewport.get("newWidth"));
});

// CONSOLE MSG
rainbowLine(31);
consoleTable(config.formate);
rainbowLine(31);
/* prettier-ignore */
console.log(`%cExample for an Understitial ad on salzburg24.at mobile: ${window.location.origin}${window.location.pathname}?S24-MOBILE-US`, "color:#ffffff;background-color:#000933;border:2px solid #FFDD33;padding:0.5rem;font-size:0.875rem");
/* prettier-ignore */
console.log(`%cExample for multiple ads on sn.at desktop: ${window.location.origin}${window.location.pathname}?SN-DESKTOP-BB-HPA-MR`, "color:#ffffff;background-color:#000933;border:2px solid #FFDD33;padding:0.5rem;font-size:0.875rem");
rainbowLine(31);

//___________
// FUNCTIONS
async function _fetch(url, type) {
  console.log(`fetching ${url} ...`);
  const response = await fetch(url);
  promises.push(response);
  if (type === "json") {
    return response.json();
  }
  if (type === "html") {
    const html = await response.text();
    return parser.parseFromString(html, "text/html");
  }
}

async function setupSite() {
  console.log("setupSite started...");
  const isMobileMockup = queryArr.includes("MOBILE") && window.innerWidth >= 768;
  const wrapperDoc = await _fetch(getWrapperURL(), "html");

  if (isMobileMockup) {
    const pageContDoc = await _fetch(`./assets/sites/${queryArr.includes("S24") ? "S24.html" : "SN.html"}`, "html");
    for (const el of pageContDoc.head.children) {
      if (el.tagName === "LINK" || el.tagName === "STYLE") {
        wrapperDoc.head.insertAdjacentHTML("beforeend", el.outerHTML);
      }
    }
    wrapperDoc.querySelector("#pageCont").outerHTML = pageContDoc.body.innerHTML;
  }

  for (const el of wrapperDoc.head.children) {
    if (el.tagName === "LINK" || el.tagName === "STYLE") {
      document.head.insertAdjacentHTML("beforeend", el.outerHTML);
    }
  }

  console.log("inserting target doc in main doc...");
  document.body.innerHTML = wrapperDoc.body.innerHTML;

  lorem.init();

  if (isMobileMockup) {
    const pageEl = document.querySelector("#page");
    const uhrzeitEl = document.querySelector("#uhrzeit");
    const touch = new Map().set("cursor", document.querySelector("#touchCursor"));
    const mobileResizeObserver = new ResizeObserver(() => {
      touch.set("topBarHeight", document.querySelector(".topBar").clientHeight);
      document.querySelector("#pageCont").style.height = `calc(100% - ${touch.get("topBarHeight")}px)`;
      touch.set("maxScroll", pageEl.scrollHeight - pageEl.clientHeight + touch.get("topBarHeight"));
    });
    mobileResizeObserver.observe(pageEl, { box: "border-box" });

    setUhrzeit(uhrzeitEl);
    document.querySelector("#urlBarText").innerText = queryArr.includes("S24") ? "salzburg24.at" : "sn.at";
    setInterval(() => {
      setUhrzeit(uhrzeitEl);
    }, 3e4);

    mobileResizeObserver.observe(document.querySelector(".topBar"), { box: "border-box" });

    mobileScroll(pageEl);

    window.addEventListener("pointermove", (event) => {
      event.preventDefault();
      touch.get("cursor").style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      touch.get("cursor").style.opacity = "0.6";
      if (touch.get("down")) {
        const PosDelta = touch.get("prevPoint") - event.clientY;
        scrollPos += PosDelta << 1;
        if (scrollPos < 0) {
          scrollPos = 0;
        } else if (scrollPos > touch.get("maxScroll")) {
          scrollPos = touch.get("maxScroll");
        }
        touch.set("prevPoint", event.clientY);
      }
    });
    window.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      touch.set("down", true);
      touch.set("prevPoint", event.clientY);
    });
    window.addEventListener("pointerup", (event) => {
      touch.set("down", false);
    });
    window.addEventListener("pointerout", (event) => {
      touch.set("down", false);
      touch.get("cursor").style.opacity = "0";
    });

    window.addEventListener("wheel", (event) => {
      scrollPos += event.deltaY;
      if (scrollPos < 0) {
        scrollPos = 0;
      }
      if (scrollPos > touch.get("maxScroll")) {
        scrollPos = touch.get("maxScroll");
      }
    });
  } else {
    let oldScrollPos = 0;
    document.querySelector("#page").addEventListener("scroll", (event) => {
      const scrollDirection = event.target.scrollTop - oldScrollPos;
      window.dispatchEvent(
        new CustomEvent("handleHeader", {
          detail: {
            direction: scrollDirection,
          },
        }),
      );
      oldScrollPos = event.target.scrollTop;
    });
  }

  const headerStickyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("isSticky", entry.intersectionRatio < 1);
      }
    },
    { root: document.querySelector("#page"), threshold: [1] },
  );
  headerStickyObserver.observe(document.querySelector("header"));

  return Promise.allSettled(promises);
}

function getWrapperURL() {
  const wrapperURL = "./assets/sites/";

  if (queryArr.includes("DESKTOP") && window.innerWidth < 1024) {
    return `${wrapperURL}tooSmall.html${queryString}`;
  }
  if (queryArr.includes("MOBILE") && window.innerWidth >= 768) {
    return `${wrapperURL}mobile.html${queryString}`;
  }
  return `${wrapperURL}${queryArr.includes("S24") ? "S24.html" : "SN.html"}${queryString}`;
}

function setUhrzeit(el) {
  const timestamp = new Date();
  el.innerText = `${timestamp.getHours().toString()}:${timestamp.getMinutes().toString().padStart(2, "0")}`;
}

function mobileScroll(el) {
  const currentScrollPos = el.scrollTop;
  const newScrollPos = (1 - lerpAmount) * currentScrollPos + lerpAmount * scrollPos;

  el.scrollTop = newScrollPos;

  window.dispatchEvent(
    new CustomEvent("handleHeader", {
      detail: {
        direction: newScrollPos - currentScrollPos,
      },
    }),
  );

  window.requestAnimationFrame(() => {
    mobileScroll(el);
  });
}

function rainbowLine(length = 36) {
  let text = "";
  const styleArr = [];
  const hue = 360 / length;
  for (let i = 0; i < length; i++) {
    text += "%c*";
  }
  for (let i = 0; i < length; i++) {
    styleArr.push(`color:hsl(${hue * i},100%,50%);font-size:1.5rem`);
  }
  console.log(text, ...styleArr);
}

function consoleTable(arr) {
  let descrLen = 11;
  let shortLen = 9;
  let targetLen = 6;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].description) {
      descrLen = descrLen < arr[i].description.length ? arr[i].description.length : descrLen;
    }
    if (arr[i].shortcode) {
      shortLen = shortLen < arr[i].shortcode.length ? arr[i].shortcode.length : shortLen;
    }
    if (arr[i].target) {
      targetLen = targetLen < arr[i].target.length ? arr[i].target.length : targetLen;
    }
  }
  const horizontalLine = `-+${"-".repeat(descrLen + 2)}+${"-".repeat(shortLen + 2)}+${"-".repeat(targetLen + 2)}+-`;
  const tableHeaders = ` | ${"AD".padEnd(descrLen, " ")} | ${"SHORTCODE".padEnd(shortLen, " ")} | ${"TARGET".padEnd(targetLen, " ")} | `;
  let tableBody = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].description) {
      tableBody += ` | ${arr[i].description.padEnd(descrLen, " ")}`;
    } else {
      tableBody += ` | ${" ".repeat(descrLen)}`;
    }
    if (arr[i].shortcode) {
      tableBody += ` | ${arr[i].shortcode.padEnd(shortLen, " ")}`;
    } else {
      tableBody += ` | ${" ".repeat(shortLen)}`;
    }
    if (arr[i].target) {
      tableBody += ` | ${arr[i].target.padEnd(targetLen, " ")} | \n`;
    } else {
      tableBody += ` | ${" ".repeat(targetLen)} | \n`;
    }
  }
  console.log(`%c${horizontalLine}\n${tableHeaders}\n${horizontalLine}\n${tableBody}${horizontalLine}`, "color:#FFDD33;background-color:#000933;font-size:0.875rem;margin:0;padding:0;");
}
