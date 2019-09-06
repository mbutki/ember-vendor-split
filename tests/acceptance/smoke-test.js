import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | smoke test');

test('tests that ember is working enough to render templates', function(assert) {
  visit('/');
  andThen(function() {
    assert.ok(document.getElementById("working"));
  });
});
