import { useState } from "react";
import { X, Plus } from "lucide-react";

export function SkillsSection({ skills, setResumeData }) {
    // State to track the current input value for each category
    const [inputs, setInputs] = useState({
        technical: "",
        soft: ""
    });

    const handleInputChange = (category, value) => {
        setInputs(prev => ({ ...prev, [category]: value }));
    };

    const handleKeyDown = (e, category) => {
        const val = inputs[category].trim();
        if ((e.key === 'Enter' || e.key === ',') && val) {
            e.preventDefault();
            addSkill(category, val);
        } else if (e.key === 'Backspace' && !val && skills[category].length > 0) {
            // Remove last tag on backspace if input is empty
            removeSkill(category, skills[category].length - 1);
        }
    };

    const addSkill = (category, skill) => {
        // Prevent duplicates
        if (skills[category].includes(skill)) {
            setInputs(prev => ({ ...prev, [category]: "" }));
            return;
        }

        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...prev.skills[category], skill]
            }
        }));
        setInputs(prev => ({ ...prev, [category]: "" }));
    };

    const removeSkill = (category, index) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter((_, i) => i !== index)
            }
        }));
    };

    const renderSkillInput = (title, category, items) => (
        <div className="neumorphic-card p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-h2 text-text-primary mb-4 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-text-secondary bg-bg-card px-2 py-1 rounded-md">Type & Press Enter</span>
            </h4>

            <div className="flex flex-wrap gap-2 p-3 bg-bg-card rounded-xl border border-transparent shadow-neu-input focus-within:border-accent-mint focus-within:bg-bg-secondary transition-all min-h-[60px]">
                {items.map((skill, i) => (
                    <div
                        key={i}
                        className="group flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary text-text-primary rounded-lg text-body font-medium shadow-sm border border-border-light/50 hover:border-accent-mint/50 transition-all animate-in zoom-in-50 duration-200"
                    >
                        <span>{skill}</span>
                        <button
                            onClick={() => removeSkill(category, i)}
                            className="text-text-secondary hover:text-red-500 p-0.5 rounded-md hover:bg-red-50"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                <input
                    value={inputs[category]}
                    onChange={(e) => handleInputChange(category, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, category)}
                    placeholder={items.length === 0 ? `Add ${title.toLowerCase()} (e.g. React, Leadership)...` : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-body py-1.5 px-1 text-text-primary placeholder:text-text-secondary"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {renderSkillInput("Technical Skills", "technical", skills.technical)}
            {renderSkillInput("Soft Skills", "soft", skills.soft)}
        </div>
    );
}
