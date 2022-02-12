import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { setComponentTemplate } from '@ember/component';
import { isDestroyed, isDestroying, registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';
import { hbs } from 'ember-cli-htmlbars';

import { createPopper } from '@popperjs/core';

import { modifier } from './-function-modifier';

import type { Options } from '@popperjs/core';
import type Popper from '@popperjs/core';

interface Args {
  placement?: Popper.Placement;
  options?: Options | ((reference: HTMLElement, popover: HTMLElement) => Options);
}

/**
 * This component does not use a long-lived instance of popper as most examples
 * in popper's documentation do.
 *
 * This component *is* persistent, _but_ because in SPAs, it's common to not
 * render what you can't see, the actual popover DOM elements do not exist
 * until the {{trigger}} element is.. triggered.
 * So, when the popover is closed, the _popoverElement is lost, and the popper
 * instance is destroyed.
 *
 * *if* popper had an api to update what the popover element was, then we could
 * avoid all this destruction and re-creating.
 *
 */
export class PopperJS extends Component<Args> {
  declare _referenceElement?: HTMLElement;
  declare _popoverElement?: HTMLElement;
  declare _popper?: Popper.Instance;

  // This is yielded out, but it's not public API
  @tracked isShown = false;

  trigger = modifier((element: HTMLElement) => {
    this._referenceElement = element;

    if (this._popoverElement) this.positionPopover();

    return () => {
      this._referenceElement = undefined;
      this._popper?.destroy();
      this.isShown = false;
    };
  });

  popover = modifier((element: HTMLElement) => {
    this._popoverElement = element;

    if (this._referenceElement) this.positionPopover();

    return () => {
      this._popoverElement = undefined;
      this._popper?.destroy();
      this.isShown = false;
    };
  });

  @action
  positionPopover() {
    const { _popoverElement: popover, _referenceElement: reference } = this;
    const { placement, options } = this.args;

    if (!popover) return;
    if (!reference) return;

    let opts: Partial<Options> = getOptions(placement);

    if (options) {
      if (typeof options === 'function') {
        opts = options(reference, popover);
      } else {
        opts = options;
      }
    }

    this._popper = createPopper(reference, popover, opts);

    this.isShown = true;

    registerDestructor(this, () => {
      this._popper?.destroy();

      if (isDestroying(this) || isDestroyed(this)) return;

      this.isShown = false;
    });
  }
}

setComponentTemplate(
  hbs`
    {{yield this.trigger this.popover this.isShown}}
  `,
  PopperJS
);

function getOptions(placement?: Options['placement']) {
  return {
    placement: placement || 'bottom-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  };
}
