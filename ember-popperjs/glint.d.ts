import '@glint/environment-ember-loose';
import '@glint/environment-ember-loose/native-integration';

import type { PopperJS } from './dist/index';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'popper-j-s': typeof PopperJS;
    PopperJS: typeof PopperJS;
  }
}
