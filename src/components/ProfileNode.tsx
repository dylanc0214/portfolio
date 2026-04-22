import React from 'react';
import { SketchyNode } from './SketchyNode';

interface Props {
  onDrag: () => void;
}

export const ProfileNode = React.forwardRef<HTMLDivElement, Props>(({ onDrag }, ref) => {
  return (
    <SketchyNode
      id="profile-node"
      ref={ref}
      x={2000 - 150} // center minus half width
      y={2000 - 150} // center minus half height
      width={300}
      onDrag={onDrag}
    >
      <img src="/pfp.jpeg" alt="Dylan Chow Yu Jun" className="profile-img" />
      <h2>Dylan Chow Yu Jun</h2>
      <p>Software Engineering Diploma Student</p>
      <p>Building immersive web experiences</p>
    </SketchyNode>
  );
});
