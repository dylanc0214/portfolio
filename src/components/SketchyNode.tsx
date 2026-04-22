import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import rough from 'roughjs';

interface SketchyNodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height?: number; // Optional, can let it auto-size based on content
  onDrag?: () => void;
  onClick?: () => void;
  children: React.ReactNode;
  expandable?: boolean;
  expanded?: boolean;
}

export const SketchyNode = React.forwardRef<HTMLDivElement, SketchyNodeProps>(
  ({ id, x, y, width, onDrag, onClick, children, expandable, expanded }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [bounds, setBounds] = useState({ w: width, h: 200 }); // Default height

    useEffect(() => {
      // Sync internal ref with forwarded ref
      if (ref) {
        if (typeof ref === 'function') ref(containerRef.current);
        else ref.current = containerRef.current;
      }
    }, [ref]);

    // Redraw roughjs rectangle when size changes
    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setBounds({ w: width, h: height });
        }
      });
      resizeObserver.observe(containerRef.current);
      
      return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, bounds.w, bounds.h);
      canvas.width = bounds.w;
      canvas.height = bounds.h;

      const rc = rough.canvas(canvas);
      rc.rectangle(2, 2, bounds.w - 4, bounds.h - 4, {
        fill: '#ffffff',
        fillStyle: 'solid',
        stroke: '#000000',
        strokeWidth: 2,
        roughness: 1.5,
        bowing: 1,
      });
    }, [bounds]);

    return (
      <motion.div
        id={id}
        ref={containerRef}
        drag
        dragMomentum={false}
        onClick={onClick}
        onDrag={onDrag}
        onDragEnd={onDrag}
        initial={{ x, y }}
        layout={expandable} // If expandable, animate layout changes
        className="node-container"
        style={{ width, zIndex: expanded ? 50 : 1 }}
      >
        <canvas ref={canvasRef} className="rough-canvas" />
        <div className="node-content" style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </motion.div>
    );
  }
);
