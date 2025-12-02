/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Member" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "imageUrl";
