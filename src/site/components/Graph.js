import React, { useEffect, useRef } from '/node_modules/react/index.js';
import * as d3 from '/node_modules/d3/dist/d3.min.js';

const Graph = ({ 
  nodes = [], 
  edges = [], 
  width = 800, 
  height = 500, 
  nodeColor = "#69b3a2", 
  linkColor = "#999" 
}) => {
  const svgRef = useRef();

  useEffect(() => {
    console.log('Graph component received:', { nodes, edges });

    if (!svgRef.current) {
      console.error('SVG ref is not available');
      return;
    }

    if (nodes.length === 0) {
      console.warn('No nodes to render');
      return;
    }

    try {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous graph

      // Ensure nodes have unique IDs
      const processedNodes = nodes.map((node, index) => ({
        ...node,
        id: node.id || `node-${index}`
      }));

      // Ensure edges reference correct node IDs
      const processedEdges = edges.map(edge => ({
        ...edge,
        source: processedNodes.find(n => n.id === edge.source)?.id || edge.source,
        target: processedNodes.find(n => n.id === edge.target)?.id || edge.target
      })).filter(edge => 
        processedNodes.some(n => n.id === edge.source) && 
        processedNodes.some(n => n.id === edge.target)
      );

      console.log('Processed nodes:', processedNodes);
      console.log('Processed edges:', processedEdges);

      // Set up force simulation
      const simulation = d3.forceSimulation(processedNodes)
        .force("link", d3.forceLink(processedEdges).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .alphaDecay(0.02)
        .alphaMin(0.1);

      // Create edges
      const link = svg.append("g")
        .selectAll("line")
        .data(processedEdges)
        .join("line")
        .attr("stroke", linkColor)
        .attr("stroke-opacity", 0.6);

      // Create nodes 
      const node = svg.append("g")
        .selectAll("circle")
        .data(processedNodes)
        .join("circle")
          .attr("r", d => {
            const numberOfNeighbors = (d.neighbors && d.neighbors.length) || 2;
            return Math.min(7, Math.max(numberOfNeighbors / 2, 2));
          })
          .attr("fill", nodeColor)
          .attr("data-testid", "graph-node")
          .call(drag(simulation));

      // Create node labels
      const label = svg.append("g")
        .selectAll("text")
        .data(processedNodes)
        .join("text")
          .text(d => d.title || d.id)
          .attr('x', 6)
          .attr('y', 3)
          .style('font-size', '10px');

      // Update node and edge positions on each tick  
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)  
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
        
        label
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });

    } catch (error) {
      console.error('Error rendering graph:', error);
    }

  }, [nodes, edges, width, height, nodeColor, linkColor]);

  return nodes.length > 0 
    ? <svg ref={svgRef} width={width} height={height} data-testid="graph-svg" /> 
    : null;
}

// Drag handler
const drag = simulation => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

export default Graph; 