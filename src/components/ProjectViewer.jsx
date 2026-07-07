// src/components/ProjectViewer.jsx
import { useState, useEffect } from 'react';

export default function ProjectViewer({ initialProjects }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile (client-side only)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Get unique categories from actual project data (flatten the array)
  const allCategories = initialProjects.flatMap(p => p.data.category);
  const uniqueCategories = ['ALL', ...new Set(allCategories)];

  // Filter projects based on active category
  const filteredProjects = activeCategory === 'ALL'
    ? initialProjects
    : initialProjects.filter(p => p.data.category.includes(activeCategory));

  // Determine which projects to show - only limit on mobile
  const INITIAL_DISPLAY = 5;
  
  // On desktop: show all projects
  // On mobile: show only 5 unless showAll is true
  const displayProjects = (!isMobile || showAll) 
    ? filteredProjects 
    : filteredProjects.slice(0, INITIAL_DISPLAY);
  
  const hasMoreProjects = filteredProjects.length > INITIAL_DISPLAY;

  // Helper function to get image path
  const getImagePath = (project) => {
    if (project.data.cardImage) {
      return `/images/projects/${project.data.cardImage}`;
    }
    return `/images/projects/${project.id}.jpg`;
  };

  // Handle dropdown change
  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value);
    setShowAll(false); // Reset show all when category changes
  };

  // Handle show more/less toggle
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-full">
      {/* Category Filter - Dropdown on mobile, Toggles on desktop */}
      <div className="mb-12">
        {/* Mobile: Dropdown */}
        <div className="block sm:hidden">
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-zinc-300 font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-brand-primary appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a1a1aa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '12px 8px',
              paddingRight: '2.5rem',
            }}
          >
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-brand-card text-zinc-300">
                {cat === 'ALL' ? 'All Work' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: Toggle Buttons */}
        <div className="hidden sm:flex flex-wrap gap-2 bg-brand-card p-1.5 border border-brand-border rounded-xl font-mono text-xs max-w-max">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowAll(false);
              }}
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
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((project) => {
          let cardImagePath = getImagePath(project);
          
          return (
            <a 
              key={project.id}
              href={`/projects/${project.id}`}
              className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-secondary flex flex-col justify-between cursor-pointer no-underline"
            >
              <div>
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img 
                    src={cardImagePath}
                    alt={project.data.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target;
                      const currentSrc = img.src;
                      const basePath = currentSrc.substring(0, currentSrc.lastIndexOf('.'));
                      const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.'));
                      
                      const extensions = ['.jpg', '.png', '.webp'];
                      const currentIndex = extensions.indexOf(currentExt);
                      
                      if (currentIndex !== -1 && currentIndex < extensions.length - 1) {
                        const nextExt = extensions[currentIndex + 1];
                        img.src = basePath + nextExt;
                        return;
                      }
                      
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-brand-dark text-zinc-500 text-sm';
                      fallback.innerHTML = `
                        <div class="text-center">
                          <span class="block text-4xl mb-2">🎬</span>
                          ${project.data.title}
                        </div>
                      `;
                      parent.appendChild(fallback);
                    }}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-brand-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {/* Display first category as primary */}
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-dark border border-brand-border text-brand-secondary rounded">
                      {project.data.category[0]}
                    </span>
                    {/* Display additional categories as badges */}
                    {project.data.category.slice(1).map((cat) => (
                      <span key={cat} className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-dark/50 border border-brand-border/50 text-zinc-400 rounded">
                        {cat}
                      </span>
                    ))}
                    {project.data.tags && project.data.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs text-zinc-500 font-light">#{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-secondary transition-colors leading-snug">
                    {project.data.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Client // {project.data.client}</p>
                </div>
              </div>

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
                    {project.data.category.join(' • ')}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Show More / Show Less Button - Only on mobile and when there are more projects */}
      {isMobile && hasMoreProjects && (
        <div className="mt-8 text-center">
          <button
            onClick={toggleShowAll}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-secondary font-bold text-sm tracking-widest uppercase rounded-xl border border-brand-primary/20 hover:border-brand-primary/40 transition-all"
          >
            {showAll ? (
              <>
                Show Less
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/>
                </svg>
              </>
            ) : (
              <>
                Show More ({filteredProjects.length - INITIAL_DISPLAY} more)
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}