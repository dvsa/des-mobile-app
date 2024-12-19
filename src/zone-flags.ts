/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
// Extend the Window interface
interface Window {
  __Zone_disable_customElements?: boolean;
}

// Assign the property
window.__Zone_disable_customElements = true;
