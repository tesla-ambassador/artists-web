const { generateSignedUploadUrl } = require('../lib/uploadFile.js'); // Adjust this path if needed
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

(async () => {
  try {
    // Local file info
    const localFilePath = 'C:\\Users\\tedya\\Music\\embrace-364091.mp3';
    const originalFileName = path.basename(localFilePath); // embrace-364091.mp3

    // Step 1: Get signed URL and file path
    const { signedUrl, filePath } = await generateSignedUploadUrl('audio', originalFileName);
    console.log('Signed URL:', signedUrl);
    console.log('Supabase Path:', filePath);

    // Step 2: Read the local file
    const fileBuffer = fs.readFileSync(localFilePath);

    // Step 3: Upload to Supabase using signed URL
    const response = await axios.put(signedUrl, fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg', // Adjust if needed
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
