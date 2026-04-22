import React, { useState } from 'react';
import { SketchyNode } from './SketchyNode';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data';

interface Props {
  onDrag: () => void;
}

export const ProjectsNode = React.forwardRef<HTMLDivElement, Props>(({ onDrag }, ref) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SketchyNode
      id="projects-node"
      ref={ref}
      x={2000 + 150} // to the right of center
      y={2000 - 200}
      width={expanded ? 600 : 250}
      onDrag={onDrag}
      onClick={() => setExpanded(!expanded)}
      expanded={expanded}
    >
      <h3>Projects</h3>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px', textAlign: 'left' }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ 
                  border: '2px dashed #ccc', 
                  padding: '15px', 
                  borderRadius: '10px' 
                }}>
                  <strong style={{ fontSize: '1.1rem' }}>{proj.title}</strong>
                  <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>{proj.description}</p>
                  <div className="pill-container" style={{ justifyContent: 'flex-start' }}>
                    {proj.tags.map(tag => (
                      <span key={tag} className="pill" style={{ borderColor: '#aaa' }}>{tag}</span>
                    ))}
                  </div>
                  <div className="links-container" style={{ flexDirection: 'row', marginTop: '10px' }}>
                    <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="link" onClick={(e) => e.stopPropagation()}>GitHub</a>
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="link" onClick={(e) => e.stopPropagation()}>Live Demo</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && <p style={{ fontSize: '0.9rem', color: '#666' }}>({projects.length} Projects. Click to expand)</p>}
    </SketchyNode>
  );
});
