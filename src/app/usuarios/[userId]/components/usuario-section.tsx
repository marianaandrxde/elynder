import {columns} from "./columns"
import { DataTable } from "@/components/data-table";
import { Suspense } from "react";
import { getUsuarioById } from "@/app/actions/user-actions";
import { UsuarioDialogButton } from "./usuario-dialog";
import { Loader2 } from "lucide-react";

export default async function UsuarioSection({
	id,
}: { id: string }) {
	const usuario = await getUsuarioById(id);

	return (
		<main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			{usuario != undefined ? (
				<>
					<div className="flex items-center justify-end">
						<UsuarioDialogButton id={usuario.id} />
					</div>

					<div
						className="justify-center shadow-sm pt-4"
						x-chunk="dashboard-02-chunk-1"
					>
					</div>
				</>
			) : (
				<div
					className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
					x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">
							Você não preencheu seu perfil
						</h3>

						<p className="text-sm text-muted-foreground">
							Você não preencheu seu perfil
						</p>

						<UsuarioDialogButton id={id} />
					</div>
				</div>
			)}
		</main>
	);
}