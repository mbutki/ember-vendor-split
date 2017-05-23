/* eslint-env node */
"use strict";

const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Concat = require('broccoli-concat');
const log = require('broccoli-stew').log;
//const uglify = require('ember-cli-uglify');
//const uglify = require('broccoli-uglify-sourcemap');


/*function splitFilePath(filePath) {
  let i = filePath.lastIndexOf("/");
  if (i > -1) {
    return [filePath.slice(0,i), filePath.slice(i+1)];
  }
}*/

/*function treeForPublic(tree) {
  const filePaths = {emberProd: 'node_modules/ember-source/dist/ember.prod.js',
                     emberDebug: 'node_modules/ember-source/dist/ember.debug.js',
                     jquery: 'node_modules/jquery/dist/jquery.js'};

  const emberProdPath = splitFilePath(filePaths.emberProd);
  const emberDebugPath = splitFilePath(filePaths.emberDebug);
  const jqueryPath = splitFilePath(filePaths.jquery);

  const headerFiles = ['jquery.js'];
  const jqueryTree = new Funnel(jqueryPath[0], { include: [jqueryPath[1]] });
  let emberTree = null;

  if (this.app.env === 'production') {
    emberTree = new Funnel(emberProdPath[0], { include: [emberProdPath[1]] });
    headerFiles.push('ember.prod.js');
  } else {
    emberTree = new Funnel(emberDebugPath[0], { include: [emberDebugPath[1]] });
    headerFiles.push('ember.debug.js');
  }

  let staticVendor = new Merge([jqueryTree, emberTree], {});
  if (this.app.env === 'production') {
    staticVendor = uglify(staticVendor, {
      mangle: true,
      compress: {
        negate_iife: false,
        sequences: false,
      },
      output: {
        semicolons: false,
      },
    });
  }
  staticVendor = new Concat(staticVendor, {
    headerFiles,
    outputFile: 'assets/vendor-static.js',
  });

  return staticVendor;
}*/

module.exports = {
  name: "ember-vendor-split",
  included: function(app) {
    //debugger;

    /*app.options.vendorFiles = app.options.vendorFiles || {};
    app.options.vendorFiles = {
      'jquery.js': null,
      'ember.js': null,
    };*/

    console.log('BEFORE app._scriptOutputFiles[/assets/vendor.js]:' + app._scriptOutputFiles['/assets/vendor.js']);
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
    console.log('AFTER app._scriptOutputFiles[/assets/vendor.js]:' + app._scriptOutputFiles['/assets/vendor.js']);

    let jqueryPath = 'vendor/jquery/dist/jquery.js';
    let emberProdPath = 'vendor/ember/ember.prod.js';
    let emberDebugPath = 'vendor/ember/ember.debug.js';
    
    const emberSource = app.project.findAddonByName('ember-source');
    if (emberSource) {
      jqueryPath = emberSource.paths.jquery
      emberProdPath = emberSource.paths.prod
      emberDebugPath = emberSource.paths.debug
    }

    app.import(jqueryPath, {
      outputFile: 'assets/vendor-static.js'});
    app.import({
      development: emberDebugPath,
      production: emberProdPath,
      outputFile: 'assets/vendor-static.js'});
  },
};
