import Ember from 'ember';
import { module, test } from 'qunit';

module('EmberENV', function() {
  // reference https://github.com/emberjs/ember.js/blob/v3.16.7/packages/%40ember/-internals/environment/lib/env.ts#L38
  test('sets a custom EmberENV before Ember.ENV is setup', function(assert) {
    assert.strictEqual(Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION, true)
  })
});