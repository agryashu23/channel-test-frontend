class StorageManager {
  /**
   * @returns {boolean}
   */
  static isLocalStorageAvailable() {
    try {
      localStorage.setItem("test", "1");
      localStorage.removeItem("test");
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  static setItem(key, value) {
    if (!this.isLocalStorageAvailable()) {
      console.warn("❌ localStorage is not available!");
      return;
    }
    localStorage.setItem(key, value);
  }

  /**
   * @param {string} key
   * @returns {string|null}
   */
  static getItem(key) {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    return localStorage.getItem(key);
  }

  /**
   * @param {string} key
   */
  static removeItem(key) {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    localStorage.removeItem(key);
  }
}

export default StorageManager;
