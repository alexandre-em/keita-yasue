/*
  Warnings:

  - A unique constraint covering the columns `[reservationHistoriesId]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "reservationHistoriesId" UUID;

-- CreateTable
CREATE TABLE "reservation_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "old_start_date" TIMESTAMP(3) NOT NULL,
    "old_end_date" TIMESTAMP(3) NOT NULL,
    "new_start_date" TIMESTAMP(3) NOT NULL,
    "new_end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservationHistoriesId_key" ON "reservations"("reservationHistoriesId");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reservationHistoriesId_fkey" FOREIGN KEY ("reservationHistoriesId") REFERENCES "reservation_histories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
