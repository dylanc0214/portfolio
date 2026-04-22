import React, { useState } from 'react';
import { SketchyNode } from './SketchyNode';
import { motion, AnimatePresence } from 'framer-motion';

export const AboutNode = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SketchyNode
      id="about-node"
      ref={ref}
      x={1000 - 550} // to the left of center
      y={1000 - 250}
      width={expanded ? 450 : 250}
      onClick={() => setExpanded(!expanded)}
      expanded={expanded}
    >
      <h3>About Me</h3>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ overflow: 'hidden' }}
          >
             <div style={{ textAlign: 'left', marginTop: 10 }}>
               <p><strong>Program:</strong> Diploma in IT (Software Engineering)</p>
               <p><strong>Institution:</strong> Asia Pacific University (APU)</p>
               <p><strong>Exp. Graduation:</strong> Oct 2026</p>
               <p style={{ marginTop: 10, fontSize: '0.9rem' }}>
                  I am a motivated IT diploma student with hands-on learning experience in programming. 
                  Passionate about tech with experience in Python, Java, HTML, CSS, PHP, JS, and MySQL.
               </p>
               <a href="/Resume.pdf" download="Resume.pdf" className="btn" onClick={(e) => e.stopPropagation()}>
                  Download CV
               </a>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && <p style={{ fontSize: '0.9rem', color: '#666' }}>(Click to expand)</p>}
    </SketchyNode>
  );
});
