import { normalizeHTML } from './normalizeHTML';
import { SankeyChartData,  NodeProperties, Relation, SankeyChartDataOptions, Node, IncludeKind } from '../src';

test('createSankeyChart should work correctly', () => {
  const element = document.createElement('div');
  element.appendChild(document.createElement('div'));
  const data = { key: 'value' };
  //SankeyChartData(element, data);
  const html = normalizeHTML(element.innerHTML);
  expect(element.innerHTML).toContain(html);
});

test('SankeyChart should be defined', () => {
  expect(SankeyChartData).toBeDefined();
});

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
  kinds: [{ name: 'type1' }, { name: 'type2' }],

};

describe('SankeyChartData', () => {
  let sankeyChartData: SankeyChartData;

  beforeEach(() => {
    sankeyChartData = new SankeyChartData(mockData, mockOptions);
  });

  test('should initialize correctly', () => {
    expect(sankeyChartData.originalData).toMatchObject(mockData);
    expect(sankeyChartData.options).toMatchObject(mockOptions);
    expect(sankeyChartData.originalData.nodes.length).toEqual(2);

    expect(sankeyChartData.getNodes().length).toEqual(2);
    expect(sankeyChartData.getKinds().length).toEqual(2);
    sankeyChartData.selectNode(mockData.nodes[0]);
    expect(sankeyChartData.nodes.length).toEqual(2);
  });

  test('should set options correctly', () => {
    const newOptions: SankeyChartDataOptions = {
      relationDefaultWidth: 20,
      kinds: [{ name: 'type3' }]
    };
    sankeyChartData.setOptions(newOptions);
    expect(sankeyChartData.options.relationDefaultWidth).toBe(20);
    expect(sankeyChartData.options.kinds).toEqual([{ name: 'type3' }]);
  });

  test('should append data correctly', () => {
    const additionalData = {
      nodes: [{ kind: 'type3', name: 'Node3' }],
      relations: [
        { source: { kind: 'type2', name: 'Node2' }, target: { kind: 'type3', name: 'Node3' } }
      ]
    };
    sankeyChartData.appendData(additionalData);
    expect(sankeyChartData.originalData.nodes).toHaveLength(3);
    expect(sankeyChartData.originalData.relations).toHaveLength(2);
  });

  test('should get nodes by kind', () => {
    const x = sankeyChartData.getNodesByKind('type1');
    expect(sankeyChartData.getNodesByKind('type1').length).toEqual(1);
    sankeyChartData.appendData({ nodes: mockData.nodes, relations: mockData.relations });
    //expect(sankeyChartData.getNodesByKind('type1')).toEqual([{ kind: 'type1', name: 'Node1' }]);
  });

  test('should select node correctly', () => {
    interface SelectedNode {
      kind: string;
      name: string;
    }
    sankeyChartData.appendData({ nodes: mockData.nodes, relations: mockData.relations });
    const node: NodeProperties = { kind: 'type1', name: 'Node1' };
    sankeyChartData.selectNode(node);
    expect(sankeyChartData.getSelectedNode()).toEqual(expect.objectContaining(node));
  });

  test('should throw error if node kind or name is empty', () => {
    expect(() => {
      sankeyChartData.selectNode({ kind: '', name: 'Node1' });
    }).toThrow('Node must have kind and name');
    expect(() => {
      sankeyChartData.selectNode({ kind: 'type1', name: '' });
    }).toThrow('Node must have kind and name');
  });

  test('should filter nodes correctly based on relations', () => {
    const nodeA: Node = { kind: 'typeA', name: 'A' };
    const nodeB: Node = { kind: 'typeB', name: 'B' };
    const nodeC: Node = { kind: 'typeC', name: 'C' };
    const nodeD: Node = { kind: 'typeD', name: 'D' };
    const relations: Relation[] = [
      { source: nodeA, target: nodeB },
      { source: nodeB, target: nodeC }
    ];
    sankeyChartData.appendData({ nodes: [nodeA, nodeB, nodeC, nodeD], relations });
    expect(sankeyChartData.filterNodes(relations)).toEqual([nodeA, nodeB, nodeC]);
  });

});

