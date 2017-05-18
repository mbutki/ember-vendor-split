"use strict";

const expect = require('chai').expect;
const { createBuilder, createTempDir } = require("broccoli-test-helper");

const Funnel = require('broccoli-funnel');
const vendorSplit = require("../index");
const co = require('co');
const log = require('broccoli-stew').log;

describe("MyBroccoliPlugin", function() {
  let input;
  let output;
  let subject;

  beforeEach(co.wrap(function* () {
    input = yield createTempDir();

    input.write({
      "bower_components": {
        "jquery": {
          "dist": {
             "jquery.js": "var x = 1;",
           }
        },
        "ember": {
          "ember.debug.js": "var y = 2;",
          "ember.prod.js": "var z = 3;"
        }
      },
      "assets": {
        "test.js": "var q = 4;"
      }
    });
  }));

  afterEach(co.wrap(function* () {
    yield input.dispose();
    yield output.dispose();
  }));

  it("should build", co.wrap(function* () {
    let fakeAppTree = new Funnel(input.path() + '/assets', { include: ['test.js'], destDir: input.path() + '/assets' });
    let fakeApp = {
      toTree: function() {return fakeAppTree}
    }
    let fakeDefaults = {
      project:{
        findAddonByName: function() {
          return {
            paths: {
              prod: input.path()+ '/bower_components/ember/ember.prod.js',
              debug: input.path()+ '/bower_components/ember/ember.debug.js',
              jquery: input.path() + '/bower_components/jquery/dist/jquery.js'
            }
          }
        }
      }
    }
    subject = vendorSplit.mergeStaticIntoAppTree(fakeApp, 'production', input.path(), fakeDefaults);

    output = createBuilder(subject);
    yield output.build();

    let outMock = {
      "assets": {
        "test.js": "var q = 4;",
        "vendor-static.js": "var x = 1;\nvar z = 3;//# sourceMappingURL=vendor-static.map\n",
        "vendor-static.map": "{\"version\":3,\"sources\":[\"jquery.js\",\"ember.prod.js\"],\"sourcesContent\":[\"var x = 1;\",\"var z = 3;\"],\"names\":[],\"mappings\":\"AAAA;ACAA\",\"file\":\"vendor-static.js\"}"
      }
    };

    const splitPath = input.path().split("/");
    for (let i = splitPath.length-1; i > 0; i--) {
      let x = {};
      x[splitPath[i]] = outMock;
      outMock = x;
    }

    expect(
      output.read()
    ).to.deep.equal(outMock);
  }));
});
