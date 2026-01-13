'use client';

import { useEffect, useRef, useState } from 'react';
import { Concept, GraphData, GraphNode } from '@/types/ontology';

interface OntologyGraphProps {
  concepts: Concept[];
  onNodeClick: (concept: Concept) => void;
}

export default function OntologyGraph({ concepts, onNodeClick }: OntologyGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Import react-force-graph-2d dynamically (client-side only)
  useEffect(() => {
    import('react-force-graph-2d').then((mod) => {
      setForceGraph2D(() => mod.default);
    });
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Function to get color based on travaux
  const getColorForTravaux = (travaux: string): string => {
    if (travaux === 'Thèse') {
      return '#080d94'; // Blue for Thèse
    } else if (travaux === 'CIENS') {
      return '#e2a9f1'; // Purple for CIENS
    }
    return '#4A90E2'; // Default color
  };

  // Generate graph data from concepts
  const graphData: GraphData = {
    nodes: concepts.map((concept) => ({
      id: concept.label,
      label: concept.label,
      color: getColorForTravaux(concept.travaux),
    })),
    links: [], // You can add relationships here if your ontology has them
  };

  // Add some sample links to create a connected graph visualization
  // This creates a circular layout - you can modify based on your ontology structure
  for (let i = 0; i < graphData.nodes.length - 1; i++) {
    if (i % 3 === 0 && i + 3 < graphData.nodes.length) {
      graphData.links.push({
        source: graphData.nodes[i].id,
        target: graphData.nodes[i + 3].id,
      });
    }
  }

  const handleNodeClick = (node: GraphNode) => {
    const concept = concepts.find(c => c.label === node.id);
    if (concept) {
      onNodeClick(concept);
    }
  };

  if (!ForceGraph2D) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">Chargement du graphique...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-white">
      <ForceGraph2D
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel="label"
        nodeColor="color"
        nodeRelSize={6}
        linkColor={() => '#999'}
        linkWidth={1.5}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.5);

          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || '#4A90E2';
          ctx.fill();

          // Draw label background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2 + 8,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          // Draw label text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#333';
          ctx.fillText(label, node.x, node.y + 8 + fontSize * 0.25);
        }}
        cooldownTicks={100}
        onEngineStop={() => {}}
      />
    </div>
  );
}
