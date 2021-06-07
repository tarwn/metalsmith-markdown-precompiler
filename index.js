
'use strict';

const fs = require('fs');
const path = require('path');

const hbs = require('handlebars');

const type = require('./lib/get-type');

exports = module.exports = function precompile(options){

  const supportedEngines = ['handlebars'];

  if (supportedEngines.indexOf(options.engine)){
    throw new Error(`Unkwown engine: ${options.engine}. Use one of ${supportedEngines.toString()}`);
  }

  if(type(options.pattern) != 'regexp'){
    throw new Error(`The "pattern" setting must be specified as a regular expression`);
  }

  if(!options.partialsPath || type(options.partialsPath) != 'string'){
    throw new Error(`The "partialsPath" setting must be specified as a string`);
  }

  if (!options.partials || type(options.partials) != 'array' || options.partials.length == 0){
    throw new Error(`The "partials" setting must be specified as a array, and must not be empty`);
  }


  return function(files, metalsmith, done){

    let engine;

    if (options.engine === 'handlebars'){
      engine = hbs;
    }


    let source = metalsmith.source();

    options.partials.forEach(function(el) {
      let partial = fs.readFileSync(path.join(source, options.partialsPath, `${el}.html`));
      hbs.registerPartial(el, partial.toString());
    });

    for (let k in files){
      if (files.hasOwnProperty(k)){
        if (options.pattern.test(k)){
          let html = engine.compile(files[k].contents.toString())();
          files[k].contents = new Buffer(html);
        }
      }
    }

    done();
  };

};
