const injectAds = {
  inject(queryArr, config) {
    queryArr.forEach((query) => {
      if (["DESKTOP", "MOBILE", "SN", "S24"].includes(query)) {
        return;
      }
      config.formate.forEach((item) => {
        if (query !== item.shortcode) {
          return;
        }
        if (!document.querySelector(item.target) && item.shortcode !== "FSA") {
          console.error(`the target element "${item.target}" of shortcode "${item.shortcode}" is not found in the DOM`);
          return;
        }
        injectAds.insertIframe(item, queryArr);
      });
    });
  },
  async insertIframe(obj, queryArr) {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const iframe = entry.target.querySelector("iframe");
        iframe.width = entry.target.clientWidth;
        iframe.height = entry.target.clientHeight;
      });
    });

    if (obj.shortcode === "FSA") {
      obj.werbemittel.forEach((ad) => {
        injectAds.insertIframe(ad);
      });
      return;
    }

    const targetEl = document.querySelector(obj.target);

    switch (obj.shortcode) {
      case "ADV":
      case "CA":
      case "SL":
        const parser = new DOMParser();
        let WMurl = `./assets/WM/${obj.entryPoint}`;
        if (queryArr.includes("S24") && obj.shortcode !== "CA") {
          targetEl.classList.add("active");
        }
        if (obj.shortcode === "CA") {
          targetEl.classList = "collectionAd";
          if (queryArr.includes("S24")) {
            WMurl = WMurl.replace("_SN", "_S24");
          }
        }
        const response = await fetch(WMurl);
        const html = await response.text();
        const doc = parser.parseFromString(html, "text/html");
        targetEl.innerHTML = doc.body.innerHTML;

        return;

      case "BG":
        resizeObserver.observe(targetEl, { box: "border-box" });
        break;

      case "MR":
        targetEl.style.padding = "0";
        break;

      case "MS":
      case "TS":
        targetEl.style.display = "block";
        resizeObserver.observe(targetEl, { box: "border-box" });
        break;

      case "SB":
        const SBresizeObserver = new ResizeObserver((entries) => {
          const iframe = targetEl.querySelector("iframe");
          const sitebarWidth = parseInt(window.innerHeight >> 1);
          if (window.innerWidth >= entries[0].target.clientWidth + sitebarWidth) {
            iframe.width = sitebarWidth;
            iframe.height = sitebarWidth << 1;
          } else {
            iframe.width = 0;
            iframe.height = 0;
          }
        });
        SBresizeObserver.observe(document.querySelector("header"), { box: "border-box" });
        break;

      case "US":
        if (queryArr.includes("MOBILE") && queryArr.includes("MR")) {
          return;
        }
        if (queryArr.includes("S24") && queryArr.includes("MOBILE") && queryArr.includes("SL")) {
          return;
        }
        resizeObserver.observe(targetEl, { box: "border-box" });
        break;

      default:
        targetEl.style.width = obj.width + "px";
        targetEl.style.height = obj.height + "px";
        break;
    }

    targetEl.innerHTML = `<iframe src="./assets/WM/${obj.entryPoint}" width="${obj.width}" height="${obj.height}" frameborder="0"></iframe>`;
  },
};

export default injectAds;