describe('init SankeyChartData', () => {

  const mockData = {
    "name": "MockData",
    "nodes": [
      { "kind": "product", "name": "Product 1 with a longer description", "tags": ["A", "B", "C", "X"] },
      { "kind": "product", "name": "Product 2", "tags": ["F"] },
      { "kind": "product", "name": "Product 3", "tags": ["A", "3"] },
      { "kind": "product", "name": "Product 4" },
      { "kind": "product", "name": "ABC" },
      { "kind": "product", "name": "Product 5", "tags": ["F", "5"] },
      { "kind": "product", "name": "Product 44", "tags": ["F", "4"] },
      { "kind": "product", "name": "Product T" },
      { "kind": "consumer", "name": "Consumer 1", "tags": ["A", "B"] },
      { "kind": "consumer", "name": "Consumer 2", "tags": ["X"] },
      { "kind": "consumer", "name": "Consumer 3" },
      { "kind": "consumer", "name": "Consumer 4", "tags": ["F"] },
      { "kind": "consumer", "name": "Consumer 5" },
      { "kind": "consumer", "name": "Consumer 5X" },
      { "kind": "consumer", "name": "ABC" },
      { "kind": "proxy", "name": "Proxy A", "tags": ["X"] },
      { "kind": "proxy", "name": "Proxy B", "tags": ["Y"] },
      { "kind": "proxy", "name": "Proxy C" },
      { "kind": "proxy", "name": "Proxy D" }
    ],
    "relations": [
      { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 1 with a longer description" }, "analytics": { "traffic": 1000000, "errors": 203555, "environment": "NonPROD" } },
      { "source": { "kind": "consumer", "name": "Consumer 5" }, "target": { "kind": "product", "name": "Product 1 with a longer description" }, "analytics": { "traffic": 0, "errors": 1000, "environment": "nonProd" } },
      { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 2" } },
      { "source": { "kind": "consumer", "name": "ABC" }, "target": { "kind": "product", "name": "ABC" } },
      { "source": { "kind": "consumer", "name": "Consumer 5" }, "target": { "kind": "proxy", "name": "Proxy A" } },
      { "source": { "kind": "consumer", "name": "Consumer 5" }, "target": { "kind": "proxy", "name": "Proxy B" } },
      { "source": { "kind": "consumer", "name": "Consumer 5" }, "target": { "kind": "product", "name": "Product 2" } },
      { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 3" }, "analytics": { "traffic": 100000000, "errors": 1000, "environment": "NonPROD" } },
      { "source": { "kind": "consumer", "name": "Consumer 4" }, "target": { "kind": "product", "name": "Product 3" }, "analytics": { "traffic": 450000, "errors": 1000 } },
      { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy B" }, "analytics": { "traffic": 10000000, "errors": 400, "consumers": { "Consumer 4": { "traffic": 40000, "errors": 200 } } } },
      { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy A" }, "analytics": { "traffic": 1000000, "errors": 0, "consumers": { "Consumer 4": { "traffic": 5000, "errors": 200 } } } },
      { "source": { "kind": "consumer", "name": "Consumer 2" }, "target": { "kind": "product", "name": "Product 4" } },
      { "source": { "kind": "product", "name": "Product 4" }, "target": { "kind": "proxy", "name": "Proxy B" } },
      { "source": { "kind": "consumer", "name": "Consumer 4" }, "target": { "kind": "product", "name": "Product 5" } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy A" }, "analytics": { "traffic": 10, "errors": 1 } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy B" }, "analytics": { "traffic": 1000, "errors": 22 } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy C" }, "analytics": { "traffic": 10000, "errors": 333 } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy D" } },
      { "source": { "kind": "product", "name": "Product 2" }, "target": { "kind": "proxy", "name": "Proxy D" } },
      { "source": { "kind": "product", "name": "Product 44" }, "target": { "kind": "proxy", "name": "Proxy D" } },
      { "source": { "kind": "consumer", "name": "Consumer 5X" }, "target": { "kind": "product", "name": "Product T" } },
      { "source": { "kind": "consumer", "name": "Consumer 5" }, "target": { "kind": "consumer", "name": "Consumer 5X" } }
    ]
  };

  const mockOptions: SankeyChartDataOptions = {
    defaultColor: "gray",
    tagColorMap: {
      "A": "#ff0000",
      "X": "#00ff00",
      "F": "#ff00ff"
    },
    kinds: [
      { name: 'consumer', title: 'Consumers' },
      { name: 'product', title: 'Products' },
      { name: 'proxy', title: 'Proxies' }
    ],
    showRelatedKinds: true
  };

  let sankeyChartData: SankeyChartData;

  beforeEach(() => {
    sankeyChartData = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
  });

  test('sankey - initial data', () => {
    expect(sankeyChartData.getKinds().length).toBe(3);
  });

  test('sankey - selectAll() ', () => {
    expect(sankeyChartData.selectedNode).toBeUndefined();
  });
  test('sankey - selectNode(): select Product 5', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    chartDataA.selectNode({ kind: 'product', name: 'Product 5' })
    expect(chartDataA.selectedNode).toStrictEqual({
      kind: 'product', name: 'Product 5', "tags": [
        "F",
        "5"
      ],
      cardinality: {
        "sameKindCount": 0,
        "sourceCount": 4,
        "targetCount": 1
      },
      hasRelatedSourceOfOtherKinds: false,
      hasRelatedSourceOfSameKind: false,
      hasRelationsOfSameKinds: true,
      color: '#ff00ff'
    });
    expect(chartDataA.getKinds().length).toBe(3);
  });

  test('sankey - selectNode(): not found Product xxxx', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    chartDataA.selectNode({ kind: 'product', name: 'Product xxxx' })
    expect(chartDataA.selectedNode).toBeUndefined();
  });

  test('sankey - selectNode(): criteria is invalid', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    expect(chartDataA.getKinds().length).toBe(3);
    expect(() => chartDataA.selectNode({ kind: '', name: 'Product xxxx' })).toThrow('Node must have kind and name');
    expect(chartDataA.getKinds().length).toBe(3);
  });

  test('sankey - searchByName(): search Product 5 and get one', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    const result = chartDataA.searchByName({ kind: 'product', name: 'Product 5' })
    expect(result).toStrictEqual([{
      kind: 'product', name: 'Product 5', "tags": [
        "F",
        "5"
      ],
      cardinality: {
        "sameKindCount": 0,
        "sourceCount": 4,
        "targetCount": 1
      },
      color: '#ff00ff'
    }]);
  });

  test('sankey - searchByName(): search Product 4 and get multiple', () => {
    const chartDataA = new SankeyChartData(mockData, mockOptions);
    const result = chartDataA.searchByName({ kind: 'product', name: 'Product 4' });
    console.log(result);
    expect(result).toStrictEqual(
      [{
        kind: "product", name: "Product 4", cardinality: {
          "sourceCount": 1,
          "targetCount": 1,
          sameKindCount: 0
        },
        color: "gray"
      },
      {
        kind: "product", name: "Product 44", tags: ["F", "4"], cardinality: {
          "sameKindCount": 0,
          "sourceCount": 1,
          "targetCount": 0
        },
        color: '#ff00ff'
      }]);
  });

  test('sankey - selectNode(): criteria is invalid', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    expect(chartDataA.getKinds().length).toBe(3);
    expect(chartDataA.getNodes().length).toBe(19);
    expect(() => chartDataA.selectNode({ kind: '', name: 'Product xxxx' })).toThrow('Node must have kind and name');
    expect(chartDataA.getNodes().length).toBe(19);
  });


  test('sankey - selectNode(): criteria is invalid', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    expect(chartDataA.getKinds().length).toBe(3);
    expect(chartDataA.getNodes().length).toBe(19);
    expect(() => chartDataA.selectNode({ kind: 'product', name: '' })).toThrow('Node must have kind and name');
    expect(chartDataA.getNodes().length).toBe(19);
  });

  test('sankey - selectNode(): Product 4', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    const result = chartDataA.selectNode({ kind: 'product', name: 'Product 4' });
    expect(result).toStrictEqual(
      {
        kind: "product", name: "Product 4",
        "color": "gray",
        cardinality: {
          "sourceCount": 1,
          "targetCount": 1,
          sameKindCount: 0
        },
        hasRelatedSourceOfOtherKinds: false,
        hasRelatedSourceOfSameKind: false,
        hasRelationsOfSameKinds: true
      });

  });

  test('sankey - selectNode(): Consumer 2', () => {
    const chartDataA = new SankeyChartData(JSON.parse(JSON.stringify(mockData)), mockOptions);
    const result = chartDataA.selectNode({ "kind": "consumer", "name": "Consumer 2" });
    expect(result).toStrictEqual(
      {
        kind: "consumer", name: "Consumer 2",
        "color": "#00ff00",
        cardinality: {
          "sourceCount": 1,
          "targetCount": 0,
          sameKindCount: 0
        },
        hasRelatedSourceOfOtherKinds: false,
        hasRelatedSourceOfSameKind: false,
        hasRelationsOfSameKinds: true,
        "tags": [
          "X"
        ]
      });

  });

});

