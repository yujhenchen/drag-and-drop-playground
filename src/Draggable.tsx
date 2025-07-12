import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Draggable({ id, className, children, ...props }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className} {...props}>
      {children}
    </div>
  );
}
