/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Billing" ADD COLUMN     "billingInterval" TEXT,
ADD COLUMN     "nextPaymentDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Payment";
