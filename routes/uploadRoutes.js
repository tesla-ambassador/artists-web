const express = require('express');
const router = express.Router();
const { generateSignedUploadUrl } = require('./lib/uploadFile.js');

// POST /api/upload/signed-url
// Generates a signed URL for file uploads to Supabase Storage
router.post('/signed-url', async (req, res) => {
  const { type, fileName } = req.body; // Expecting 'type' (audio/image) and 'fileName' from client

  // Basic validation
  if (!type || !fileName) {
    return res.status(400).json({ message: 'Missing file type or file name.' });
  }
  if (type !== 'audio' && type !== 'image') {
    return res.status(400).json({ message: 'Invalid file type. Must be "audio" or "image".' });
  }

  try {
    // Call the function to generate the signed URL
    const { uploadUrl, uploadToken, filePath } = await generateSignedUploadUrl(type, fileName);

    // Send the generated URL, token, and file path back to the client
    res.status(200).json({
      message: 'Signed upload URL generated successfully.',
      uploadUrl,     // The direct URL for PUT request
      uploadToken,   // The token for supabase.storage.uploadToSignedUrl
      filePath,      // The path where the file will be stored in Supabase
    });
  } catch (error) {
    console.error('Error generating signed upload URL:', error.message);
    res.status(500).json({ message: 'Failed to generate signed upload URL.', error: error.message });
  }
});

module.exports = router;