import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, Trash2 } from 'lucide-react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Reuse Input
const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);

const TextArea = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <textarea
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
    </div>
);

export function ProjectsSection({ projects, setResumeData }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setResumeData((prev) => {
                const oldIndex = prev.projects.findIndex((i) => i.id === active.id);
                const newIndex = prev.projects.findIndex((i) => i.id === over.id);
                const newProjects = arrayMove(prev.projects, oldIndex, newIndex);
                return { ...prev, projects: newProjects };
            });
        }
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [
                ...prev.projects,
                {
                    id: crypto.randomUUID(),
                    name: "",
                    technologies: "",
                    description: "",
                    link: "",
                }
            ]
        }));
    };

    const removeProject = (id) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== id)
        }));
    };

    const updateProject = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-lg">Projects</h3>
                <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={projects}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {projects.map((proj, i) => (
                            <SortableItem key={proj.id} id={proj.id}>
                                <div className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-semibold text-gray-800">Project {i + 1}</h4>
                                        <button
                                            onClick={() => removeProject(proj.id)}
                                            className="text-gray-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <Input
                                            label="Project Name"
                                            value={proj.name}
                                            onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                                        />
                                        <Input
                                            label="Technologies"
                                            value={proj.technologies}
                                            onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                                        />
                                        <TextArea
                                            label="Description (Bullet points supported via newlines)"
                                            rows="3"
                                            value={proj.description}
                                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                                        />
                                        <Input
                                            label="Link (Optional)"
                                            value={proj.link}
                                            onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {projects.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No projects added yet.</p>
                </div>
            )}
        </div>
    );
}
