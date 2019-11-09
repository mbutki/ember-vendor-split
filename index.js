/* eslint-env node */
"use strict";

const path = require('path');
const fs = require('fs');
const vendorStaticFilepath = 'assets/vendor-static.js';
const vendorFilepath = '/assets/vendor.js';
const vendorStaticPrefixPath = path.resolve(__dirname + '/assets/prefix-vendor-static-eval.js');
const vendorStaticSuffixPath = path.resolve(__dirname + '/assets/suffix-vendor-static-eval.js');

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

    app.import(vendorStaticPrefixPath, {
      outputFile: vendorStaticFilepath
    });

    let optionalFeatures = app.project.findAddonByName('@ember/optional-features');
    if (!optionalFeatures || optionalFeatures.isFeatureEnabled('jquery-integration')) {
      app.import(jqueryPath, {
        outputFile: vendorStaticFilepath
      });
    }

    app.import({
      development: emberDebugPath,
      production: emberProdPath
    }, {
      outputFile: vendorStaticFilepath
    });

    app.import(vendorStaticSuffixPath, {
      outputFile: vendorStaticFilepath
    });
  },
  updateFastBootManifest: function(manifest) {
    manifest.vendorFiles.unshift(vendorStaticFilepath);
    return manifest;
  }
};

module.exports.removeOutputFiles = removeOutputFiles;
function removeOutputFiles(app, useSource, emberSource) {
  // TODO: public API for ember-cli? maybe: https://github.com/ember-cli/ember-cli/pull/7060
  let filesToRemove;
  if (useSource) {
    filesToRemove = [
      emberSource.paths.jquery,
      emberSource.paths.prod,
      emberSource.paths.debug
    ];
  } else {
    filesToRemove = [
      `${app.bowerDirectory}/jquery/dist/jquery.js`,
      `${app.bowerDirectory}/ember/ember.prod.js`,
      `${app.bowerDirectory}/ember/ember.debug.js`
    ];
  }

  for (let i = 0; i < filesToRemove.length; i++) {
    let index = app._scriptOutputFiles[vendorFilepath].indexOf(filesToRemove[i]);
    if (index > -1) {
      app._scriptOutputFiles[vendorFilepath].splice(index, 1);
    }
  }
}
