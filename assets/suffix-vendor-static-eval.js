if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
  window.performance.mark('mark_vendor_static_end');
  if (window.performance.getEntriesByName('mark_vendor_static_start').length > 0) {
    window.performance.measure('mark_vendor_static_eval', 'mark_vendor_static_start', 'mark_vendor_static_end');
  }
}
