import { SankeyChartData, Node, Relation, SankeyChartDataOptions, SankeyChart, EventHandler } from '../src';

import { normalizeHTML } from './normalizeHTML';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body><svg id="sankey-chart-svg" width="900" height="600"></svg></body></html>');
const document = dom.window.document;

/*
global.window = dom.window;
*/
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
    trafficLog10Factor: 12,
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
test('sankey - silly', () => {

  expect(1).toBe(1);
});
});





