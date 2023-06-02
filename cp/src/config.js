
import { AES } from 'crypto-js'
import CryptoJS from 'crypto-js'

const SITE_URL = 'https://gaiko-souba-net.icdl.tokyo/cp/'
const SECRET_KEY = '+@V0.1'
const LOCAL_URL = 'http://localhost/gaiko-souba-api/v1'
const SERVER_URL = 'https://gaiko-souba-net.icdl.tokyo/v1'
const PREFIX = '/api'


export const APP = {
    'SITE_URL': SITE_URL,
    'SECRET_KEY': SECRET_KEY,
    'encryptID': (id) => {
        // Encrypt the ID
        const encryptedId = AES.encrypt(id.toString(), SECRET_KEY).toString();
        // URL-encode the encrypted ID with UTF-8 support
        const encodedEncryptedId = encodeURIComponent(encryptedId);
        return encodedEncryptedId;
    },
    'decryptID': (encryptedID) => {
        // URL-decode the encodedEncryptedId
        const decodedEncryptedId = decodeURIComponent(encryptedID);
        // Decrypt the encoded and encrypted ID
        const decryptedId = AES.decrypt(decodedEncryptedId, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return decryptedId;
    },
    'API': {
        'PREFIX': PREFIX,
        'LOCAL_URL': LOCAL_URL,
        'SERVER_URL': SERVER_URL,
        'ACTIVE_API_URL': LOCAL_URL
    }
}