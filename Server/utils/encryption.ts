import CryptoJS from 'crypto-js';
import crypto from 'crypto';

const secret_key = "TbEQb0TDG9D64Xt544xLFofSBmxtJ7l6";
const secret_key_main = "aPKyaDO4h4F8MQd3";
const init_vector = "TbALdMOhDS6aec1U";
const PASSWORD_SPEC = "61504b7961444f34683446384d516433";
const GCM_IV_LENGTH = 12;
const GCM_TAG_LENGTH = 16;

export const encodePassword = (userName, password) => {
  const passEncrypted = CryptoJS.AES.encrypt(
    `${userName}_${password}`,
    secret_key
  ).toString();
  return passEncrypted;
};

export function encrypt(data) {
  const keyHex = CryptoJS.enc.Utf8.parse(secret_key_main);
  const initVector = CryptoJS.enc.Utf8.parse(init_vector);

  const encrypted = CryptoJS.AES.encrypt(data, keyHex, {
    iv: initVector,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

export function decrypt(encrypted) {
  const keyHex = CryptoJS.enc.Utf8.parse(secret_key_main);
  const initVector = CryptoJS.enc.Utf8.parse(init_vector);

  const decrypted = CryptoJS.AES.decrypt(encrypted, keyHex, {
    iv: initVector,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function getKeySpec() {
  return PASSWORD_SPEC;
}

function encryptNew(plaintext, key, IV) {
  const keyBuffer = Buffer.from(key, 'hex');
  const cipher = crypto.createCipheriv('aes-128-gcm', keyBuffer, IV, {
    authTagLength: GCM_TAG_LENGTH
  });
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);
  return ciphertext;
}

function decryptNew(ciphertext, key, IV) {
  const keyBuffer = Buffer.from(key, 'hex');
  const tag = ciphertext.slice(ciphertext.length - GCM_TAG_LENGTH);
  const encryptedText = ciphertext.slice(0, ciphertext.length - GCM_TAG_LENGTH);

  const decipher = crypto.createDecipheriv('aes-128-gcm', keyBuffer, IV, {
    authTagLength: GCM_TAG_LENGTH
  });
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return plaintext;
}

export function getEncryptedText(plainText) {
  try {
    const IV = crypto.randomBytes(GCM_IV_LENGTH);
    const iv = IV.toString('base64');
    const cipherText = encryptNew(plainText, getKeySpec(), IV);
    const text = cipherText.toString('base64');
    return iv + text;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function getDecryptedText(cipherText) {
  try {
    const buffer = Buffer.from(cipherText, 'base64');
    const iv = buffer.subarray(0, GCM_IV_LENGTH);
    const encryptedText = buffer.subarray(GCM_IV_LENGTH);

    const data = decryptNew(encryptedText, getKeySpec(), iv);
    return data.toString();
  } catch (e) {
    console.error(e);
    return "";
  }
}
