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
        <div className="neumorphic-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-h2 text-text-primary mb-4 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-text-secondary bg-[#F1F3F6] px-3 py-1.5 rounded-lg">Type & Press Enter</span>
            </h4>

            <div className="flex flex-wrap gap-3 p-4 bg-[#F1F3F6] rounded-xl border border-[rgba(0,0,0,0.08)] shadow-neumorphic-inset focus-within:border-[#9EE8C8] focus-within:bg-[#FFFFFF] transition-all min-h-[70px]">
                {items.map((skill, i) => (
                    <div
                        key={i}
                        className="group flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] text-text-primary rounded-xl text-body font-medium shadow-neumorphic border border-[rgba(0,0,0,0.08)] hover:border-[#9EE8C8] transition-all animate-in zoom-in-50 duration-200"
                    >
                        <span>{skill}</span>
                        <button
                            onClick={() => removeSkill(category, i)}
                            className="text-text-secondary hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
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
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-body py-2 px-2 text-text-primary placeholder:text-text-secondary"
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
