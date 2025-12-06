import { useState } from "react";
import { generateId } from "../utils/uuid";
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

export function ProjectsSection({ projects, setResumeData }) {
    const [editingId, setEditingId] = useState(null);

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
                const oldIndex = prev.projects.findIndex((i) => i.id === active.id);
                const newIndex = prev.projects.findIndex((i) => i.id === over.id);
                return {
                    ...prev,
                    projects: arrayMove(prev.projects, oldIndex, newIndex),
                };
            });
        }
    };

    const addProject = () => {
        const newId = generateId();
        const newProject = {
            id: newId,
            name: "",
            technologies: "",
            description: "",
            link: "",
        };
        setResumeData((prev) => ({
            ...prev,
            projects: [newProject, ...prev.projects], // Add to top
        }));
        setEditingId(newId); // Auto-edit
    };

    const removeProject = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            setResumeData((prev) => ({
                ...prev,
                projects: prev.projects.filter((p) => p.id !== id),
            }));
            if (editingId === id) setEditingId(null);
        }
    };

    const updateProject = (id, field, value) => {
        setResumeData((prev) => ({
            ...prev,
            projects: prev.projects.map((p) =>
                p.id === id ? { ...p, [field]: value } : p
            ),
        }));
    };

    // ------------------------------------------------------------------
    //  CARD SUB-COMPONENT
    // ------------------------------------------------------------------
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* ADD BUTTON */}
            {!editingId && (
                <button
                    onClick={addProject}
                    className="w-full py-4 border-2 border-dashed border-[rgba(158,232,200,0.3)] rounded-2xl flex items-center justify-center gap-2 text-[#9EE8C8] font-semibold hover:bg-[#9EE8C8]/10 hover:border-[#9EE8C8] transition-all"
                >
                    <Plus className="w-5 h-5" /> Add New Project
                </button>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={projects.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {projects.map((proj) => (
                            <SortableItem key={proj.id} id={proj.id}>
                                {editingId === proj.id ? (
                                    // EDIT FORM
                                    <div className="border border-[rgba(158,232,200,0.3)] rounded-2xl p-8 bg-[#F1F3F6] shadow-mint-glow">
                                        <div className="grid grid-cols-1 gap-6 mb-6">
                                            <div className="space-y-1">
                                                <label className="text-label">Project Name</label>
                                                <input
                                                    className="w-full input-neumorphic"
                                                    value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} placeholder="e.g. Resume Builder" autoFocus />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-label">Technologies</label>
                                                <input
                                                    className="w-full input-neumorphic"
                                                    value={proj.technologies} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} placeholder="e.g. React, Node.js, Tailwind" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-label">Link</label>
                                                <input
                                                    className="w-full input-neumorphic"
                                                    value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} placeholder="https://..." />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-label">Description / Responsibilities</label>
                                                <p className="text-body text-text-secondary mb-1">Enter details on new lines. They will appear as bullet points.</p>
                                                <textarea
                                                    className="w-full textarea-neumorphic resize-y"
                                                    value={proj.description || ""}
                                                    onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                                                    placeholder="• Built a full-stack app using...&#10;• Implemented user authentication..."
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-[rgba(0,0,0,0.08)]">
                                            <button onClick={() => removeProject(proj.id)} className="px-4 py-2 text-red-400 hover:text-red-300 rounded-lg text-body font-medium transition-colors">Delete</button>
                                            <button onClick={() => setEditingId(null)} className="px-6 py-2 bg-accent-mint text-text-primary rounded-xl shadow-mint-glow hover:bg-teal-400 font-bold transition-all">Done</button>
                                        </div>
                                    </div>
                                ) : (
                                    // PREVIEW CARD
                                    <div className="group neumorphic-card p-6 cursor-pointer hover:border-[rgba(158,232,200,0.3)] transition-all border border-transparent"
                                        onClick={() => setEditingId(proj.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-text-primary text-body">
                                                    {proj.name || "(No Project Name)"}
                                                </h4>
                                                <div className="text-text-secondary font-medium text-body">
                                                    {proj.technologies}
                                                </div>
                                                {/* Preview Description */}
                                                {proj.description && (
                                                    <div className="mt-4 text-body text-text-secondary ml-5 opacity-80" style={{ whiteSpace: 'pre-line' }}>
                                                        {/* Just show first couple of lines */}
                                                        {proj.description.split('\n').slice(0, 2).map((line, i) => (
                                                            <div key={i} className="line-clamp-1">• {line}</div>
                                                        ))}
                                                        {proj.description.split('\n').length > 2 && <div className="text-xs italic text-text-secondary mt-2">+ more</div>}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingId(proj.id); }}
                                                    className="p-2 text-text-secondary hover:text-accent-mint hover:bg-bg-secondary rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
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
