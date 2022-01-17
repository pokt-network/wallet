export function isPassphraseValid(passphrase) {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  return passwordRegex.test(passphrase);
}

export function validationError(type) {
  if (type === VALIDATION_ERROR_TYPES.input)
    return { border: `2px solid #F93232` };
}

export const VALIDATION_ERROR_TYPES = {
  input: "input",
};
