import React, { useState, useEffect, useRef } from 'react';
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
        // Basic sync: if lengths differ or content differs significantly, reset.
        // For simple implementation, we map prop items to existing IDs if possible, or gen new ones.
        setListItems(prev => {
            const newItems = items.map((text, i) => {
                // Try to keep existing ID at this index if text roughly matches or just by index?
                // "By index" is unsafe for insert/delete.
                // Best: if prev[i] exists, use it? No, if we swap, index changes.
                // We'll trust that this runs on mount or full reset. 
                // For internal updates, we rely on local state and push changes up.
                // If parent updates (e.g. import), all IDs regenerate. That's acceptable.
                return { id: crypto.randomUUID(), text };
            });

            // Optimization: if text matches prev state exactly, don't update (avoid loop)
            if (prev.length === items.length && prev.every((p, i) => p.text === items[i])) {
                return prev;
            }
            return newItems;
        });
    }, [items === listItems.map(l => l.text) ? listItems : items]);
    // Dependency trick: only update if parent data is DIFFERENT from what check would imply

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
        triggerUpdate(newItems);

        // Auto-add logic handled in specific handlers or effects? 
        // "Typing in last responsibility automatically creates a new empty bullet"
        const index = newItems.findIndex(i => i.id === id);
        if (index === newItems.length - 1 && value.trim() !== "") {
            triggerUpdate([...newItems, { id: crypto.randomUUID(), text: "" }]);
        }
    };

    const handleBlur = (id) => {
        const index = listItems.findIndex(i => i.id === id);
        // If empty and not last, remove
        if (index < listItems.length - 1 && listItems[index].text.trim() === "") {
            const newItems = listItems.filter(i => i.id !== id);
            triggerUpdate(newItems);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setListItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newArr = arrayMove(items, oldIndex, newIndex);
                onChange(newArr.map(i => i.text)); // Sync up
                return newArr;
            });
        }
    };

    const addSampleBullets = () => {
        const samples = [
            "Led a team of 5 developers to deliver feature X ahead of schedule.",
            "Optimized database queries reducing load times by 40%.",
            "Collaborated with UX/UI designers to revamp the customer portal."
        ];
        const newItems = [
            ...listItems.filter(i => i.text.trim()), // keep existing content
            ...samples.map(s => ({ id: crypto.randomUUID(), text: s })),
            { id: crypto.randomUUID(), text: "" } // empty one at end
        ];
        triggerUpdate(newItems);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-sm text-gray-700">Responsibilities</label>
                <button
                    type="button"
                    onClick={addSampleBullets}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    Generate sample bullets
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={listItems}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {listItems.map((item, index) => (
                            <SortableItem key={item.id} id={item.id} className="items-start">
                                <div className="relative w-full group/input">
                                    <textarea
                                        value={item.text}
                                        onChange={(e) => handleChange(item.id, e.target.value)}
                                        onBlur={() => handleBlur(item.id)}
                                        placeholder="Type responsibility here..."
                                        rows={1}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden min-h-[38px] text-sm"
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                    />
                                    {/* Inline remove button on hover */}
                                    <button
                                        onClick={() => {
                                            const newItems = listItems.filter(i => i.id !== item.id);
                                            if (newItems.length === 0) newItems.push({ id: crypto.randomUUID(), text: "" });
                                            triggerUpdate(newItems);
                                        }}
                                        tabIndex={-1}
                                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/input:opacity-100 transition-opacity"
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
