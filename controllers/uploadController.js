const asyncHandler = require("express-async-handler");
const { prisma } = require("../lib/db");

/**
 * Records metadata of an uploaded file linked to a user.
 * Expects: { filePath, type, title? } in req.body
 * req.user.id must contain Prisma User UUID (from auth middleware)
 */
const recordUpload = asyncHandler(async (req, res) => {
  const { filePath, type, title } = req.body;
  const userId = req.user.id;

  if (!filePath || !type) {
    res.status(400);
    throw new Error("filePath and type are required.");
  }

  const upload = await prisma.upload.create({
    data: {
      filePath,
      type,
      title,
      userId,
    },
  });

  res.status(201).json({
    message: "Upload recorded successfully",
    upload,
  });
});

/**
 * Link multiple uploads to a release.
 * Expects: { releaseId, uploadIds } in req.body
 */
const linkUploadsToRelease = asyncHandler(async (req, res) => {
  const { releaseId, uploadIds } = req.body;

  if (!releaseId || !Array.isArray(uploadIds)) {
    res.status(400);
    throw new Error("releaseId and uploadIds array are required.");
  }

  await prisma.upload.updateMany({
    where: {
      id: { in: uploadIds },
    },
    data: {
      releaseId,
    },
  });

  res.status(200).json({ message: "Uploads linked to release successfully" });
});

module.exports = {
  recordUpload,
  linkUploadsToRelease,
};
