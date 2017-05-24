import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import $ from 'jquery';

moduleForAcceptance('Acceptance | vendor is split');

const jqueryIdentifier = 'jQuery JavaScript Library';
const emberIdentifier = 'Ember - JavaScript Application Framework';

test('files get moved from vendor.js to vendor-static.js', function(assert) {
  let done = assert.async(2);
  visit('/');
  andThen(function() {
    $.ajax({
      url: '/assets/vendor-static.js',
      success: function(data) {
        assert.ok(data.indexOf(jqueryIdentifier) !== -1);
        assert.ok(data.indexOf(emberIdentifier) !== -1);
        done();
      },
      dataType: 'script'
    });

    $.ajax({
      url: '/assets/vendor.js',
      success: function(data) {
        assert.ok(data.indexOf(jqueryIdentifier) === -1);
        assert.ok(data.indexOf(emberIdentifier) === -1);
        done();
      },
      dataType: 'script'
    });
  });
});
