import "@glint/environment-ember-loose";
import "@glint/environment-ember-loose/native-integration";
import "ember-page-title/glint";
import "ember-popperjs/glint";

// import type { ComponentLike, HelperLike, ModifierLike } from "@glint/template";

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    // App-specific overrides here
  }
}
