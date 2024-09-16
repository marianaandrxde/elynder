"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

type ComentarioData = {
  id?: string;
  userId: string;
  postId: string;
};

type Result = {
  success: boolean;
  message: string;
};

export async function getComentarioById(id: string) {
  const comentario = await prisma.comentario.findUnique({
    where: { id },
    include: {
      user: true,
      post: true,
    },
  });

  return comentario;
}

export async function getComentarios() {
  return prisma.comentario.findMany({
    include: {
      user: true,
      post: true,
    },
  });
}

export async function removeComentario(id: string): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    await prisma.comentario.delete({ where: { id } });

    result.success = true;
    result.message = "Comentário removido com sucesso!";

    revalidatePath("comentarios");
  } catch (error) {
    result.message = `Erro ao remover comentário: ${error}`;
  }

  return result;
}

export async function upsertComentario({
  id,
  userId,
  postId,
}: ComentarioData): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    const newComentario = await prisma.comentario.upsert({
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
    result.message = `Comentário ${newComentario.id} ${id ? 'atualizado' : 'criado'} com sucesso!`;

    revalidatePath("comentarios");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        result.message = `Comentário com ID ${id} já existe.`;
      } else {
        result.message = `Erro ao criar/atualizar comentário: ${error.message}`;
      }
    }

    console.error(error);
  }

  return result;
}
