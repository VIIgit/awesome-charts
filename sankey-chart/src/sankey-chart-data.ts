interface Cardinality {
  sourceCount?: number;
  targetCount?: number;
  fetchMore?: boolean;
  refs: number;
}

interface Node {
  kind: string;
  name: string;
  title?: string;
  subtitle?: string;
  color?: string;
  targetCount?: number;
  sourceCount?: number;
  tags?: string[];
  placeHolder?: boolean;
  cardinality?: Cardinality;
  selectedCardinality?: Cardinality;
  hasRelatedSourceOfOtherKinds?: boolean;
  hasRelatedSourceOfSameKind?: boolean; // used for indentation
  hasRelationsOfSameKinds?: boolean;
}

interface Data {
  subtitle?: string;
  title?: string;
  description?: string;
  targetCount?: number;
  sourceCount?: number;
  nodes?: Data[];
  color?: string;
  relations?: Relation[];
}

interface BasicNode {
  kind: string;
  name: string;
}

interface Analytics {
  traffic: number;
  environment?: string;
  errors?: number;
}

interface Relation {
  source: Node;
  target: Node;
  analytics?: Analytics;
  environment?: string;
}
enum IncludeKind {
  WITH_SAME_TARGET = "WITH_SAME_TARGET"
}
interface SankeyChartDataOptions {
  noTag?: string;
  noTagSuffixCharacter?: string;
  relationDefaultWidth?: number;
  defaultColor?: string;
  tagColorMap?: { [key: string]: string };
  kinds: KindMeta[];
  showRelatedKinds?: boolean;
  selectAndFilter?: boolean;
}

interface Kind {
  name: string;
  title?: string;
  color?: string;
}
interface KindMeta extends Kind {
  includeAlternative?: IncludeKind;
}

class SankeyChartData {
  selectedNode?: Node;
  nodes: Node[];
  dependencies: { relations: Relation[]; hasRelatedSourceOfOtherKinds: boolean; };
  originalData: { name: string; color?: string; nodes: Node[]; relations: Relation[] };
  nodesByKinds: { [key: string]: Node[] };
  title?: KindMeta;
  options: SankeyChartDataOptions;

  constructor(data: { name: string; color?: string; nodes?: Node[]; relations?: Relation[] }, options: SankeyChartDataOptions) {
    this.selectedNode = undefined;
    this.nodes = [];
    this.dependencies = { relations: [], hasRelatedSourceOfOtherKinds: false };

    this.originalData = { name: data.name, color: data.color, nodes: data.nodes || [], relations: data.relations || [] };
    this.nodesByKinds = {};
    this.title = undefined;
    this.options = {
      noTag: 'Others',
      noTagSuffixCharacter: '…',
      relationDefaultWidth: 15,
      defaultColor: "orange",
      tagColorMap: {},
      kinds: [],
      showRelatedKinds: false,
      selectAndFilter: true
    };
    this.setOptions(options);
  }

  initialize() {
    this.initializeSortRelations();
    this.initializeRelationsInfo();
    this.sortNodes(this.nodes);
  }

  resetColors() {
    if (this.options.tagColorMap) {
      const tags = Object.keys(this.options.tagColorMap);
      this.nodes.forEach(node => {
        const hasSome = tags.some(tag => node.tags?.includes(tag));
        if (hasSome) {
          delete node['color'];
        }
      });
    }
    else {
      this.nodes.forEach(node => delete node['color']);
    }
  }
  setOptions(options: SankeyChartDataOptions) {
    this.resetColors();
    this.options = { ...this.options, ...options };
    const previousNode = this.selectedNode;
    this.initialize();
    this.selectedNode = undefined;
    this.selectNode(previousNode);
  }

  appendData(data: { nodes: Node[]; relations: Relation[] }, selectedNode?: Node) {
    this.selectedNode = undefined;
    this.mergeData(this.originalData, data);
    this.initialize();
    this.selectNode(selectedNode);
  }

  getNodes(): Node[] {
    return this.nodes || [];
  }

  getNodesByKind(kind: string): Node[] {
    return this.nodesByKinds[kind] ?? [];
  }

