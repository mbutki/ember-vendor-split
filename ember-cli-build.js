/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const options = {};

  /*options.vendorFiles = {
    'jquery.js': null,
    'ember.js': null,
  };*/

  var app = new EmberAddon(defaults, options);
  return app.toTree();
};


