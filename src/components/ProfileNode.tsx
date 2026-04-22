import React from 'react';
import { SketchyNode } from './SketchyNode';

export const ProfileNode = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <SketchyNode
      id="profile-node"
      ref={ref}
      x={1000 - 150} // center minus half width
      y={1000 - 150} // center minus half height
      width={300}
    >
      <img src="/pfp.jpeg" alt="Dylan Chow Yu Jun" className="profile-img" />
      <h2>Dylan Chow Yu Jun</h2>
      <p>Software Engineering Diploma Student</p>
      <p>Building immersive web experiences</p>
    </SketchyNode>
  );
});
