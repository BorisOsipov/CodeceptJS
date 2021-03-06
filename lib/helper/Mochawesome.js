'use strict';
let addMochawesomeContext;
let currentTest;
let currentSuite;
const Helper = require('../helper');
const clearString = require('../utils').clearString;
const requireg = require('requireg');
const path = require('path');


class Mochawesome extends Helper {

  constructor(config) {
    super(config);

    // set defaults
    this.options = {
      uniqueScreenshotNames: false,
      disableScreenshots: false
    };

    addMochawesomeContext = requireg('mochawesome/addContext');
    this._createConfig(config);
  }

  _createConfig(config) {
    // override defaults with config
    Object.assign(this.options, config);
  }

  _beforeSuite(suite) {
    currentSuite = suite;
  }

  _before() {
    currentTest = {test: currentSuite.ctx.currentTest};
  }

  _test(test) {
    currentTest = {test: test};
  }


  _failed(test) {
    if (this.options.disableScreenshots) return;
    let fileName;
    // Get proper name if we are fail on hook
    if (test.ctx.test.type == "hook") {
      currentTest = {test: test.ctx.test};
      // ignore retries if we are in hook
      test._retries = -1;
      fileName = clearString(`${test.title}_${currentTest.test.title}`);
    } else {
      currentTest = {test: test};
      fileName = clearString(test.title);
    }
    if (this.options.uniqueScreenshotNames) {
      let uuid = test.uuid || test.ctx.test.uuid;
      fileName = `${fileName.substring(0, 10)}_${uuid}`;
    }
    if (test._retries < 1 || test._retries == test.retryNum) {
      fileName = `${fileName}.failed.png`;
      return addMochawesomeContext(currentTest, fileName);
    }
  }

  addMochawesomeContext(context) {
    return addMochawesomeContext(currentTest, context);
  }

}

module.exports = Mochawesome;
