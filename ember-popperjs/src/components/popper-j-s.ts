import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isDestroyed, isDestroying, registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';

import { createPopper } from '@popperjs/core';
import { modifier } from 'ember-modifier';

import type { Options, Placement } from '@popperjs/core';

interface Signature {
  Args: {
    placement?: Placement;
    options?: Options | ((reference: Element, popover: Element) => Options);
  };
  Blocks: {
    default: [PopperJS['trigger'], PopperJS['popover']];
  };
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
export class PopperJS extends Component<Signature> {
  declare _referenceElement?: Element;
  declare _popoverElement?: Element;
  declare _popper?: ReturnType<typeof createPopper>;

  // This is yielded out, but it's not public API
  @tracked isShown = false;

  trigger = modifier(
    (element: Element) => {
      this._referenceElement = element;

      if (this._popoverElement) this.positionPopover();

      return () => {
        this._referenceElement = undefined;
        this._popper?.destroy();
        this.isShown = false;
      };
    },
    { eager: false }
  );

  popover = modifier(
    (element: Element) => {
      this._popoverElement = element;

      if (this._referenceElement) this.positionPopover();

      return () => {
        this._popoverElement = undefined;
        this._popper?.destroy();
        this.isShown = false;
      };
    },
    { eager: false }
  );

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

export default PopperJS;

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
