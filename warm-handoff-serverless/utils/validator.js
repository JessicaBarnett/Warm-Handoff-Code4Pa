module.exports.validationMessage = (body, fieldsToValidate) => {
    // should all eval to true for a correct value
    const validatorFuncs = {
        first_name: (firstName) => {
            return typeof firstName === 'string';
        },
        last_name: (lastName) => {
            return typeof lastName === 'string';
        },
        phone_number: (phoneNumber) => {
            return typeof phoneNumber === 'string';
        },
        address: (address) => {
            return typeof address === 'string';
        }
    }

    const errors = fieldsToValidate.reduce((errorsArray, errorKey) => {
        if (validatorFuncs[errorKey] && errorKey in body && !validatorFuncs[errorKey](body[errorKey])) {
            errorsArray.push(errorKey);
        }
        return errorsArray;
    }, ['The following params are invalid or missing: ']);

    return errors.length === 1 ? '' : errors.join(' ');
}

// Test cases - will incorporate into real tests later

// var a = ['first_name', 'last_name', 'phone_number', 'address'];

// var o1 = {a: 'a', b: 'b', c: 'c', d: 'd'};
// var r1 = module.exports.validationMessage(o1, a); // ''

// var o2 = {
//     first_name: 'a',
//     last_name: 'b',
//     phone_number: 'c',
//     address: 'd'
// };
// var r2 = module.exports.validationMessage(o2, a); // ''

// var o3 = {
//     first_name: 'a',
//     last_name: undefined,
//     phone_number: 10,
//     address: true
// };
// var r3 = module.exports.validationMessage(o3, a); // 'The following params are invalid or missing: last_name phone_number address'
