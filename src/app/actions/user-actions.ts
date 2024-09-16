"use server";

import prisma from "@/lib/db";
import { Genero, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

type UsuarioData = {
  id: string;
  username?: string;
  name?: string;
  idade?: number;
  email: string;
  password: string;
  imageProfile?: string;
  genero?: Genero;
  bio?: string;
  localizacao?: string;
  telefone?: string;
};

type Result = {
  success: boolean;
  message: string;
};

export async function getUsuarioById(id: string) {
  if (!id) {
    throw new Error("ID do usuário não fornecido");
  }
  
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  return usuario;
}

export async function getUsuariosPorGenero(genero: Genero) {
  if (!genero) {
    throw new Error("Genero não fornecido");
  }
  
  const usuario = await prisma.usuario.findMany({
    where: { genero },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  return usuario;
}

export async function getUsuarios() {
  return prisma.usuario.findMany();
}

export async function removeUsuario(id: string): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    await prisma.usuario.delete({ where: { id } });

    result.success = true;
    result.message = "Usuário removido com sucesso!";

    revalidatePath("usuarios");
  } catch (error) {
    result.message = `Erro ao remover usuário: ${error}`;
  }

  return result;
}

export async function upsertUsuario({
  id,
  username,
  name,
  idade,
  email,
  password,
  imageProfile,
  genero,
  bio,
  localizacao,
  telefone,
}: UsuarioData): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    const newUsuario = await prisma.usuario.upsert({
      where: { id: id ?? "" },
      update: {
        username,
        name,
        idade,
        email,
        password,
        imageProfile,
        genero,
        bio,
        localizacao,
        telefone,
      },
      create: {
        username,
        name,
        idade,
        email,
        password,
        imageProfile,
        genero,
        bio,
        localizacao,
        telefone,
      },
    });

    result.success = true;
    result.message = `Usuário ${newUsuario.name} ${id ? 'atualizado' : 'criado'} com sucesso!`;

    revalidatePath("usuarios");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        result.message = `Usuário ${username} já existe.`;
      } else {
        result.message = `Erro ao criar/atualizar usuário: ${error.message}`;
      }
    }

    console.error(error);
  }

  return result;
}

// export async function getPhotos(usuarioId: string) {
//   const photos = await getPhotosFromS3(usuarioId);

//   return photos;
// }

export async function deletePhoto(key: string): Promise<Result> {
  const result: Result = { success: false, message: "" };

  try {
    revalidatePath('/');
    result.success = true;
    result.message = "Foto do usuário removida com sucesso!";
  } catch (error) {
    result.message = `Erro ao remover foto do usuário: ${error}`;
  }

  return result;
}