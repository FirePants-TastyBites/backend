import crypto from 'crypto';

export function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex'); 
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let key = Buffer.from(text.key, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log('Decrypted toString -->', decrypted.toString());
    return decrypted.toString();
}