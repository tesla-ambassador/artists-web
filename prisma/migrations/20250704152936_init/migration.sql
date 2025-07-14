-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PRIMARY_ARTIST', 'PERFORMER', 'PRODUCER', 'REMIXER', 'COMPOSER', 'LYRICIST', 'PUBLISHER', 'FEATURING_WITH', 'CONDUCTOR', 'ARRANGER', 'ORCHESTRA', 'ACTOR', 'AGENT', 'PROMOTER', 'BENEFICIARY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "locale" TEXT,
    "nickname" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "preferred_username" TEXT,
    "based_country" TEXT,
    "based_region" TEXT,
    "address" TEXT,
    "website" TEXT,
    "updated_at" TIMESTAMP(3),
    "picture" TEXT,
    "followers" TEXT,
    "monthly_plays" TEXT,
    "downloads" TEXT,
    "is_artist" BOOLEAN,
    "country" TEXT,
    "email_alerts" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "facebook" TEXT,
    "role" "Role"[],
    "influencers" TEXT[],
    "genre" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artworkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "releaseId" TEXT,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ownership" INTEGER NOT NULL,
    "releaseId" TEXT NOT NULL,

    CONSTRAINT "ArtistRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalOwner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,

    CONSTRAINT "LegalOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributionPlatform" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,

    CONSTRAINT "DistributionPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRole" ADD CONSTRAINT "ArtistRole_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalOwner" ADD CONSTRAINT "LegalOwner_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionPlatform" ADD CONSTRAINT "DistributionPlatform_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
