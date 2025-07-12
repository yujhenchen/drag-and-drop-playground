import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function SortableItem({ id, children, ...props }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} id={id} style={style} {...attributes} {...listeners} {...props}>
      {children}
    </div>
  );
}
