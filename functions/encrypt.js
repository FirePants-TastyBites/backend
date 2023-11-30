import crypto from 'crypto';

export function encrypt(text) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    //Hur ska man göra med key? env variabel lr går det bra att skicka den till db? är det säkert att göra så som jag har gjort?
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), key: key.toString('hex') } 
}