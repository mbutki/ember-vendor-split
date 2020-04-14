/* eslint-env node */
"use strict";

const path = require('path');
const fs = require('fs');
const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');
const vendorStaticFilepath = 'assets/vendor-static.js';
const vendorFilepath = '/assets/vendor.js';
const vendorStaticPrefixPath = 'vendor-static/prefix-vendor-static-eval.js';
const vendorStaticSuffixPath = 'vendor-static/suffix-vendor-static-eval.js';

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

    app.import(`vendor/${vendorStaticPrefixPath}`, {
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

    app.import(`vendor/${vendorStaticSuffixPath}`, {
      outputFile: vendorStaticFilepath
    });
  },

  treeForVendor() {
    let EmberENV = JSON.stringify(this.project.config(process.env.EMBER_ENV).EmberENV);
    let rawPrefixContent = fs.readFileSync(
        path.join(__dirname, 'assets', 'prefix-vendor-static-eval.js'),
        { encoding: 'utf8'}
    );

    let prefix = writeFile(
      vendorStaticPrefixPath,
      rawPrefixContent.replace('{{EMBER_ENV}}', EmberENV)
    );
    let suffix = writeFile(
      vendorStaticSuffixPath,
      fs.readFileSync(path.join(__dirname, 'assets', 'suffix-vendor-static-eval.js'), { encoding: 'utf8'})
    );

    return new MergeTrees([prefix, suffix]);
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
