console.log("This is a popup!");

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
  console.log("received message from content script", req.info);
  sendResp("received");
});
