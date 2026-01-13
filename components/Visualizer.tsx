import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VisualizerProps {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, audioRef }) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  // Fix: Initialize useRef with null to satisfy expected arguments
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const svg = d3.select(canvasRef.current);
    const width = 300;
    const height = 150;

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
      audioContext.close();
    };
  }, [audioRef]);

  return (
    <div className="w-full flex justify-center items-center h-32 opacity-80">
      <svg ref={canvasRef} width="300" height="150" className="rounded-lg overflow-hidden" />
    </div>
  );
};

export default Visualizer;