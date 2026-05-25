var _configMap = {};
var _configIdCounter = 0;
var _allParsedConfigs = [];
var _configRegions = [];
var _currentFilterRegion = "ALL";
var _currentSubUrl = "";

function DownloadV2ray(platform) {
  var secondaryButton = document.querySelector(".secondaryButton");
  var buttons = document.querySelectorAll(".MainButtonHolder div button");
  buttons.forEach(function(b) { b.classList.remove("clickedButton"); });
  event.target.classList.add("clickedButton");

  var downloadInfo = {
    windows: {
      links: ["https://github.com/2dust/v2rayN/releases"],
      titles: ["v2rayN"],
    },
    android: {
      links: [
        "https://en.v2rayng.org/download/",
        "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases",
        "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
      ],
      titles: ["v2rayNG", "NekoBox", "V2Box"],
    },
    ios: {
      links: [
        "https://apps.apple.com/us/app/npv-tunnel/id1629465476",
        "https://apps.apple.com/us/app/foxray/id6448898396",
        "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690",
      ],
      titles: ["NapsternetV", "FoXray", "V2Box"],
    },
    MacOS: {
      links: [
        "https://apps.apple.com/us/app/foxray/id6448898396",
        "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690",
      ],
      titles: ["FoXray", "V2Box"],
    },
    linux: {
      links: [
        "https://github.com/Dreamacro/clash/releases",
        "https://github.com/MatsuriDayo/nekoray/releases",
      ],
      titles: ["Clash", "NekoRay"],
    },
  };

  var info = downloadInfo[platform];
  secondaryButton.innerHTML = info.links.map(function(link, i) {
    return '<a href="' + link + '" target="_blank">' + info.titles[i] + "</a>";
  }).join("<br>");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function writeToClipboard(text, onDone) {
  var fallback = function() {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;top:-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    if (onDone) onDone();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onDone || function(){}).catch(fallback);
  } else {
    fallback();
  }
}

function flashBtn(btn, label) {
  var orig = btn.textContent;
  btn.textContent = label || "copied!";
  btn.classList.add("btn-flash");
  setTimeout(function() {
    btn.textContent = orig;
    btn.classList.remove("btn-flash");
  }, 2000);
}

var URLS = {
  mix:         "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/mix",
  reality:     "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/reality",
  vless:       "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/vless",
  vmess:       "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/vmess",
  shadowsocks: "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/shadowsocks",
  trojan:      "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/trojan",
};

function ConfigLink(type, btnEl) {
  var buttons = document.querySelectorAll(".sectionConfig .proto-btn");
  buttons.forEach(function(b) { b.classList.remove("clickedButton"); });
  btnEl.classList.add("clickedButton");

  _allParsedConfigs = [];
  _configMap = {};
  _configIdCounter = 0;
  _currentSubUrl = URLS[type] || "";

  renderLinkReady(type);
}

function renderLinkReady(type) {
  var url = _currentSubUrl;
  var bottomSection = document.querySelector("#bottomSection");

  bottomSection.innerHTML =
    '<div class="cfg-link-ready">' +

      '<div class="cfg-step-badge">' +
        '<span class="step-num">step 2</span>' +
        '<span class="step-desc">your subscription link</span>' +
      '</div>' +

      '<div class="sub-url-box">' +
        '<div class="sub-url-label">subscription link · ' + escapeHtml(type) + '</div>' +
        '<div class="sub-url-text">' + escapeHtml(url) + '</div>' +
        '<div class="sub-url-actions">' +
          '<button class="btn-copy-sub" onclick="copySubLink(this)">copy link</button>' +
          '<button class="btn-open-sub" onclick="window.open(\'' + escapeHtml(url) + '\',\'_blank\')">open ↗</button>' +
        '</div>' +
      '</div>' +

      '<div class="cfg-hint-box">' +
        '<div class="hint-row hint-direct">' +
          '<span class="hint-icon">📋</span>' +
          '<div>' +
            '<strong>paste directly into your V2Ray app</strong>' +
            '<span>copy the link above and add it as a subscription in v2rayNG, NekoBox, or any V2Ray client.</span>' +
          '</div>' +
        '</div>' +
        '<div class="hint-divider">or</div>' +
        '<div class="hint-row hint-load">' +
          '<span class="hint-icon">🌍</span>' +
          '<div>' +
            '<strong>load &amp; browse servers by country</strong>' +
            '<span>fetch all servers here to copy individual ones and filter by region.</span>' +
          '</div>' +
        '</div>' +
        '<button class="btn-load-servers" onclick="fetchConfigs()">' +
          '<span>load servers</span>' +
          '<span class="btn-arrow">→</span>' +
        '</button>' +
      '</div>' +

    '</div>';
}

function copySubLink(btn) {
  writeToClipboard(_currentSubUrl, function() { flashBtn(btn, "copied!"); });
}

