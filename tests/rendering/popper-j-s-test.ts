import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { PopperJS } from 'ember-popperjs';

module('<PopperJS>', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    await render(hbs`
      <PopperJS as |trigger popover hasPopper|>
        <button type="button" {{trigger}}></button>
        <div {{popover}}>woo</div>
        <out>{{hasPopper}}</out>
      </PopperJS>
    `);

    assert.dom('out').hasText('true');
  });

  test('it works with import', async function (assert) {
    this.setProperties({ PopperJS });
    await render(hbs`
      <this.PopperJS as |trigger popover hasPopper|>
        <button type="button" {{trigger}}></button>
        <div {{popover}}>woo</div>
        <out>{{hasPopper}}</out>
      </this.PopperJS>
    `);

    assert.dom('out').hasText('true');
  });

  module('destruction', function (hooks) {
    hooks.beforeEach(async function (assert) {
      this.setProperties({
        hasWrapper: true,
        hasButton: true,
        hasPopover: true,
      });

      await render(hbs`
        {{#if this.hasWrapper}}
          <PopperJS as |trigger popover hasPopper|>
            {{#if this.hasButton}}
              <button type="button" {{trigger}}></button>
            {{/if}}

            {{#if this.hasPopover}}
              <div {{popover}}>woo</div>
            {{/if}}

            <out>{{hasPopper}}</out>
          </PopperJS>
        {{/if}}
      `);

      assert.dom('out').hasText('true');
    });

    test('trigger is destroyed', async function (assert) {
      this.setProperties({ hasButton: false });
      await settled();

      assert.dom('out').hasText('false');
    });

    test('popover is destroyed', async function (assert) {
      this.setProperties({ hasPopover: false });
      await settled();

      assert.dom('out').hasText('false');
    });

    test('the whole thing is destroyed', async function (assert) {
      this.setProperties({ hasWrapper: false });
      await settled();

      // mostly making sure we don't throw an exception or anything
      // these assertions aren't all that meaningful, other than for
      // sanity checking....
      assert.dom('button').doesNotExist();
      assert.dom('div').doesNotExist();
      assert.dom('out').doesNotExist();
    });
  });
});
