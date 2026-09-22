/**
 * Version & Auto-Update Checker Service for Eco English Extension
 */
export const versionService = {
  getCurrentVersion() {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      return chrome.runtime.getManifest().version || '1.0.0';
    }
    return '1.0.0';
  },

  async checkForUpdates() {
    try {
      const currentVer = this.getCurrentVersion();
      // Fetch latest version manifest directly from GitHub repository
      const res = await fetch('https://raw.githubusercontent.com/DuongNguyen0199/Eco-English/main/public/manifest.json', { cache: 'no-cache' });
      if (!res.ok) return { hasUpdate: false, currentVersion: currentVer };

      const remoteManifest = await res.json();
      const latestVer = remoteManifest.version || '1.0.0';

      if (this.isVersionHigher(latestVer, currentVer)) {
        return {
          hasUpdate: true,
          currentVersion: currentVer,
          latestVersion: latestVer,
          downloadUrl: 'https://github.com/DuongNguyen0199/Eco-English'
        };
      }
      return { hasUpdate: false, currentVersion: currentVer };
    } catch (err) {
      console.warn('Version check warning:', err.message);
      return { hasUpdate: false, currentVersion: this.getCurrentVersion() };
    }
  },

  isVersionHigher(latest, current) {
    const lParts = String(latest).split('.').map(Number);
    const cParts = String(current).split('.').map(Number);
    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  }
};