function fetchConfigs() {
  if (!_currentSubUrl) return;
  var bottomSection = document.querySelector("#bottomSection");
  bottomSection.innerHTML =
    '<div class="cfg-loading">' +
      '<div class="cfg-loading-spinner"></div>' +
      '<span>fetching servers</span>' +
      '<span class="cfg-loading-dots"></span>' +
    '</div>';

  fetch(_currentSubUrl + "?v=" + Date.now())
    .then(function(r) { return r.text(); })
    .then(function(data) {
      if (data === "404: Not Found") {
        bottomSection.innerHTML = '<div class="cfg-error">not found — please report to the project owner.</div>';
        return;
      }
      _configMap = {};
      _configIdCounter = 0;
      _allParsedConfigs = data
        .split("\n")
        .map(function(l) { return l.trim(); })
        .filter(function(l) { return l.length > 0; })
        .map(parseConfigEntry);

      var seen = {};
      _configRegions = ["ALL"];
      _allParsedConfigs.forEach(function(c) {
        if (!seen[c.region]) { seen[c.region] = true; _configRegions.push(c.region); }
      });
      _configRegions.sort(function(a, b) {
        if (a === "ALL") return -1;
        if (b === "ALL") return 1;
        if (a === "UN") return 1;
        if (b === "UN") return -1;
        return a.localeCompare(b);
      });

      renderConfigList("ALL");
    })
    .catch(function() {
      bottomSection.innerHTML = '<div class="cfg-error">failed to fetch — try opening the link directly.</div>';
    });
}

function parseConfigEntry(line) {
  var flag = "🌐", region = "UN", displayText = "", ip = "";

  var atIdx = line.indexOf("@");
  if (atIdx !== -1) {
    var portColonIdx = line.indexOf(":", atIdx + 1);
    ip = portColonIdx !== -1 ? line.slice(atIdx + 1, portColonIdx) : line.slice(atIdx + 1, atIdx + 40);
  }

  var hashIdx = line.lastIndexOf("#");
  if (hashIdx !== -1) {
    try {
      var fragment = decodeURIComponent(line.slice(hashIdx + 1));
      var pipeIdx = fragment.indexOf("|");
      if (pipeIdx !== -1) {
        var leftPart = fragment.slice(0, pipeIdx).trim();
        var rightPart = fragment.slice(pipeIdx + 1).trim();
        displayText = rightPart || ip;
        var words = leftPart.split(/\s+/);
        region = words[words.length - 1].toUpperCase();
        flag = words.slice(0, words.length - 1).join(" ").trim() || "🌐";
      } else {
        displayText = fragment.trim() || ip;
      }
    } catch(e) { displayText = ip; }
  }
  if (!displayText) displayText = ip || line.slice(0, 30);

  var id = _configIdCounter++;
  _configMap[id] = line;
  return { id: id, region: region, flag: flag, displayText: displayText, ip: ip, raw: line };
}

function renderConfigList(filterRegion) {
  _currentFilterRegion = filterRegion;
  var bottomSection = document.querySelector("#bottomSection");
  var filtered = filterRegion === "ALL"
    ? _allParsedConfigs
    : _allParsedConfigs.filter(function(c) { return c.region === filterRegion; });

  var countByRegion = {};
  _allParsedConfigs.forEach(function(c) {
    countByRegion[c.region] = (countByRegion[c.region] || 0) + 1;
  });

  var pillsHtml = _configRegions.map(function(r) {
    var active = r === filterRegion ? " active" : "";
    var count = r === "ALL" ? _allParsedConfigs.length : (countByRegion[r] || 0);
    return (
      '<button class="region-pill' + active + '" onclick="renderConfigList(\'' + escapeHtml(r) + '\')">' +
        (r === "ALL" ? "🌐 all" : r) +
        '<span class="pill-count">' + count + '</span>' +
      '</button>'
    );
  }).join("");

  var itemsHtml = filtered.length === 0
    ? '<div class="cfg-no-results">no servers in this region</div>'
    : filtered.map(function(c, idx) {
        return (
          '<div class="config-item" style="animation-delay:' + Math.min(idx * 0.025, 0.4) + 's">' +
            '<div class="config-item-left">' +
              '<span class="config-flag" title="' + escapeHtml(c.region) + '">' + c.flag + '</span>' +
              '<div class="config-info">' +
                '<span class="config-region-code">' + escapeHtml(c.region) + '</span>' +
                '<span class="config-display-text">' + escapeHtml(c.displayText) + '</span>' +
              '</div>' +
            '</div>' +
            '<button class="config-copy-btn" onclick="copySingleConfig(this,' + c.id + ')">copy</button>' +
          '</div>'
        );
      }).join("");

  bottomSection.innerHTML =
    '<div class="cfg-results-header">' +
      '<div class="step-label cfg-step-badge">' +
        '<span class="step-num">step 3</span>' +
        '<span class="step-desc">browse &amp; copy servers</span>' +
      '</div>' +
      '<button class="copy-all-btn" onclick="copyAllConfigs()">' +
        'copy all (' + filtered.length + ')' +
      '</button>' +
    '</div>' +
    '<div class="region-filter-bar">' +
      '<div class="region-filter-scroll">' + pillsHtml + '</div>' +
    '</div>' +
    '<div class="config-list">' + itemsHtml + '</div>';
}

