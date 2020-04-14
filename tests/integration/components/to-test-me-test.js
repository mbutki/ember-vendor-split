import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | to-test-me', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders',  function(assert) {
    return render(hbs`<ToTestMe />`).then(() => {
      assert.equal(this.element.innerHTML.trim(), 'Hello! I have no wrapper!!!!');
    });
  });
});
