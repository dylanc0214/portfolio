import React, { useState } from 'react';
import { SketchyNode } from './SketchyNode';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '../data';

interface Props {
  onDrag: () => void;
}

export const SkillsNode = React.forwardRef<HTMLDivElement, Props>(({ onDrag }, ref) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SketchyNode
      id="skills-node"
      ref={ref}
      x={2000 - 300} // below and left
      y={2000 + 150}
      width={expanded ? 400 : 200}
      onDrag={onDrag}
      onClick={() => setExpanded(!expanded)}
      expandable={true}
      expanded={expanded}
    >
      <h3>Tech Skills</h3>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
             <div className="pill-container" style={{ marginTop: '15px' }}>
               {skills.map(skill => (
                 <span key={skill.id} className="pill" title={`${skill.category} - ${skill.proficiency * 100}%`}>
                   {skill.name}
                 </span>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && <p style={{ fontSize: '0.9rem', color: '#666' }}>(Click to expand)</p>}
    </SketchyNode>
  );
});
