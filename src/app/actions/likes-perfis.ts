"use server";

import prisma from "@/lib/db";
import { Genero, Prisma, Usuario } from "@prisma/client";
import { revalidatePath } from "next/cache";

type LikeProfile = {
  id: string;
  userId: string;
  user: Usuario;
  userIdCurtido?: number;
  userCurtido: Usuario;
};

type Result = {
  success: boolean;
  message: string;
};

export async function getLikesPerfis() {
    return prisma.likeProfile.findMany({
      include: {
        user: true,
        userCurtido: true,
      },
    });
}

export async function getLikesPorPerfil(id: string) {
    return prisma.likeProfile.findMany({
      where: {
        userId: id,
    },
    });
}

export async function curtirPerfil(userId: string, userIdCurtido: string): Promise<Result> {
    const result: Result = { success: false, message: "" };
  
    try {
      const curtiuAntes = await prisma.likeProfile.findFirst({
        where: {
          userId: userId,
          userIdCurtido: userIdCurtido,
        },
      });
  
      if (curtiuAntes) {
        result.message = "Você já curtiu este perfil.";
        return result;
      }
      await prisma.likeProfile.create({
        data: {
          userId: userId,
          userIdCurtido: userIdCurtido,
        },
      });
  
      result.success = true;
      result.message = "Perfil curtido com sucesso!";
    } catch (error) {
      result.message = "Erro ao curtir o perfil.";
      console.error(error);
    }
  
    return result;
}










