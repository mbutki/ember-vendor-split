"use strict";

const path = require('path');

const chai = require('chai');
const assert = require('chai').assert;
const spies = require('chai-spies');
const should = chai.should();
const expect = chai.expect;

chai.use(spies);

const { createTempDir } = require("broccoli-test-helper");
const vendorSplit = require("../index");
const co = require('co');
const vendorStaticFilepath = 'assets/vendor-static.js';

describe("removeOutputFiles", function() {
  it("should remove files from vendor.js when using ember source", function() {
    let useSource = true;
    let emberSource = {
      paths: {
        jquery: 'node_modules/jquery/dist/jquery.js',
        prod: 'node_modules/ember-source/dist/ember.prod.js',
        debug: 'node_modules/ember-source/dist/ember.debug.js'
      }
    };
    let app = {
      _scriptOutputFiles: {
        '/assets/vendor.js':[
          'dummy/a.js',
          emberSource.paths.jquery,
          emberSource.paths.prod,
          emberSource.paths.debug,
          'dummy/b.js'
        ]
      }
    };

    vendorSplit.removeOutputFiles(app, useSource, emberSource);
    assert.deepEqual(app._scriptOutputFiles, {'/assets/vendor.js':['dummy/a.js', 'dummy/b.js']});
  });

  it("should remove files from vendor.js when using bower", function() {
    let useSource = false;
    let emberSource = null;
    let app = {bowerDirectory: 'bower_components'}
    app._scriptOutputFiles = {
      '/assets/vendor.js':[
        'dummy/a.js',
        `${app.bowerDirectory}/jquery/dist/jquery.js`,
        `${app.bowerDirectory}/ember/ember.prod.js`,
        `${app.bowerDirectory}/ember/ember.debug.js`,
        'dummy/b.js'
      ]
    }

    vendorSplit.removeOutputFiles(app, useSource, emberSource);
    assert.deepEqual(app._scriptOutputFiles, {'/assets/vendor.js':['dummy/a.js', 'dummy/b.js']});
  });

  it('does include jQuery if the app has `@ember/optional-features` with the `jquery-integration` feature flag turned on', function() {
    let emberSource = {
      paths: {
        jquery: 'node_modules/jquery/dist/jquery.js',
        prod: 'node_modules/ember-source/dist/ember.prod.js',
        debug: 'node_modules/ember-source/dist/ember.debug.js'
      }
    };
    let importSpy = chai.spy();
    let app = {
      root: '/',
      project: {
        findAddonByName(addon) {
          if (addon === 'ember-source') {
            return emberSource;
          }
          if (addon === '@ember/optional-features') {
            return {
              isFeatureEnabled() {
                return true;
              }
            }
          }
        }
      },
      _scriptOutputFiles: {
        '/assets/vendor.js':[
          'dummy/a.js',
          emberSource.paths.jquery,
          emberSource.paths.prod,
          emberSource.paths.debug,
          'dummy/b.js'
        ]
      },
      import: importSpy,
    };

    vendorSplit.included(app);
    assert.ok(importSpy.should.have.been.called.exactly(4));
    assert.ok(importSpy.should.have.been.called.with(emberSource.paths.jquery));
    assert.deepEqual(app._scriptOutputFiles, {'/assets/vendor.js':['dummy/a.js', 'dummy/b.js']});
  });

  it('does not include jQuery if the app has `@ember/optional-features` with the `jquery-integration` feature flag turned off', function() {
    let emberSource = {
      paths: {
        jquery: 'node_modules/jquery/dist/jquery.js',
        prod: 'node_modules/ember-source/dist/ember.prod.js',
        debug: 'node_modules/ember-source/dist/ember.debug.js'
      }
    };
    let importSpy = chai.spy();
    let app = {
      root: '/',
      project: {
        findAddonByName(addon) {
          if (addon === 'ember-source') {
            return emberSource;
          }
          if (addon === '@ember/optional-features') {
            return {
              isFeatureEnabled() {
                return false;
              }
            }
          }
        }
      },
      _scriptOutputFiles: {
        '/assets/vendor.js':[
          'dummy/a.js',
          emberSource.paths.jquery,
          emberSource.paths.prod,
          emberSource.paths.debug,
          'dummy/b.js'
        ]
      },
      import: importSpy,
    };

    vendorSplit.included(app);
    assert.ok(importSpy.should.have.been.called.exactly(3));
    assert.ok(importSpy.should.not.have.been.called.with(emberSource.paths.jquery));
    assert.deepEqual(app._scriptOutputFiles, {'/assets/vendor.js':['dummy/a.js', 'dummy/b.js']});
  });
});

