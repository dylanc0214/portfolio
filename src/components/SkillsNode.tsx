import React, { useState } from 'react';
import { SketchyNode } from './SketchyNode';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '../data';

export const SkillsNode = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SketchyNode
      id="skills-node"
      ref={ref}
      x={1000 - 450} // below and left
      y={1000 + 250}
      width={expanded ? 400 : 200}
      onClick={() => setExpanded(!expanded)}
      expanded={expanded}
    >
      <h3>Tech Skills</h3>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              <div className="pill-container" style={{ marginTop: '15px' }}>
                {skills.map(skill => (
                  <span key={skill.id} className="pill" title={`${skill.category} - ${skill.proficiency * 100}%`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && <p style={{ fontSize: '0.9rem', color: '#666' }}>(Click to expand)</p>}
    </SketchyNode>
  );
});
