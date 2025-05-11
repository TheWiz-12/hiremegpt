import React, { useState } from 'react';
import { useUserData } from '../context/UserDataContext';
import { generateResources } from '../services/openai';
import { Loader, BookOpen, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

const ResourceLibrary: React.FC = () => {
  const { userProfile, updateProfile } = useUserData();
  const [jobTitle, setJobTitle] = useState(userProfile?.jobTitle || '');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState<string[]>(userProfile?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [resources, setResources] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill('');
      
      if (userProfile) {
        updateProfile({ skills: updatedSkills })
          .catch(error => console.error("Error saving skills:", error));
      }
    } else if (skills.includes(newSkill.trim())) {
      toast.info("This skill is already in your list.");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    
    if (userProfile) {
      updateProfile({ skills: updatedSkills })
        .catch(error => console.error("Error updating skills:", error));
    }
  };

  const handleGenerateResources = async () => {
    if (!jobTitle) {
      toast.error('Please enter a job title.');
      return;
    }
    
    if (!company) {
      toast.error('Please enter a company name.');
      return;
    }
    
    if (!skills || skills.length === 0) {
      toast.error('Please add at least one skill.');
      return;
    }

    try {
      setLoading(true);
      
      if (userProfile && jobTitle !== userProfile.jobTitle) {
        await updateProfile({ jobTitle });
      }
      
      const result = await generateResources(jobTitle, company, skills);
      setResources(result || '');
    } catch (error) {
      console.error('Error generating resources:', error);
      toast.error('Failed to generate resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
      
      <div className="mb-6">
        <div className="mb-4">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="input"
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="input"
            placeholder="e.g., Google"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <div className="flex">
            <input
              type="text"
              id="skills"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="input rounded-r-none"
              placeholder="e.g., React, Node.js"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleAddSkill}
              className="btn btn-primary rounded-l-none"
            >
              Add
            </button>
          </div>
          
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                    aria-label={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={handleGenerateResources}
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Finding Resources...
            </span>
          ) : 'Generate Learning Resources'}
        </button>
      </div>
      
      {resources && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
            Recommended Resources
          </h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary-600 hover:underline flex items-center"
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    {props.children}
                  </a>
                ),
                h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold mb-2" />,
                h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold mb-2" />,
                h3: ({ node, ...props }) => <h3 {...props} className="text-md font-bold mb-2" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 mb-4" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 mb-4" />,
                li: ({ node, ...props }) => <li {...props} className="mb-1" />,
              }}
            >
              {resources}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;