import { getUsuarioById } from "@/app/actions/user-actions";
import { UsuarioForm } from "@/components/user-form";
import { notFound } from "next/navigation";

export default async function Page({
	params,
}: { params: { userId: string } }) {
	const usuario = await getUsuarioById(params.userId);

	if (!usuario) {
		notFound();
	}
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div>
				<h1 className="text-lg font-semibold md:text-2xl">Editar Usuario</h1>
			</div>
			<div
				className="flex flex-grow justify-center lg:pt-12 md:pt-6 rounded-lg border border-dashed shadow-sm"
				x-chunk="dashboard-02-chunk-1"
			>
				<UsuarioForm usuario={usuario} />
			</div>
		</main>
	);
}