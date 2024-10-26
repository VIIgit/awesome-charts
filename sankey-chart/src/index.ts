
export function greet(name: string): string {
  return `Hello, ${name}! Welcome to Awesome Charts!`;
}
/*

export { SankeyChartData, Node, Relation, SankeyChartDataOptions } from './sankey-chart-data';
export { EventHandler } from './event-handler';
export { SankeyChart } from './sankey-chart';

*/

import { SankeyChartData } from './sankey-chart-data';
import  SankeyChart from './sankey-chart';
import { EventHandler } from './event-handler';

export { SankeyChartData, Node, Relation, SankeyChartDataOptions } from './sankey-chart-data';
export { EventHandler }
export { SankeyChart };



// Expose SankeyChartData globally
(window as any).SankeyChart = SankeyChart;
(window as any).SankeyChartData = SankeyChartData;
(window as any).EventHandler = EventHandler;

