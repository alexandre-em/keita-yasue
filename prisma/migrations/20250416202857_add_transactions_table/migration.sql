-- CreateEnum
CREATE TYPE "Package" AS ENUM ('ONE_HOUR_PACK', 'FOUR_HOURS_PACK', 'TWELVE_HOURS_PACK', 'TWO_PERSONS_PACK', 'THREE_PERSONS_PACK', 'FOUR_PERSONS_PACK');

-- DropIndex
DROP INDEX "idx_user_id";

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "Status" NOT NULL DEFAULT 'IDLE',
    "package_type" "Package" NOT NULL DEFAULT 'ONE_HOUR_PACK',
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
