const passPhraseErrorType = {
  length: 1,
  capital: 2,
  lowercase: 4,
  number: 8,
  symbol: 16,
};

function getPassphraseError(passphrase) {
  var error = 0;

  error += passphrase.length >= 15 ? 0 : passPhraseErrorType.length;
  error += /.*[A-Z].*/.test(passphrase) ? 0 : passPhraseErrorType.capital;
  error += /.*[a-z].*/.test(passphrase) ? 0 : passPhraseErrorType.lowercase;
  error += /.*[0-9].*/.test(passphrase) ? 0 : passPhraseErrorType.number;
  error += /.*[!@#$%^&*].*/.test(passphrase) ? 0 : passPhraseErrorType.symbol;

  return error;
}

function isPassphraseValid(passphrase) {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  return passwordRegex.test(passphrase);
}

export { getPassphraseError, isPassphraseValid, passPhraseErrorType };
