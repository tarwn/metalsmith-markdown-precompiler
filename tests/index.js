
'use strict';

const fs = require('fs');

const tape = require('tape');
const sinon = require('sinon');

const hbs = require('handlebars');

const sut = require('../index');

tape('metalsmith-markdown-precompiler.js:', function(t) { t.end(); });

tape('check settings are validated', function(t) {

  const options = {
    engine: 'diesel',
    pattern: '.md'
  };

  t.throws(()=>sut(options), /Unkwown engine: diesel. Use one of handlebars/i, 'check exception "engine"');

  options.engine = 'handlebars';

  t.throws(()=>sut(options), /The "pattern" setting must be specified as a regular expression/i, 'check exception "pattern"');

  options.pattern = /\.markdown$/i;

  t.throws(()=>sut(options), /The "partialsPath" setting must be specified as a string/i, 'check exception "partialsPath"');

  options.partialsPath = './partials';

  t.throws(()=>sut(options), /The "partials" setting must be specified as a array, and must not be empty/i, 'check exception "partials"');
  options.partials = [];
  t.throws(()=>sut(options), /The "partials" setting must be specified as a array, and must not be empty/i, 'check exception "partials"');

  options.partials.push('demo');

  t.equal(typeof sut(options), 'function', 'returns the plugin function');

  t.end();

});

tape('partials registration', function(t) {

  const options = {
    engine: 'handlebars',
    pattern: /\.md$/,
    partialsPath: '__partials',
    partials: ['foo', 'bar']
  }

  const registerPartialStub = sinon.stub(hbs, 'registerPartial');
  const readFileStub = sinon.stub(fs, 'readFileSync');

  const fakeContent = ['foo content', 'content of bar: hello world!'];

  readFileStub.onCall(0).returns(fakeContent[0]);
  readFileStub.onCall(1).returns(fakeContent[1]);


  const files = {};

  const metalsmith = {
    source: sinon.stub().returns('src')
  }

  const doneSpy = sinon.spy();



  const precompiler = sut(options);
  precompiler(files, metalsmith, doneSpy);


  t.ok(readFileStub.calledTwice, 'Content of the partials is read from file system');

  ['foo', 'bar'].forEach(function(el, i) {
    t.ok(readFileStub.getCall(i).calledWith(`src/__partials/${el}.html`), `check ${el} partial path`);
    t.ok(registerPartialStub.getCall(i).calledWith(el, fakeContent[i]), `check ${el} partial registration`);
  });

  t.ok(doneSpy.calledOnce, 'When computation ends, the "done" callback is executed.');

  readFileStub.restore();
  registerPartialStub.restore();

  t.end();

});

tape('partials compilation', function(t) {

  const options = {
    engine: 'handlebars',
    pattern: /\.md$/,
    partialsPath: '__partials',
    partials: ['world', 'me']
  }

  const readFileStub = sinon.stub(fs, 'readFileSync');

  readFileStub.onCall(0).returns('world');
  readFileStub.onCall(1).returns('Bruno (I am Bruno)');


  const files = {
    'post1.markdown': {
      contents: new Buffer('Hello {{> world}}!')
    },
    'post2.md': {
      contents: new Buffer('Hello {{> world}}!')
    },
    'post3.md': {
      contents: new Buffer('Hello {{> world}}! Hello everybody! Hello {{> me}}!')
    }
  };

  const metalsmith = {
    source: sinon.stub().returns('src')
  }

  const doneSpy = sinon.spy();


  const precompiler = sut(options);
  precompiler(files, metalsmith, doneSpy);


  t.equal(files['post1.markdown'].contents.toString(), 'Hello {{> world}}!', 'Check file filtered by the pattern');

  t.equal(files['post2.md'].contents.toString(), 'Hello world!', 'Check compilation');
  t.equal(files['post3.md'].contents.toString(), 'Hello world! Hello everybody! Hello Bruno (I am Bruno)!', 'Check compilation (multiple partials on same files)');

  t.ok(doneSpy.calledOnce, 'When computation ends, the "done" callback is executed.');

  readFileStub.restore();

  t.end();

});
