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