  getRelations(): Relation[] {
    return this.dependencies.relations || [];
  }

  getKinds(): Kind[] {
    const filteredKinds = Object.keys(this.nodesByKinds);
    if (this.options?.kinds?.length > 0) {
      return this.options.kinds.filter(kind => filteredKinds.includes(kind.name));
    }
    return filteredKinds.map(kind => ({ name: kind }));
  }

  getTitle(): KindMeta | undefined {
    return this.title;
  }

  setTitle(title?: KindMeta) {
    this.title = title ? { title: title.title, name: title.name, color: title.color } : undefined;
  }

  getSelectedNode(): Node | undefined {
    return this.selectedNode;
  }

  selectNode(node?: Node): Node | undefined {
    const groupByKind = (nodes: Node[]) => {
      const dataByKinds: { [key: string]: Node[] } = {};
      nodes.forEach(node => {
        if (!dataByKinds[node.kind]) {
          dataByKinds[node.kind] = [];
        }
        dataByKinds[node.kind].push(node);
      });
      for (const kind in dataByKinds) {
        if (this.options.selectAndFilter && node && kind === node.kind) {
          dataByKinds[kind].sort((a, b) => a.name === node.name ? -1 : (b.name === node.name ? 1 : a.name.localeCompare(b.name)));
        } else {
          dataByKinds[kind].sort((a, b) => a.name.localeCompare(b.name));
        }
      }
      return dataByKinds;
    };

    if (!node) {
      this.nodes = this.originalData.nodes;
      this.dependencies.relations = this.originalData.relations || [];
      this.nodesByKinds = groupByKind(this.nodes);
      this.selectedNode = undefined;
    } else if (!node.kind || !node.name) {
      throw new Error('Node must have kind and name');
    } else if (this.selectedNode && node.name === this.selectedNode.name && node.kind === this.selectedNode.kind) {
      return this.selectedNode;
    } else {
      this.selectedNode = this.originalData.nodes.find(item => item.name === node.name && item.kind === node.kind);

      if (this.selectedNode) {
        const selectedKind = this.options.kinds.find(kind => kind.name === this.selectedNode?.kind);
        if (selectedKind?.includeAlternative) {
          this.selectedNode['hasRelatedSourceOfOtherKinds'] = true;
        } else {
          delete this.selectedNode['hasRelatedSourceOfOtherKinds'];
        }
        this.selectedNode['hasRelatedSourceOfOtherKinds'] = selectedKind?.includeAlternative ? true : false;
        if (this.options.selectAndFilter) {
          if (this.options.showRelatedKinds) {
            this.dependencies = this.filterDependencies(this.selectedNode, selectedKind);
          } else {
            this.dependencies = this.filterDependencies(this.selectedNode);
          }
          this.nodes = this.filterNodes(this.dependencies.relations);
          this.nodes.forEach(node => {
            node.hasRelatedSourceOfSameKind = this.dependencies.relations.find(relation => relation.target.kind === node.kind && relation.target.name === node.name && relation.source.kind === node.kind) ? true : false;
          });
        }
      } else {
        this.nodes = [];
      }
      this.nodesByKinds = groupByKind(this.nodes);
    }

    return this.selectedNode;
  }

