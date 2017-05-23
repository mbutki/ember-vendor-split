/* eslint-env node */
"use strict";

const fs = require('fs');

module.exports = {
  name: "ember-vendor-split",
  included(app) {
    let jqueryPath, emberProdPath, emberDebugPath;

    removeOutputFiles(app);

    const hasBower = fs.existsSync(app.root + '/bower.json');
    const emberSource = app.project.findAddonByName('ember-source');

    if (!hasBower && emberSource) {
      jqueryPath = emberSource.paths.jquery
      emberProdPath = emberSource.paths.prod
      emberDebugPath = emberSource.paths.debug
    } else {
      jqueryPath = `${app.bowerDirectory}/jquery/dist/jquery.js`;
      emberProdPath = `${app.bowerDirectory}/ember/ember.prod.js`;
      emberDebugPath = `${app.bowerDirectory}/ember/ember.debug.js`;
    }

    app.import(jqueryPath, {
      outputFile: 'assets/vendor-static.js'
    });

    app.import({
      development: emberDebugPath,
      production: emberProdPath
    }, {
      outputFile: 'assets/vendor-static.js'
    });
  },
};

module.exports.removeOutputFiles = removeOutputFiles;
function removeOutputFiles(app) {
  // TODO: write unitTest
  // TODO: public API for ember-cli? maybe: https://github.com/ember-cli/ember-cli/pull/7060
  let index = app._scriptOutputFiles['/assets/vendor.js'].indexOf('vendor/ember/jquery/jquery.js');
  if (index > -1) {
    app._scriptOutputFiles['/assets/vendor.js'].splice(index, 1);
  }

  index = app._scriptOutputFiles['/assets/vendor.js'].indexOf('vendor/ember/ember.debug.js');
  if (index > -1) {
    app._scriptOutputFiles['/assets/vendor.js'].splice(index, 1);
  }

  index = app._scriptOutputFiles['/assets/vendor.js'].indexOf('vendor/ember/ember.prod.js');
  if (index > -1) {
    app._scriptOutputFiles['/assets/vendor.js'].splice(index, 1);
  }
}
