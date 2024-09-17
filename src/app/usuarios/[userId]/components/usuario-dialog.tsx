import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UsuarioForm } from "@/components/user-form";


export function UsuarioDialogButton({
	id,
}: {
	id: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Editar usuário</Button>
			</DialogTrigger>
			<DialogContent>
				<UsuarioForm />
			</DialogContent>
		</Dialog>
	);
}