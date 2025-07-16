/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - The `followers` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `monthly_plays` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `downloads` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
DROP COLUMN "followers",
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "monthly_plays",
ADD COLUMN     "monthly_plays" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "downloads",
ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0;
