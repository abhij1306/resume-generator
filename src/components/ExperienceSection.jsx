import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { ResponsibilityList } from "./ResponsibilityList";
import { Plus, Trash2, Edit2 } from "lucide-react";

export function ExperienceSection({ experience, setResumeData }) {
    const [editingId, setEditingId] = useState(null);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setResumeData((prev) => {
                const oldIndex = prev.experience.findIndex((e) => e.id === active.id);
                const newIndex = prev.experience.findIndex((e) => e.id === over.id);
                return {
                    ...prev,
                    experience: arrayMove(prev.experience, oldIndex, newIndex),
                };
            });
        }
    };

    const addExperience = () => {
        const newId = crypto.randomUUID();
        const newExp = {
            id: newId,
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            responsibilities: ["Sample responsibility"],
        };
        setResumeData((prev) => ({
            ...prev,
            experience: [newExp, ...prev.experience], // Add to top
        }));
        setEditingId(newId); // Auto-edit
    };

    const removeExperience = (id) => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            setResumeData((prev) => ({
                ...prev,
                experience: prev.experience.filter((e) => e.id !== id),
            }));
            if (editingId === id) setEditingId(null);
        }
    };

    const updateExperience = (id, field, value) => {
        setResumeData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    // ------------------------------------------------------------------
    //  CARD SUB-COMPONENT
    // ------------------------------------------------------------------
    const ExperienceCard = ({ exp, onEdit, onDelete }) => (
        <div className="group neumorphic-card p-5 transition-all border-border-light/50 hover:border-accent-mint/30 cursor-pointer">
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                    <div>
                        <h4 className="font-bold text-text-primary text-body">
                            {exp.title || "(No Title)"}
                        </h4>
                        <div className="text-text-secondary font-medium text-body">
                            {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                        <div className="text-text-secondary text-body mt-1">
                            {exp.startDate} - {exp.endDate}
                        </div>
                        {/* Preview Responsibilities */}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <ul className="mt-3 text-body text-text-secondary list-disc ml-4 space-y-1 opacity-80">
                                {exp.responsibilities.slice(0, 2).map((r, i) => (
                                    <li key={i} className="line-clamp-1">{r}</li>
                                ))}
                                {exp.responsibilities.length > 2 && <li className="list-none text-xs italic text-text-secondary">+ {exp.responsibilities.length - 2} more</li>}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(exp.id); }}
                        className="p-2 text-text-secondary hover:text-accent-mint hover:bg-bg-secondary rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }}
                        className="p-2 text-text-secondary hover:text-red-500 hover:bg-bg-secondary rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* ADD BUTTON */}
            {!editingId && (
                <button
                    onClick={addExperience}
                    className="w-full py-4 border-2 border-dashed border-border-light/30 rounded-2xl flex items-center justify-center gap-2 text-accent-mint font-semibold hover:bg-accent-mint/10 hover:border-accent-mint transition-all"
                >
                    <Plus className="w-5 h-5" /> Add New Position
                </button>
            )}


            {/* LIST (Sortable) */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={experience.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <SortableItem key={exp.id} id={exp.id}>
                                {editingId === exp.id ? (
                                    // EDIT FORM
                                    <div className="border border-accent-mint/30 rounded-2xl p-6 bg-bg-card shadow-mint-glow">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-1">
                                                <label className="text-label">Job Title</label>
                                                <input
                                                    className="w-full neumorphic-input focus:ring-1 focus:ring-accent-mint"
                                                    value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="e.g. Senior Product Manager" autoFocus />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-label">Company</label>
                                                <input
                                                    className="w-full neumorphic-input focus:ring-1 focus:ring-accent-mint"
                                                    value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="e.g. Google" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-label">Start Date</label>
                                                <input
                                                    className="w-full neumorphic-input focus:ring-1 focus:ring-accent-mint"
                                                    value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="e.g. June 2020" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-label">End Date</label>
                                                <input
                                                    className="w-full neumorphic-input focus:ring-1 focus:ring-accent-mint"
                                                    value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="e.g. Present" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-label">Location</label>
                                                <input
                                                    className="w-full neumorphic-input focus:ring-1 focus:ring-accent-mint"
                                                    value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} placeholder="e.g. New York, NY" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-label">Responsibilities</label>
                                            <p className="text-body text-text-secondary mb-1">Enter each responsibility on a new line.</p>
                                            <textarea
                                                className="w-full neumorphic-input focus:ring-1 focus:ring-accent-mint min-h-[120px] resize-y text-body"
                                                value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities}
                                                onChange={(e) => updateExperience(exp.id, "responsibilities", e.target.value.split('\n'))}
                                                placeholder="• Lead development of feature X...&#10;• Optimized database queries..."
                                            />
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-light/50">
                                            <button onClick={() => removeExperience(exp.id)} className="px-4 py-2 text-red-400 hover:text-red-300 rounded-lg text-body font-medium transition-colors">Delete</button>
                                            <button onClick={() => setEditingId(null)} className="px-6 py-2 bg-accent-mint text-text-primary rounded-xl shadow-mint-glow hover:bg-teal-400 font-bold transition-all">Done</button>
                                        </div>
                                    </div>
                                ) : (
                                    // PREVIEW CARD
                                    <div className="group neumorphic-card p-5 cursor-pointer hover:border-accent-mint/30 transition-all border border-transparent"
                                        onClick={() => setEditingId(exp.id)} // Click card to edit
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3 items-start">
                                                <div>
                                                    <h4 className="font-bold text-text-primary text-body">
                                                        {exp.title || "(No Title)"}
                                                    </h4>
                                                    <div className="text-text-secondary font-medium text-body">
                                                        {exp.company} {exp.location && `• ${exp.location}`}
                                                    </div>
                                                    <div className="text-text-secondary text-body mt-1">
                                                        {exp.startDate} - {exp.endDate}
                                                    </div>

                                                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                                                        <ul className="mt-3 text-body text-text-secondary list-disc ml-4 space-y-1 opacity-80">
                                                            {exp.responsibilities.slice(0, 2).map((r, i) => (
                                                                <li key={i} className="line-clamp-1">{r}</li>
                                                            ))}
                                                            {exp.responsibilities.length > 2 && <li className="list-none text-xs italic text-text-secondary">+ {exp.responsibilities.length - 2} more</li>}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingId(exp.id); }}
                                                    className="p-2 text-text-secondary hover:text-accent-mint hover:bg-bg-secondary rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                                                    className="p-2 text-text-secondary hover:text-red-500 hover:bg-bg-secondary rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
