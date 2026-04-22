import React from 'react';
import { SketchyNode } from './SketchyNode';
import { Mail, ExternalLink } from 'lucide-react';

interface Props {
  onDrag: () => void;
}

export const ContactNode = React.forwardRef<HTMLDivElement, Props>(({ onDrag }, ref) => {
  return (
    <SketchyNode
      id="contact-node"
      ref={ref}
      x={2000 + 100} // below and right
      y={2000 + 200}
      width={250}
      onDrag={onDrag}
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
