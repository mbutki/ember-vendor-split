/* eslint-env node */
"use strict";

const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Concat = require('broccoli-concat');
const log = require('broccoli-stew').log;

function removeStaticFromAppOptions(options)  {
  options.vendorFiles = options.vendorFiles || {};
  options.vendorFiles = {
    'jquery.js': null,
    'ember.js': null,
  };
};

function splitFilePath(filePath) {
  let i = filePath.lastIndexOf("/");
  if (i > -1) {
    return [filePath.slice(0,i), filePath.slice(i+1)];
  }
}

function mergeStaticIntoAppTree(app, env, basePath, defaults) {
  let jqueryPath, jqueryFileName, emberProdPath, emberProdFileName, emberDebugPath, emberDebugFileName;

  let emberSource = null;
  if (typeof defaults.project.findAddonByName === "function") {
    emberSource = defaults.project.findAddonByName('ember-source');
  }

  if (emberSource) {
    emberProdPath = splitFilePath(emberSource.paths.prod);
    emberDebugPath = splitFilePath(emberSource.paths.debug);
    jqueryPath = splitFilePath(emberSource.paths.jquery);
    console.log('jqueryPath:' +jqueryPath);
  } else {
    emberProdPath = [basePath + '/bower_components/ember', 'ember.prod.js'];
    emberDebugPath = [basePath + '/bower_components/ember', 'ember.debug.js'];
    jqueryPath = [basePath + '/bower_components/jquery/dist', 'jquery.js'];
  }

  const headerFiles = ['jquery.js'];
  const jqueryTree = new Funnel(jqueryPath[0], { include: [jqueryPath[1]] });
  let emberTree = null;
  if (env === 'production') {
    emberTree = new Funnel(emberProdPath[0], { include: [emberProdPath[1]] });
    headerFiles.push('ember.prod.js');
  } else {
    emberTree = new Funnel(emberDebugPath[0], { include: [emberDebugPath[1]] });
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
