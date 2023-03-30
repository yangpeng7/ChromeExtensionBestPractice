chrome.action.onClicked.addListener(function (tab) {
  //open pages
  chrome.tabs.sendMessage(tab.id, {
    action: "EVENT_PANEL_OPEN",
  });
});
