"use client";

import { RegisterResponse } from "@/app/api/register/route";
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

export function RegisterForm() {
  // Router serve para fazer redirect de páginas
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const password2InputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o cadastro ao enviar o formulário
  const handleRegisterSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Previne o envio do formulário pelo navegador
      event.preventDefault();
      // Reseta os estados do formulário
      setFormError("");
      setFormLoading(true);

      // Regex para verificar e-mail
      const emailReg = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );

      // Verifica se os inputs existem na página
      if (
        emailInputRef.current &&
        password2InputRef.current &&
        passwordInputRef.current
      ) {
        // Pega os valores preenchidos nos inputs
        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;
        const pass2 = password2InputRef.current.value;

        // Começa não precisando dar erro nenhum
        let shouldReturnError = false;

        // Caso encontre algum erro de validação,
        // altera o estado de erro
        if (!emailReg.test(email)) {
          setFormError("Digite um e-mail válido.");
          shouldReturnError = true;
        }

        if (pass1.length < 8) {
          setFormError("A senha precisa ter pelo menos 8 caracteres.");
          shouldReturnError = true;
        }

        if (pass1 !== pass2) {
          setFormError("As senhas não são iguais.");
          shouldReturnError = true;
        }

        if (shouldReturnError) {
          setFormLoading(false);
          setFormSuccess(false);
          return;
        }

        try {
          // Tenta fazer o cadastro
          // Se o AXIOS retornar um erro, ele vai dar um throw new AxiosError()
          // que vai ser verificado no catch()
          const response = await axios.post<RegisterResponse>("/api/register", {
            email,
            password: pass1,
            password2: pass2,
          });

          // Se chegou aqui, o cadastro deu certo
          router.push("/");

          setFormLoading(false);
          setFormSuccess(true);
        } catch (error) {
          // Se chegou aqui, ocorreu um erro nao tentar cadastrar o usuário
          // Verificamos se é uma instância do AxiosError só para tipar o erro
          if (error instanceof AxiosError) {
            // O erro vem dentro de response.data, como JSON, de acordo com a tipagem
            const { error: errorMessage } = error.response
              ?.data as RegisterResponse;

            // Se o usuário já existe, sugere mandar para o login
            if (errorMessage === "user already exists") {
              setFormError(
                "Esse e-mail já está registrado. Tente ir para o login."
              );
            } else {
              setFormError(errorMessage || error.message);
            }
          }
          setFormLoading(false);
          setFormSuccess(false);
        }
      }
    },
    [router]
  );

  return (
    <form onSubmit={(event) => handleRegisterSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>
            Insira seus dados para se cadastrar.
          </CardDescription>
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
          <div className="grid gap-2">
            <Label htmlFor="password2">Repita a senha</Label>
            <Input
              ref={password2InputRef}
              id="password2"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no formulário</p>
              <p>{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-rose-600 mb-4">
              <p className="text-sm font-semibold">
                Cadastro realizado, redirecionando para o app
              </p>
            </div>
          )}
          <Button
            className="w-full flex items-center gap-2"
            disabled={formLoading}
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Cadastrar
          </Button>
          <div className="mt-5 underline text-center">
            <Link href="/login">Ir para o login</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}