describe('SankeyChartData set options', () => {

  const mockData = {
    "name": "MockData",
    "nodes": [
      { "kind": "product", "name": "Product 1" },
      { "kind": "product", "name": "Product 2" },
      { "kind": "product", "name": "Product 3" },
      { "kind": "product", "name": "Product 4" },
      { "kind": "product", "name": "Product 5" },
      { "kind": "consumer", "name": "Consumer 1" },
      { "kind": "consumer", "name": "Consumer 2" },
      { "kind": "consumer", "name": "Consumer 3" },
      { "kind": "consumer", "name": "Consumer 4" },
      { "kind": "proxy", "name": "Proxy A" },
      { "kind": "proxy", "name": "Proxy B" },
      { "kind": "proxy", "name": "Proxy C" },
      { "kind": "proxy", "name": "Proxy D" }
    ],
    "relations": [
      { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 3" } },
      { "source": { "kind": "consumer", "name": "Consumer 4" }, "target": { "kind": "product", "name": "Product 3" } },
      { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy B" } },
      { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy A" } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy A" } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy B" } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy C" } },
      { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy D" } },
      { "source": { "kind": "product", "name": "Product 2" }, "target": { "kind": "proxy", "name": "Proxy D" } }
    ]
  };

  const mockRootOptions: SankeyChartDataOptions = {
    defaultColor: "blue",
    kinds: [
      { name: 'consumer', title: 'Consumers' },
      { name: 'product', title: 'Products' },
      { name: 'proxy', title: 'Proxies' }
    ],
    showRelatedKinds: true
  };

  describe('set options A - relatedSourceKinds at proxy, showRelatedKinds', () => {
    let sankeyChartData: SankeyChartData;

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);
      const mockOptions: SankeyChartDataOptions = {
        defaultColor: "gray",
        kinds: [
          { name: 'consumer', title: 'Consumers' },
          { name: 'product', title: 'Products' },
          { name: 'proxy', title: 'Proxies' }
        ],
        showRelatedKinds: true
      };
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options A - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options A - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });

      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "gray",
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];

      expect(results).toStrictEqual(nodes);
    });

    test('set options A - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

  describe('set options B - relatedSourceKinds at proxy, showRelatedKinds=false, relatedSourceKinds=Products', () => {
    let sankeyChartData: SankeyChartData;
    const mockData = {
      "name": "MockData",
      "nodes": [
        { "kind": "product", "name": "Product 1" },
        { "kind": "product", "name": "Product 2" },
        { "kind": "product", "name": "Product 3" },
        { "kind": "product", "name": "Product 4" },
        { "kind": "product", "name": "Product 5" },
        { "kind": "consumer", "name": "Consumer 1" },
        { "kind": "consumer", "name": "Consumer 2" },
        { "kind": "consumer", "name": "Consumer 3" },
        { "kind": "consumer", "name": "Consumer 4" },
        { "kind": "proxy", "name": "Proxy A" },
        { "kind": "proxy", "name": "Proxy B" },
        { "kind": "proxy", "name": "Proxy C" },
        { "kind": "proxy", "name": "Proxy D" }
      ],
      "relations": [
        { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 3" } },
        { "source": { "kind": "consumer", "name": "Consumer 4" }, "target": { "kind": "product", "name": "Product 3" } },
        { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy B" } },
        { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy A" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy A" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy B" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy C" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy D" } },
        { "source": { "kind": "product", "name": "Product 2" }, "target": { "kind": "proxy", "name": "Proxy D" } }
      ]
    };

    const mockOptions: SankeyChartDataOptions = {
      defaultColor: "gray",
      kinds: [
        { name: 'consumer', title: 'Consumers' },
        { name: 'product', title: 'Products' },
        { name: 'proxy', title: 'Proxies' }
      ],
      showRelatedKinds: false
    };

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options B - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options B - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });
      console.log(JSON.stringify(result));
      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "gray",
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];

      expect(results).toStrictEqual(nodes);
    });

    test('set options B - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      console.log(JSON.stringify(result));
      const x = JSON.stringify(result);
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

  describe('set options C - relatedSourceKinds at proxy, showRelatedKinds=false', () => {
    let sankeyChartData: SankeyChartData;


    const mockOptions: SankeyChartDataOptions = {
      defaultColor: "gray",
      kinds: [
        { name: 'consumer', title: 'Consumers' },
        { name: 'product', title: 'Products' },
        { name: 'proxy', title: 'Proxies' }
      ],
      showRelatedKinds: false
    };

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);

      sankeyChartData.setOptions(mockOptions);
    });


    test('set options C - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options C - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });
      console.log(JSON.stringify(result));
      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "gray",
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );


      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];

      expect(results).toStrictEqual(nodes);

    });

    test('set options C - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      console.log(JSON.stringify(result));
      const x = JSON.stringify(result);
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );


      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

  describe('set options D - relatedSourceKinds at proxy, showRelatedKinds', () => {
    let sankeyChartData: SankeyChartData;

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);
      const mockOptions: SankeyChartDataOptions = {
        defaultColor: "gray",
        kinds: [
          { name: 'consumer', title: 'Consumers' },
          { name: 'product', title: 'Products', includeAlternative: IncludeKind.WITH_SAME_TARGET },
          { name: 'proxy', title: 'Proxies' }
        ],
        showRelatedKinds: true
      };
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options D - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options D - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });
      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "gray",
          hasRelatedSourceOfOtherKinds: true,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 0}
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 5",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];

      expect(results).toStrictEqual(nodes);
    });

    test('set options D - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

});

