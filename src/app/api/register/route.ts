import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { Usuario } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";
import { cookies } from "next/headers";

interface RegisterProps {
  email: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  error?: string;
  user?: Usuario;
}

/**
 * Realiza o cadastro
 */
export async function POST(request: Request) {
  const body = (await request.json()) as RegisterProps;

  const { email, password, password2 } = body;

  if (!email || !password || !password2) {
    return NextResponse.json(
      { error: "missing required fields" },
      { status: 400 }
    );
  }

  const emailReg = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );

  if (!emailReg.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  if (password.length < 8 || password !== password2) {
    return NextResponse.json({ error: "invalid password" }, { status: 400 });
  }

  const hash = bcrypt.hashSync(password, 12);

  try {
    const prisma = PrismaGetInstance();

    const user = await prisma.usuario.create({
      data: {
        email,
        password: hash,
      },
    });

    const sessionToken = GenerateSession({
      email,
      passwordHash: hash,
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

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // usuário já existe
        return NextResponse.json(
          { error: "user already exists" },
          { status: 400 }
        );
      }
    }
  }
}