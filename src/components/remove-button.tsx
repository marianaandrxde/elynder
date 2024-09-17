"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { removeUsuario } from "@/app/actions/user-actions";

interface RemoveButtonProps {
  userId: string;
}

export function RemoveButton({ userId }: RemoveButtonProps) {
  const router = useRouter();

  const handleRemove = async () => {
    try {
      await removeUsuario(userId);
      router.refresh(); // Atualize a página ou redirecione após a remoção
    } catch (error) {
      console.error("Falha ao remover usuário", error);
    }
  };

  return (
    <Button onClick={handleRemove} variant="destructive">
      Excluir conta
    </Button>
  );
}
