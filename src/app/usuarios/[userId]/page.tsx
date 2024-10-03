import { getUsuarioById, getUsuarios, removeUsuario } from "@/app/actions/user-actions";
import { RemoveButton } from "@/components/remove-button";
import { AddButton } from "@/components/ui/add-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardIcon, LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { curtirPerfil } from "../../actions/likes-perfis";
import UserList from "@/components/user-list";

export default async function Page({
	params,
}: { params: { userId: string } }) {
	const usuarioLogado = await getUsuarioById(params.userId);
    const usuarios = await getUsuarios();

    if (!params.userId) {
        notFound(); // Retorna uma página 404 se o ID do usuário não estiver presente
    }

    return (
        <main>
            <h1>Usuário logado: {usuarioLogado.name}</h1>
            <UserList usuarios={usuarios} usuarioLogado={usuarioLogado} />
        </main>
    );
}

