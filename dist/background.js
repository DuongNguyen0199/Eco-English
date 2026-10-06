// Background Service Worker for Eco English Extension

// Automatically open the side panel when the user clicks on the extension action icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Error setting side panel behavior:', error));

chrome.runtime.onInstalled.addListener(() => {
  console.log('Eco English Extension installed successfully.');
});

// Listen for Web Store automatic background update notifications
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onUpdateAvailable) {
  chrome.runtime.onUpdateAvailable.addListener((details) => {
    console.log('New update available on Web Store:', details.version);
    // Reload background service worker to apply update
    chrome.runtime.reload();
  });
}
