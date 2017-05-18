/* eslint-env node */
"use strict";

const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Concat = require('broccoli-concat');
const log = require('broccoli-stew').log;
function removeStaticFromAppOptions(options)  {
  options.vendorFiles = {
    'jquery.js': null,
    'ember.js': null,
  };
};

function mergeStaticIntoAppTree(app, env, basePath) {
  let jqueryPath, emberProdPath, emberDebugPath;

  let emberSource = null;
  if (typeof app.findAddonByName === "function") {
    emberSource = app.findAddonByName('ember-source');
  }
  if (emberSource) {
    emberProdPath = emberSource.paths.prod;
    emberDebugPath = emberSource.paths.debug;
    jqueryPath = emberSource.paths.jquery;
    console.log('mike:'+emberSource.paths.jquery);
  } else {
    emberProdPath = basePath + '/bower_components/ember';
    emberDebugPath = basePath + '/bower_components/ember';
    jqueryPath = basePath + '/bower_components/jquery/dist';
  }

  const headerFiles = ['jquery.js'];
  const jqueryTree = new Funnel(basePath + '/bower_components/jquery/dist', { include: ['jquery.js'] });
  let emberTree = null;
  if (env === 'production') {
    emberTree = new Funnel(basePath + '/bower_components/ember', { include: ['ember.prod.js'] });
    headerFiles.push('ember.prod.js');
  } else {
    emberTree = new Funnel(basePath + '/bower_components/ember', { include: ['ember.debug.js'] });
    headerFiles.push('ember.debug.js');
  }

  let staticVendor = new Merge([jqueryTree, emberTree], {});
  staticVendor = new Concat(staticVendor, {
    headerFiles,
    outputFile: basePath + '/assets/vendor-static.js',
  });
  const customVendorAsset = new Merge([app.toTree(), staticVendor]);
  return customVendorAsset;
};

module.exports = {
  name: "ember-vendor-split",
  removeStaticFromAppOptions,
  mergeStaticIntoAppTree
};
