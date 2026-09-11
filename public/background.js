// Background Service Worker for EngVibe Extension

// Automatically open the side panel when the user clicks on the extension action icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Error setting side panel behavior:', error));

chrome.runtime.onInstalled.addListener(() => {
  console.log('EngVibe Extension installed successfully.');
});
