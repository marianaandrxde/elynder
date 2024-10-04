"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

type LikeData = {
  id?: string;
  userId: string;
  postId: string;
};

type Result = {
  success: boolean;
  message: string;
};

export async function getLikeById(id: string) {
  const like = await prisma.like.findUnique({
    where: { id },
    include: {
      user: true,
      post: true,
    },
  });

  return like;
}

export async function getLikes() {
  return prisma.like.findMany({
    include: {
      user: true,
      post: true,
    },
  });
}

export async function removeLike(id: string): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    await prisma.like.delete({ where: { id } });

    result.success = true;
    result.message = "Curtida removida com sucesso!";

    revalidatePath("likes");
  } catch (error) {
    result.message = `Erro ao remover curtida: ${error}`;
  }

  return result;
}

export async function upsertLike({
  id,
  userId,
  postId,
}: LikeData): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    const newLike = await prisma.like.upsert({
      where: { id: id ?? "" },
      update: {
        userId,
        postId,
      },
      create: {
        userId,
        postId,
      },
    });

    result.success = true;
    result.message = `Curtida ${newLike.id} ${id ? 'atualizada' : 'criada'} com sucesso!`;

    revalidatePath("likes");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        result.message = `Curtida com ID ${id} já existe.`;
      } else {
        result.message = `Erro ao criar/atualizar curtida: ${error.message}`;
      }
    }

    console.error(error);
  }

  return result;
}
