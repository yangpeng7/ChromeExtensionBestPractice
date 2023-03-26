chrome.runtime.onInstalled.addListener(function (details) {
  console.log("onInstalled event has been triggered with details: ", details);
  // 检查安装、更新或卸载的原因
  if (details.reason == "install") {
    // 在安装扩展时执行的代码
  } else if (details.reason == "update") {
    // 在更新扩展时执行的代码
  } else if (details.reason == "uninstall") {
    // 在卸载扩展时执行的代码
  }
});

/**
 * 注意需要声明权限
 */
chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
  console.log(
    "Bookmark created with title: " +
      bookmark.title +
      " and url: " +
      bookmark.url
  );
});

/**
 * 注意需要声明 webNavigation 权限
 */
chrome.webNavigation.onCompleted.addListener(() => {
  console.info("The user has loaded my favorite website!");
});


// const filter = {
//     url: [
//       {
//         urlMatches: 'https://www.google.com/',
//       },
//     ],
//   };
  
//   chrome.webNavigation.onCompleted.addListener(() => {
//     console.info("The user has loaded my favorite website!");
//   }, filter);