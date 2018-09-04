/**
 * @ngdoc module
 * @name functions
 * @description A module that contains function definitions.
 */

'use strict';

const _ = require('lodash');

/**
 * @ngdoc function
 * @name add
 * @module functions
 * @description Adds two values, either numeric or strings.
 *
 * @param {Number|String} v1 The first value.
 * @param {Number|String} v2 The second value.
 *
 * @return {Number|String} Returns the value of `v1 + v2`.
 */

function _add(v1, v2) {
    return v1 + v2;
};

module.exports = {
    add: _add
};
