import React from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from 'lucide-react';

export function SortableItem({ id, children, className = "" }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 'auto',
        position: 'relative',
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-start gap-2 group ${className}`}>
            <button
                {...attributes}
                {...listeners}
                className="mt-3 text-text-secondary hover:text-text-primary cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-bg-secondary"
                aria-label="Drag to reorder"
                type="button"
            >
                <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1 w-full relative">
                {children}
            </div>
        </div>
    );
}
