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

function mergeStaticIntoAppTree(appTree, env, basePath) {
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
  staticVendor = new Concat(log(staticVendor), {
    headerFiles,
    outputFile: basePath + '/assets/vendor-static.js',
  });
  const customVendorAsset = new Merge([appTree, staticVendor]);
  return customVendorAsset;
};

module.exports = {
  name: "ember-vendor-split",
  removeStaticFromAppOptions,
  mergeStaticIntoAppTree
};
