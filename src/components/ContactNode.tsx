import React from 'react';
import { SketchyNode } from './SketchyNode';
import { Mail, ExternalLink } from 'lucide-react';

export const ContactNode = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <SketchyNode
      id="contact-node"
      ref={ref}
      x={1000 + 200} // below and right
      y={1000 + 250}
      width={250}
    >
      <h3>Get in touch</h3>
      <div className="links-container">
        <a href="mailto:dylanchow.dev@example.com" className="link" onClick={(e) => e.stopPropagation()}>
          <Mail size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Email Me
        </a>
        <a href="https://github.com/dylanc0214" target="_blank" rel="noreferrer" className="link" onClick={(e) => e.stopPropagation()}>
          <ExternalLink size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          GitHub
        </a>
        <a href="https://linkedin.com/in/dylan-chow-yu-jun" target="_blank" rel="noreferrer" className="link" onClick={(e) => e.stopPropagation()}>
          <ExternalLink size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          LinkedIn
        </a>
      </div>
    </SketchyNode>
  );
});
