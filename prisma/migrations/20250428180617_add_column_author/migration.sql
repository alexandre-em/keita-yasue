/*
  Warnings:

  - Added the required column `author_id` to the `reservation_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservation_histories" ADD COLUMN     "author_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "reservation_histories" ADD CONSTRAINT "reservation_histories_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
