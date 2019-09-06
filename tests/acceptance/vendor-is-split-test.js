import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | vendor is split');

const jqueryIdentifier = 'jQuery JavaScript Library';
const emberIdentifier = 'Ember - JavaScript Application Framework';

test('files get moved from vendor.js to vendor-static.js', function(assert) {
  let done = assert.async(2);
  visit('/');
  andThen(function() {
    fetch('/assets/vendor-static.js')
      .then(response => response.text())
      .then(data => {
        assert.ok(data.indexOf(jqueryIdentifier) !== -1);
        assert.ok(data.indexOf(emberIdentifier) !== -1);
        done();
      });
    });
    fetch('/assets/vendor.js')
    .then(response => response.text())
    .then(data => {
      assert.ok(data.indexOf(jqueryIdentifier) === -1);
      assert.ok(data.indexOf(emberIdentifier) === -1);
      done();
    });
  });
