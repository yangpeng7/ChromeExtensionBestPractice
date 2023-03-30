const EASY_CSS_MOUSE_MOVE_CLASS = "easy_css_mouse_move";

let preDOM = null;

const easyContainerId = "easy_css_container";
const easyPanelId = "easy_css_panel";

document.addEventListener("mousedown", function (e) {
  let easyPanel = document.getElementById(easyPanelId);
  if (easyPanel == null) {
    return;
  }
  const cpStyle = window.getComputedStyle(e.target);
  console.log(cpStyle.backgroundColor, '🍉');
  easyPanel.contentWindow.postMessage(
    {
      type: "computedStyle",
      data: JSON.stringify({
        color: cpStyle.color,
        backgroundColor: cpStyle.backgroundColor,
      }),
    },
    "*"
  );
});

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
  console.log("接受来自消息", req, sender, sendResp);
  const data = req;
  if (data.action === "EVENT_PANEL_OPEN") {
    let easyPanel = document.getElementById(easyPanelId);
    if (easyPanel == null) {
      easyPanel = document.createElement("iframe");
      easyPanel.id = easyPanelId;
      easyPanel.src = chrome.runtime.getURL("../pages/panel.html");
      easyPanel.style.width = "100%";
      easyPanel.style.height = "100%";
      easyPanel.style.borderRadius = "20px";
      easyPanel.style.border = "none";

      const container = document.createElement("div");
      container.id = easyContainerId;
      container.style.width = "330px";
      container.style.height = "600px";
      container.style.position = "fixed";
      container.style.top = "10px";
      container.style.right = "10px";
      container.style.zIndex = "10000";
      container.style.boxShadow = "3px 2px 22px 1px rgba(0, 0, 0, 0.24)";
      container.style.borderRadius = "20px";
      container.appendChild(easyPanel);

      document.body.appendChild(container);
    }

    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      true
    );
  }
});

let positionTop = 10;
let positionRight = 10;

window.addEventListener("message", (evt) => {
  const data = evt.data;

  switch (data.msg) {
    case "EVENT_PANEL_CLOSE":
      let element = document.getElementById(easyContainerId);
      element.parentNode.removeChild(element);
      document.removeEventListener("mousemove", handleMouseMove);
      break;
    case "EVENT_DRAG_MOVE":
      handleDragMove(data.offsetX, data.offsetY);
      break;
    case "EVENT_COPY_CODE":
      navigator.clipboard.writeText(data.code).then(
        () => {
          console.log(data.code);
        },
        (e) => {
          console.error("Failed to copy", e);
        }
      );
  }
});

function handleMouseMove(e) {
  if (preDOM != null) {
    preDOM.classList.remove(EASY_CSS_MOUSE_MOVE_CLASS);
  }
  let target = e.target;
  target.classList.add(EASY_CSS_MOUSE_MOVE_CLASS);
  preDOM = target;
}

function handleDragMove(offsetX, offsetY) {
  positionTop += offsetY;
  positionRight -= offsetX;
  document.getElementById(easyContainerId).style.top = positionTop + "px";
  document.getElementById(easyContainerId).style.right = positionRight + "px";
}
