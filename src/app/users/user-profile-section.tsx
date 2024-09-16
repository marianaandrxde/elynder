import {Button} from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ClipboardIcon, LoaderPinwheel, Trash2Icon} from "lucide-react";
import Image from "next/image";
// import ph1 from "../../../public/ph1.webp";
// import ph2 from "../../../public/ph2.webp";
// import ph3 from "../../../public/ph3.webp";
// import {Usuario} from "@prisma/client";
import { getUsuarioById } from "@/app/actions/user-actions";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Suspense } from "react";

export default async function UsuarioProfileSection({
usuarioId,
}: { usuarioId: string }) {

    const user = await getUsuarioById(usuarioId);

    return (
        <>
    <section className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Dados do Usuario</h1>
                </div>

                <div
                    className="flex flex-grow justify-center rounded-lg border border-dashed shadow-sm"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div className="w-full max-w-4xl p-3 ">
                        <Tabs defaultValue="profile" className="w-full h-full">
                            <TabsList className="flex gap-6">
                                <TabsTrigger value="profile">
                                    <ClipboardIcon className="w-4 h-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                            </TabsList>

                            <Button className="right-0">Editar perfil</Button>

                            <Suspense fallback={<LoaderPinwheel/>}>
                                <header className="flex items-center gap-6 border rounded-xl p-2 bg-zinc-100 my-8">
                                    <div>
                                        <Avatar className="w-20 h-20">
                                            <AvatarFallback className="rounded-full bg-zinc-700 text-white font-medium text-2xl">
                                                {"M"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-3xl font-bold">{"Mariana Andrade"}</span>
                                        <div className="flex items-baseline text-muted-foreground gap-1">
                                            <span className="truncate">email:</span>
                                            <span className="text-sm font-semibold ">{user.email}</span>
                                            <span> | email:</span>
                                            <span className="text-sm font-semibold ">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </header>
                            </Suspense>
                        </Tabs>
                    </div>
                </div>
            </section>
        </>
    );
}