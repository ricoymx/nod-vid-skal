function validate(parameters){
  if((typeof parameters) !== 'object'){
    process.stderr.write('* error *\n')
  } else {
    process.stdout.write('OK\n');
  }
}

process.stdout.write('= Validation Tests =================\n');

validate();
validate(null);
validate(1);
validate('bravo');
validate("charlie");
validate([4, 3, 2]);
validate({alfa: "one", bravo:"two", charlie:"three"});
validate({"ett": "uñas", "två":"duques", "tre":"tripas"});

// process inputs
