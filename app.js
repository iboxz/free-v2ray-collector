function DownloadV2ray(platform) {
  var secondaryButton = document.querySelector(".secondaryButton");
  var buttons = document.querySelectorAll(".MainButtonHolder div button");

  buttons.forEach((button) => button.classList.remove("clickedButton"));

  var clickedButton = event.target;
  clickedButton.classList.add("clickedButton");

  var downloadInfo = {
    windows: {
      links: ["https://github.com/2dust/v2rayN/releases"],
      titles: ["v2rayN"],
    },
    android: {
      links: [
        "https://play.google.com/store/apps/details?id=com.v2ray.ang",
        "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases",
      ],
      titles: ["v2rayNG", "NekoBox"],
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
  var linksHtml = info.links.map(
    (link, index) =>
      '<a href="' + link + '" target="_blank">' + info.titles[index] + "</a>"
  );

  secondaryButton.innerHTML = linksHtml.join("<br>");
}

function ConfigLink(type) {
  var secondaryButton = document.querySelector("#bottomSection");
  document.querySelector(".mainContainer #topSection p").textContent = "copy";
  var buttons = document.querySelectorAll(".sectionConfig .buttonC button");

  buttons.forEach((button) => button.classList.remove("clickedButton"));

  var clickedButton = event.target;
  clickedButton.classList.add("clickedButton");

  var downloadInfo = {
    mix: {
      links: [
        "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/mix",
      ],
    },
    reality: {
      links: [
        "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/reality",
      ],
    },
    vless: {
      links: [
        "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/vless",
      ],
    },
    vmess: {
      links: [
        "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/vmess",
      ],
    },
    shadowsocks: {
      links: [
        "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/shadowsocks",
      ],
    },
    trojan: {
      links: [
        "https://raw.githubusercontent.com/iboxz/free-v2ray-collector/main/main/trojan",
      ],
    },
  };

  var info = downloadInfo[type];
  var linksHtml = info.links.map(
    (link, index) => '<a href="' + link + '" target="_blank">' + link + "</a>"
  );

  secondaryButton.innerHTML = linksHtml.join("<br>");
}

var tempInput = document.createElement("textarea");
document.getElementById("TextInput").appendChild(tempInput);

function copyLink(copyText) {
  var linkElement = document.querySelector("#bottomSection a");
  if (linkElement == null) {
    document.querySelector("#bottomSection").textContent =
      "یکی از گزینه های لیست را انتخاب کنید";
    return;
  }
  tempInput.value = linkElement.textContent;
  copyText.textContent = "copied!";

  tempInput.select();
  tempInput.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");

  //   copyText.onClick = smoother.scrollTo(".sectionConfig", true, "top top");
}
function fetchLink() {
  document.querySelector(".mainContainer #topSection p").textContent = "copy";
  var linkElement = document.querySelector("#bottomSection a");
  if (linkElement == null) {
    document.querySelector("#bottomSection").textContent =
      "یکی از گزینه های لیست را انتخاب کنید";
    return;
  }
  fetch(linkElement.href)
    .then((response) => response.text())
    .then((data) => {
      if (data === "404: Not Found") {
        linkElement.textContent =
          "لینک وجود ندارد، مشکل را به اونر پروژه ارجاع دهید.";
        return;
      }
      linkElement.textContent = data;
    })
    .catch(
      (error) =>
        (linkElement.textContent = "محتوا دریافت نشد، لینک را باز کنید.")
    );
}

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

let smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  contect: "#smooth-content",
  smooth: 0.8,
  effects: true,
  smoothTouch: 0.01,
});

document.querySelectorAll("#ButtonDownloadSection").forEach((element) => {
  element.addEventListener("click", () => {
    smoother.scrollTo("#sectionDownload", true, "top top");
  });
});

document.querySelectorAll("#ButtonConfigSection").forEach((element) => {
  element.addEventListener("click", () => {
    smoother.scrollTo(".sectionConfig", true, "top top");
  });
});

gsap.to("main", {
  scrollTrigger: {
    trigger: ".sectionDownload",
    start: "top 30%",
    end: "bottom 70%",
    toggleActions: "play reverse play reverse",
    scrub: false,
  },
  duration: 0.5,
  filter: "invert(1)",
});

window.addEventListener("load", (event) => {
  gsap.to(".sectionHero #hereTitleTop div:nth-child(1) div:nth-child(2)", {
    duration: 3,
    marginRight: "0%",
  });
  gsap.from(
    new SplitText(".sectionHero #hereTitleTop + div", {
      type: "chars",
      tagName: "span",
    }).chars,
    {
      y: "120%",
      x: "100%",
      duration: 1,
      ease: "power1.out",
      stagger: 0.1,
    }
  );

  gsap.from(
    new SplitText(".sectionHero #hereTitleTop div:nth-child(2)", {
      type: "chars",
      tagName: "span",
    }).chars,
    {
      y: "100%",
      x: "-50%",
      duration: 1.5,
      ease: "power1.out",
      stagger: 0.2,
    }
  );
  gsap.from(".sectionHero .imageHolder > img", {
    duration: 2.5,
    ease: "back.out(1.7)",
    scale: "1.5",
  });
});

gsap.from(".sectionDownload > p", {
  duration: 2,
  ease: "power1.out",
  skewY: 10,
  y: "50%",
  x: "5%",
  scrollTrigger: {
    trigger: ".sectionDownload > p",
    toggleActions: "play reset play reverse",
    start: "center 70%",
    end: "center -20%",
  },
});

gsap.to(CSSRulePlugin.getRule(".sectionHero .imageHolder::before"), {
  scrollTrigger: {
    trigger: ".sectionHero",
    start: "40% center",
    end: "bottom center",
    scrub: 2,
  },
  cssRule: {
    y: "200%",
  },
});

gsap.from(".sectionConfig", {
  duration: 1,
  ease: "power1.out",
  skewY: -5,
  scrollTrigger: {
    trigger: ".sectionConfig",
    toggleActions: "play none none reverse",
    start: "center 70%",
    end: "center -50%",
  },
});

gsap.to(".windows > div > img", {
  scrollTrigger: {
    trigger: ".windows > div",
    start: "top center",
    end: "bottom center",
    scrub: 2,
  },
  y: "50%",
  duration: 1,
});

gsap.to(".android > div > img", {
  scrollTrigger: {
    trigger: ".android > div",
    start: "top center",
    end: "bottom center",
    scrub: 2,
  },
  y: "50%",
  duration: 1,
});

document.getElementById("github").addEventListener("click", function () {
  window.open("https://github.com/iboxz/free-v2ray-collector", "_blank");
});

document.getElementById("IBOX").addEventListener("click", function () {
  window.open("https://firstibox.glitch.me/", "_blank");
});
