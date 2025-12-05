import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, X } from 'lucide-react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export function ResponsibilityList({ items = [], onChange }) {
    // Local state to manage IDs for DnD
    // synchronizing with props.items (strings)
    const [listItems, setListItems] = useState([]);

    // Initialize/Sync IDs
    useEffect(() => {
        setListItems(prev => {
            if (items.length === 0) {
                // Ensure at least one empty bullet if empty
                // But wait, if we have local state, we should check if we already have it?
                // If the prop is explicitly empty (e.g. parent clear), we should reset.
                // But if it is initial load...
                if (prev.length === 0) {
                    return [{ id: crypto.randomUUID(), text: "" }];
                }
            }

            const newItems = items.map((text, i) => {
                // Heuristic: If we have a local item at this index, keep its ID to prevent focus loss
                // Only if texts match or we are initializing. 
                // Simple sync:
                return { id: (prev[i] ? prev[i].id : crypto.randomUUID()), text };
            });

            // If newItems is empty (shouldn't happen if we force 1 above, but logic:
            if (newItems.length === 0) return [{ id: crypto.randomUUID(), text: "" }];

            return newItems;
        });
    }, [items]); // Simplified dependency

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const triggerUpdate = (newItems) => {
        setListItems(newItems);
        onChange(newItems.map(i => i.text));
    };

    const handleChange = (id, value) => {
        const newItems = listItems.map(item => item.id === id ? { ...item, text: value } : item);

        // Update local state immediately for responsiveness
        setListItems(newItems);

        // Debounce propagation to parent if needed, but for now direct:
        onChange(newItems.map(i => i.text));

        // Auto-add logic: if typing in last one, add new
        const index = newItems.findIndex(i => i.id === id);
        if (index === newItems.length - 1 && value.trim() !== "") {
            // We need to use Functional State update to be safe or just trigger update
            // but we can't call setListItems twice in sync easily.
            // Let's create the bigger array.
            const added = [...newItems, { id: crypto.randomUUID(), text: "" }];
            setListItems(added);
            onChange(added.map(i => i.text));
        }
    };

    const handleBlur = (id) => {
        // Remove empty ones on blur, unless it's the only one
        const index = listItems.findIndex(i => i.id === id);
        const item = listItems[index];
        if (!item) return;

        if (item.text.trim() === "" && listItems.length > 1) {
            const trimmed = listItems.filter(i => i.id !== id);
            triggerUpdate(trimmed);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setListItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newArr = arrayMove(items, oldIndex, newIndex);
                onChange(newArr.map(i => i.text));
                return newArr;
            });
        }
    };

    return (
        <div className="space-y-2">
            {/* Header removed as requested */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={listItems.map(i => i.id)} // Must map to IDs
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {listItems.map((item) => (
                            <SortableItem key={item.id} id={item.id} className="items-start">
                                <div className="relative w-full group/input flex items-start gap-3">
                                    <div className="mt-3 w-2 h-2 rounded-full bg-[#9EE8C8] shrink-0 shadow-neumorphic-inset" />
                                    <textarea
                                        value={item.text}
                                        onChange={(e) => handleChange(item.id, e.target.value)}
                                        onBlur={() => handleBlur(item.id)}
                                        placeholder="Type responsibility here..."
                                        rows={1}
                                        className="flex-1 input-neumorphic resize-none overflow-hidden min-h-[44px]"
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        autoFocus={listItems.length === 1 && !item.text}
                                    />
                                    {/* Inline remove button on hover */}
                                    <button
                                        onClick={() => {
                                            const newItems = listItems.filter(i => i.id !== item.id);
                                            // If removed last one, add empty
                                            const finalItems = newItems.length === 0 ? [{ id: crypto.randomUUID(), text: "" }] : newItems;
                                            triggerUpdate(finalItems);
                                        }}
                                        tabIndex={-1}
                                        className="text-text-secondary hover:text-red-500 opacity-0 group-hover/input:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
