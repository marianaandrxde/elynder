import { UsuarioForm } from "@/components/user-form";

export default async function Page() {
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div>
				<h1 className="text-lg font-semibold md:text-2xl">Adicionar Usuario</h1>
			</div>
			<div
				className="flex flex-grow justify-center lg:pt-12 md:pt-6 rounded-lg border border-dashed shadow-sm"
				x-chunk="dashboard-02-chunk-1"
			>
				<UsuarioForm />
			</div>
		</main>
	);
}