import { getUsuarioById, getUsuarios } from "@/app/actions/user-actions";
import { notFound } from "next/navigation";
import UserList from "@/components/user-list";

export default async function Page({
	params,
}: { params: { userId: string } }) {
	const usuarioLogado = await getUsuarioById(params.userId);
    const usuarios = await getUsuarios();

    if (!params.userId) {
        notFound(); 
    }

    return (
        <main>
            <UserList usuarios={usuarios} usuarioLogado={usuarioLogado} />
        </main>
    );
}

