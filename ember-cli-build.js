/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const options = {};
  var app = new EmberAddon(defaults, options);
  return app.toTree();
};


