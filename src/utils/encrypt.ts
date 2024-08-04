import CryptoJS from 'crypto-js';

// 固定的16字节密钥（128位）
export const key = 'imm6sco23gx97qml';

// AES 加密
export function encrypt(timestamp, plaintext, key) {

    // 拼接时间戳和明文
    const data = timestamp + "||" + plaintext;
    const iv = CryptoJS.lib.WordArray.random(16); // 生成16字节的随机IV
    // AES 加密
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 返回 IV 和 密文的组合，并进行 base64 编码
    const ivAndCipherText = iv.concat(encrypted.ciphertext);
    return ivAndCipherText.toString(CryptoJS.enc.Base64);
}