describe('SankeyChartData set options - dataset B', () => {

  const mockData = {
    name: "MockData",
    "nodes": [
      { kind: "product", name: "Product 1" },
      { kind: "product", name: "Product 2", "tags": ["abc"] },
      { kind: "product", name: "Product 3", color: "pink" },
      { kind: "product", name: "Product 4" },
      { kind: "product", name: "Product 5" },
      { kind: "consumer", name: "Consumer 1" },
      { kind: "consumer", name: "Consumer 2" },
      { kind: "consumer", name: "Consumer 3" },
      { kind: "consumer", name: "Consumer 4", "tags": ["xyz"] },
      { kind: "proxy", name: "Proxy A" },
      { kind: "proxy", name: "Proxy B" },
      { kind: "proxy", name: "Proxy C" },
      { kind: "proxy", name: "Proxy D" }
    ],
    "relations": [
      { source: { kind: "consumer", name: "Consumer 1" }, "target": { kind: "product", name: "Product 3" } },
      { source: { kind: "consumer", name: "Consumer 4" }, "target": { kind: "product", name: "Product 3" } },
      { source: { kind: "product", name: "Product 3" }, "target": { kind: "proxy", name: "Proxy B" }, analytics: { traffic: 100000, errors: 20 } },
      { source: { kind: "product", name: "Product 3" }, "target": { kind: "proxy", name: "Proxy A" }, analytics: { traffic: 20000, errors: 20, environment: "nonPROD" } },
      { source: { kind: "product", name: "Product 3" }, "target": { kind: "product", name: "Product 4" } },
      { source: { kind: "product", name: "Product 4" }, "target": { kind: "proxy", name: "Proxy D" } },
      { source: { kind: "consumer", name: "Consumer 4" }, "target": { kind: "product", name: "Product 4" } },
      { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy A" } },
      { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy B" } },
      { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy C" } },
      { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy D" } },
      { source: { kind: "product", name: "Product 2" }, "target": { kind: "proxy", name: "Proxy D" } }
    ]
  };

  const mockRootOptions: SankeyChartDataOptions = {
    defaultColor: "blue",
    kinds: [
      { name: 'consumer', title: 'Consumers' },
      { name: 'product', title: 'Products' },
      { name: 'proxy', title: 'Proxies' }
    ],
    showRelatedKinds: true,
    showSameKindsOnNonSelected: true
  };

  describe('set options A - relatedSourceKinds at proxy, showRelatedKinds', () => {
    let sankeyChartData: SankeyChartData;

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);
      const mockOptions: SankeyChartDataOptions = {
        defaultColor: "gray",
        kinds: [
          { name: 'consumer', title: 'Consumers' },
          { name: 'product', title: 'Products' },
          { name: 'proxy', title: 'Proxies' }
        ],
        showRelatedKinds: true,
        showSameKindsOnNonSelected: true
      };
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options A - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options A - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });

      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "pink",
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 1 },
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }, {
          kind: "proxy",
          name: "Proxy D"
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options A - sankey - selectNode():  Product 4', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 4' });

      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 4", "color": "gray",
          cardinality: { "sourceCount": 1, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: true,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        }, {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy D",
          kind: "proxy",
        }];

      expect(results).toStrictEqual(nodes);
    });

    test('set options A - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });



  describe('Sort by grouping', () => {
    let sankeyChartData: SankeyChartData;
    const mockDataToSort = {
      name: "MockData",
      "nodes": [
        { kind: "product", name: "Product 1" },
        { kind: "product", name: "Product 2", "tags": ["abc"] },
        { kind: "product", name: "Product 3", color: "pink" },
        { kind: "product", name: "Product 4" },
        { kind: "product", name: "Product 5" },
        { kind: "consumer", name: "Consumer 1" },
        { kind: "consumer", name: "Consumer 2" },
        { kind: "consumer", name: "Consumer 3" },
        { kind: "consumer", name: "Consumer 4", "tags": ["xyz"] },
        { kind: "proxy", name: "Proxy A" },
        { kind: "proxy", name: "Proxy B" },
        { kind: "proxy", name: "Proxy C" },
        { kind: "proxy", name: "Proxy D" }
      ],
      "relations": [
        { source: { kind: "consumer", name: "Consumer 1" }, "target": { kind: "product", name: "Product 5" } },
        { source: { kind: "consumer", name: "Consumer 1" }, "target": { kind: "product", name: "Product 3" } },
        { source: { kind: "consumer", name: "Consumer 4" }, "target": { kind: "product", name: "Product 3" } },
        { source: { kind: "product", name: "Product 3" }, "target": { kind: "proxy", name: "Proxy C" }, analytics: { traffic: 100000, errors: 20 } },
        { source: { kind: "product", name: "Product 3" }, "target": { kind: "proxy", name: "Proxy D" }, analytics: { traffic: 20000, errors: 20, environment: "nonPROD" } },
        { source: { kind: "product", name: "Product 3" }, "target": { kind: "product", name: "Product 4" } },

        { source: { kind: "product", name: "Product 4" }, "target": { kind: "proxy", name: "Proxy D" } },
        { source: { kind: "consumer", name: "Consumer 4" }, "target": { kind: "product", name: "Product 4" } },

        { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy A" } },
        { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy B" } },
        { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy C" } },
        { source: { kind: "product", name: "Product 5" }, "target": { kind: "proxy", name: "Proxy D" } },
        { source: { kind: "product", name: "Product 2" }, "target": { kind: "proxy", name: "Proxy D" } }
      ]
    };

    const mockOptions: SankeyChartDataOptions = {
      defaultColor: "gray",
      kinds: [
        { name: 'consumer', title: 'Consumers' },
        { name: 'product', title: 'Products' },
        { name: 'proxy', title: 'Proxies' }
      ],
      showRelatedKinds: false,
      showSameKindsOnNonSelected: true
    };

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockDataToSort, mockRootOptions);
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options B - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 2, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 4", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Consumer 1", "kind": "consumer" },
        { "name": "Proxy A", "kind": "proxy" },
        { "name": "Proxy B", "kind": "proxy" },
        { "name": "Proxy C", "kind": "proxy" },
        { "name": "Proxy D", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);

      const nodesConsumer = mapKindAndName(sankeyChartData.getNodesByKind(mockOptions.kinds[0].name));
      expect([
        { "name": "Consumer 1", "kind": "consumer" }]).toStrictEqual(nodesConsumer);

      const nodesProduct = mapKindAndName(sankeyChartData.getNodesByKind(mockOptions.kinds[1].name));
      expect([
        { "name": "Product 4", "kind": "product" },
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" }]).toStrictEqual(nodesProduct);

      const nodesProxy = mapKindAndName(sankeyChartData.getNodesByKind(mockOptions.kinds[2].name));
      expect([
        { "name": "Proxy C", "kind": "proxy" },
        { "name": "Proxy D", "kind": "proxy" },
        { "name": "Proxy A", "kind": "proxy" },
        { "name": "Proxy B", "kind": "proxy" }]).toStrictEqual(nodesProxy);

    });
  });

  describe('set options B - relatedSourceKinds at proxy, showRelatedKinds=false, relatedSourceKinds=Products', () => {
    let sankeyChartData: SankeyChartData;
    const mockData = {
      "name": "MockData",
      "nodes": [
        { "kind": "product", "name": "Product 1" },
        { "kind": "product", "name": "Product 2" },
        { "kind": "product", "name": "Product 3" },
        { "kind": "product", "name": "Product 4" },
        { "kind": "product", "name": "Product 5" },
        { "kind": "consumer", "name": "Consumer 1" },
        { "kind": "consumer", "name": "Consumer 2" },
        { "kind": "consumer", "name": "Consumer 3" },
        { "kind": "consumer", "name": "Consumer 4" },
        { "kind": "proxy", "name": "Proxy A" },
        { "kind": "proxy", "name": "Proxy B" },
        { "kind": "proxy", "name": "Proxy C" },
        { "kind": "proxy", "name": "Proxy D" }
      ],
      "relations": [
        { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 3" } },
        { "source": { "kind": "consumer", "name": "Consumer 4" }, "target": { "kind": "product", "name": "Product 3" } },
        { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy B" } },
        { "source": { "kind": "product", "name": "Product 3" }, "target": { "kind": "proxy", "name": "Proxy A" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy A" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy B" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy C" } },
        { "source": { "kind": "product", "name": "Product 5" }, "target": { "kind": "proxy", "name": "Proxy D" } },
        { "source": { "kind": "product", "name": "Product 2" }, "target": { "kind": "proxy", "name": "Proxy D" } }
      ]
    };

    const mockOptions: SankeyChartDataOptions = {
      defaultColor: "gray",
      kinds: [
        { name: 'consumer', title: 'Consumers' },
        { name: 'product', title: 'Products' },
        { name: 'proxy', title: 'Proxies' }
      ],
      showRelatedKinds: false
    };

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options B - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options B - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });
      console.log(JSON.stringify(result));
      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "gray",
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];

      expect(results).toStrictEqual(nodes);
    });

    test('set options B - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      console.log(JSON.stringify(result));
      const x = JSON.stringify(result);
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

  describe('set options C - relatedSourceKinds at proxy, showRelatedKinds=false', () => {
    let sankeyChartData: SankeyChartData;

    const mockOptions: SankeyChartDataOptions = {
      defaultColor: "gray",
      kinds: [
        { name: 'consumer', title: 'Consumers' },
        { name: 'product', title: 'Products' },
        { name: 'proxy', title: 'Proxies' }
      ],
      showRelatedKinds: false
    };

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);

      sankeyChartData.setOptions(mockOptions);
    });


    test('set options C - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options C - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });
      console.log(JSON.stringify(result));
      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "pink",
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 1 },
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );


      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }, {
          kind: "proxy",
          name: "Proxy D"
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options C - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      console.log(JSON.stringify(result));
      const x = JSON.stringify(result);
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

  describe('set options D - relatedSourceKinds at proxy, showRelatedKinds', () => {
    let sankeyChartData: SankeyChartData;

    beforeEach(() => {
      sankeyChartData = new SankeyChartData(mockData, mockRootOptions);
      const mockOptions: SankeyChartDataOptions = {
        defaultColor: "gray",
        kinds: [
          { name: 'consumer', title: 'Consumers' },
          { name: 'product', title: 'Products', includeAlternative: IncludeKind.WITH_SAME_TARGET },
          { name: 'proxy', title: 'Proxies' }
        ],
        showRelatedKinds: true
      };
      sankeyChartData.setOptions(mockOptions);
    });

    test('set options D - relatedSourceKinds - Consumer 1', () => {

      const result = sankeyChartData.selectNode({ kind: 'consumer', name: 'Consumer 1' });
      expect(result).toStrictEqual(
        {
          "kind": "consumer", "name": "Consumer 1", "color": "gray",
          "cardinality": { "sourceCount": 1, "targetCount": 0, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );
      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        },
        {
          name: "Consumer 1",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }];
      expect(results).toStrictEqual(nodes);
    });

    test('set options D - sankey - selectNode():  Product 3', () => {

      const result = sankeyChartData.selectNode({ kind: 'product', name: 'Product 3' });
      expect(result).toStrictEqual(
        {
          kind: "product", "name": "Product 3", "color": "pink",
          hasRelatedSourceOfOtherKinds: true,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true,
          cardinality: { "sourceCount": 2, "targetCount": 2, "sameKindCount": 1 }
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        {
          name: "Product 3",
          kind: "product",
        }, {
          name: "Product 4",
          kind: "product",
        }, {
          name: "Product 5",
          kind: "product",
        }, {
          name: "Consumer 1",
          kind: "consumer",
        },
        {
          name: "Consumer 4",
          kind: "consumer",
        }, {
          name: "Proxy A",
          kind: "proxy",
        }, {
          name: "Proxy B",
          kind: "proxy",
        }, {
          kind: "proxy",
          name: "Proxy D"
        }];

      expect(results).toStrictEqual(nodes);
    });

    test('set options D - sankey - selectNode(): Proxy A', () => {

      const result = sankeyChartData.selectNode({ kind: "proxy", name: "Proxy A" });
      expect(result).toStrictEqual(
        {
          kind: "proxy", name: "Proxy A", "color": "gray",
          cardinality: { "sourceCount": 0, "targetCount": 2, "sameKindCount": 0},
          hasRelatedSourceOfOtherKinds: false,
          hasRelatedSourceOfSameKind: false,
          hasRelationsOfSameKinds: true
        }
      );

      const nodes = mapKindAndName(sankeyChartData.getNodes());
      console.log(JSON.stringify(mapKindAndName(nodes)));
      const results = [
        { "name": "Product 3", "kind": "product" },
        { "name": "Product 5", "kind": "product" },
        { "name": "Proxy A", "kind": "proxy" }];
      expect(results).toStrictEqual(nodes);
    });
  });

});

describe('init SankeyChartData and append data', () => {
  const mockData22 = {
    "name": "appendData",
    "nodes": [
      { "kind": "product", "name": "Product 1" },
      { "kind": "product", "name": "Product 2", "targetCount": 100, "sourceCount": 199 },
      { "kind": "consumer", "name": "Consumer 1" },
      { "kind": "consumer", "name": "Consumer 2" },
      { "kind": "proxy", "name": "Proxy A" },
      { "kind": "proxy", "name": "Proxy B" }
    ],
    "relations": [
      { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 1" } },
      { "source": { "kind": "consumer", "name": "Consumer 1" }, "target": { "kind": "product", "name": "Product 2" } },
      { "source": { "kind": "product", "name": "Product 1" }, "target": { "kind": "proxy", "name": "Proxy A" } }
    ]
  };

  const mockDataAppend22 = {
    "nodes": [
      { "kind": "product", "name": "Product 2" },
      { "kind": "product", "name": "Product 3" },
      { "kind": "consumer", "name": "Consumer 3" },
      { "kind": "proxy", "name": "Proxy C" },
      { "kind": "proxy", "name": "Proxy D" }
    ],
    "relations": [
      { "source": { "kind": "consumer", "name": "Consumer 3" }, "target": { "kind": "product", "name": "Product 2" } },
      { "source": { "kind": "product", "name": "Product 2" }, "target": { "kind": "proxy", "name": "Proxy C" } },
      { "source": { "kind": "product", "name": "Product 2" }, "target": { "kind": "proxy", "name": "Proxy D" } }
    ]
  };
  const mockOptions22 = {
    relationDefaultWidth: 15,
    kinds: [{ name: 'consumer' }, { name: 'product' }, { name: 'proxy' }],
  };

  let sankeyChartData: SankeyChartData;

  beforeEach(() => {
    sankeyChartData = new SankeyChartData(mockData22, mockOptions22);
  });

  test('sankey - appendData() ', () => {
    const selectedNode = sankeyChartData.selectNode({ "kind": "product", "name": "Product 2" });

    expect(selectedNode).toStrictEqual(
      {
        kind: "product", name: "Product 2", color: "orange",
        cardinality: { sameKindCount: 0,
          sourceCount: 199, targetCount: 100},
        hasRelatedSourceOfOtherKinds: false,
        hasRelatedSourceOfSameKind: false,
        hasRelationsOfSameKinds: true,
        sourceCount: 199, targetCount: 100
      }
    );

    const nodes = sankeyChartData.getNodes();
    expect(nodes).toHaveLength(2); // could add place holder

    sankeyChartData.appendData(mockDataAppend22, selectedNode);
    const nodesAfter = sankeyChartData.getNodes();
    expect(nodesAfter).toHaveLength(4);

    const resultAfter = sankeyChartData.selectedNode;

    expect(resultAfter).toStrictEqual(
      {
        "kind": "product", "name": "Product 2", "color": "orange",
        hasRelatedSourceOfOtherKinds: false,
        hasRelatedSourceOfSameKind: false,
        hasRelationsOfSameKinds: true,
        cardinality: { "sourceCount": 2, "targetCount": 1, "sameKindCount": 0}
      }
    );
  });
});

const mapKindAndName = function (nodes: Node[]): Node[] {
  return nodes.map(node => { return { name: node.name, kind: node.kind } })
}