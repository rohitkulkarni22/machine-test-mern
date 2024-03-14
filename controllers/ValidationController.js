const validator = require('email-validator');

async function validateEmail(email) {
  try {
    return validator.validate(email);
  } catch (error) {
    console.error('Error validating email:', error);
    return false;
  }
}

function validateNumeric(value) {
  return !isNaN(value);
}

module.exports = {
  validateEmail,
  validateNumeric
};
