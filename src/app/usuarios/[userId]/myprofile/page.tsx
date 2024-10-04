import { getUsuarioById, removeUsuario } from "@/app/actions/user-actions";
import { RemoveButton } from "@/components/remove-button";
import { AddButton } from "@/components/ui/add-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ClipboardIcon,
	LoaderPinwheel,

} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
	params,
}: { params: { userId: string } }) {
	const usuario = await getUsuarioById(params.userId);

	if (!usuario) {
		notFound();
	}

	return (
		<section className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div
				className="flex justify-center rounded-lg"
				x-chunk="dashboard-02-chunk-1"
			>
				<div className="w-full max-w-4xl">
				<div>
				<h1 className="text-lg font-semibold md:text-2xl mt-6 ">Dados do Usuario</h1>
			</div>
					<Tabs defaultValue="profile">
							<header className="flex flex-col gap-6 rounded-xl p-2">
								<div>
									<Avatar className="w-60 h-60">
										<AvatarFallback className=" bg-zinc-700 text-white font-medium text-2xl">
											<Image src={`/images/perfil.jpeg`} alt="imagem do usuario" width={500} height={500}/>
										</AvatarFallback>
									</Avatar>
								</div>

								<div className="flex flex-col gap-0">
									<span className="text-2xl font-bold">{usuario.name}</span>
									<div className="flex flex-col gap-2 text-muted-foreground">
										<span className="text-lg">{usuario.username}</span>
										<span className="text-sm text-black">{usuario.bio}</span>
									</div>
								</div>
							</header>
					</Tabs>
					<div className="flex justify-items-end gap-2 mt-2">
						<div className="mt-0">
							<Link href={`/usuarios/${usuario.id}/edit`}>
								<AddButton  text="Editar Usuario" />
							</Link>
						</div>

						{/* <div>
             			 <RemoveButton userId={usuario.id} />
            			</div> */}
					</div>
					</div>
				</div>
		</section>
	);
}