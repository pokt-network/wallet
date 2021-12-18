/**
 * Validates wheter or not str is a valid hex string
 * @param {string} str string to validate
 * @returns {boolean} - True or false if the string is hex.
 */
function isHex(str) {
  const regexp = new RegExp("^[0-9a-fA-F]+$");
  return regexp.test(str);
}

/**
 * crypto-js implementation
 * Gets the length of a hex string in its byte format
 * @param {string} str - string to check.
 * @returns {number} - The string length in bytes.
 * @memberof Hex
 */
function getByteLength(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes.length;
}

/**
 *
 *  Validates if the given address satisfies the format used on the Pocket Blockchain.
 *  Pocket addresses are not checksummed, so the method to follow is check if its:
 *  1. A valid hex string, AND
 *  2. its length in bytes is 20.
 * @param {string} address - Address to be verified.
 * @returns {boolean} - If the address is valid or not.
 */
export function isAddress(address) {
  if (
    isHex(address) &&
    getByteLength(address) === 20 &&
    address.length % 2 === 0
  ) {
    return true;
  }
  return false;
}
