const { generateSignedUploadUrl } = require('./lib/uploadFile'); // Adjust this path
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

(async () => {
  try {
    const localFilePath = 'C:\\Users\\tedya\\Music\\embrace-364091.mp3';
    const originalFileName = path.basename(localFilePath); // embrace-364091.mp3

    const { signedUrl, filePath } = await generateSignedUploadUrl('audio', originalFileName);
    console.log('Signed URL:', signedUrl);
    console.log('Supabase Path:', filePath);

    const fileBuffer = fs.readFileSync(localFilePath);

    const response = await axios.put(signedUrl, fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

    if (response.status === 200) {
      console.log('✅ Upload successful!');
    } else {
      console.error(`⚠️ Upload returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();