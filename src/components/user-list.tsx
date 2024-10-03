// components/UserList.tsx
"use client";

import { Button } from "@/components/ui/button"; // Importando o componente de botão que você estiver usando
import { curtirPerfil } from "@/app/actions/likes-perfis";
import Link from "next/link";

export default function UserList({ usuarioLogado, usuarios }) {
    const handleCurtir = async (usuarioId: string) => {
        const result = await curtirPerfil(usuarioLogado.id, usuarioId);
        alert(result.message); // Exibir a mensagem de retorno
    };

    return (
        <div className="justify-center shadow-sm pt-4">
            {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center">
                        <h2 className="font-semibold">{usuario.name}</h2>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <Link href={`/usuarios/${usuario.id}`}>
                            <Button>Detalhes</Button>
                        </Link>
                        <Button onClick={() => handleCurtir(usuario.id)} className="bg-rose-700">Curtir</Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
