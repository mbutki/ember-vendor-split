# ember-vendor-split

[![Build Status](https://travis-ci.org/mbutki/ember-vendor-split.svg?branch=master)](https://travis-ci.org/mbutki/ember-vendor-split)

Splits the vendor.js into a dynamic (vendor.js) and static (vendor-static.js) half. Supports both ember-source and bower instalization filepaths.

*NOTE:* As of v2.0, this addon will check whether you have [jQuery integration enabled](https://guides.emberjs.com/release/configuring-ember/optional-features/#toc_jquery-integration). This means you will need to be running Ember 3.4.0 or later to ensure Ember does not require jQuery.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-vendor-split`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200)

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

## Fastboot compatibility
* This addon is compatible with fastboot 1.0 release. To use this addon with fastboot app, please include ember-cli-fastboot version 1.0.5 or above in your app as well.

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
