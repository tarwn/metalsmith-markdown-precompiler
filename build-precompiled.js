
'use strict';

const path = require('path');

const Metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const layouts = require('metalsmith-layouts');
const evaluate = require('metalsmith-in-place');


function skip(options){
  return function(files, metalsmith, done){
    for (let k in files){
      if (files.hasOwnProperty(k) && options.pattern.test(k)){
        delete files[k];
      }
    }
    done();
  };
};

const precompile = require('./index');


const ms = new Metalsmith(process.cwd());


ms
  .source('./sample/src')
  .use(skip({ pattern: /^__/ }))
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))


  /*
   * metalsmith-markdown-precompiler
   * In this example ...
   */
  .use(precompile({

    // engine to use to perform the precompilation
    engine: 'handlebars',

    // precompilation is executed only on the files
    // which match the following pattern
    pattern: /\.md$/,

    // path where the partial templates are located.
    // it should be relative to the path configured as "source" for metalsmith.
    partialsPath: '__partials',

    // name of the partial files which should be registered, and compiled.
    partials: ['figure', 'video', 'quote']

  }))


  .use(markdown())
  .use(permalinks(':title'))
  .use(evaluate({
    engine: 'handlebars',
    partials: './sample/src/__partials',
    cache: false
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './sample/src/__layouts'
  }))
  .destination('./sample/dist-precompiled')
  .build(function(err) {
    if (err) {
      throw err;
    }
    console.log('DONE!');
  });
