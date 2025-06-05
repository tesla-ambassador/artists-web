import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  scalar Date
  scalar Upload

  type Release {
    id: ID!
    title: String!
    language: String!
    genre: String!
    secondaryGenre: String
    description: String!
    features: String
    releaseType: String!
    version: String
    label: String
    referenceNo: String
    upc: String
    releaseDate: Date!
    digitalReleaseDate: Date!
    licenseType: String!
    publishingRegions: String!
    budget: String!
    artworkUrl: String
    createdAt: Date!
    updatedAt: Date!
    songs: [Song!]!
    artistRoles: [ArtistRole!]!
    legalOwners: [LegalOwner!]!
    distributionPlatforms: [DistributionPlatform!]!
  }

  type Song {
    id: ID!
    title: String!
    fileUrl: String!
    duration: Int
    fileSize: Int
    mimeType: String
    releaseId: String!
    createdAt: Date!
  }

  type ArtistRole {
    id: ID!
    artistRole: String!
    artistRoleName: String!
    releaseId: String!
  }

  type LegalOwner {
    id: ID!
    type: String!
    name: String!
    year: String!
    releaseId: String!
  }

  type DistributionPlatform {
    id: ID!
    platform: String!
    releaseId: String!
  }

  input ArtistRoleInput {
    artistRole: String!
    artistRoleName: String!
  }

  input LegalOwnerInput {
    name: String!
    year: String!
  }

  input CreateReleaseInput {
    title: String!
    language: String!
    genre: String!
    secondaryGenre: String
    description: String!
    features: String
    releaseType: String!
    version: String
    label: String
    referenceNo: String
    upc: String
    releaseDate: Date!
    digitalReleaseDate: Date!
    licenseType: String!
    publishingRegions: String!
    budget: String!
    artistRoles: [ArtistRoleInput!]!
    legalOwner: LegalOwnerInput!
    legalOwnerRelease: LegalOwnerInput!
    distributionPlatforms: [String!]!
    songFiles: [String!]!
    artworkFile: String
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Release!
    deleteRelease(id: ID!): Boolean!
  }
`;
