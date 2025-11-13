-- CreateEnum
CREATE TYPE "public"."AssociationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."AssociationType" AS ENUM ('COOPERATIVA', 'ASSOCIAÇÃO', 'SINDICATO');

-- AlterTable
ALTER TABLE "public"."Association" ADD COLUMN     "status" "public"."AssociationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "type" "public"."AssociationType" NOT NULL DEFAULT 'ASSOCIAÇÃO';
