"use client";

import { upsertUsuario } from "@/app/actions/user-actions";
import {zodResolver} from "@hookform/resolvers/zod";
import { Genero} from "@prisma/client";
import {CirclePlus} from "lucide-react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import {Input} from "./ui/input";
import {RadioGroup, RadioGroupItem} from "./ui/radio-group";
import {useRouter} from "next/navigation";
import {toast} from "./ui/use-toast"
type UsuarioProps = {
    usuario?: {
        id?: string;
        email: string;
        password: string;
        username: string | null;  
        name: string | null;
        idade: number | null;
        genero: Genero | null;
        bio: string| null;
        localizacao: string | null;
        telefone: string | null;
        imageProfile: string | null;
    };
};

const formSchema = z.object({
    name: z
        .string()
        .min(2, {message: "O nome deve conter pelo menos 2 caracteres"}),
    username: z
        .string(),
    genero: z
        .string(),
    bio: z
        .string()
        ,
    localizacao: z
        .string(),
    telefone: z
    .string(),
    email: z
    .string(),
    password: z
    .string(),
});

export function UsuarioForm({usuario}: UsuarioProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: usuario?.name ?? "",
            username: usuario?.username ?? "",
            genero: usuario?.genero ?? "",
            bio: usuario?.bio ?? "",
            localizacao: usuario?.localizacao ?? "",
            telefone: usuario?.telefone ?? "",
            email: usuario?.email ?? "",
            password: usuario?.email ?? "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await upsertUsuario({
            id: usuario?.id ?? "",
            name: values.name?? "",
            username: values.username,
            genero: values.genero as Genero,
            bio: values.bio as string,
            localizacao: values.localizacao,
            telefone: values.telefone,
            email: values.email as string,
            password: values.password as string,
        });

        toast({
            title: result.success
                ? "Alterações salvas com sucesso!"
                : "Erro ao salvar...",
            variant: result.success ? undefined : "destructive",
            description: result.message,
            duration: 3000,
        });

        if(result.success) {
            router.push(`/usuarios/${usuario?.id}/`);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="name" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="genero"
                    render={({field}) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Genero</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Masculino"/>
                                        </FormControl>
                                        <FormLabel className="font-normal">Masculino</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Feminino"/>
                                        </FormControl>
                                        <FormLabel className="font-normal">Feminino</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="localizacao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Localizacao</FormLabel>
                            <FormControl>
                                <Input placeholder="Localizacao" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Input placeholder="Bio" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex w-full gap-4 justify-center">
                    <Button className="flex gap-2 w-1/3" type="submit">
                        <CirclePlus className="h-4 w-4"/>
                        Salvar
                    </Button>

                    <Link href={`/usuarios/`} className="w-1/3">
                        <Button variant="outline">Voltar ao perfil</Button>
                    </Link>
                </div>
            </form>
        </Form>
    );
}