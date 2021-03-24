console.log(process.argv[2]);   // in a string

let parameters = JSON.parse(process.argv[2]);  // now an object
console.log(parameters);
// something extra
console.log(':-----------------:');
console.log('type: '+typeof parameters);  // in case you wonder
console.log('name : '+parameters.name);   // access a single parameter
console.log('age  : '+parameters.age);    // access a single parameter
console.log('email: '+parameters.email);  // access a single parameter
