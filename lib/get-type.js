
/**
 * @name get-type
 * @function
 * @description Return the type of the input value; it fix the problem with "null", and brings consistence (array, date ...).
 */

'use strict';

exports = module.exports = subject => Object.prototype.toString.call(subject).toLowerCase().match(/ ([\w]+)/)[1];
