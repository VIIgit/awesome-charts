import { SankeyChartData } from './sankey-chart-data';
import  SankeyChart from './sankey-chart';
import { EventHandler } from './event-handler';

export { SankeyChartData, Node, Relation, SankeyChartDataOptions, BasicNode, IncludeKind } from './sankey-chart-data';
export { EventHandler }
export { SankeyChart };

// Expose SankeyChartData globally
(window as any).SankeyChart = SankeyChart;
(window as any).SankeyChartData = SankeyChartData;
(window as any).EventHandler = EventHandler;

