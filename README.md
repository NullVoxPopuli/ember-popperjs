# ember-popperjs

[![npm version](https://badge.fury.io/js/ember-popperjs.svg)](https://badge.fury.io/js/ember-popperjs)
[![CI](https://github.com/NullVoxPopuli/ember-popperjs/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/NullVoxPopuli/ember-popperjs/actions/workflows/ci.yml)



## Compatibility

* Ember.js v3.25 or above
* Ember CLI v3.25 or above
* Webpack v5 or above
* ember-auto-import v2 or above

## Installation

```
ember install ember-popperjs
```

## Usage

Example building a `<Menu />` component
```hbs
<PopperJS as |trigger popover|>
  <button {{trigger}} class="button-classes">
    {{yield to="trigger"}}
  </button>

  <div {{popover}} class="popover-classes">
    This is a popover!
    {{yield to="default"}}
  </div>
</PopperJS>
```
Not that neither Popper.JS nor this addon provide styles for making a popover.
However, this addon pairs nicely with TailWind and [HeadlessUI](https://github.com/GavinJoyce/ember-headlessui)
and a menu popover may look like: 

```hbs
<Menu as |menu|>
  <PopperJS as |trigger popover|>
    <menu.Button
      {{trigger}}
      class="
        text-black
        relative rounded-sm border border-gray-900 bg-white px-2 py-1 -my-1 text-left
        transition ease-in-out duration-150 sm:text-sm
        focus:ring-4 focus-visible:outline-none ring-ember-brand focus:outline-none
      "
      ...attributes
    >
      {{yield menu to="trigger"}}
    </menu.Button>

    <menu.Items
      {{popover}}
      class="absolute top-2 z-20 grid mt-1 rounded-sm bg-white shadow-lg min-w-max"
      as |items|
    >
      {{yield (component 'limber/menu/button' item=items.Item) to="options"}}
    </menu.Items>
  </PopperJS>
</Menu>
```

### API

#### arguments

##### `@placement`

The default placement is `"bottom-end"`, but any placement described by the
`Placement` options on the [popper.js](https://popper.js.org/docs/v2/constructors/#options) site will work.

For example,

```hbs
<PopperJS @placement="top" as |trigger popover|>
  ...
</PopperJS>
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
