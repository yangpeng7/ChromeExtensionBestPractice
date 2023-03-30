window.addEventListener("message", function (event) {
  if (event.data.type === "computedStyle") {
    const ev = JSON.parse(event.data.data);
    showComputedStyle(ev);
  }
});

document
  .getElementById("easy-css-panel-header-close")
  .addEventListener("click", handleClosePanel);
document
  .getElementById("easy-css-panel-code-copy")
  .addEventListener("click", handleCopyCode);

document
  .getElementById("easy-css-panel-header-icon")
  .addEventListener("click", () => {
    window.open("https://github.com/yangpeng7/easycss", "_blank");
  });

const showComputedStyle = (data) => {
  let ecpcb = document.getElementById("easy-css-panel-content-box");
  // width x height
  let ecpbc = document.getElementById("easy-css-panel-box-width-height");

  ecpcb.style.backgroundColor = data.backgroundColor;
  ecpbc.innerText = convertToHex(data.backgroundColor);
};

function convertToHex(color) {
  // 去除空格并转换为小写
  color = color.trim().toLowerCase();
  
  // 匹配 rgb 或 rgba 颜色
  let match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  
  // 如果是 rgba 颜色，则将透明度乘以 255 并四舍五入取整
  if (match && match[4]) {
    let alpha = Math.round(parseFloat(match[4]) * 255).toString(16);
    if (alpha.length === 1) alpha = '0' + alpha;
    return '#' + Number(match[1]).toString(16).padStart(2, '0') + 
           Number(match[2]).toString(16).padStart(2, '0') + 
           Number(match[3]).toString(16).padStart(2, '0') +
           alpha;
  } else if (match) { // 如果是 rgb 颜色，则透明度为 255（完全不透明）
    return '#' + Number(match[1]).toString(16).padStart(2, '0') + 
           Number(match[2]).toString(16).padStart(2, '0') + 
           Number(match[3]).toString(16).padStart(2, '0');
  } else { // 如果不是有效的 rgb 或 rgba 颜色，则返回空字符串
    return '';
  }
}


function handleClosePanel() {
  parent.window.postMessage({ msg: "EVENT_PANEL_CLOSE" }, "*");
}

function handleCopyCode() {
  const str = document.getElementById("easy-css-panel-code").innerText;
  parent.window.postMessage(
    {
      msg: "EVENT_COPY_CODE",
      code: str,
    },
    "*"
  );
}

let baseMouseX, baseMouseY;

document
  .getElementById("easy-css-panel-header-title")
  .addEventListener("mousedown", handleDragStart);

function handleDragStart(evt) {
  baseMouseX = evt.clientX;
  baseMouseY = evt.clientY;
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
}

function handleDragMove(evt) {
  let offsetX = evt.clientX - baseMouseX;
  let offsetY = evt.clientY - baseMouseY;

  // 防止抖动过快
  if (Math.abs(offsetX) > 4 || Math.abs(offsetY) > 4) {
    parent.window.postMessage(
      {
        msg: "EVENT_DRAG_MOVE",
        offsetX: evt.clientX - baseMouseX,
        offsetY: evt.clientY - baseMouseY,
      },
      "*"
    );
  }
}

function handleDragEnd() {
  document.removeEventListener("mouseup", handleDragEnd);
  document.removeEventListener("mousemove", handleDragMove);
}
