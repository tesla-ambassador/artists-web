import { prisma } from "../lib/db";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

const DateScalar = new GraphQLScalarType({
  name: "Date",
  serialize: (value: any) =>
    value instanceof Date ? value.toISOString() : value,
  parseValue: (value: any) => new Date(value),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
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
        orderBy: {
          createdAt: "desc",
        },
      });
    },

    release: async (_: any, { id }: { id: string }) => {
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
    createRelease: async (_: any, { input }: { input: any }) => {
      const {
        artistRoles,
        legalOwner,
        legalOwnerRelease,
        distributionPlatforms,
        songFiles,
        artworkFile,
        ...releaseData
      } = input;

      // Create the release with all related data
      const release = await prisma.release.create({
        data: {
          ...releaseData,
          artworkUrl: artworkFile || null,
          songs: {
            create: songFiles.map((fileUrl: string, index: number) => ({
              title: `Track ${index + 1}`, // You might want to extract this from metadata
              fileUrl,
            })),
          },
          artistRoles: {
            create: artistRoles,
          },
          legalOwners: {
            create: [
              {
                type: "owner",
                name: legalOwner.name,
                year: legalOwner.year,
              },
              {
                type: "release",
                name: legalOwnerRelease.name,
                year: legalOwnerRelease.year,
              },
            ],
          },
          distributionPlatforms: {
            create: distributionPlatforms.map((platform: string) => ({
              platform,
            })),
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

    deleteRelease: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.release.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        console.error("Error deleting release:", error);
        return false;
      }
    },
  },
};
