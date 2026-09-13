'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3Force from 'd3-force';
import { getAxeColor } from '@/lib/axes';

export default function OntologyGraph({ concepts, onNodeClick, selectedAxe, selectedConceptLabel }) {
  const containerRef = useRef(null);
  const fgRef = useRef(null);
  const [ForceGraph2D, setForceGraph2D] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    import('react-force-graph-2d').then((mod) => {
      setForceGraph2D(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDimensions, 100);
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  const graphData = useMemo(() => {
    const filteredConcepts = concepts.filter((concept) => {
      if (selectedAxe === 'all') return true;
      return concept.axe === selectedAxe;
    });

    const data = {
      nodes: filteredConcepts.map((concept) => ({
        id: concept.label,
        label: concept.label,
        color: getAxeColor(concept.axe),
      })),
      links: [],
    };

    const addedLinks = new Set();

    concepts.forEach((concept) => {
      if (concept.relations && concept.relations.trim()) {
        const relatedConcepts = concept.relations
          .split(';')
          .map((r) => r.trim())
          .filter((r) => r);

        relatedConcepts.forEach((targetLabel) => {
          const sourceExists = data.nodes.some((node) => node.id === concept.label);
          const targetExists = data.nodes.some((node) => node.id === targetLabel);

          if (sourceExists && targetExists) {
            const linkId = [concept.label, targetLabel].sort().join('-');

            if (!addedLinks.has(linkId)) {
              data.links.push({ source: concept.label, target: targetLabel });
              addedLinks.add(linkId);
            }
          }
        });
      }
    });

    return data;
  }, [concepts, selectedAxe]);

  const selectAndCenterNode = useCallback((nodeId) => {
    setSelectedNode(nodeId);

    const connectedNodes = new Set([nodeId]);
    const connectedLinks = new Set();

    if (fgRef.current && fgRef.current.graphData) {
      const currentGraphData = fgRef.current.graphData();
      let targetNode = null;

      if (currentGraphData && currentGraphData.nodes) {
        targetNode = currentGraphData.nodes.find((n) => n.id === nodeId);

        const idx = currentGraphData.nodes.findIndex((n) => n.id === nodeId);
        if (idx !== -1 && idx !== currentGraphData.nodes.length - 1) {
          const [moved] = currentGraphData.nodes.splice(idx, 1);
          currentGraphData.nodes.push(moved);
        }
      }

      if (currentGraphData && currentGraphData.links) {
        currentGraphData.links.forEach((link) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;

          if (sourceId === nodeId) {
            connectedNodes.add(targetId);
            connectedLinks.add(`${sourceId}-${targetId}`);
          }
          if (targetId === nodeId) {
            connectedNodes.add(sourceId);
            connectedLinks.add(`${sourceId}-${targetId}`);
          }
        });
      }

      if (targetNode && targetNode.x !== undefined && targetNode.y !== undefined) {
        fgRef.current.centerAt(targetNode.x, targetNode.y, 1000);
        fgRef.current.zoom(3.2, 1000);
      }
    }

    setHighlightNodes(connectedNodes);
    setHighlightLinks(connectedLinks);
  }, []);

  const handleNodeClick = useCallback(
    (node) => {
      const concept = concepts.find((c) => c.label === node.id);
      if (concept) {
        selectAndCenterNode(node.id);
        onNodeClick(concept);
      }
    },
    [concepts, onNodeClick, selectAndCenterNode]
  );

  useEffect(() => {
    if (selectedConceptLabel && ForceGraph2D) {
      const timer = setTimeout(() => {
        selectAndCenterNode(selectedConceptLabel);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [selectedConceptLabel, ForceGraph2D, selectAndCenterNode]);

  if (!ForceGraph2D) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">Un instant, je cherche les recherches d&apos;Elsa</p>
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
        nodePointerAreaPaint={(node, color, ctx, globalScale) => {
          const fontSize = 11 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(node.label).width;

          const circleRadius = 10 / globalScale;
          const padding = fontSize * 0.3;
          const bubbleWidth = textWidth + padding * 2;
          const bubbleHeight = fontSize + padding;
          const textPadding = circleRadius + 8 / globalScale;

          const totalWidth = textPadding + bubbleWidth;
          const totalHeight = Math.max(circleRadius * 2, bubbleHeight);

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(node.x - circleRadius, node.y - totalHeight / 2, totalWidth, totalHeight, 4 / globalScale);
          ctx.fill();
        }}
        linkColor={(link) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const linkId1 = `${sourceId}-${targetId}`;
          const linkId2 = `${targetId}-${sourceId}`;
          const isHL = highlightLinks.has(linkId1) || highlightLinks.has(linkId2);
          if (isHL) return '#ff6b6b';
          return highlightNodes.size > 0 ? 'rgba(153,153,153,0.15)' : '#999';
        }}
        linkWidth={(link) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const linkId1 = `${sourceId}-${targetId}`;
          const linkId2 = `${targetId}-${sourceId}`;
          return highlightLinks.has(linkId1) || highlightLinks.has(linkId2) ? 3 : 1.5;
        }}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label;
          const isSelected = selectedNode === node.id;
          const isHighlighted = highlightNodes.has(node.id);
          const isDimmed = highlightNodes.size > 0 && !isHighlighted;

          ctx.save();
          ctx.globalAlpha = isDimmed ? 0.12 : 1;

          const sizeMultiplier = isSelected || isHighlighted ? 1.5 : 1;
          const fontSize = (11 / globalScale) * sizeMultiplier;
          ctx.font = `${isSelected || isHighlighted ? 'bold ' : ''}${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;

          const circleRadius = (10 * sizeMultiplier) / globalScale;

          if (isSelected) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, circleRadius + 4 / globalScale, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(236,30,150,0.3)';
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, circleRadius, 0, 2 * Math.PI);
          ctx.fillStyle = node.color || '#4A90E2';
          ctx.fill();
          ctx.strokeStyle = isSelected || isHighlighted ? '#000' : '#fff';
          ctx.lineWidth = 2 / globalScale;
          ctx.stroke();

          const textPadding = circleRadius + 8 / globalScale;
          const textX = node.x + textPadding;

          const padding = fontSize * 0.3;
          const bubbleWidth = textWidth + padding * 2;
          const bubbleHeight = fontSize + padding;

          ctx.beginPath();
          ctx.roundRect(textX - padding, node.y - bubbleHeight / 2, bubbleWidth, bubbleHeight, 4 / globalScale);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.lineWidth = 1 / globalScale;
          ctx.stroke();

          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#333';
          ctx.fillText(label, textX, node.y);

          ctx.restore();
        }}
        enableNodeDrag={true}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.82}
        warmupTicks={50}
        cooldownTime={6000}
        nodeRelSize={8}
        d3Force={(forces) => {
          forces.charge.strength(-260);
          forces.center.x(dimensions.width / 2).strength(0.05);
          forces.center.y(dimensions.height / 2).strength(0.05);
          if (forces.link) {
            forces.link.distance(100).strength(0.8);
          }
          forces.collision = d3Force.forceCollide().radius(50);
          return forces;
        }}
      />
    </div>
  );
}