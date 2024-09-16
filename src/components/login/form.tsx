"use client";

import { LoginResponse } from "@/app/api/login/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

export function LoginForm() {
  // Router serve para fazer redirect de páginas
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o login ao enviar o formulário
  const handleLoginSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Previne o envio do formulário pelo navegador
      event.preventDefault();
      // Reseta os estados do formulário
      setFormError("");
      setFormLoading(true);

      // Verifica se os inputs existem na página
      if (emailInputRef.current && passwordInputRef.current) {
        // Pega os valores preenchidos nos inputs
        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;

        try {
          // tenta realizar o login
          const response = await axios.post<LoginResponse>("/api/login", {
            email,
            password: pass1,
          });

          // se chegar aqui, o login deu certo
          router.push("/");

          setFormLoading(false);
          setFormSuccess(true);
        } catch (error) {
          // Altera o estado de forma genérica, sem informar o erro
          console.log(error);
          setFormError("login invalid");
          setFormLoading(false);
          setFormSuccess(false);
        }
      }
    },
    [router]
  );

  return (
    <form onSubmit={(event) => handleLoginSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="seu@email.com.br"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              ref={passwordInputRef}
              id="password"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {/* Erro genérico por segurança */}
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no login</p>
              <p>Verifique suas credenciais.</p>
            </div>
          )}
          <Button
            className="w-full flex items-center gap-2"
            disabled={formLoading}
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Entrar
          </Button>
          <div className="mt-5 underline text-center">
            <Link href="/cadastro">Ir para o cadastro</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}