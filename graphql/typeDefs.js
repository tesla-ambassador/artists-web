const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Song {
    id: ID!
    title: String!
    fileUrl: String!
  }

  input ArtistRoleInput {
    name: String!
    role: String!
    ownership: Int!
  }

  input LegalOwnerInput {
    name: String!
    year: Int!
  }

  type ArtistRole {
    id: ID!
    name: String!
    role: String!
    ownership: Int!
  }

  type LegalOwner {
    id: ID!
    name: String!
    year: Int!
    type: String!
  }

  type DistributionPlatform {
    id: ID!
    platform: String!
  }

  type Release {
    id: ID!
    title: String!
    artworkUrl: String
    songs: [Song!]!
    artistRoles: [ArtistRole!]!
    legalOwners: [LegalOwner!]!
    distributionPlatforms: [DistributionPlatform!]!
    createdAt: Date!
  }

  input CreateReleaseInput {
    title: String!
    artworkFile: String
    artistRoles: [ArtistRoleInput!]!
    legalOwner: LegalOwnerInput!
    legalOwnerRelease: LegalOwnerInput!
    distributionPlatforms: [String!]!
    songFiles: [String!]!
  }

  # Presigned S3 Upload URL Response
  type UploadURL {
    uploadURL: String!
    key: String!
    bucket: String!
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Release
    deleteRelease(id: ID!): Boolean

    # New: Generate presigned URLs for file uploads
    generateAudioUploadURL: UploadURL
    generateImageUploadURL: UploadURL
  }
`;

module.exports = typeDefs;
