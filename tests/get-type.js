
'use strict';

const tcase = require('tape-case');

const type = require('../lib/get-type');

const testcases = [
  { description: 'Boolean', args: [ true ], result: 'boolean' },
  { description: 'Number', args: [ 42 ], result: 'number' },
  { description: 'String', args: [ 'hello' ], result: 'string' },
  { description: 'Object', args: [ {foo:'bar'} ], result: 'object' },
  { description: 'Array', args: [ [1,2,3] ], result: 'array' },
  { description: 'Array of null(s)', args: [ [null] ], result: 'array' },
  { description: 'Null', args: [ null ], result: 'null' },
  { description: 'Undefined', args: [ void 0 ], result: 'undefined' },
  { description: 'Function', args: [ x=>x ], result: 'function' },
  { description: 'Date', args: [ new Date() ], result: 'date' },
  { description: 'RegExp', args: [ /^hello/i ], result: 'regexp' }
];

tcase(testcases, subject => type(subject));
