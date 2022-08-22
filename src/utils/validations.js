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

export const STDX_MSG_TYPES = {
  unjail: "pos/MsgUnjail",
  unjail8: "pos/8.0MsgUnjail",
  unstake: "pos/MsgBeginUnstake" ,
  unstake8: "pos/8.0MsgBeginUnstake",
  stake: "pos/MsgStake",
  send: "pos/Send",
};
