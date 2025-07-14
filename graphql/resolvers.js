const { GraphQLScalarType, Kind } = require("graphql");
const { prisma } = require("../lib/db.js");
const { uploadToS3 } = require("../lib/uploadFile");
const { v4: uuidv4 } = require("uuid");

const DateScalar = new GraphQLScalarType({
  name: "Date",
  serialize: value => value instanceof Date ? value.toISOString() : value,
  parseValue: value => new Date(value),
  parseLiteral: ast => (ast.kind === Kind.STRING ? new Date(ast.value) : null),
});

const resolvers = {
  Date: DateScalar,

  Query: {
    releases: async () => {
      return await prisma.release.findMany({
        include: {
          songs: true,
          artistRoles: true,
          legalOwners: true,
          distributionPlatforms: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },

    release: async (_, { id }) => {
      return await prisma.release.findUnique({
        where: { id },
        include: {
          songs: true,
          artistRoles: true,
          legalOwners: true,
          distributionPlatforms: true,
        },
      });
    },
  },

  Mutation: {
    createRelease: async (_, { input }) => {
      const {
        artistRoles,
        legalOwner,
        legalOwnerRelease,
        distributionPlatforms,
        songFiles,
        artworkFile,
        ...releaseData
      } = input;

      // Upload artwork to S3
      let artworkUrl = null;
      if (artworkFile) {
        const buffer = Buffer.from(artworkFile, "base64");
        artworkUrl = await uploadToS3(
          buffer,
          `artwork-${uuidv4()}.png`,
          process.env.AWS_S3_BUCKET_IMAGES,
          "image/png"
        );
      }

      // Upload songs to S3
      const uploadedSongs = await Promise.all(
        songFiles.map(async (base64, index) => {
          const buffer = Buffer.from(base64, "base64");
          const fileUrl = await uploadToS3(
            buffer,
            `track-${uuidv4()}.mp3`,
            process.env.AWS_S3_BUCKET_SONGS,
            "audio/mpeg"
          );
          return {
            title: `Track ${index + 1}`,
            fileUrl,
          };
        })
      );

      // Save everything to DB
      const release = await prisma.release.create({
        data: {
          ...releaseData,
          artworkUrl,
          songs: {
            create: uploadedSongs,
          },
          artistRoles: {
            create: artistRoles,
          },
          legalOwners: {
            create: [
              { type: "owner", ...legalOwner },
              { type: "release", ...legalOwnerRelease },
            ],
          },
          distributionPlatforms: {
            create: distributionPlatforms.map((platform) => ({ platform })),
          },
        },
        include: {
          songs: true,
          artistRoles: true,
          legalOwners: true,
          distributionPlatforms: true,
        },
      });

      return release;
    },

    deleteRelease: async (_, { id }) => {
      try {
        await prisma.release.delete({ where: { id } });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    generateAudioUploadURL: async () => {
      return await generateUploadURL("audio");
    },

    generateImageUploadURL: async () => {
      return await generateUploadURL("image");
    },
  },
};

module.exports = resolvers;
