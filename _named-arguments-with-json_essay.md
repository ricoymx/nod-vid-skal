>**ricoy**  
>dev@ricoy.mx  
>(date 2021 03 18)

# Named Arguments for Javascript (NodeJS) with JSON

This is an exercise in using JSON to encapsulate the arguments sent to update the parameters in a NodeJS program, it's written for command line execution but can be used inside a function. This is part of the **node at shell** series.

There are, of course, libraries to process an argument list in the style of a ``nix`` command and ``json``, like:

- [argparse@npm](https://www.npmjs.com/package/argparse)
- [nix-clap@npm](https://www.npmjs.com/package/nix-clap)
- [subarg@npm](https://www.npmjs.com/package/subarg)

Looking forward for information exchange with other applications, which emit ``json`` results, we are going to take a simpler avenue. We can see this approach used in libraries and frameworks like ``JQuery``.

### Environment

This is my working environment, but I suspect the code will work in other environments without change.

```sh
% node -v
v14.15.1

% echo "$SHELL"
/bin/zsh

% sw_vers
ProductName: Mac OS X
ProductVersion: 10.15.7
BuildVersion: 19H2
```
## Named Parameters

*Named Parameters*, *Named Arguments*, *Keyword Parameters* or *Keyword Arguments* refer to the support of a programming language to name of each parameter in a function call. This gives ability to reference the parameter but also open the opportunity of using all, a subset, or none of the parameters.

Javascript does not support named parameters, so it not rare to find something like this:
```javaScript
Date(1995, 3, 4);
```
Is it March 4th or April 3th? (wait for it)
```javaScript
% node --eval 'console.log((new Date(1995, 3, 4)));'
> 1995-04-04T06:00:00.000Z
```
Actually neither, but thats a problem of implementation. In ([MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)) casually mentions in one example that ``month``, which is the second parameter by the way, starts on 0 (``// the month is 0-indexed``).

In languages which support *named parameters* we could have something like the following *Lisp* example:

```clojure
(blend :apples 1 )
(blend :apples 1 :oranges 2 :kiwis 3)
(blend)
(blend :kiwis 1 :oranges 1)
```

## Named Parameters in Javascript

Lets start with the basics, reading parameters from the command line.

Lets create this file:

> ``args.js``
> ```javascript
console.log(process.argv);
```
>> and run like so:
```bash
% node args
[
  '/usr/local/bin/node',
  '/Users/dev/essays/github_ricoymx_nod-vid-skal/nod-vid-skall/args'
]
```
Which sure enough gives us which node is running and the path of the program we created. So now lets feed it some parameters:
```bash
% node args parameter-1 value-1 -e --clean parameter-2 value-2
[
  '/usr/local/bin/node',
  '/Users/dev/essays/github_ricoymx_nod-vid-skal/nod-vid-skall/args',
  'parameter-1',
  'value-1',
  '-e',
  '--clean',
  'parameter-2',
  'value-2'
]
```
An then document and parse the options.   
So now lets pass a ``javascript`` object as parameter:
```bash
% node args '{name: "sven", age: "23", email: "sven@mail.se"}'
[
  '/usr/local/bin/node',
  '/Users/dev/essays/github_ricoymx_nod-vid-skal/nod-vid-skall/args',
  '{name: "sven", age: "23", email: "sven@mail.se"}'
]
```
which puts the object in the third position.

Son now let start working on that object. Les create change the file to the following:

> ``args2.js``
> ```javascript
console.log(process.argv[2]);
```
>> and run like so:
```bash
% node args2 '{name: "sven", age: "23", email: "sven@mail.se"}'
{name: "sven", age: "23", email: "sven@mail.se"}
```
giving us the raw object to work with. By the way as of now it still is a text string.

So now we transmogrify it to an actual ``javascript`` object.
> ``argsj.js``
> ```javascript
console.log(process.argv[2]);  // in a string  
let parameters = eval("("+process.argv[2]+")");  // now an object
console.log(parameters);
// something extra
console.log(':-----------------:');
console.log('type: '+typeof parameters);  // in case you wonder
console.log('name : '+parameters.name);   // access a single parameter
console.log('age  : '+parameters.age);    // access a single parameter
console.log('email: '+parameters.email);  // access a single parameter
```
>> and now we have more options:
```bash
% node argsj '{name: "sven", age: "23", email: "sven@mail.se"}'
{name: "sven", age: "23", email: "sven@mail.se"}
{ name: 'sven', age: '23', email: 'sven@mail.se' }
:-----------------:
type: object
name : sven
age  : 23
email: sven@mail.se
```
The first result is the argument as string.  
The second line is converted into an object, which can now be processed.  
And finally we can access individual elements

#### Danger Will Robinson!
> Although this is presented as proof of concept,
the use of **eval** is discouraged because you could inject harmful code.  
You could conceptually validate the input to avoid this but it's outside of our present scope.


## So where's JSON?

We are going to tweak our code for two things. First to work with *valid* JSON and then to write to standard output, so it would align to the ``nix`` philosophy of emiting plain text and be the input and input of other appications.

This would be our next iteration, very close to the one before:
> ``argsjson1.js``
> ```javascript
console.log(process.argv[2]);   // in a string
let parameters = JSON.parse(process.argv[2]);  // now an object
console.log(parameters);
// something extra
console.log(':-----------------:');
console.log('type: '+typeof parameters);  // in case you wonder
console.log('name : '+parameters.name);   // access a single parameter
console.log('age  : '+parameters.age);    // access a single parameter
console.log('email: '+parameters.email);  // access a single parameter
```
>> but,
```bash
% node argsjson1 '{name: "sven", age: "23", email: "sven@mail.se"}'
{name: "sven", age: "23", email: "sven@mail.se"}
undefined:1
{name: "sven", age: "23", email: "sven@mail.se"}
 ^
SyntaxError: Unexpected token n in JSON at position 1
    at JSON.parse (<anonymous>)
    at Object.<anonymous> (/Users/dev/essays/github_ricoymx_nod-vid-skal/nod-vid-skall/argsjson1.js:3:23)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
```
We get an error because we have been working with a *javascript object initializing string*. So let's change it to a valid ``json`` structure by quoting the attributes. That easy, remember the **js** in ``json`` stands for ``javascript``. In the process change the age to a number for clarity sake; you could have it either way depending on the final use.
```bash
% node argsjson1 '{"name": "sven", "age": 23, "email": "sven@mail.se"}'
{"name": "sven", "age": "23", "email": "sven@mail.se"}
{ name: 'sven', age: 23, email: 'sven@mail.se' }
:-----------------:
type: object
name : sven
age  : 23
email: sven@mail.se
```
Same as before.

We have been using ``console.log`` for our workout which is fine, it gives us great flexibility, but it adds a *carriage return* on each call.

Now we're moving to ``process.stdout.write`` in which ``console.log`` is built upon. Giving us more flexibility but haver to take care of many things that ``console.log`` did for us.

The reworked version is as follows:

> ``argsjson2.js``
> ```javascript
process.stdout.write(process.argv[2]+'\n');  // in a string
// process.stdout.write deals only with strings. No included carriage return.
let parameters = JSON.parse(process.argv[2]);  // now an object
process.stdout.write(require('util').format("%o", parameters)+'\n');
// util.format is similar to C sprintf. %o is for object.
// something extra
process.stdout.write(':-----------------:');
process.stdout.write('type: '+typeof parameters+'\n');  // in case you wonder
process.stdout.write('name : '+parameters.name+'\n');   // access a single parameter
process.stdout.write('age  : '+parameters.age+'\n');    // access a single parameter
process.stdout.write('email: '+parameters.email+'\n');  // access a single parameter
process.stderr.write(' * No error here *'+'\n');  // and now, presenting
// running from the console stdout and stderr use the same stream.
```
>> and now:
```bash
% node argsjson2 '{"name": "sven", "age": 23, "email": "sven@mail.se"}'
{"name": "sven", "age": 23, "email": "sven@mail.se"}
{ name: 'sven', age: 23, email: 'sven@mail.se' }
:-----------------:
type: object
name : sven
age  : 23
email: sven@mail.se
 * No error here *
```
Same as before.

## Validation

Validation and default values.

he first result is the argument as string.  
The second line is converted into an object, which can now be processed.  
And finally we can access individual elements

let's make make a test function to test our validation cases.




let defaults = {"nitrogen":123, "potassium":246, "calcium":63};
process.stdout.write(require('util').format("%o", defaults)+'\n');
process.stdout.write((typeof defaults)+'\n');


function change1(options){
  if(options != null && typeof options ==='object' && !Array.isArray(options)){
    console.log('si pasó');
    for(let key in options){
      //console.log('-key: '+key+', value: '+options[key]);
      if(!['directory', 'filename', 'fullpath'].includes(key)){
        console.log('ERROR: unknown parameter ['+key+']');
      } else {
        console.log('key: '+key+', value: '+options[key]);
      }
    }
  } else {
    console.log('no pasó');
  }
}
change1();
change1(123);
change1('hola');
change1("nix");
change1([1,2,3]);
change1({uno:'ett'});  //property not found
change1({uno:'ett', dos:'två' });  //property not found
change1({uno:'ett', directory:'miau'});  //property not found
change1({directory:'ett', filename:'två', fullpath:'tre'});
change1({directory:'ett', fileneme:'två', fullpath:'tre'});  // syntax error
change1({directory:'ett', dos:'två', fullpath:'tre'});  //property not found


### references:

 * https://rosettacode.org/wiki/Named_parameters

revisions: v1#20210318

tags: #ricoy #nodejs #javascript #shell #zsh #function #arguments #parameters #json #git #ricoymx #elchidisimo

contact: [ricoy](dev@ricoy.mx)  
feedback: essays@ricoy.mx
