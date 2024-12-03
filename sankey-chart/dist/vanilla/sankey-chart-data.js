var IncludeKind;
(function (IncludeKind) {
    IncludeKind["WITH_SAME_TARGET"] = "WITH_SAME_TARGET";
})(IncludeKind || (IncludeKind = {}));
class SankeyChartData {
    constructor(data, options) {
        this.getNodeTagColor = (node) => {
            const color = node.tags ? node.tags.map(tag => { var _a; return (_a = this.options.tagColorMap) === null || _a === void 0 ? void 0 : _a[tag]; }).find(color => color !== undefined) : this.options.defaultColor;
            return node.color || color;
        };
        this.selectedNode = undefined;
        this.nodes = [];
        this.dependencies = { relations: [], hasRelatedSourceOfOtherKinds: false };
        this.height = 0;
        this.originalData = { name: data.name, color: data.color, nodes: data.nodes || [], relations: data.relations || [] };
        this.nodesByKinds = {};
        this.title = undefined;
        this.options = {
            noTag: 'Others',
            noTagSuffixCharacter: '…',
            relationDefaultWidth: 15,
            trafficLog10Factor: 12,
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
                const hasSome = tags.some(tag => { var _a; return (_a = node.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); });
                if (hasSome) {
                    delete node['color'];
                }
            });
        }
        else {
            this.nodes.forEach(node => delete node['color']);
        }
    }
    setOptions(options) {
        this.resetColors();
        this.options = Object.assign(Object.assign({}, this.options), options);
        const previousNode = this.selectedNode;
        this.initialize();
        this.selectedNode = undefined;
        this.selectNode(previousNode);
    }
    appendData(data, selectedNode) {
        this.selectedNode = undefined;
        this.mergeData(this.originalData, data);
        this.initialize();
        this.selectNode(selectedNode);
    }
    getNodes() {
        return this.nodes || [];
    }
    getNodesByKind(kind) {
        var _a;
        return (_a = this.nodesByKinds[kind]) !== null && _a !== void 0 ? _a : [];
    }
    getRelations() {
        return this.dependencies.relations || [];
    }
    getKinds() {
        var _a, _b;
        const filteredKinds = Object.keys(this.nodesByKinds);
        if (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.kinds) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            return this.options.kinds.filter(kind => filteredKinds.includes(kind.name));
        }
        return filteredKinds.map(kind => ({ name: kind }));
    }
    getTitle() {
        return this.title;
    }
    setTitle(title) {
        this.title = title ? { title: title.title, name: title.name, color: title.color } : undefined;
    }
    getSelectedNode() {
        return this.selectedNode;
    }
    selectNode(node) {
        const groupByKind = (nodes) => {
            const dataByKinds = {};
            nodes.forEach(node => {
                if (!dataByKinds[node.kind]) {
                    dataByKinds[node.kind] = [];
                }
                dataByKinds[node.kind].push(node);
            });
            for (const kind in dataByKinds) {
                if (this.options.selectAndFilter && node && kind === node.kind) {
                    dataByKinds[kind].sort((a, b) => a.name === node.name ? -1 : (b.name === node.name ? 1 : a.name.localeCompare(b.name)));
                }
                else {
                    dataByKinds[kind].sort((a, b) => a.name.localeCompare(b.name));
                }
            }
            return dataByKinds;
        };
        if (!node) {
            this.nodes = this.originalData.nodes;
            this.dependencies.relations = this.originalData.relations || [];
            this.nodesByKinds = groupByKind(this.nodes);
            this.updateRelationWeights(this.nodes, this.dependencies.relations);
            this.selectedNode = undefined;
        }
        else if (!node.kind || !node.name) {
            throw new Error('Node must have kind and name');
        }
        else if (this.selectedNode && node.name === this.selectedNode.name && node.kind === this.selectedNode.kind) {
            return this.selectedNode;
        }
        else {
            this.selectedNode = this.originalData.nodes.find(item => item.name === node.name && item.kind === node.kind);
            if (this.selectedNode) {
                const selectedKind = this.options.kinds.find(kind => { var _a; return kind.name === ((_a = this.selectedNode) === null || _a === void 0 ? void 0 : _a.kind); });
                if (selectedKind === null || selectedKind === void 0 ? void 0 : selectedKind.includeAlternative) {
                    this.selectedNode['hasRelatedSourceOfOtherKinds'] = true;
                }
                else {
                    delete this.selectedNode['hasRelatedSourceOfOtherKinds'];
                }
                this.selectedNode['hasRelatedSourceOfOtherKinds'] = (selectedKind === null || selectedKind === void 0 ? void 0 : selectedKind.includeAlternative) ? true : false;
                if (this.options.selectAndFilter) {
                    if (this.options.showRelatedKinds) {
                        this.dependencies = this.filterDependencies(this.selectedNode, selectedKind);
                    }
                    else {
                        this.dependencies = this.filterDependencies(this.selectedNode);
                    }
                    this.nodes = this.filterNodes(this.dependencies.relations);
                    this.nodes.forEach(node => {
                        node.hasRelatedSourceOfSameKind = this.dependencies.relations.find(relation => relation.target.kind === node.kind && relation.target.name === node.name && relation.source.kind === node.kind) ? true : false;
                    });
                    this.updateRelationWeights(this.nodes, this.dependencies.relations, this.selectedNode);
                }
            }
            else {
                this.nodes = [];
            }
            this.nodesByKinds = groupByKind(this.nodes);
        }
        return this.selectedNode;
    }
    sortNodes(nodes) {
        const undefinedTag = (this.options.noTag || '') + this.options.noTagSuffixCharacter;
        nodes.sort((a, b) => {
            if (a.name === undefinedTag && b.name !== undefinedTag) {
                return 1;
            }
            else if (a.name !== undefinedTag && b.name === undefinedTag) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    initializeSortRelations() {
        var _a;
        (_a = this.originalData.relations) === null || _a === void 0 ? void 0 : _a.sort((a, b) => {
            if (a.source.kind !== b.source.kind) {
                return a.source.kind.localeCompare(b.source.kind);
            }
            else {
                return a.source.name.localeCompare(b.source.name);
            }
        }).sort((a, b) => {
            if (a.source.kind === b.source.kind && a.source.name === b.source.name) {
                if (a.target.kind !== b.target.kind) {
                    return a.target.kind.localeCompare(b.target.kind);
                }
                else {
                    return a.target.name.localeCompare(b.target.name);
                }
            }
            return 0;
        });
    }
    initializeRelationsInfo() {
        var _a;
        const summary = {};
        (_a = this.originalData.relations) === null || _a === void 0 ? void 0 : _a.forEach((link) => {
            const key = link.source.kind + '::' + link.source.name;
            if (!summary[key]) {
                summary[key] = { sourceCount: 0, targetCount: 0, refs: 0 };
            }
            if (link.source.kind === link.target.kind) {
                summary[key].refs++;
            }
            else {
                summary[key].sourceCount++;
            }
            const targetKey = link.target.kind + '::' + link.target.name;
            if (!summary[targetKey]) {
                summary[targetKey] = { sourceCount: 0, targetCount: 0, refs: 0 };
            }
            summary[targetKey].targetCount++;
        });
        const fetchMoreNodes = [];
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
            }
            else {
                node.cardinality = cardinality;
            }
        });
        fetchMoreNodes.forEach(node => {
            this.originalData.nodes.push(node);
        });
    }
    getIndexByKind(kind, offset) {
        var _a, _b;
        const index = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.kinds) === null || _b === void 0 ? void 0 : _b.findIndex(obj => obj.name === kind);
        if (index > -1) {
            let newIndex = index + offset;
            if (newIndex < 0 || newIndex >= this.options.kinds.length) {
                return -1;
            }
            else {
                return newIndex;
            }
        }
        else {
            return -1;
        }
    }
    appendNextNode(node, offset) {
        const index = this.getIndexByKind(node.kind, offset);
        if (index > -1) {
            const nextNodeKind = this.options.kinds[index];
            const nextNode = { kind: nextNodeKind.name, name: '…', placeHolder: true };
            const nextNodeRelation = offset === -1 ? { source: nextNode, target: node } : { source: node, target: nextNode };
            this.originalData.relations.push(nextNodeRelation);
            return nextNode;
        }
        return undefined;
    }
    searchByName(node) {
        if (!node.kind || !node.name) {
            throw new Error('Filter criteria is empty');
        }
        return this.originalData.nodes.filter(item => item.kind === node.kind && item.name.includes(node.name));
    }
    findByName(name, dataArray) {
        return dataArray.find(item => item.name === name);
    }
    filterDependencies(selectedNode, selectedKind) {
        let relatedRelations = [];
        const kindNames = this.getKinds().map(kind => kind.name);
        const targetRelations = this.originalData.relations.filter(relation => {
            return relation.source.kind === selectedNode.kind && relation.source.name === selectedNode.name && (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true);
        });
        const targetKeys = targetRelations ? [...new Set(targetRelations.flatMap(relation => `${relation.target.kind}::${relation.target.name}`))] : [];
        const targetTargetRelations = this.originalData.relations.filter(relation => {
            return (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true) && targetKeys.includes(relation.source.kind + '::' + relation.source.name);
        });
        if (selectedKind === null || selectedKind === void 0 ? void 0 : selectedKind.includeAlternative) {
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
    filterNodes(relations) {
        const relationKeys = relations.flatMap(relation => `${relation.target.kind}::${relation.target.name}`);
        const relationSourceKeys = relations.flatMap(relation => `${relation.source.kind}::${relation.source.name}`);
        if (this.selectedNode) {
            relationSourceKeys.push(`${this.selectedNode.kind}::${this.selectedNode.name}`);
        }
        const distinctKeys = [...new Set(relationKeys.concat(relationSourceKeys))];
        return this.originalData.nodes.filter(node => distinctKeys.includes(`${node.kind}::${node.name}`));
    }
    updateRelationWeights(nodes, relations, selectedNode) {
        if (!relations) {
            return;
        }
        const relationWeights = relations.reduce((acc, relation) => {
            var _a, _b, _c;
            const { source, target, analytics } = relation;
            if (source.kind === target.kind) {
                relation.height = 0;
                return acc;
            }
            const sourceKey = `s${source.kind}:${source.name}`;
            const targetKey = `t${target.kind}:${target.name}`;
            let selectedAnalytics;
            if ((analytics === null || analytics === void 0 ? void 0 : analytics.drillDown) && selectedNode) {
                selectedAnalytics = analytics.drillDown.find(item => item.kind === selectedNode.kind && item.name === selectedNode.name);
            }
            if (!selectedAnalytics) {
                selectedAnalytics = analytics;
            }
            const weight = selectedAnalytics && 'traffic' in selectedAnalytics && ((_a = selectedAnalytics.traffic) !== null && _a !== void 0 ? _a : 0) > 0
                ? Math.round(Math.log10(Math.max(selectedAnalytics.traffic, 2) || 2) * ((_b = this.options.trafficLog10Factor) !== null && _b !== void 0 ? _b : 12))
                : ((_c = this.options.relationDefaultWidth) !== null && _c !== void 0 ? _c : 10);
            relation.height = weight;
            acc[sourceKey] = (acc[sourceKey] || 0) + weight;
            acc[targetKey] = (acc[targetKey] || 0) + weight;
            return acc;
        }, {});
        nodes.forEach(node => {
            var _a, _b;
            node.height = Math.max((_a = relationWeights[`s${node.kind}:${node.name}`]) !== null && _a !== void 0 ? _a : 0, (_b = relationWeights[`t${node.kind}:${node.name}`]) !== null && _b !== void 0 ? _b : 0);
        });
    }
    mergeData(originData, appendData) {
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
            }
            else {
                originData.nodes.push(node);
            }
        });
        appendData.relations.forEach(relation => {
            const existingRelationIndex = originData.relations.findIndex(existingRelation => existingRelation.source.kind === relation.source.kind &&
                existingRelation.source.name === relation.source.name &&
                existingRelation.target.kind === relation.target.kind &&
                existingRelation.target.name === relation.target.name);
            if (existingRelationIndex === -1) {
                originData.relations.push(relation);
            }
        });
        return originData;
    }
}
