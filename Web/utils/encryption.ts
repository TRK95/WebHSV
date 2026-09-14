import CryptoJS from 'crypto-js';

const secret_key = "TbEQb0TDG9D64Xt544xLFofSBmxtJ7l6";
const secret_key_main = "aPKyaDO4h4F8MQd3";
const init_vector = "TbALdMOhDS6aec1U";

export const encodePassword = (userName: string, password: string): string => {
  let passEncrypted = CryptoJS.AES.encrypt(
    userName + "_" + password,
    secret_key
  ).toString();
  // passEncrypted = '8287cb17da36320f7bb4e4712ecd27b84f4f1684120745555c7ac94c5a0feb95'
  return passEncrypted;
};

export function encrypt(data: string): string {
  const keyHex = CryptoJS.enc.Utf8.parse(secret_key_main);
  const initVector = CryptoJS.enc.Utf8.parse(init_vector);

  const encrypted = CryptoJS.AES.encrypt(data, keyHex, {
    iv: initVector,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

export function decrypt(encrypted: string): string {
  const keyHex = CryptoJS.enc.Utf8.parse(secret_key_main);
  const initVector = CryptoJS.enc.Utf8.parse(init_vector);

  const decrypted = CryptoJS.AES.decrypt(encrypted, keyHex, {
    iv: initVector,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

const crypto = require('crypto');
const GCM_IV_LENGTH = 12;
const GCM_TAG_LENGTH = 16;
const PASSWORD_SPEC = "61504b7961444f34683446384d516433"

export function getEncryptedText(plainText: string) {
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
    cipherText = buffer.subarray(GCM_IV_LENGTH);
    console.log("cipherText: ", cipherText)

    const data = decryptNew(cipherText, getKeySpec(), iv);

    return data.toString();
  } catch (e) {
    console.error(e);
    return "";
  }
}

function getKeySpec() {
  return PASSWORD_SPEC
}

function encryptNew(plaintext, key, IV) {
  // console.log('key:', key)
  const keyBuffer = Buffer.from(key, 'hex');
  const cipher = crypto.createCipheriv('aes-128-gcm', keyBuffer, IV, {
    authTagLength: 16
  });
  const ciphertext = cipher.update(plaintext);
  return Buffer.concat([ciphertext, cipher.final(), cipher.getAuthTag()]);
}

function decryptNew(ciphertext, key, IV) {
  const keyBuffer = Buffer.from(key, 'hex');
  const tag = ciphertext.slice(ciphertext.length - GCM_TAG_LENGTH);
  ciphertext = ciphertext.slice(0, ciphertext.length - GCM_TAG_LENGTH);

  const decipher = crypto.createDecipheriv('aes-128-gcm', keyBuffer, IV, {
    authTagLength: 16
  });
  decipher.setAuthTag(tag);
  const plaintext = decipher.update(ciphertext);
  return Buffer.concat([plaintext, decipher.final()]);
}