/// <reference lib="webworker" />

let tabID: number | undefined = void 0;

const TmpWindow = chrome.tabs.create({ url: `chrome-extension://${chrome.runtime.id}/pages/player-tab.html` }).then(tab => {
    tabID = tab.id;
});
