import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import rough from 'roughjs';
import { ProfileNode } from './ProfileNode';
import { AboutNode } from './AboutNode';
import { ProjectsNode } from './ProjectsNode';
import { SkillsNode } from './SkillsNode';
import { ContactNode } from './ContactNode';

interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CanvasMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // We maintain a simple trigger state to redraw lines when nodes are dragged
  const [redrawTick, setRedrawTick] = useState(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // This function draws roughjs lines between the center node and the others
  const drawLines = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    
    // Clear existing inner HTML (paths)
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const rc = rough.svg(svg);
    const canvasBounds = containerRef.current?.getBoundingClientRect();

    if (!canvasBounds || !profileRef.current) return;

    const getCenter = (el: HTMLElement | null): { x: number, y: number } | null => {
      if (!el) return null;
      // We get absolute positions but we need them relative to the SVG container
      // Since SVG is positioned absolute inside TransformComponent which handles scaling/translation,
      // we can actually just read the top/left styles or translate values.
      // But getBoundingClientRect gives screen coordinates, so we'll compute relative pos
      const rect = el.getBoundingClientRect();
      const parentRect = containerRef.current!.getBoundingClientRect();
      const scale = 1; // getBoundingClientRect includes scale, but wait, TransformComponent scales the inner div.
      
      // Better approach when inside TransformWrapper: use offsetLeft/offsetTop if they are siblings in the same scale context
      return {
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop + el.offsetHeight / 2,
      };
    };

    const drawConnection = (from: HTMLElement | null, to: HTMLElement | null) => {
      const p1 = getCenter(from);
      const p2 = getCenter(to);
      if (p1 && p2) {
        const path = rc.line(p1.x, p1.y, p2.x, p2.y, {
          stroke: '#666',
          strokeWidth: 2,
          roughness: 1.5,
          bowing: 1
        });
        svg.appendChild(path);
      }
    };

    drawConnection(profileRef.current, aboutRef.current);
    drawConnection(profileRef.current, projectsRef.current);
    drawConnection(profileRef.current, skillsRef.current);
    drawConnection(profileRef.current, contactRef.current);
  };

  useLayoutEffect(() => {
    drawLines();
  }, [redrawTick]);

  // Recalculate layout on window resize as well
  useEffect(() => {
    const handleResize = () => setRedrawTick(t => t + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrag = () => {
    setRedrawTick(t => t + 1);
  };

  return (
    <div className="canvas-container">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div ref={containerRef} className="canvas-bg" style={{ width: 4000, height: 4000, position: 'relative' }}>
            
            <svg 
              ref={svgRef} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} 
            />

            <ProfileNode ref={profileRef} onDrag={handleDrag} />
            <AboutNode ref={aboutRef} onDrag={handleDrag} />
            <ProjectsNode ref={projectsRef} onDrag={handleDrag} />
            <SkillsNode ref={skillsRef} onDrag={handleDrag} />
            <ContactNode ref={contactRef} onDrag={handleDrag} />

          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
