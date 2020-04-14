if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
  window.performance.mark('mark_vendor_static_start');
}
window.EmberENV = (function(EmberENV, extra) {
  for (var key in extra) {
    EmberENV[key] = extra[key];
  }
  return EmberENV;
})(window.EmberENV || {}, {{EMBER_ENV}});