  sortNodes(nodes: Node[]) {
    const undefinedTag = (this.options.noTag || '') + this.options.noTagSuffixCharacter;
    nodes.sort((a, b) => {
      if (a.name === undefinedTag && b.name !== undefinedTag) {
        return 1;
      } else if (a.name !== undefinedTag && b.name === undefinedTag) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  initializeSortRelations() {
    this.originalData.relations?.sort((a, b) => {
      if (a.source.kind !== b.source.kind) {
        return a.source.kind.localeCompare(b.source.kind);
      } else {
        return a.source.name.localeCompare(b.source.name);
      }
    }).sort((a, b) => {
      if (a.source.kind === b.source.kind && a.source.name === b.source.name) {
        if (a.target.kind !== b.target.kind) {
          return a.target.kind.localeCompare(b.target.kind);
        } else {
          return a.target.name.localeCompare(b.target.name);
        }
      }
      return 0;
    });
  }

  initializeRelationsInfo() {
    const summary: { [key: string]: { sourceCount: number; targetCount: number; refs: number } } = {};
    this.originalData.relations?.forEach((link) => {
      const key = link.source.kind + '::' + link.source.name;
      if (!summary[key]) {
        summary[key] = { sourceCount: 0, targetCount: 0, refs: 0 };
      }
      if (link.source.kind === link.target.kind) {
        summary[key].refs++;
      } else {
        summary[key].sourceCount++;
      }
      const targetKey = link.target.kind + '::' + link.target.name;
      if (!summary[targetKey]) {
        summary[targetKey] = { sourceCount: 0, targetCount: 0, refs: 0 };
      }
      summary[targetKey].targetCount++;
    });
    const fetchMoreNodes: Node[] = [];
    this.originalData.nodes.forEach((node) => {
      const cardinality = summary[node.kind + '::' + node.name];
      node.color = this.getNodeTagColor(node);
      if (node.targetCount || node.sourceCount) {
        node.cardinality = { sourceCount: node.sourceCount, targetCount: node.targetCount, fetchMore: true, refs: 0 };
        if (node.sourceCount) {
          delete node.sourceCount;
          const nextNode = this.appendNextNode(node, -1);
          if (nextNode) {
            fetchMoreNodes.push(nextNode);
          }
        }
        if (node.targetCount) {
          delete node.targetCount;
          const nextNode = this.appendNextNode(node, 1);
          if (nextNode) {
            fetchMoreNodes.push(nextNode);
          }
        }
      } else {
        node.cardinality = cardinality;
      }
    });
    fetchMoreNodes.forEach(node => {
      this.originalData.nodes.push(node);
    });
  }

  getIndexByKind(kind: string, offset: number): number {
    const index = this.options?.kinds?.findIndex(obj => obj.name === kind);
    if (index > -1) {
      let newIndex = index + offset;
      if (newIndex < 0 || newIndex >= this.options.kinds.length) {
        return -1;
      } else {
        return newIndex;
      }
    } else {
      return -1;
    }
  }

  getNodeTagColor = (node: Node): string | undefined => {
    const color = node.tags ? node.tags.map(tag => this.options.tagColorMap?.[tag]).find(color => color !== undefined) : this.options.defaultColor;
    return node.color || color;
  };

  appendNextNode(node: Node, offset: number): Node | undefined {
    const index = this.getIndexByKind(node.kind, offset);
    if (index > -1) {
      const nextNodeKind = this.options.kinds[index];
      const nextNode: Node = { kind: nextNodeKind.name, name: '…', placeHolder: true };
      const nextNodeRelation: Relation = offset === -1 ? { source: nextNode, target: node } : { source: node, target: nextNode };
      this.originalData.relations.push(nextNodeRelation);
      return nextNode;
    }
    return undefined;
  }

  searchByName(node: { kind: string; name: string }): Node[] {
    if (!node.kind || !node.name) {
      throw new Error('Filter criteria is empty');
    }
    return this.originalData.nodes.filter(item => item.kind === node.kind && item.name.includes(node.name));
  }

  findByName(name: string, dataArray: Node[]): Node | undefined {
    return dataArray.find(item => item.name === name);
  }

  filterDependencies(selectedNode: Node, selectedKind?: KindMeta): { relations: Relation[]; hasRelatedSourceOfOtherKinds: boolean } {
    let relatedRelations: Relation[] = [];
    const kindNames = this.getKinds().map(kind => kind.name);

    let targetRelations = this.originalData.relations.filter(relation => {
      return relation.source.kind === selectedNode.kind && relation.source.name === selectedNode.name && (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true);
    });

    if (targetRelations.length == 0) {
      const selectedSources = this.originalData.relations.filter(relation => {
        return relation.target.kind === selectedNode.kind && relation.target.name === selectedNode.name && (kindNames.length > 0 ? kindNames.includes(relation.source.kind) : true);
      });
      const selectedSourceNames = selectedSources.map(relation => relation.source.name);
      targetRelations = this.originalData.relations.filter(relation => {
        return relation.source.kind === selectedNode.kind && selectedSourceNames.includes(relation.source.name);
      });
      targetRelations.push(...selectedSources);
    }

    const targetKeys = targetRelations ? [...new Set(targetRelations.flatMap(relation => `${relation.target.kind}::${relation.target.name}`))] : [];
    const targetTargetRelations = this.originalData.relations.filter(relation => {
      return (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true) && targetKeys.includes(relation.source.kind + '::' + relation.source.name);
    });

    if (selectedKind?.includeAlternative) {
      const relatedKindKeys = [...new Set(targetRelations.flatMap(relation => `${relation.target.kind}::${relation.target.name}`))];

      relatedRelations = this.originalData.relations.filter(relation => {
        return relatedKindKeys.includes(`${relation.target.kind}::${relation.target.name}`) && selectedKind.name === relation.source.kind;
      });
    }

    const sourceRelations = this.originalData.relations.filter(relation => {
      return (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true) && relation.target.kind === selectedNode.kind && relation.target.name === selectedNode.name;
    });

    const sourceKeys = sourceRelations ? [...new Set(sourceRelations.flatMap(relation => `${relation.target.kind}::${relation.target.name}`))] : [];
    const sourceSourceRelations = this.originalData.relations.filter(relation => {
      return (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true) && sourceKeys.includes(`${relation.target.kind}::${relation.target.name}`);
    });

    const distinctRelations = [...new Set([...targetRelations, ...targetTargetRelations, ...sourceSourceRelations, ...relatedRelations, ...sourceRelations].map(rel => JSON.stringify(rel)))].map(relString => JSON.parse(relString));

    selectedNode.hasRelationsOfSameKinds = distinctRelations.find(relation => relation.source.kind === selectedNode.kind || relation.target.kind === selectedNode.kind) ? true : false;
    return {
      relations: distinctRelations,
      hasRelatedSourceOfOtherKinds: relatedRelations.length > 0
    };

  }
  filterNodes(relations: Relation[]): Node[] {
    const relationKeys = relations.flatMap(relation => `${relation.target.kind}::${relation.target.name}`);
    const relationSourceKeys = relations.flatMap(relation => `${relation.source.kind}::${relation.source.name}`);
    if (this.selectedNode) {
      relationSourceKeys.push(`${this.selectedNode.kind}::${this.selectedNode.name}`)
    }
    const distinctKeys = [...new Set(relationKeys.concat(relationSourceKeys))];

    return this.originalData.nodes.filter(node => distinctKeys.includes(`${node.kind}::${node.name}`));
  }

  mergeData(originData: { nodes: Node[]; relations: Relation[] }, appendData: { nodes: Node[]; relations: Relation[] }): { nodes: Node[]; relations: Relation[] } {
    appendData.nodes.forEach(node => {
      const index = originData.nodes.findIndex(existingNode => existingNode.kind === node.kind && existingNode.name === node.name);
      if (index !== -1) {
        const existingNode = originData.nodes[index];
        const foundRelationsToRemove = originData.relations.filter(relation => {
          return existingNode.kind === relation.source.kind && existingNode.name === relation.source.name ||
            existingNode.kind === relation.target.kind && existingNode.name === relation.target.name;
        });
        foundRelationsToRemove.forEach(relation => {
          const relationIndex = originData.relations.indexOf(relation);
          if (relationIndex !== -1) {
            originData.relations.splice(relationIndex, 1);
          }
        });

        originData.nodes[index] = node;
      } else {
        originData.nodes.push(node);
      }
    });

    appendData.relations.forEach(relation => {
      const existingRelationIndex = originData.relations.findIndex(existingRelation =>
        existingRelation.source.kind === relation.source.kind &&
        existingRelation.source.name === relation.source.name &&
        existingRelation.target.kind === relation.target.kind &&
        existingRelation.target.name === relation.target.name
      );
      if (existingRelationIndex === -1) {
        originData.relations.push(relation);
      }
    });

    return originData;
  }
}
export { SankeyChartData, Node, Relation, SankeyChartDataOptions, Kind, Analytics, BasicNode, IncludeKind, Cardinality };
