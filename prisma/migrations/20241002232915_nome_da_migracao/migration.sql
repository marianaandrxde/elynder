-- CreateTable
CREATE TABLE "LikeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userIdCurtido" TEXT NOT NULL,

    CONSTRAINT "LikeProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikeProfile" ADD CONSTRAINT "LikeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeProfile" ADD CONSTRAINT "LikeProfile_userIdCurtido_fkey" FOREIGN KEY ("userIdCurtido") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
