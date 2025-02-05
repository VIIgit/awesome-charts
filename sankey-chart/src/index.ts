import { SankeyChartData } from './sankey-chart-data';
import  SankeyChart from './sankey-chart';
import { EventHandler } from './event-handler';
import { Minimap } from './minimap';

export { SankeyChartData, Node, Relation, SankeyChartDataOptions, BasicNode, IncludeKind, Magnitude } from './sankey-chart-data';
export { EventHandler }
export { SankeyChart };
export { Minimap };

// Expose SankeyChartData globally
(window as any).SankeyChart = SankeyChart;
(window as any).SankeyChartData = SankeyChartData;
(window as any).EventHandler = EventHandler;
(window as any).MiniMap = Minimap;
