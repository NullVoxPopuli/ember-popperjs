# [3.0.0](https://github.com/NullVoxPopuli/ember-popperjs/compare/v2.0.9...v3.0.0) (2022-05-30)


### chore

* switch to ember-modifier for glint support ([3007196](https://github.com/NullVoxPopuli/ember-popperjs/commit/3007196dfa7eb51c26e39547fc600641e1a73f32))


* Merge pull request #142 from NullVoxPopuli/addon-v2 ([12f6259](https://github.com/NullVoxPopuli/ember-popperjs/commit/12f6259abf0a4ab5b083303864d0d14ece467831)), closes [#142](https://github.com/NullVoxPopuli/ember-popperjs/issues/142)


### Features

* convert to v2 format ([8a660aa](https://github.com/NullVoxPopuli/ember-popperjs/commit/8a660aa04c3e6e01b4e497ad473a00637a8f8d1b))


### BREAKING CHANGES

* support / requirements have changed
- ember-3.27 dropped, minimum Ember is now 3.28. 3.25+ should work but is not tested against
- ember-modifier is now a requirement (via peer dependency), due to Glint support
- minimum versions of the following dependencies have been bumped:
    - "@embroider/addon-shim": "^1.7.1",(dep)
    - "@popperjs/core": "^2.11.1" (dep)
    - "ember-modifier": ">= 3.2.7" (peer)
* previously, this addon could be used without
ember-modifier, but in order to provide a better experience for glint,
ember-modifier is the *only* modifier approach supported...
