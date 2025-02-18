const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Use a secure key
const iv = crypto.randomBytes(16); // Initialization vector

function encryptFile(buffer) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decryptFile(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encrypted.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted.encryptedData, 'hex')), decipher.final()]);
  return decrypted;
}

module.exports = { encryptFile, decryptFile };