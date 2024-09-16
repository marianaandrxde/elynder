"use client";

import { removeUsuario } from "@/app/actions/user-actions";
import { UsuarioForm } from "@/components/user-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import type { Usuario } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const columns: ColumnDef<Usuario>[] = [
    {
        id: "seq",
        header: "Row #",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "genero",
        header: "Specie",
    },
    {
        accessorKey: "localizacao",
        header: "Breed",
    },
    {
        accessorKey: "bio",
        header: "Bio",
    },
    {
        accessorKey: "telefone",
        header: "Telefone",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = row.getValue<Date>("createdAt");
            return new Intl.DateTimeFormat("pt-BR").format(date);
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const usuario = row.original;
            const [actionSelected, setActionSelected] = useState<"edit" | "delete">();

            return (
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                            <DropdownMenuItem>
                                <Link href={`/usuarios/${usuario.id}`}>View details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setActionSelected("edit")}>
                                Quick edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActionSelected("delete")}>
                                Delete usuario
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        {actionSelected === "edit" ? (
                            <EditDialog usuario={usuario} />
                        ) : (
                            <RemoveDialog usuario={usuario} />
                        )}
                    </DialogContent>
                </Dialog>
            );
        },
    },
];

function RemoveDialog({ usuario }: { usuario: Usuario }) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete usuario?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. Are you sure you want to permanently delete this file from our servers?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                    variant="destructive"
                    onClick={async () => {
                        const result = await removeUsuario(usuario.id);
                        toast({
                            title: "Removido com sucesso!",
                            description: result.message,
                            duration: 3000,
                        });
                    }}
                >
                    Delete
                </Button>
            </DialogFooter>
        </>
    );
}

function EditDialog({ usuario }: { usuario: Usuario }) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Usuario?</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <DialogContent>
                <UsuarioForm
                    usuario={{
                        id: usuario.id,
                        username: usuario.username as string,
                        email: usuario.email,
                        password: usuario.password,
                        idade: usuario.idade as number,
                        name: usuario.name as string,
                        genero: usuario.genero ?? 'Feminino',
                        bio: usuario.bio ?? "",
                        localizacao: usuario.localizacao ?? " ",
                        telefone: usuario.telefone ?? " ",
                    }}
                />
            </DialogContent>
        </>
    );
}
