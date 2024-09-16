"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

type PostagemData = {
  id?: string;
  userId: string;
  conteudo: string;
  image?: string;
  qtdCurtidas?: number;
  qtdDescurtidas?: number;
  published?: boolean;
};

type Result = {
  success: boolean;
  message: string;
};

export async function getPostagemById(id: string) {
  const postagem = await prisma.postagem.findUnique({
    where: { id },
    include: {
      user: true,
      comentarios: true,
      curtidas: true,
    },
  });

  return postagem;
}

export async function getPostagens() {
  return prisma.postagem.findMany({
    include: {
      user: true,
      comentarios: true,
      curtidas: true,
    },
  });
}

export async function removePostagem(id: string): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    const postagem = await prisma.postagem.findUnique({ where: { id } });
    
    if (postagem?.image) {
      // Remove the image from S3 if applicable
      // await deletePhotoFromS3(postagem.image);  // Uncomment if you have image deletion logic
    }

    await prisma.postagem.delete({ where: { id } });

    result.success = true;
    result.message = "Postagem removida com sucesso!";

    revalidatePath("postagens");
  } catch (error) {
    result.message = `Erro ao remover postagem: ${error}`;
  }

  return result;
}

export async function upsertPostagem({
  id,
  userId,
  conteudo,
  image,
  qtdCurtidas = 0,
  qtdDescurtidas = 0,
  published = false,
}: PostagemData): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    const newPostagem = await prisma.postagem.upsert({
      where: { id: id ?? "" },
      update: {
        userId,
        conteudo,
        image,
        qtdCurtidas,
        qtdDescurtidas,
        published,
      },
      create: {
        userId,
        conteudo,
        image,
        qtdCurtidas,
        qtdDescurtidas,
        published,
      },
    });

    result.success = true;
    result.message = `Postagem ${newPostagem.id} ${id ? 'atualizada' : 'criada'} com sucesso!`;

    revalidatePath("postagens");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        result.message = `Postagem com ID ${id} já existe.`;
      } else {
        result.message = `Erro ao criar/atualizar postagem: ${error.message}`;
      }
    }

    console.error(error);
  }

  return result;
}

// export async function getPhotos(postagemId: string) {
//   const photos = await getPhotosFromS3(postagemId);

//   return photos;
// }

export async function deletePhoto(key: string): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    // Delete the photo from S3 if applicable
    // await deletePhotoFromS3(key);  // Uncomment if you have image deletion logic

    revalidatePath('/');
    result.success = true;
    result.message = "Foto da postagem removida com sucesso!";
  } catch (error) {
    result.message = `Erro ao remover foto da postagem: ${error}`;
  }

  return result;
}
