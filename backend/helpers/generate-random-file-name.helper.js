import crypto from 'crypto';

function generateRandomFileName() {
    const randomBytes = crypto.randomBytes(16);
    const fileName = randomBytes.toString('hex');
    return fileName;
  }

export { generateRandomFileName };