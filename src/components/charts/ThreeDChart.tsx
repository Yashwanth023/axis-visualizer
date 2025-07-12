
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scatter3D, RotateCcw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface Dataset {
  id: string;
  name: string;
  data: DataPoint[];
  chartType: 'line' | 'bar' | 'scatter' | 'area' | '3d';
  createdAt: string;
}

interface ThreeDChartProps {
  dataset: Dataset;
}

export const ThreeDChart: React.FC<ThreeDChartProps> = ({ dataset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);
  const [rotation, setRotation] = useState({ x: 0.5, y: 0 });
  const [scale, setScale] = useState(1);
  const mouseRef = useRef({ isDown: false, startX: 0, startY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      drawChart(ctx, canvas);
      if (isAnimating) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.01 }));
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dataset, rotation, scale, isAnimating]);

  const drawChart = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw background gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height) / 2);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw 3D grid
    drawGrid(ctx, centerX, centerY);
    
    // Draw 3D axes
    drawAxes(ctx, centerX, centerY);
    
    // Draw data points
    drawDataPoints(ctx, centerX, centerY);
    
    // Draw connections for line chart
    if (dataset.chartType === 'line' || dataset.chartType === '3d') {
      drawConnections(ctx, centerX, centerY);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 50 * scale;
    const gridCount = 10;
    
    for (let i = -gridCount; i <= gridCount; i++) {
      // Horizontal lines
      const y1 = project3D(i * gridSize, -gridCount * gridSize, 0, rotation);
      const y2 = project3D(i * gridSize, gridCount * gridSize, 0, rotation);
      
      ctx.beginPath();
      ctx.moveTo(centerX + y1.x, centerY + y1.y);
      ctx.lineTo(centerX + y2.x, centerY + y2.y);
      ctx.stroke();
      
      // Vertical lines
      const x1 = project3D(-gridCount * gridSize, i * gridSize, 0, rotation);
      const x2 = project3D(gridCount * gridSize, i * gridSize, 0, rotation);
      
      ctx.beginPath();
      ctx.moveTo(centerX + x1.x, centerY + x1.y);
      ctx.lineTo(centerX + x2.x, centerY + x2.y);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const axisLength = 200 * scale;
    
    // X axis (red)
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    const xAxis = project3D(axisLength, 0, 0, rotation);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + xAxis.x, centerY + xAxis.y);
    ctx.stroke();
    
    // Y axis (green)
    ctx.strokeStyle = '#4ECDC4';
    const yAxis = project3D(0, axisLength, 0, rotation);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + yAxis.x, centerY + yAxis.y);
    ctx.stroke();
    
    // Z axis (blue)
    ctx.strokeStyle = '#45B7D1';
    const zAxis = project3D(0, 0, axisLength, rotation);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + zAxis.x, centerY + zAxis.y);
    ctx.stroke();
  };

  const drawDataPoints = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    dataset.data.forEach((point, index) => {
      const x = (point.x - 25) * 5 * scale;
      const y = (point.y - 25) * 5 * scale;
      const z = Math.sin(index * 0.5) * 50 * scale;
      
      const projected = project3D(x, y, z, rotation);
      
      // Draw point shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX + projected.x + 5, centerY + projected.y + 5, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw point
      const gradient = ctx.createRadialGradient(
        centerX + projected.x, centerY + projected.y, 0,
        centerX + projected.x, centerY + projected.y, 12 * scale
      );
      gradient.addColorStop(0, point.color || '#8B5CF6');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX + projected.x, centerY + projected.y, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw point highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX + projected.x - 2, centerY + projected.y - 2, 2 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label
      if (point.label) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(point.label, centerX + projected.x, centerY + projected.y - 15 * scale);
      }
    });
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (dataset.data.length < 2) return;
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    
    dataset.data.forEach((point, index) => {
      const x = (point.x - 25) * 5 * scale;
      const y = (point.y - 25) * 5 * scale;
      const z = Math.sin(index * 0.5) * 50 * scale;
      
      const projected = project3D(x, y, z, rotation);
      
      if (index === 0) {
        ctx.moveTo(centerX + projected.x, centerY + projected.y);
      } else {
        ctx.lineTo(centerX + projected.x, centerY + projected.y);
      }
    });
    
    ctx.stroke();
  };

  const project3D = (x: number, y: number, z: number, rot: { x: number; y: number }) => {
    // Rotate around X axis
    const rotatedY = y * Math.cos(rot.x) - z * Math.sin(rot.x);
    const rotatedZ = y * Math.sin(rot.x) + z * Math.cos(rot.x);
    
    // Rotate around Y axis
    const finalX = x * Math.cos(rot.y) + rotatedZ * Math.sin(rot.y);
    const finalZ = -x * Math.sin(rot.y) + rotatedZ * Math.cos(rot.y);
    
    // Project to 2D
    const distance = 400;
    const scale3D = distance / (distance + finalZ);
    
    return {
      x: finalX * scale3D,
      y: rotatedY * scale3D
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.startX = e.clientX;
    mouseRef.current.startY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseRef.current.isDown) return;
    
    const deltaX = e.clientX - mouseRef.current.startX;
    const deltaY = e.clientY - mouseRef.current.startY;
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01
    }));
    
    mouseRef.current.startX = e.clientX;
    mouseRef.current.startY = e.clientY;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const resetView = () => {
    setRotation({ x: 0.5, y: 0 });
    setScale(1);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Scatter3D className="h-5 w-5" />
            3D Visualization - {dataset.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAnimation}
              className="text-white hover:bg-white/20"
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale(prev => Math.min(prev * 1.2, 3))}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale(prev => Math.max(prev / 1.2, 0.5))}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetView}
              className="text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 w-full rounded-lg overflow-hidden bg-black/20">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="absolute top-4 right-4 text-white/60 text-sm">
            <p>Click and drag to rotate</p>
            <p>Use controls to zoom</p>
          </div>
        </div>
        
        {/* 3D Chart Info */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Rotation X</p>
            <p className="text-white text-sm font-mono">{rotation.x.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Rotation Y</p>
            <p className="text-white text-sm font-mono">{rotation.y.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Scale</p>
            <p className="text-white text-sm font-mono">{scale.toFixed(1)}x</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
