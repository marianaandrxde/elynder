"use client";

import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { Button } from "./button";

interface AddButtonProps {
	twClasses?: string;
	text: string;
	onClickFn?: () => void;
}

export function AddButton(props: AddButtonProps) {
	return (
		<Button
			className={cn("h-8 py-4 gap-2 bg-slate-500", props.twClasses)}
			onClick={props.onClickFn}
		>
			<PlusCircle className="h-4 w-4" />
			<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
				{props.text}
			</span>
		</Button>
	);
}