describe("included", function() {
  let input;

  it("should import files from ember source", function() {
    let emberSource = {
      paths: {
        jquery: 'node_modules/jquery/dist/jquery.js',
        prod: 'node_modules/ember-source/dist/ember.prod.js',
        debug: 'node_modules/ember-source/dist/ember.debug.js'
      }
    };

    const jqueryPath = emberSource.paths.jquery
    const emberProdPath = emberSource.paths.prod
    const emberDebugPath = emberSource.paths.debug
    const vendorStaticPrefixPath = path.join(__dirname, '../assets/prefix-vendor-static-eval.js');
    const vendorStaticSuffixPath = path.join(__dirname, '../assets/suffix-vendor-static-eval.js');

    const importSpy = chai.spy();

    let app = {
      project: {
        findAddonByName(addon) {
          if (addon === 'ember-source') {
            return emberSource;
          }
          if (addon === '@ember/optional-features') {
            return {
              isFeatureEnabled() {
                return true;
              }
            }
          }
        }
      },
      _scriptOutputFiles: {'/assets/vendor.js':[]},
      import: importSpy
    }

    vendorSplit.included(app);

    importSpy.should.have.been.called.exactly(4);
    importSpy.should.have.been.called.with.exactly(vendorStaticPrefixPath, { outputFile: vendorStaticFilepath });
    importSpy.should.have.been.called.with.exactly(jqueryPath, {outputFile: vendorStaticFilepath});
    importSpy.should.have.been.called.with.exactly(
      {
        development: emberDebugPath,
        production: emberProdPath
      }, {
        outputFile: vendorStaticFilepath
      }
    );
    importSpy.should.have.been.called.with(vendorStaticSuffixPath, { outputFile: vendorStaticFilepath });
  });

  it("should import files from bower", co.wrap(function* () {
    input = yield createTempDir();
    input.write({"bower.json": "x"});

    let emberSource = null;

    const importSpy = chai.spy();

    let app = {
      project: {
        findAddonByName: function() {return emberSource}
      },
      _scriptOutputFiles: {'/assets/vendor.js':[]},
      "import": importSpy,
      bowerDirectory: 'bower_components'
    }

    const jqueryPath = `${app.bowerDirectory}/jquery/dist/jquery.js`;
    const emberProdPath = `${app.bowerDirectory}/ember/ember.prod.js`;
    const emberDebugPath = `${app.bowerDirectory}/ember/ember.debug.js`;
    const vendorStaticPrefixPath = path.join(__dirname, '../assets/prefix-vendor-static-eval.js');
    const vendorStaticSuffixPath = path.join(__dirname, '../assets/suffix-vendor-static-eval.js');

    vendorSplit.included(app);
    importSpy.should.have.been.called.exactly(4);
    importSpy.should.have.been.called.with.exactly(vendorStaticPrefixPath, { outputFile: vendorStaticFilepath });
    importSpy.should.have.been.called.with.exactly(jqueryPath, {outputFile: vendorStaticFilepath});
    importSpy.should.have.been.called.with.exactly(
      {
        development: emberDebugPath,
        production: emberProdPath
      }, {
        outputFile: vendorStaticFilepath
      }
    );
    importSpy.should.have.been.called.with(vendorStaticSuffixPath, { outputFile: vendorStaticFilepath });

    yield input.dispose();
  }));
});
