'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Concept, GraphData } from '@/types/ontology';

interface OntologyGraphProps {
  concepts: Concept[];
  onNodeClick: (concept: Concept) => void;
  selectedFilter: string;
  selectedCategory: string;
}

export default function OntologyGraph({ concepts, onNodeClick, selectedFilter, selectedCategory }: OntologyGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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
        const rect = containerRef.current.getBoundingClientRect();
        // On mobile, ensure minimum usable dimensions
        const minHeight = window.innerWidth < 768 ? Math.max(400, window.innerHeight * 0.6) : rect.height;
        setDimensions({
          width: rect.width,
          height: Math.max(minHeight, rect.height),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    // Add orientation change for mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDimensions, 100);
    });
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Function to get color based on travaux
  const getColorForTravaux = (travaux: string): string => {
    // If travaux contains both "Thèse" and "CIENS", use CIENS color
    if (travaux.includes('CIENS')) {
      return '#e2a9f1'; // Purple for CIENS (including Thèse + CIENS)
    } else if (travaux.includes('Thèse')) {
      return '#080d94'; // Blue for Thèse only
    }
    return '#4A90E2'; // Default color
  };

  // Generate graph data from concepts with useMemo to avoid recreating on every render
  const graphData: GraphData = useMemo(() => {
    
    // Filter concepts based on selected filter and category
    const filteredConcepts = concepts.filter(concept => {
      // Apply travaux filter
      let passesTravauxFilter = false;
      if (selectedFilter === 'all') {
        passesTravauxFilter = true;
      } else if (selectedFilter === 'CIENS') {
        passesTravauxFilter = concept.travaux.includes('CIENS');
      } else if (selectedFilter === 'Thèse') {
        passesTravauxFilter = concept.travaux.includes('Thèse');
      } else {
        passesTravauxFilter = concept.travaux === selectedFilter;
      }

      // Apply category filter
      let passesCategoryFilter = false;
      if (selectedCategory === 'all') {
        passesCategoryFilter = true;
      } else {
        passesCategoryFilter = concept.categorie === selectedCategory;
      }

      return passesTravauxFilter && passesCategoryFilter;
    });

    const data: GraphData = {
      nodes: filteredConcepts.map((concept) => ({
        id: concept.label,
        label: concept.label,
        color: getColorForTravaux(concept.travaux),
      })),
      links: [],
    };

    // Add real relationships from the concepts' relations field
    // Use ALL concepts to find relations, but only add links if both nodes are in filtered set
    const addedLinks = new Set<string>(); // To avoid duplicate links
    
    concepts.forEach((concept) => {
      if (concept.relations && concept.relations.trim()) {
        // Split relations by semicolon and trim whitespace
        const relatedConcepts = concept.relations
          .split(';')
          .map(r => r.trim())
          .filter(r => r); // Remove empty strings

        // Create a link for each related concept
        relatedConcepts.forEach((targetLabel) => {
          // Check if both source and target exist in our filtered nodes
          const sourceExists = data.nodes.some(node => node.id === concept.label);
          const targetExists = data.nodes.some(node => node.id === targetLabel);

          if (sourceExists && targetExists) {
            // Create a unique identifier for this link (sorted to avoid duplicates)
            const linkId = [concept.label, targetLabel].sort().join('-');
            
            if (!addedLinks.has(linkId)) {
              data.links.push({
                source: concept.label,
                target: targetLabel,
              });
              addedLinks.add(linkId);
            }
          }
        });
      }
    });

    return data;
  }, [concepts, selectedFilter, selectedCategory]);

  const handleNodeClick = useCallback((node: any) => {
    const concept = concepts.find(c => c.label === node.id);
    if (concept) {
      // Mark this node as selected for visual enlargement
      setSelectedNode(node.id);

      // Find all connected nodes and links by accessing graphData from current graph
      const connectedNodes = new Set<string>();
      const connectedLinks = new Set<string>();

      connectedNodes.add(node.id);

      // Get links directly from the force graph data to avoid stale closure
      if (fgRef.current && fgRef.current.graphData) {
        const currentGraphData = fgRef.current.graphData();
        if (currentGraphData && currentGraphData.links) {
          currentGraphData.links.forEach((link: any) => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;

            if (sourceId === node.id) {
              connectedNodes.add(targetId);
              connectedLinks.add(`${sourceId}-${targetId}`);
            }
            if (targetId === node.id) {
              connectedNodes.add(sourceId);
              connectedLinks.add(`${sourceId}-${targetId}`);
            }
          });
        }
      }

      setHighlightNodes(connectedNodes);
      setHighlightLinks(connectedLinks);

      // Zoom to node
      if (fgRef.current && node.x !== undefined && node.y !== undefined) {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2, 1000);
      }

      // Trigger definition display
      onNodeClick(concept);
    }
  }, [concepts, onNodeClick]);

  if (!ForceGraph2D) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">Un instant, je cherche les recherches d'Elsa</p>
      </div>
    );
  }

  const handleReset = () => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setSelectedNode(null);
    if (fgRef.current) {
      fgRef.current.zoomToFit(1000);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-white relative">
      {highlightNodes.size > 0 && (
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Réinitialiser le zoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel="label"
        nodeColor="color"
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          // Simple large clickable area
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 40, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkColor={(link: any) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const linkId1 = `${sourceId}-${targetId}`;
          const linkId2 = `${targetId}-${sourceId}`;
          return highlightLinks.has(linkId1) || highlightLinks.has(linkId2) ? '#ff6b6b' : '#999';
        }}
        linkWidth={(link: any) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const linkId1 = `${sourceId}-${targetId}`;
          const linkId2 = `${targetId}-${sourceId}`;
          return highlightLinks.has(linkId1) || highlightLinks.has(linkId2) ? 3 : 1.5;
        }}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.label;
          const isSelected = selectedNode === node.id;
          const isHighlighted = highlightNodes.has(node.id);

          // Enlarge selected and highlighted nodes
          const sizeMultiplier = isSelected || isHighlighted ? 1.5 : 1;
          const fontSize = (11 / globalScale) * sizeMultiplier;
          ctx.font = `${isSelected || isHighlighted ? 'bold ' : ''}${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;

          // Calculate bubble size
          const padding = fontSize * 1.2;
          const bubbleWidth = textWidth + padding * 2;
          const bubbleHeight = fontSize + padding * 1.5;
          const bubbleRadius = bubbleHeight / 2;

          // Draw bubble
          ctx.beginPath();
          ctx.moveTo(node.x - bubbleWidth / 2 + bubbleRadius, node.y - bubbleHeight / 2);
          ctx.lineTo(node.x + bubbleWidth / 2 - bubbleRadius, node.y - bubbleHeight / 2);
          ctx.quadraticCurveTo(node.x + bubbleWidth / 2, node.y - bubbleHeight / 2, node.x + bubbleWidth / 2, node.y - bubbleHeight / 2 + bubbleRadius);
          ctx.lineTo(node.x + bubbleWidth / 2, node.y + bubbleHeight / 2 - bubbleRadius);
          ctx.quadraticCurveTo(node.x + bubbleWidth / 2, node.y + bubbleHeight / 2, node.x + bubbleWidth / 2 - bubbleRadius, node.y + bubbleHeight / 2);
          ctx.lineTo(node.x - bubbleWidth / 2 + bubbleRadius, node.y + bubbleHeight / 2);
          ctx.quadraticCurveTo(node.x - bubbleWidth / 2, node.y + bubbleHeight / 2, node.x - bubbleWidth / 2, node.y + bubbleHeight / 2 - bubbleRadius);
          ctx.lineTo(node.x - bubbleWidth / 2, node.y - bubbleHeight / 2 + bubbleRadius);
          ctx.quadraticCurveTo(node.x - bubbleWidth / 2, node.y - bubbleHeight / 2, node.x - bubbleWidth / 2 + bubbleRadius, node.y - bubbleHeight / 2);
          ctx.closePath();

          ctx.fillStyle = node.color || '#4A90E2';
          ctx.fill();

          // Draw label text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x, node.y);
        }}
        enableNodeDrag={true}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.4}
        warmupTicks={50}
        cooldownTime={15000}
        nodeRelSize={8}
        d3Force={(forces: any) => {
          forces.charge.strength(-400);
          forces.center.x(dimensions.width / 2);
          forces.center.y(dimensions.height / 2);
          return forces;
        }}
      />
    </div>
  );
}