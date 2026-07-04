// src/components/ProjectViewer.jsx
import React, { useState } from 'react';

export default function ProjectViewer({ initialProjects }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  // Get unique categories from actual project data
  const allCategories = initialProjects.map(p => p.data.category);
  const uniqueCategories = ['ALL', ...new Set(allCategories)];

  const filteredProjects = activeCategory === 'ALL'
    ? initialProjects
    : initialProjects.filter(p => p.data.category === activeCategory);

  return (
    <div className="w-full">
      {/* Category Toggles */}
      <div className="flex flex-wrap gap-2 bg-brand-card p-1.5 border border-brand-border rounded-xl font-mono text-xs max-w-max mb-12">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer uppercase ${
              (activeCategory === cat)
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Work' : cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => {
          // Use youtubeId as primary, fallback to first in youtubeIds
          const videoId = project.data.youtubeId || 
                         (project.data.youtubeIds && project.data.youtubeIds[0]) || 
                         '';
          
          return (
            <a 
              key={project.id}
              href={`/projects/${project.id}`}
              className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-secondary flex flex-col justify-between cursor-pointer no-underline"
            >
              <div>
                {/* Aspect Ratio 16:9 Video Box */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  {videoId ? (
                    <iframe 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                      src={`https://www.youtube.com/embed/${videoId}`} 
                      title={project.data.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-dark text-zinc-500 text-sm">
                      No video available
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-dark border border-brand-border text-brand-secondary rounded">
                      {project.data.category}
                    </span>
                    {project.data.tags && project.data.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-zinc-500 font-light">#{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-secondary transition-colors leading-snug">
                    {project.data.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Client // {project.data.client}</p>
                </div>
              </div>

              {/* Strategy Outcome Panel - using real data or fallback */}
              <div className="border-t border-brand-border p-5 bg-brand-dark/50 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block uppercase text-[9px] tracking-wider">Highlight</span>
                  <span className="text-brand-secondary font-bold mt-0.5 block truncate">
                    {project.data.highlight || 'Featured Project'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[9px] tracking-wider">Category</span>
                  <span className="text-zinc-300 font-semibold mt-0.5 block truncate">
                    {project.data.category}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}