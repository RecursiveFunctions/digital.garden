import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ nodes, edges }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous graph elements
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Only proceed if there are nodes and edges
    if (nodes.length === 0 || edges.length === 0) {
      return;
    }

    // Set up force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(400, 250))
      .force("x", d3.forceX(400).strength(0.1))
      .force("y", d3.forceY(250).strength(0.1))
      .alphaDecay(0.02)
      .alphaMin(0.1);

    // Create edges
    const link = svg.append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6);

    // Create nodes 
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", d => {
          const numberOfNeighbors = (d.neighbors && d.neighbors.length) || 2;
          return Math.min(7, Math.max(numberOfNeighbors / 2, 2));
        })
        .attr("fill", "#69b3a2")
        .attr("data-testid", "graph-node")
        .call(drag(simulation));

    // Create node labels
    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
        .text(d => d.title || d.id)
        .attr('x', 8)
        .attr('y', 4)
        .style('font-size', '12px');

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

  }, [nodes, edges]);

  return <svg ref={svgRef} width={800} height={500} data-testid="graph-svg" />;
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