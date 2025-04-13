import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock D3 to avoid import issues
jest.mock('d3', () => {
  const mockChain = {
    attr: jest.fn().mockImplementation(function(key, value) {
      if (key === 'data-testid') {
        this.testid = value;
      }
      return this;
    }),
    join: jest.fn().mockImplementation(function(elementType) {
      this.elements = this.data || [];
      return this;
    }),
    call: jest.fn().mockImplementation(function(dragFn) {
      // Simulate the drag function
      return this;
    }),
    on: jest.fn().mockReturnThis(),
    force: jest.fn().mockReturnThis(),
    alphaTarget: jest.fn().mockReturnThis(),
    id: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    text: jest.fn().mockImplementation(function(textFn) {
      this.text = this.elements.map(textFn);
      return this;
    }),
    data: jest.fn().mockImplementation(function(data) {
      this.data = data;
      return this;
    }),
  };

  const mockD3 = {
    select: jest.fn().mockImplementation(() => ({
      selectAll: jest.fn().mockImplementation(() => ({
        remove: jest.fn().mockReturnThis(),
        data: jest.fn().mockImplementation(function(data) {
          this.data = data;
          return {
            join: jest.fn().mockImplementation(function(elementType) {
              this.elements = this.data || [];
              return {
                call: jest.fn().mockImplementation(function(dragFn) {
                  // Simulate the drag function
                  return this;
                }),
                attr: jest.fn().mockReturnThis(),
              };
            }),
            attr: jest.fn().mockReturnThis(),
            call: jest.fn().mockImplementation(function(dragFn) {
              // Simulate the drag function
              return this;
            }),
          };
        }),
        join: jest.fn().mockReturnThis(),
        append: jest.fn().mockImplementation(function() {
          return {
            selectAll: jest.fn().mockReturnValue({
              data: jest.fn().mockImplementation(function(data) {
                this.data = data;
                return {
                  join: jest.fn().mockImplementation(function(elementType) {
                    this.elements = this.data || [];
                    return {
                      call: jest.fn().mockImplementation(function(dragFn) {
                        // Simulate the drag function
                        return this;
                      }),
                      attr: jest.fn().mockReturnThis(),
                    };
                  }),
                  attr: jest.fn().mockReturnThis(),
                };
              }),
            }),
            attr: jest.fn().mockReturnThis(),
          };
        }),
        attr: jest.fn().mockReturnThis(),
      })),
      data: jest.fn().mockReturnValue(mockChain),
      join: jest.fn().mockReturnValue(mockChain),
      append: jest.fn().mockImplementation(function() {
        return {
          selectAll: jest.fn().mockReturnValue({
            data: jest.fn().mockImplementation(function(data) {
              this.data = data;
              return {
                join: jest.fn().mockImplementation(function(elementType) {
                  this.elements = this.data || [];
                  return {
                    call: jest.fn().mockImplementation(function(dragFn) {
                      // Simulate the drag function
                      return this;
                    }),
                    attr: jest.fn().mockReturnThis(),
                  };
                }),
                attr: jest.fn().mockReturnThis(),
              };
            }),
          }),
          attr: jest.fn().mockReturnThis(),
        };
      }),
      attr: jest.fn().mockReturnThis(),
    })),
    forceSimulation: jest.fn().mockImplementation((nodes) => ({
      nodes: nodes,
      force: jest.fn().mockReturnThis(),
      alphaTarget: jest.fn().mockReturnThis(),
      restart: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function(event, callback) {
        if (event === 'tick') {
          callback.call(null, { type: 'tick' });
        }
        return this;
      }),
    })),
    forceLink: jest.fn().mockReturnValue({
      id: jest.fn().mockReturnThis(),
    }),
    forceManyBody: jest.fn().mockReturnThis(),
    forceCenter: jest.fn().mockReturnThis(),
    drag: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
    }),
  };

  return mockD3;
});

import Graph from './Graph';

describe('Graph Component', () => {
  // Sample data for testing
  const mockNodes = [
    { id: 'Node1', title: 'First Node' },
    { id: 'Node2', title: 'Second Node' },
    { id: 'Node3', title: 'Third Node' }
  ];

  const mockEdges = [
    { source: 'Node1', target: 'Node2' },
    { source: 'Node2', target: 'Node3' }
  ];

  test('renders SVG with correct dimensions', () => {
    render(<Graph nodes={mockNodes} edges={mockEdges} />);
    
    const svgElement = screen.getByTestId('graph-svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '800');
    expect(svgElement).toHaveAttribute('height', '500');
  });

  test('renders correct number of nodes', () => {
    render(<Graph nodes={mockNodes} edges={mockEdges} />);
    
    const nodeElements = screen.getAllByTestId('graph-node');
    expect(nodeElements).toHaveLength(mockNodes.length);
  });

  test('renders node labels', () => {
    render(<Graph nodes={mockNodes} edges={mockEdges} />);
    
    mockNodes.forEach(node => {
      const label = screen.getByText(node.title);
      expect(label).toBeInTheDocument();
    });
  });

  test('handles empty data', () => {
    render(<Graph nodes={[]} edges={[]} />);
    
    const svgElement = screen.getByTestId('graph-svg');
    expect(svgElement).toBeInTheDocument();
  });
}); 