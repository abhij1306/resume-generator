import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ResponsibilityList } from './ResponsibilityList';
import { Plus, Trash2 } from 'lucide-react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Helper Input Component
const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);

export function ExperienceSection({ experience, setResumeData }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setResumeData((prev) => {
                const oldIndex = prev.experience.findIndex((i) => i.id === active.id);
                const newIndex = prev.experience.findIndex((i) => i.id === over.id);
                const newExp = arrayMove(prev.experience, oldIndex, newIndex);
                return { ...prev, experience: newExp };
            });
        }
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                {
                    id: crypto.randomUUID(),
                    title: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    responsibilities: [""]
                }
            ]
        }));
    };

    const removeExperience = (id) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(e => e.id !== id)
        }));
    };

    const updateExperience = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-lg">Work Experience</h3>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={experience}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {experience.map((exp, i) => (
                            <SortableItem key={exp.id} id={exp.id}>
                                <div className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-semibold text-gray-800">Experience {i + 1}</h4>
                                        <button
                                            onClick={() => removeExperience(exp.id)}
                                            className="text-gray-400 hover:text-red-600 p-1"
                                            title="Remove Experience"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <Input
                                            label="Job Title"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                        />
                                        <Input
                                            label="Company"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                        />
                                        <Input
                                            label="Location"
                                            value={exp.location}
                                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                label="Start"
                                                value={exp.startDate}
                                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                            />
                                            <Input
                                                label="End"
                                                value={exp.endDate}
                                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <ResponsibilityList
                                        items={exp.responsibilities}
                                        onChange={(newRes) => updateExperience(exp.id, "responsibilities", newRes)}
                                    />
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {experience.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No experience entries yet.</p>
                </div>
            )}
        </div>
    );
}
