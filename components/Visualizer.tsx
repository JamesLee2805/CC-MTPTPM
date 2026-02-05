
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VisualizerProps {
  isPlaying: boolean;
  analyser: AnalyserNode | null;
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, analyser }) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const svg = d3.select(canvasRef.current);
    const width = 300;
    const height = 150;
    const bufferLength = analyser.frequencyBinCount;

    const renderFrame = () => {
      if (!isPlaying) {
        animationIdRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      svg.selectAll('rect')
        .data(Array.from(dataArray))
        .join('rect')
        .attr('x', (d, i) => i * (width / bufferLength))
        .attr('y', d => height - (d / 255) * height)
        .attr('width', (width / bufferLength) - 1)
        .attr('height', d => (d / 255) * height)
        .attr('fill', (d, i) => d3.interpolatePlasma(i / bufferLength))
        .attr('rx', 2);

      animationIdRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isPlaying, analyser]);

  return (
    <div className="w-full flex justify-center items-center h-32 opacity-80">
      <svg ref={canvasRef} width="300" height="150" className="rounded-lg overflow-hidden" />
    </div>
  );
};

export default Visualizer;
