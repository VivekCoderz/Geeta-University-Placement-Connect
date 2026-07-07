import React, { useState } from 'react';
import { 
  User, Mail, FileSpreadsheet, Clipboard, Percent, 
  Plus, Trash2, ExternalLink, Upload, Eye, FileText, 
  Briefcase, GraduationCap, Award, PlusCircle, Check, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as storage from '../utils/storage';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('edit'); // edit | preview
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.branch || 'CSE',
    year: user?.year || 4,
    cgpa: user?.cgpa || '',
  });

  const [skills, setSkills] = useState(user?.skills || []);
  const [certifications, setCertifications] = useState(user?.certifications || []);
  const [projects, setProjects] = useState(user?.projects || []);

  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    link: ''
  });
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [resumeName, setResumeName] = useState(user?.resumeName || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  const branches = ['CSE', 'ECE', 'EEE', 'IT', 'MECH', 'CIVIL'];
  const years = [1, 2, 3, 4];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const updated = [...skills, skillInput.trim()];
      setSkills(updated);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (certInput.trim() && !certifications.includes(certInput.trim())) {
      const updated = [...certifications, certInput.trim()];
      setCertifications(updated);
      setCertInput('');
    }
  };

  const handleRemoveCert = (certToRemove) => {
    setCertifications(certifications.filter(c => c !== certToRemove));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const { title, description, techStack, link } = newProject;
    if (!title || !description) return;

    const formattedTech = techStack
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const projectObj = {
      id: `proj-${Date.now()}`,
      title,
      description,
      techStack: formattedTech,
      link
    };

    const updated = [...projects, projectObj];
    setProjects(updated);
    setNewProject({ title: '', description: '', techStack: '', link: '' });
    setShowProjectForm(false);
  };

  const handleRemoveProject = (projId) => {
    setProjects(projects.filter(p => p.id !== projId));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const simulatedUrl = `https://res.cloudinary.com/placementconnect/image/upload/v172021628/${file.name.replace(/\s+/g, '_')}`;
      setResumeName(file.name);
      setResumeUrl(simulatedUrl);
      setIsUploading(false);
      
      storage.addNotification(user.id, `Resume file "${file.name}" uploaded successfully via Cloudinary simulator.`, 'success');
    }, 1500);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setSuccessMsg('');

    const parsedCgpa = parseFloat(formData.cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      alert('CGPA must be a valid number between 0 and 10');
      return;
    }

    const updatedData = {
      ...formData,
      year: parseInt(formData.year),
      cgpa: parsedCgpa,
      skills,
      certifications,
      projects,
      resumeUrl,
      resumeName
    };

    updateUserProfile(updatedData);
    setSuccessMsg('Profile updated successfully! All eligible placement jobs synchronized.');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8"> {/* Expanded top space */}
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Student Portfolio</h1>
          <p className="text-sm text-slate-500 mt-1">Configure your professional details, credentials, and resume.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            Edit Details
          </button>
          <button
            onClick={() => {
              handleSaveProfile();
              setActiveTab('preview');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            Profile Preview
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 p-5 rounded-2xl flex items-center gap-3.5 text-sm animate-in fade-in duration-300">
          <Check className="w-5 h-5 flex-shrink-0" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {activeTab === 'edit' ? (
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Expanded gap */}
          {/* Left Column: Personal info form */}
          <div className="lg:col-span-2 space-y-8"> {/* Expanded spacing */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                Academic & Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Roll Number / ID</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold appearance-none"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold appearance-none"
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y === 4 ? '4th Year (Final)' : `${y}nd Year`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Projects Management - Spacious block */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Key Projects ({projects.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  {showProjectForm ? 'Cancel' : 'Add Project'}
                </button>
              </div>

              {/* Add Project Form Drawer - Spacious padding */}
              {showProjectForm && (
                <div className="bg-slate-50 p-6 border border-slate-200 rounded-2xl space-y-5 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Project Title</label>
                      <input
                        type="text"
                        placeholder="PlacementConnect"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Repository/Deployment Link</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={newProject.link}
                        onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                        className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Tech Stack (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="React.js, Node.js, Express, MongoDB"
                        value={newProject.techStack}
                        onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                        className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Brief Description</label>
                      <textarea
                        rows="4"
                        placeholder="Describe the application features, challenges solved, and components built..."
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-semibold resize-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    disabled={!newProject.title || !newProject.description}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shadow-sm"
                  >
                    Save Project
                  </button>
                </div>
              )}

              {/* Projects List Grid */}
              <div className="space-y-5">
                {projects.length === 0 ? (
                  <p className="text-slate-400 text-xs py-3 italic">No projects listed. Add one to strengthen your CV.</p>
                ) : (
                  projects.map((proj) => (
                    <div key={proj.id} className="p-6 bg-slate-50/50 border border-slate-200 rounded-2xl relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(proj.id)}
                        className="absolute top-5 right-5 text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-all duration-200"
                        title="Remove Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        {proj.title}
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[90%] font-medium">{proj.description}</p>
                      
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="text-[10px] bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Skills, certifications, resume */}
          <div className="space-y-8">
            {/* Resume Upload Box */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <FileText className="w-5 h-5 text-emerald-600" />
                Resume Document
              </h2>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:border-emerald-500/50 transition-all relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <div className="py-6 space-y-3">
                    <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">Uploading to Cloudinary...</p>
                  </div>
                ) : resumeName ? (
                  <div className="space-y-3">
                    <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-850 truncate px-2">{resumeName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">PDF Document Uploaded</p>
                    
                    <div className="flex justify-center gap-2 pt-3">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:text-emerald-500 hover:border-slate-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Resume
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-6">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Choose PDF Resume</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Max size 5MB (PDF only)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills tags list */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Award className="w-5 h-5 text-emerald-600" />
                Technical Skills
              </h2>

              <form onSubmit={handleAddSkill} className="flex gap-3">
                <input
                  type="text"
                  placeholder="React, Java, Python..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills added yet.</span>
                ) : (
                  skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-250/50 px-3.5 py-1.5 rounded-full text-xs font-bold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-emerald-500 hover:text-rose-500 focus:outline-none text-[10px] font-extrabold"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Certifications list */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Award className="w-5 h-5 text-emerald-600" />
                Certifications
              </h2>

              <form onSubmit={handleAddCert} className="flex gap-3">
                <input
                  type="text"
                  placeholder="AWS, FreeCodeCamp..."
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {certifications.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No certifications listed.</span>
                ) : (
                  certifications.map((cert) => (
                    <div 
                      key={cert} 
                      className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl text-xs text-slate-700 font-semibold"
                    >
                      <span className="truncate max-w-[85%]">{cert}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cert)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-555 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/15"
              >
                Save All Profile Data
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Professional CV Preview Mode - Light theme redesign */
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg animate-in fade-in duration-300">
          {/* Header Banner - Executive Light Green */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 p-10 border-b border-slate-200/80 relative">
            <div className="absolute top-8 right-8 flex gap-2">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-650 hover:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  View PDF Resume
                </a>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-555 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-emerald-500/10 border border-emerald-400/20">
                {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">{formData.name}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-650">
                    <Mail className="w-4.5 h-4.5 text-emerald-600" /> {formData.email}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-650">ID: {formData.rollNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10"> {/* Expanded padding */}
            {/* Left preview sidebar */}
            <div className="space-y-8 border-b md:border-b-0 md:border-r border-slate-200 pb-8 md:pb-0 md:pr-8">
              {/* Academics card */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap className="w-4.5 h-4.5 text-emerald-600" /> Academics
                </h3>
                <div className="bg-slate-50 p-5 border border-slate-200 rounded-2xl space-y-3.5 font-semibold">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Degree</span>
                    <span className="text-slate-700">B.Tech Engineering</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Branch</span>
                    <span className="text-slate-800 font-bold">{formData.branch}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Year / Semester</span>
                    <span className="text-slate-700">Year {formData.year} (Sem {formData.year * 2})</span>
                  </div>
                  <div className="h-px bg-slate-200 my-1" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Aggregate CGPA</span>
                    <span className="text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-250/50 px-3 py-1 rounded-full text-xs">
                      {formData.cgpa} / 10.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills preview */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-emerald-600" /> Core Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No skills added</span>
                  ) : (
                    skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-white text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Certifications preview */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-emerald-600" /> Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No certifications listed</span>
                  ) : (
                    certifications.map((cert) => (
                      <div key={cert} className="flex gap-2.5 items-start text-xs text-slate-700 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 font-semibold">
                        <Check className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right main timeline (Projects) */}
            <div className="md:col-span-2 space-y-8">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-slate-200">
                <Briefcase className="w-4.5 h-4.5 text-emerald-600" /> Portfolio Projects
              </h3>
              
              <div className="space-y-8">
                {projects.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No projects listed</p>
                ) : (
                  projects.map((proj) => (
                    <div key={proj.id} className="space-y-3 relative pl-6 border-l border-slate-200">
                      <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                      
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-extrabold text-slate-800 leading-tight">{proj.title}</h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[10px] text-emerald-600 hover:text-emerald-500 font-bold"
                          >
                            Code/Link <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{proj.description}</p>
                      
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 text-slate-500 px-2.5 py-1 rounded border border-slate-200 font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
