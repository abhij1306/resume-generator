import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";

export function CustomSection({ sectionId, data, setResumeData }) {
    // data = { title: "...", items: ["...", "..."] }
    // We treat items as simple strings for now.

    const [newItem, setNewItem] = useState("");

    const addItem = () => {
        if (!newItem.trim()) return;
        setResumeData(prev => ({
            ...prev,
            customSections: {
                ...prev.customSections,
                [sectionId]: {
                    ...prev.customSections[sectionId],
                    items: [...prev.customSections[sectionId].items, newItem]
                }
            }
        }));
        setNewItem("");
    };

    const removeItem = (index) => {
        setResumeData(prev => ({
            ...prev,
            customSections: {
                ...prev.customSections,
                [sectionId]: {
                    ...prev.customSections[sectionId],
                    items: prev.customSections[sectionId].items.filter((_, i) => i !== index)
                }
            }
        }));
    };

    const updateTitle = (newTitle) => {
        setResumeData(prev => ({
            ...prev,
            customSections: {
                ...prev.customSections,
                [sectionId]: {
                    ...prev.customSections[sectionId],
                    title: newTitle
                }
            }
        }));
    }

    return (
        <div className="neumorphic-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <label className="text-label">Section Title</label>
                <input
                    value={data.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="text-h1 bg-transparent border-b border-transparent hover:border-border-light focus:border-accent-mint outline-none text-text-primary w-full transition-colors"
                />
            </div>

            <div className="space-y-3">
                {data.items.map((item, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-bg-card rounded-xl border border-transparent hover:border-accent-mint/30 transition-all">
                        <span className="text-body font-medium text-text-primary">{item}</span>
                        <button
                            onClick={() => removeItem(i)}
                            className="text-text-secondary hover:text-red-500 p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add item (e.g. Native Spanish)..."
                    className="flex-1 neumorphic-input"
                />
                <button
                    onClick={addItem}
                    className="px-4 py-2 bg-accent-mint text-text-primary font-bold rounded-xl shadow-mint-glow hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