function copySingleConfig(btn, id) {
  var raw = _configMap[id];
  if (!raw) return;
  writeToClipboard(raw, function() { flashBtn(btn, "copied!"); });
}

function copyAllConfigs() {
  var filtered = _currentFilterRegion === "ALL"
    ? _allParsedConfigs
    : _allParsedConfigs.filter(function(c) { return c.region === _currentFilterRegion; });
  var text = filtered.map(function(c) { return c.raw; }).join("\n");
  writeToClipboard(text, function() {
    var btn = document.querySelector(".copy-all-btn");
    if (btn) flashBtn(btn, "copied!");
  });
}

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CSSRulePlugin);

var smoother = null;
if (window.innerWidth > 768) {
  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 0.8,
    effects: true,
  });
}

document.querySelectorAll("#ButtonDownloadSection").forEach(function(el) {
  el.addEventListener("click", function() {
    if (smoother) {
      smoother.scrollTo("#sectionDownload", true, "top 20vh");
    } else {
      document.getElementById("sectionDownload").scrollIntoView({ behavior: "smooth" });
    }
  });
});

document.querySelectorAll("#ButtonConfigSection").forEach(function(el) {
  el.addEventListener("click", function() {
    if (smoother) {
      smoother.scrollTo("#sectionConfig", true, "top top");
    } else {
      document.getElementById("sectionConfig").scrollIntoView({ behavior: "smooth" });
    }
  });
});

var disableScroll = function() {
  document.body.style.overflowY = "hidden";
  document.body.style.overflowX = "hidden";
  document.documentElement.style.overflowX = "hidden";
  document.documentElement.style.overflowY = "hidden";
};

var enableScroll = function() {
  document.documentElement.style.overflowY = "";
  document.body.style.overflowY = "";
};

window.addEventListener("load", function() {
  disableScroll();

  var firstLoad = !localStorage.getItem("loadedBefore");
  var delayTime = firstLoad ? 5 : 2;
  if (firstLoad) { localStorage.setItem("loadedBefore", "true"); }

  gsap.set("#loading-screen", { y: "0%" });
  gsap.to("#loading-screen", {
    duration: 1, delay: delayTime, y: "100%", ease: "power1.in",
    onComplete: function() {
      enableScroll();
      document.getElementById("loading-screen").style.display = "none";
    },
  });
  gsap.to(".loader", { paddingLeft: "1000%", delay: delayTime, duration: 1 });
  gsap.to(".sectionHero #hereTitleTop div:nth-child(1) div:nth-child(2)", {
    duration: 3, marginRight: "0%", delay: delayTime,
  });
  gsap.from(
    new SplitText(".sectionHero #hereTitleTop + div", { type: "chars", tagName: "span" }).chars,
    { y: "120%", x: "100%", duration: 1, ease: "power1.out", stagger: 0.1, delay: delayTime }
  );
  gsap.from(
    new SplitText(".sectionHero #hereTitleTop div:nth-child(2)", { type: "chars", tagName: "span" }).chars,
    { y: "100%", x: "-50%", duration: 1.5, ease: "power1.out", stagger: 0.2, delay: delayTime }
  );
  gsap.from(".sectionHero .imageHolder > img", {
    duration: 2.5, ease: "back.out(1.7)", scale: "1.5", delay: delayTime,
  });
  gsap.from(".sectionDownload > p", {
    duration: 2, ease: "power1.out", skewY: 10, y: "50%", x: "5%",
    scrollTrigger: { trigger: ".sectionDownload > p", toggleActions: "play none", start: "center 70%", end: "center -20%" },
  });
  gsap.to(CSSRulePlugin.getRule(".sectionHero .imageHolder::before"), {
    scrollTrigger: { trigger: ".sectionHero", start: "40% center", end: "bottom center", scrub: 2 },
    cssRule: { y: "200%" },
  });
  gsap.from(".sectionConfig", {
    duration: 1, ease: "power1.out", skewY: -5,
    scrollTrigger: { trigger: ".sectionConfig", toggleActions: "play none", start: "center 70%", end: "center -50%" },
  });
  if (window.innerWidth > 768) {
    gsap.to("main", {
      scrollTrigger: {
        trigger: ".sectionDownload", start: "top center", end: "bottom center",
        toggleActions: "play reverse play reverse", scrub: false,
      },
      duration: 0.5, filter: "invert(1)",
    });
  }
  document.getElementById("github").addEventListener("click", function() {
    window.open("https://github.com/iboxz/free-v2ray-collector", "_blank");
  });
  document.getElementById("IBOX").addEventListener("click", function() {
    window.open("https://firstibox.com/", "_blank");
  });
});
