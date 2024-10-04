"use client";

import { Button } from "@/components/ui/button";
import { curtirPerfil } from "@/app/actions/likes-perfis";
import Link from "next/link";
import { UsuarioData } from "@/app/actions/user-actions";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface UserListProps {
  usuarioLogado: UsuarioData;
  usuarios: UsuarioData[];
}

export default function UserList({ usuarioLogado, usuarios }: UserListProps) {
  const handleCurtir = async (usuarioId: string) => {
    const result = await curtirPerfil(usuarioLogado.id, usuarioId);
    alert(result.message);
  };

  return (
    <div className="flex flex-col shadow-sm pt-4 mx-20 space-y-4">
        <div>
			<h1 className="text-lg font-semibold md:text-2xl mt-6">Usuários</h1>
		</div>
      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="flex items-center justify-between border rounded-lg shadow-md w-full p-3 bg-white hover:shadow-lg transition-shadow duration-200"
        >
          <Avatar className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
            <AvatarFallback className="bg-pink-700 text-white font-medium text-2xl flex items-center justify-center w-full h-full">
              {usuario.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 ml-4">
            <h2 className="font-semibold text-lg">{usuario.name}</h2>
            <p className="text-sm text-gray-600">{usuario.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/usuarios/${usuario.id}/myprofile`}>
              <Button className="bg-slate-500 hover:bg-slate-800 text-white">
                Detalhes
              </Button>
            </Link>
            <Button
              onClick={() => handleCurtir(usuario.id)}
              className="bg-red-600 hover:bg-rose-800 text-white"
            >
              Curtir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
