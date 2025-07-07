import { DOMElement } from 'react';
import { SankeyChartData, NodeProperties, Relation, SankeyChartDataOptions, SankeyChart, EventHandler } from '../src';

import { normalizeHTML } from './normalizeHTML';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// --- Happy DOM setup ---
import { Window } from 'happy-dom';
const document = window.document;
global.window = window as any;
global.document = document as any;
global.HTMLElement = window.HTMLElement as any;
global.SVGElement = window.SVGElement as any;
global.SVGSVGElement = window.SVGSVGElement as any;
global.SVGGElement = window.SVGGElement as any;
global.SVGRectElement = window.SVGRectElement as any;
global.SVGTextElement = window.SVGTextElement as any;
global.SVGTSpanElement = window.SVGTSpanElement as any;
global.SVGCircleElement = window.SVGCircleElement as any;

describe('SankeyChartData', () => {

  const mockData = {
    name: 'Test Data',
    color: 'blue',
    nodes: [
      { kind: 'type1', name: 'Node1' },
      { kind: 'type2', name: 'Node2' }
    ],
    relations: [
      { source: { kind: 'type1', name: 'Node1' }, target: { kind: 'type2', name: 'Node2' } }
    ]
  };

  const mockOptions: SankeyChartDataOptions = {
    relationDefaultWidth: 15,
    kinds: [{ name: 'type1' }, { name: 'type2' }]
  };

  let sankeyChartData: SankeyChartData;

  beforeEach(() => {
    sankeyChartData = new SankeyChartData(mockData, mockOptions);
  });

  /*
  test('sankey - render: init chart', () => {

    const svg = document.getElementById('sankey-chart-svg');
    const chart = new SankeyChart(svg);
    chart.setData(sankeyChartData);
    console.log(svg?.innerHTML);

    // Define the expected innerHTML
    const expectedInnerHTML = `
      <defs>
        <filter id="dropshadow">
          <feGaussianBlur stdDeviation="0.4"></feGaussianBlur>
        </filter>
      </defs>
    `;
    expect(normalizeHTML("" + svg?.innerHTML)).toBe(normalizeHTML(expectedInnerHTML));
  });
  */
 
  test('sankey - render: should render nodes and relations into the SVG', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);

    const chart = new SankeyChart(svg);
    chart.setData(sankeyChartData);

    // Check that SVG contains expected elements
    expect(svg.querySelectorAll('g').length).toBe(7); // At least one group
    expect(svg.querySelectorAll('rect').length).toBe(4); // At least one rect for nodes
    expect(svg.querySelectorAll('path').length).toBe(1); // At least one path for relations

    // Clean up
    document.body.removeChild(svg);
  });
});





