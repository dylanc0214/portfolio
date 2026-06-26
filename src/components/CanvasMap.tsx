import { useRef, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import rough from 'roughjs';
import { Hand, MousePointer2 } from 'lucide-react';
import { ProfileNode } from './ProfileNode';
import { AboutNode } from './AboutNode';
import { ProjectsNode } from './ProjectsNode';
import { SkillsNode } from './SkillsNode';
import { ContactNode } from './ContactNode';

// Bounding box (with margin) of the 5 nodes in their default, collapsed state.
// Used to pick a scale that keeps every node visible on first load.
const NODES_BBOX = { width: 1150, height: 900 };
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.5;

function getFitScale(): number {
  const scale = Math.min(
    window.innerWidth / NODES_BBOX.width,
    window.innerHeight / NODES_BBOX.height,
  );
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}


export function CanvasMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [interactionMode, setInteractionMode] = useState<'pan' | 'select'>('select');

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
      if (!el || !containerRef.current) return null;
      const rect = el.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();
      const scale = parentRect.width / 2000; // 2000 is our explicit canvas width
      
      return {
        x: (rect.left - parentRect.left) / scale + el.offsetWidth / 2,
        y: (rect.top - parentRect.top) / scale + el.offsetHeight / 2,
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
          bowing: 1,
          seed: 1
        });
        svg.appendChild(path);
      }
    };

    drawConnection(profileRef.current, aboutRef.current);
    drawConnection(profileRef.current, projectsRef.current);
    drawConnection(profileRef.current, skillsRef.current);
    drawConnection(profileRef.current, contactRef.current);
  };

  // Continuous loop to perfectly sync lines with any drag or Framer Motion layout animation
  useEffect(() => {
    let animationFrameId: number;
    const renderLoop = () => {
      drawLines();
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Remove handleDrag since rAF loop handles it automatically

  // Re-fit the view to keep all 5 nodes visible if the window is resized
  // (e.g. rotating a mobile device).
  useEffect(() => {
    const handleResize = () => {
      transformRef.current?.centerView(getFitScale(), 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`canvas-container ${interactionMode === 'pan' ? 'pan-mode-active' : ''}`}>
      <TransformWrapper
        ref={transformRef}
        initialScale={getFitScale()}
        minScale={0.6}
        maxScale={1.5}
        centerOnInit={true}
        limitToBounds={true}
        wheel={{ step: 0.02, excluded: ['custom-scrollbar'] }}
        panning={{ excluded: ['node-container'] }}
      >
        {({ zoomIn, zoomOut, state }) => (
          <>
            {/* Toolbar Overlay */}
            <div className="hud-toolbar">
              <button 
                className={`toolbar-btn ${interactionMode === 'pan' ? 'active' : ''}`}
                onClick={() => setInteractionMode('pan')}
              >
                <Hand size={18} /> Pan
              </button>
              <button 
                className={`toolbar-btn ${interactionMode === 'select' ? 'active' : ''}`}
                onClick={() => setInteractionMode('select')}
              >
                <MousePointer2 size={18} /> Select
              </button>
            </div>

            {/* Zoom Controls HUD */}
            <div className="hud-zoom">
              <button className="hud-btn" onClick={() => zoomOut()}>-</button>
              <span style={{ minWidth: '45px', textAlign: 'center' }}>{Math.round(state.scale * 100)}%</span>
              <button className="hud-btn" onClick={() => zoomIn()}>+</button>
            </div>

            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div ref={containerRef} className="canvas-bg" style={{ width: 2000, height: 2000, position: 'relative' }}>
                
                <svg 
                  ref={svgRef} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} 
                />

                <ProfileNode ref={profileRef} />
                <AboutNode ref={aboutRef} />
                <ProjectsNode ref={projectsRef} />
                <SkillsNode ref={skillsRef} />
                <ContactNode ref={contactRef} />

              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
