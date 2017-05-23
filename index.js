/* eslint-env node */
"use strict";

const fs = require('fs');

module.exports = {
  name: "ember-vendor-split",
  included(app) {
    let jqueryPath, emberProdPath, emberDebugPath;

    const hasBower = fs.existsSync(app.root + '/bower.json');
    const emberSource = app.project.findAddonByName('ember-source');

    const useSource = !hasBower && emberSource;
    removeOutputFiles(app, useSource, emberSource);

    if (useSource) {
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
function removeOutputFiles(app, useSource, emberSource) {
  // TODO: write unitTest
  // TODO: public API for ember-cli? maybe: https://github.com/ember-cli/ember-cli/pull/7060
  let filesToRemove = null;
  if (useSource) {
    filesToRemove = [emberSource.paths.jquery, emberSource.paths.prod, emberSource.paths.debug];
  } else {
    filesToRemove = [`${app.bowerDirectory}/jquery/dist/jquery.js`, `${app.bowerDirectory}/ember/ember.prod.js`, `${app.bowerDirectory}/ember/ember.debug.js`];
  }

  const vendorName = '/assets/vendor.js';
  for (let i = 0; i < filesToRemove.length; i++) {
    let index = app._scriptOutputFiles[vendorName].indexOf(filesToRemove[i]);
    if (index > -1) {
      app._scriptOutputFiles[vendorName].splice(index, 1);
    }
  }
}
