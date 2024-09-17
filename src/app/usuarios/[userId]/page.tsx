import { getUsuarioById } from "@/app/actions/user-actions";
import { AddButton } from "@/components/ui/add-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

						<Suspense fallback={<LoaderPinwheel/>}>
							<header className="flex items-center gap-6 border rounded-xl p-2 bg-zinc-100 my-8">
								<div>
									<Avatar className="w-20 h-20">
										<AvatarFallback className=" bg-zinc-700 text-white font-medium text-2xl">
											{usuario.email}
										</AvatarFallback>
									</Avatar>
								</div>

								<div className="flex flex-col gap-2">
									<span className="text-3xl font-bold">{usuario.email}</span>
									<div className="flex items-baseline text-muted-foreground gap-1">
										<span className="truncate">email:</span>
										<span className="text-sm font-semibold ">{usuario.email}</span>
										<span> | email:</span>
										<span className="text-sm font-semibold ">
											{usuario.email}
										</span>
									</div>
								</div>
							</header>
						</Suspense>
					</Tabs>
					<div className="mt-4">
							<Link href={`/usuarios/${usuario.id}/edit`}>
								<AddButton text="Add Animal" />
							</Link>
						</div>
				</div>
			</div>
		</section>
	);
}