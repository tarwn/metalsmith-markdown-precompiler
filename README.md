# metalsmith-markdown-precompiler

A Metalsmith plugin that precompiles markdown files.

You might need to use a template in your markdown documents.

```
# example from sample/src/posts/post1.markdown

Hello world! This is a simple post I'm writing to share an image, and since I want that images look consistent on my blog, I am using a partial to define the markup.

{{> figure src="kitten.jpg" title="A kitten"}}
```

The problem here is that [marked](https://github.com/chjj/marked) (used by metalsmith-markdown) to parse the markdown, is not too happy when meet expressions like `{{> foo}}`:

```
Error: Parse error on line 2:
...e markup.</p><p>{{&gt; figure src=&quot
----------------------^
Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'INVALID'
```

The solution it's to use `metalsmith-markdown-precompiler` to precompile the markdown files replacing the partials with their effective content, before using metalsmith-markdown.

## setup

```
npm i -s metalsmith-markdown-precompiler
```

## demo

Take a look at the file build-precompiled.js to have a demo of the correct usage.
The results are available under `sample/dist-precompiled` folder.

## options

`metalsmith-markdown-precompiler` accepts the following settings:

```
engine
---
The engine to use to perform the precompilation.
Currently the only supported engine is handlebars.

pattern
---
Define a pattern to filter the file on which the precompilation
should be executed.
It should be a regexp.

partialsPath
---
The path where the partial templates are located.
It should be relative to the path configured as "source" for metalsmith.

partials
---
Names of the partial files which should be registered, and compiled.
It should be an array.
```
