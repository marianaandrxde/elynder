import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { cookies } from "next/headers";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";

interface LoginProps {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: string;
}

export const revalidate = 0;

/**
 * Verifica o estado da autenticação, pegando o token de login nos cookies
 * Verifica se a sessão existe, se não expirou e se ainda está válida
 * Retorna 401 se não permitir a autenticação e 200 se permitir
 */
export async function GET(request: NextRequest) {
  const authCookie = cookies().get("auth-session");

  const sessionToken = authCookie?.value || "";

  const prisma = PrismaGetInstance();
  const session = await prisma.sessions.findFirst({
    where: {
      token: sessionToken,
    }, select: {
      userId: true, // Assumindo que o ID do usuário está armazenado neste campo
      valid: true,
      expiresAt: true,
    },
  });

  if (!session || !session.valid || session.expiresAt < new Date()) {
    return NextResponse.json({}, { status: 401 });
  }

  return NextResponse.json({session}, { status: 200 });
}

/**
 * Realiza o login
 */
export async function POST(request: Request) {
  const body = (await request.json()) as LoginProps;

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
  }

  try {
    const prisma = PrismaGetInstance();

    const user = await prisma.usuario.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const userPassword = user.password;
    const passwordResult = bcrypt.compareSync(password, userPassword);

    if (!passwordResult) {
      return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
    }

    const sessionToken = GenerateSession({
      email,
      passwordHash: userPassword,
    });

    await prisma.sessions.create({
      data: {
        userId: user.id,
        token: sessionToken,
        valid: true,
        expiresAt: addHours(new Date(), 24),
      },
    });

    cookies().set({
      name: "auth-session",
      value: sessionToken,
      httpOnly: true,
      expires: addHours(new Date(), 24),
      path: "/",
    });

    return NextResponse.json({ session: sessionToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
  }
}