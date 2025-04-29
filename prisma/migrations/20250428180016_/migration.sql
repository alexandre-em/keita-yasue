/*
  Warnings:

  - You are about to drop the column `reservationHistoriesId` on the `reservations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservation_histories_id]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_reservationHistoriesId_fkey";

-- DropIndex
DROP INDEX "reservations_reservationHistoriesId_key";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "reservationHistoriesId",
ADD COLUMN     "reservation_histories_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservation_histories_id_key" ON "reservations"("reservation_histories_id");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reservation_histories_id_fkey" FOREIGN KEY ("reservation_histories_id") REFERENCES "reservation_histories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
