import { useDroppable } from "@dnd-kit/core";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
	id: string;
}

export function Droppable({ id, children, className, ...props }: Props) {
	const { setNodeRef } = useDroppable({
		id,
	});

	return (
		<div ref={setNodeRef} className={className} {...props}>
			{children}
		</div>
	);
}
