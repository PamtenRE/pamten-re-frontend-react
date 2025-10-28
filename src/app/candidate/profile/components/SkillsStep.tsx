'use client';

import { ProfileFormData } from '@/utils/profileHelpers';

interface SkillsStepProps {
  form: ProfileFormData;
  updateForm: <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => void;
}

export default function SkillsStep({ form, updateForm }: SkillsStepProps) {
  
  // Handle adding skill when Enter key is pressed
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const skill = input.value.trim();
      
      if (skill) {
        updateForm('skills', [...form.skills, skill]);
        input.value = ''; // Clear input
      }
    }
  };

  // Handle adding skill when button is clicked
  const handleAddClick = () => {
    const input = document.getElementById('skill-input') as HTMLInputElement;
    const skill = input?.value.trim();
    
    if (skill) {
      updateForm('skills', [...form.skills, skill]);
      input.value = ''; // Clear input
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (indexToRemove: number) => {
    updateForm('skills', form.skills.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Add your technical and professional skills to help employers find you.
      </p>

      {/* Input Section */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Add Skills
        </label>
        
        {/* Input + Button Row */}
        <div className="flex gap-2">
          <input
            id="skill-input"
            type="text"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter a skill and press Enter"
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            onClick={handleAddClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Add
          </button>
        </div>

        {/* Skills Display (Tags) */}
        <div className="mt-4 flex flex-wrap gap-2">
          {form.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Empty State Message */}
        {form.skills.length === 0 && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
            No skills added yet. Start typing to add your first skill!
          </p>
        )}
      </div>
    </div>
  );
}