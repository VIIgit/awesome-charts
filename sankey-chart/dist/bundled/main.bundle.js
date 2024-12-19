(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VIISankeyChart"] = factory();
	else
		root["VIISankeyChart"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/event-handler.ts":
/*!******************************!*\
  !*** ./src/event-handler.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventHandler: () => (/* binding */ EventHandler)
/* harmony export */ });
class EventHandler {
    constructor() {
        this.listeners = new Map();
    }
    subscribe(event, listener) {
        var _a;
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(listener);
    }
    unsubscribe(event, listener) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event);
            const index = eventListeners.indexOf(listener);
            if (index !== -1) {
                eventListeners.splice(index, 1);
            }
        }
    }
    dispatchEvent(event, data) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event).slice();
            for (const listener of eventListeners) {
                listener(data);
            }
        }
    }
}



/***/ }),

/***/ "./src/sankey-chart-data.ts":
/*!**********************************!*\
  !*** ./src/sankey-chart-data.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncludeKind: () => (/* binding */ IncludeKind),
/* harmony export */   SankeyChartData: () => (/* binding */ SankeyChartData)
/* harmony export */ });
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
            let selectedAnalytics = analytics;
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



/***/ }),

/***/ "./src/sankey-chart.ts":
/*!*****************************!*\
  !*** ./src/sankey-chart.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SankeyChart: () => (/* binding */ SankeyChart),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event-handler */ "./src/event-handler.ts");

class SankeyChart {
    constructor(svgElement, customOptions) {
        this.SVG_NS = "http://www.w3.org/2000/svg";
        this.showContextMenu = (event) => {
            var _a, _b;
            const contextMenu = this.contextMenuElement;
            const context = { node: (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode() };
            const menuItems = ((_b = this.contextMenuDynamicLinks) === null || _b === void 0 ? void 0 : _b.call(this, context)) || [];
            if (menuItems.length > 0) {
                contextMenu.innerHTML = '';
                menuItems.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'context-item';
                    div.textContent = item.label;
                    div.setAttribute('data-url', item.url);
                    div.setAttribute('data-target', item.target || '');
                    div.addEventListener('click', this.openPage);
                    contextMenu.appendChild(div);
                });
                document.addEventListener('click', this.closeContextMenu);
                event.preventDefault();
                contextMenu.style.left = `${event.clientX}px; contextMenu!.style.top = ${event.clientY}px`;
                contextMenu.style.display = 'block';
            }
        };
        this.openPage = (event) => {
            const target = event.currentTarget;
            const url = target.getAttribute('data - url');
            const targetAttr = target.getAttribute('data - target') || '_self';
            if (url) {
                window.open(url, targetAttr);
            }
        };
        this.closeContextMenu = () => {
            const contextMenu = this.contextMenuElement;
            if (contextMenu) {
                contextMenu.style.display = 'none';
                document.removeEventListener('click', this.closeContextMenu);
            }
        };
        this.renderNodes = (nodes, positionX, selectedNode, kind) => {
            var _a, _b;
            const svgGroup = document.createElementNS(this.SVG_NS, "g");
            let overallY = this.options.topY;
            (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getKinds;
            const x = positionX + (this.options.nodeWidth / 2);
            const y = this.options.topY + this.options.marginY + (this.options.nodeWidth / 2);
            let x2 = positionX + this.options.nodeWidth + this.options.nodeMarginY / 2;
            const y2 = this.options.topY + this.options.marginY + (this.options.nodeWidth);
            if (this.options.renderKindAsColums) {
                if (kind === null || kind === void 0 ? void 0 : kind.title) {
                    let prefix = '';
                    if (kind.color) {
                        const circle = this.createCircle(x, y, 5, kind.color || this.options.defaultNodeColor);
                        svgGroup.appendChild(circle);
                    }
                    else {
                        prefix = '| ';
                        x2 = (x2 - 13);
                    }
                    const nodeKindTitle = this.createSvgText(prefix + kind.title, [this.className.NODE_TYPE_TITLE]);
                    nodeKindTitle.setAttribute("x", x2.toString());
                    nodeKindTitle.setAttribute("y", y2.toString());
                    svgGroup.appendChild(nodeKindTitle);
                    overallY += 25;
                }
                else if ((_b = this.chartData) === null || _b === void 0 ? void 0 : _b.getTitle()) {
                    const title = this.chartData.getTitle();
                    const circle = this.createCircle(x, y, 5, (title === null || title === void 0 ? void 0 : title.color) || this.options.defaultNodeColor);
                    svgGroup.appendChild(circle);
                    const nodeKindTitle = this.createSvgText(((title === null || title === void 0 ? void 0 : title.name) || ''), [this.className.NODE_TYPE_TITLE]);
                    nodeKindTitle.setAttribute("x", x2.toString());
                    nodeKindTitle.setAttribute("y", y2.toString());
                    svgGroup.appendChild(nodeKindTitle);
                    overallY += 25;
                }
            }
            nodes.forEach((node, index) => {
                var _a, _b, _c;
                const linksHeight = (_a = node.height) !== null && _a !== void 0 ? _a : 0;
                const height = node.cardinality ? 10 : -20;
                const isSelected = selectedNode && selectedNode.name === node.name && selectedNode.kind === node.kind;
                const rectHeight = height + Math.max(linksHeight + 2 * this.options.marginY, this.options.nodeMinHeight + (this.options.renderKindAsColums ? 0 : 10) + (node.subtitle ? 10 : 0));
                const y = this.options.marginY + overallY;
                const color = node.color || this.options.defaultNodeColor;
                let posX = positionX;
                let rectPositionWidth = this.options.nodeColumnWith;
                if (isSelected) {
                    this.selectedNodePositionY = y;
                }
                if (node.hasRelatedSourceOfSameKind) {
                    posX = posX + this.options.relation.sameKindIndentation;
                    rectPositionWidth = rectPositionWidth - this.options.relation.sameKindIndentation;
                }
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const rectHover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rectHover.setAttribute('x', posX.toString());
                rectHover.setAttribute('y', y.toString());
                rectHover.setAttribute('width', rectPositionWidth.toString());
                rectHover.setAttribute('height', rectHeight.toString());
                rectHover.setAttribute('rx', "5");
                rectHover.setAttribute('ry', "5");
                rectHover.setAttribute('fill', color);
                rectHover.setAttribute('filter', 'url(#dropshadow)');
                rectHover.setAttribute("opacity", "0");
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', posX.toString());
                rect.setAttribute('y', y.toString());
                rect.setAttribute('width', this.options.nodeWidth.toString());
                rect.setAttribute('height', rectHeight.toString());
                rect.setAttribute('rx', "5");
                rect.setAttribute('ry', "5");
                rect.setAttribute('fill', color);
                if (isSelected) {
                    const rectShadow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rectShadow.setAttribute('x', String(posX - 2));
                    rectShadow.setAttribute('y', String(y - 2));
                    rectShadow.setAttribute('width', String(this.options.nodeWidth + 4));
                    rectShadow.setAttribute('height', String(rectHeight + 4));
                    rectShadow.setAttribute('rx', "6");
                    rectShadow.setAttribute('ry', "6");
                    if (this.options.selectedNode.dropShadow) {
                        rectShadow.setAttribute('fill', 'black');
                        rectShadow.setAttribute('filter', 'url(#dropshadow)');
                        rectShadow.setAttribute("opacity", "0.2");
                    }
                    else if (this.options.selectedNode.borderColor) {
                        rectShadow.setAttribute('stroke-width', "2");
                        rectShadow.setAttribute('stroke', this.options.selectedNode.borderColor);
                        rectShadow.setAttribute('fill', 'none');
                        rectShadow.setAttribute("opacity", "1");
                    }
                    g.appendChild(rectShadow);
                }
                else {
                }
                ;
                g.appendChild(rect);
                rectHover.style.cursor = 'pointer';
                g.appendChild(rectHover);
                const cardinality = node.cardinality;
                if (cardinality) {
                    if ((_b = cardinality.sourceCount) !== null && _b !== void 0 ? _b : 0 > 0) {
                        const sourceText = this.createSvgText('- ' + cardinality.sourceCount + (cardinality.refs > 0 ? '+' : ''), [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
                        sourceText.setAttribute("x", String(posX + this.options.marginX - 6));
                        sourceText.setAttribute("y", String(y + rectHeight - 2));
                        sourceText.setAttribute("fill", color);
                        g.appendChild(sourceText);
                    }
                    if ((_c = cardinality.targetCount) !== null && _c !== void 0 ? _c : 0 > 0) {
                        const sourceText = this.createSvgText(cardinality.targetCount + ' -', [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
                        sourceText.setAttribute("x", String(posX + this.options.marginX - 14));
                        sourceText.setAttribute("y", String(y + rectHeight - 2));
                        sourceText.setAttribute("fill", color);
                        sourceText.setAttribute("text-anchor", "end");
                        g.appendChild(sourceText);
                    }
                }
                const text = this.createSvgText('', [this.className.NODE_TITLE, isSelected ? this.className.SELECTED : '']);
                text.setAttribute("x", String(posX + this.options.marginX));
                text.setAttribute("y", y.toString());
                const truncatedTitle = this.truncateName(node.title ? node.title : node.name, this.options.nameMaxLength);
                const lines = [truncatedTitle];
                if (node.tags) {
                    lines.push(node.tags.join(', '));
                }
                if (!this.options.renderKindAsColums) {
                    lines.push(node.kind.charAt(0).toUpperCase() + node.kind.slice(1));
                }
                let headlineIndex = 0;
                let subtitleLineIndex = -1;
                if (node.subtitle) {
                    const truncatedSubtitle = this.truncateName(node.subtitle, this.options.nameMaxLength);
                    lines.splice(1, 0, truncatedSubtitle);
                    headlineIndex = 1;
                    subtitleLineIndex = 0;
                }
                for (let i = 0; i < lines.length; i++) {
                    const tspan = document.createElementNS(this.SVG_NS, "tspan");
                    tspan.setAttribute("x", String(posX + this.options.marginX));
                    tspan.setAttribute("dy", "1.2em");
                    tspan.textContent = lines[i];
                    if (i === headlineIndex) {
                        tspan.classList.add("headline");
                    }
                    else if (i === subtitleLineIndex) {
                        tspan.classList.add("subtitle");
                    }
                    else {
                        tspan.classList.add("description");
                    }
                    text.appendChild(tspan);
                }
                g.appendChild(text);
                if (!(node === null || node === void 0 ? void 0 : node.placeHolder)) {
                    rectHover.addEventListener('click', (event) => {
                        var _a, _b;
                        (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.selectNode(node);
                        this.render();
                        if ((_b = node === null || node === void 0 ? void 0 : node.cardinality) === null || _b === void 0 ? void 0 : _b.fetchMore) {
                            this.eventHandler.dispatchEvent('fetchData', { node });
                        }
                        else {
                        }
                        this.eventHandler.dispatchEvent('selectionChanged', { node, position: { y: this.selectedNodePositionY } });
                        rectHover.setAttribute("opacity", this.options.selectedNode.hoverOpacity.toString());
                    });
                    rectHover.addEventListener('mouseover', (event) => {
                        rectHover.setAttribute("opacity", this.options.selectedNode.hoverOpacity.toString());
                    });
                    rectHover.addEventListener('mouseout', (event) => {
                        rectHover.setAttribute("opacity", "0");
                    });
                }
                svgGroup.appendChild(g);
                if (isSelected && !(node === null || node === void 0 ? void 0 : node.placeHolder) && this.contextMenuElement) {
                    svgGroup.appendChild(this.renderElipsisMenu(posX, y));
                }
                this.nodePositions[node.kind + '::' + node.name] = { x: posX, y, index, sourceY: y + this.options.marginY, targetY: y, h: rectHeight, color: node.color };
                overallY = overallY + rectHeight + this.options.nodeMarginY;
            });
            this.calculatedHeight = Math.max(this.calculatedHeight, overallY + this.options.nodeMarginY * 2);
            return svgGroup;
        };
        this.createSvgText = (textContent, classNames) => {
            const text = document.createElementNS(this.SVG_NS, "text");
            text.classList.add(...classNames.filter(className => className));
            text.textContent = textContent;
            return text;
        };
        this.renderRelations = (relations, selectedNode) => {
            const { name, kind, color } = selectedNode || {};
            const defaultColor = color || this.options.defaultNodeColor;
            const localNodePositions = JSON.parse(JSON.stringify(this.nodePositions));
            const gText = document.createElementNS(this.SVG_NS, "g");
            const gPath = document.createElementNS(this.SVG_NS, "g");
            relations === null || relations === void 0 ? void 0 : relations.forEach((link) => {
                var _a, _b, _c, _d;
                const g = document.createElementNS(this.SVG_NS, "g");
                const sourcePosition = localNodePositions[link.source.kind + '::' + link.source.name];
                const targetPosition = localNodePositions[link.target.kind + '::' + link.target.name];
                if (!targetPosition || !sourcePosition) {
                    return;
                }
                const linkColor = sourcePosition.color || defaultColor;
                const { source, target, height } = link;
                const controlPoint1X = sourcePosition.x + this.options.nodeWidth;
                const controlPoint1Y = sourcePosition.sourceY + ((height || 0) / 2);
                const controlPoint2Y = targetPosition.targetY + ((height || 0) / 2) + 5;
                const controlPoint2X = (sourcePosition.x + this.options.nodeWidth + targetPosition.x) / 2;
                let pathD;
                let opacity = this.options.relation.opacity;
                let strokeWidth = height;
                var opacityEmphasizeSelected = 0;
                if ((link.source.kind === kind && link.source.name === name) || (link.target.kind === kind && link.target.name === name)) {
                    opacity += this.options.relation.selectedOpacity;
                }
                if (source.kind === target.kind) {
                    if (sourcePosition.index < targetPosition.index) {
                        const point1X = sourcePosition.x + (this.options.nodeWidth / 2);
                        const point1Y = sourcePosition.y + sourcePosition.h;
                        const point2X = targetPosition.x + (this.options.nodeWidth / 2);
                        const point2Y = targetPosition.y + (targetPosition.h / 2);
                        pathD = `M${point1X},${point1Y} C${point1X},${point2Y} ${point1X},${point2Y} ${point2X},${point2Y}`;
                    }
                    else {
                        const point2X = sourcePosition.x + (this.options.nodeWidth / 2);
                        const point2Y = sourcePosition.y + (sourcePosition.h / 2);
                        const point1X = targetPosition.x + (this.options.nodeWidth / 2);
                        const point1Y = targetPosition.y + targetPosition.h;
                        pathD = `M${point1X},${point1Y} C${point1X},${point2Y} ${point1X},${point2Y} ${point2X},${point2Y}`;
                    }
                    opacity = 0.8;
                    strokeWidth = 2;
                }
                else {
                    pathD = `M${controlPoint1X},${controlPoint1Y} C${controlPoint2X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetPosition.x},${controlPoint2Y}`;
                }
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathD);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-width', String(strokeWidth || 0));
                path.setAttribute('stroke', linkColor);
                gPath.appendChild(path);
                let analytics;
                if (analytics) {
                }
                else {
                    analytics = link.analytics;
                    const isSelectedKind = link.target.kind === (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind) || link.source.kind === (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind);
                }
                if ((_a = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _a !== void 0 ? _a : 0 > 0) {
                    const text = this.createSvgText('', [this.className.RELATION]);
                    text.setAttribute("x", String(targetPosition.x - this.options.marginY));
                    text.setAttribute("y", String(targetPosition.targetY + (height || 0 / 2) + 8));
                    text.setAttribute("text-anchor", "end");
                    const tspanEnv = document.createElementNS(this.SVG_NS, "tspan");
                    tspanEnv.textContent = (analytics === null || analytics === void 0 ? void 0 : analytics.environment) || '';
                    text.appendChild(tspanEnv);
                    if ((analytics === null || analytics === void 0 ? void 0 : analytics.environment) && this.options.relation.environment[analytics === null || analytics === void 0 ? void 0 : analytics.environment]) {
                        path.setAttribute('stroke-dasharray', this.options.relation.environment[analytics.environment].dashArray);
                    }
                    if ((_b = analytics === null || analytics === void 0 ? void 0 : analytics.errors) !== null && _b !== void 0 ? _b : 0 > 0) {
                        const errorRatio = (100 / ((_c = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _c !== void 0 ? _c : 0) * ((_d = analytics === null || analytics === void 0 ? void 0 : analytics.errors) !== null && _d !== void 0 ? _d : 0));
                        const tspanErr = document.createElementNS(this.SVG_NS, "tspan");
                        tspanErr.setAttribute("fill", "red");
                        tspanErr.textContent = ' ' + (errorRatio == 0 ? "(<0.01%)" : '(' + errorRatio.toFixed(2).toLocaleString() + '%)');
                        text.appendChild(tspanErr);
                    }
                    const tspan = document.createElementNS(this.SVG_NS, "tspan");
                    tspan.textContent = ' ' + (analytics === null || analytics === void 0 ? void 0 : analytics.traffic.toLocaleString());
                    text.appendChild(tspan);
                    gText.appendChild(text);
                    opacity = opacity + this.options.relation.analyticsOpacity;
                }
                else if (source.kind != target.kind) {
                }
                sourcePosition.sourceY += height;
                targetPosition.targetY += height;
                path.setAttribute('opacity', String(opacity));
            });
            this.svgElement.appendChild(gPath);
            this.svgElement.appendChild(gText);
        };
        this.options = {
            nodeWidth: 10,
            nodeMinHeight: 65,
            marginX: 15,
            marginY: 5,
            leftX: 15,
            topY: 10,
            nodeMarginY: 10,
            nameMaxLength: 50,
            nodeColumnWith: 300,
            defaultNodeColor: "gray",
            renderKindAsColums: true,
            relation: {
                selectedOpacity: 0.2,
                analyticsOpacity: 0.2,
                opacity: 0.2,
                environment: {
                    nonPROD: {
                        dashArray: '10,1'
                    }
                },
                sameKindIndentation: 20
            },
            selectedNode: {
                dropShadow: false,
                scale: 1.2,
                borderColor: '#ff1010',
                hoverOpacity: 0.2,
                hoverColor: '#141414'
            },
            ellipseCharacter: '…',
            rootCharacter: '⌂'
        };
        this.setOptions(customOptions || {});
        this.calculatedHeight = 0;
        this.svgElement = svgElement;
        this.nodePositions = {};
        this.eventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__.EventHandler();
        this.contextMenuElement = undefined;
        this.contextMenuDynamicLinks = undefined;
        this.className = {
            NODE_TYPE_TITLE: "node-kind-title",
            NODE_TITLE: "node-title",
            RELATION: "relation",
            CARDINALITY: "cardinality",
            SELECTED: 'selected'
        };
        this.selectedNodePositionY = -1;
    }
    setOptions(customOptions) {
        this.options = this._deepMerge(this.options, customOptions);
    }
    setData(chartData) {
        if (this.chartData !== chartData) {
            this.chartData = chartData;
            this.render();
            this.eventHandler.dispatchEvent('selectionChanged', { node: this.chartData.getSelectedNode(), position: { y: 0 } });
        }
    }
    getData() {
        return this.chartData;
    }
    addSelectionChangedListeners(callbackFunction) {
        var _a;
        if (typeof callbackFunction === 'function') {
            this.eventHandler.subscribe('selectionChanged', callbackFunction);
            callbackFunction({ node: (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode(), position: { y: 0 } });
        }
    }
    addContextMenuListeners(contextMenuElement, callbackFunction) {
        if (typeof callbackFunction === 'function') {
            this.contextMenuElement = contextMenuElement;
            this.contextMenuDynamicLinks = callbackFunction;
        }
    }
    addFetchDataListeners(callbackFunction) {
        if (typeof callbackFunction === 'function') {
            this.eventHandler.subscribe('fetchData', callbackFunction);
        }
    }
    truncateName(name, maxLength) {
        if (name && (name === null || name === void 0 ? void 0 : name.length) > maxLength) {
            return name.substring(0, maxLength - 3) + this.options.ellipseCharacter;
        }
        return name || '';
    }
    resetSvg() {
        this.calculatedHeight = 0;
        this.svgElement.innerHTML = `
      <defs>
        <filter id="dropshadow">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
    `;
    }
    updateHeight() {
        var _a;
        const width = (this.options.nodeColumnWith + this.options.nodeWidth) * Math.max(1, ((_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getKinds().length) || 0) + (this.options.marginX * 2);
        this.svgElement.setAttribute('height', this.calculatedHeight.toString());
        this.svgElement.setAttribute('width', width.toString());
    }
    renderElipsisMenu(x, y) {
        const menu = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        menu.setAttribute('id', 'ellipsisMenu');
        menu.setAttribute('style', 'cursor: pointer;');
        menu.setAttribute('transform', `translate(${x + 2.5}, ${y})`);
        menu.addEventListener('click', this.showContextMenu);
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '-2.5');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', this.options.nodeWidth.toString());
        rect.setAttribute('height', '22');
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        rect.setAttribute('fill', 'black');
        rect.setAttribute('opacity', '0.2');
        menu.appendChild(rect);
        for (let iy = 5; iy <= 15; iy += 5) {
            const circle = this.createCircle(2.5, iy, 2, "white");
            menu.appendChild(circle);
        }
        return menu;
    }
    createCircle(cx, cy, r, fill) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx.toString());
        circle.setAttribute('cy', cy.toString());
        circle.setAttribute('r', r.toString());
        circle.setAttribute('fill', fill);
        return circle;
    }
    _deepMerge(target, source) {
        if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
            return source;
        }
        for (const key of Object.keys(source)) {
            if (Array.isArray(source[key])) {
                target[key] = source[key].slice();
            }
            else if (typeof source[key] === 'object' && source[key] !== null) {
                if (!target[key]) {
                    target[key] = {};
                }
                this._deepMerge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
        return target;
    }
    render() {
        var _a, _b, _c, _d, _e;
        const selectedNode = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode();
        this.resetSvg();
        let column = 0;
        const columnWidth = this.options.nodeColumnWith + this.options.nodeWidth;
        const kinds = (_b = this.chartData) === null || _b === void 0 ? void 0 : _b.getKinds();
        this.selectedNodePositionY = -1;
        const svgNodes = document.createElementNS(this.SVG_NS, "g");
        if (kinds && kinds.length > 0) {
            kinds.forEach(kind => {
                var _a, _b;
                svgNodes.appendChild(this.renderNodes((_b = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getNodesByKind(kind.name)) !== null && _b !== void 0 ? _b : [], this.options.leftX + columnWidth * column++, selectedNode, kind));
            });
        }
        else {
            svgNodes.appendChild(this.renderNodes((_d = (_c = this.chartData) === null || _c === void 0 ? void 0 : _c.getNodes()) !== null && _d !== void 0 ? _d : [], this.options.leftX + 0));
        }
        ;
        this.renderRelations((_e = this.chartData) === null || _e === void 0 ? void 0 : _e.getRelations(), selectedNode);
        this.svgElement.appendChild(svgNodes);
        this.updateHeight();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SankeyChart);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventHandler: () => (/* reexport safe */ _event_handler__WEBPACK_IMPORTED_MODULE_2__.EventHandler),
/* harmony export */   IncludeKind: () => (/* reexport safe */ _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__.IncludeKind),
/* harmony export */   SankeyChart: () => (/* reexport safe */ _sankey_chart__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   SankeyChartData: () => (/* reexport safe */ _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__.SankeyChartData)
/* harmony export */ });
/* harmony import */ var _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sankey-chart-data */ "./src/sankey-chart-data.ts");
/* harmony import */ var _sankey_chart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sankey-chart */ "./src/sankey-chart.ts");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event-handler */ "./src/event-handler.ts");






window.SankeyChart = _sankey_chart__WEBPACK_IMPORTED_MODULE_1__["default"];
window.SankeyChartData = _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__.SankeyChartData;
window.EventHandler = _event_handler__WEBPACK_IMPORTED_MODULE_2__.EventHandler;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUN3Qjs7Ozs7Ozs7Ozs7Ozs7OztBQzdCeEI7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxrQ0FBa0M7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELFFBQVEsc0ZBQXNGO0FBQzNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFFBQVEsZ0ZBQWdGO0FBQzNJO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDJEQUEyRDtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RSxRQUFRLCtGQUErRjtBQUM5SztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQix1REFBdUQsaUNBQWlDLElBQUk7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsZ0dBQWdHLHFCQUFxQixJQUFJLHFCQUFxQjtBQUM5STtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsdUZBQXVGLHFCQUFxQixJQUFJLHFCQUFxQjtBQUNySTtBQUNBLG1EQUFtRCxxQkFBcUIsSUFBSSxxQkFBcUI7QUFDakcsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxnR0FBZ0cscUJBQXFCLElBQUkscUJBQXFCO0FBQzlJO0FBQ0Esc0hBQXNILHFCQUFxQixJQUFJLHFCQUFxQjtBQUNwSyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxxQkFBcUIsSUFBSSxxQkFBcUI7QUFDNUcsb0VBQW9FLHFCQUFxQixJQUFJLHFCQUFxQjtBQUNsSDtBQUNBLHVDQUF1Qyx1QkFBdUIsSUFBSSx1QkFBdUI7QUFDekY7QUFDQTtBQUNBLCtFQUErRSxVQUFVLElBQUksVUFBVTtBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsWUFBWSxHQUFHLFlBQVk7QUFDN0Qsa0NBQWtDLFlBQVksR0FBRyxZQUFZO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0EsNkRBQTZELFVBQVUsR0FBRyxVQUFVLGtFQUFrRSxVQUFVLEdBQUcsVUFBVTtBQUM3SyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUN3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvWE87QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLDRDQUE0QyxjQUFjLElBQUksMkJBQTJCLGNBQWM7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsTUFBTTtBQUNqRjtBQUNBO0FBQ0E7QUFDQSw4RUFBOEUsa0JBQWtCLGlDQUFpQztBQUNqSTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixvQkFBb0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUJBQXlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUSxHQUFHLFNBQVMsR0FBRyxRQUFRLEdBQUcsU0FBUyxFQUFFLFFBQVEsR0FBRyxTQUFTLEVBQUUsUUFBUSxHQUFHLFFBQVE7QUFDMUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFFBQVEsR0FBRyxTQUFTLEdBQUcsUUFBUSxHQUFHLFNBQVMsRUFBRSxRQUFRLEdBQUcsU0FBUyxFQUFFLFFBQVEsR0FBRyxRQUFRO0FBQzFIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZUFBZSxHQUFHLGdCQUFnQixHQUFHLGVBQWUsR0FBRyxnQkFBZ0IsRUFBRSxlQUFlLEdBQUcsZ0JBQWdCLEVBQUUsaUJBQWlCLEdBQUcsZUFBZTtBQUNoTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHdEQUFZO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxvREFBb0QsUUFBUTtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsbUdBQW1HLFFBQVE7QUFDMUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRCxvREFBb0QsUUFBUSxJQUFJLEVBQUU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixVQUFVO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsV0FBVyxFQUFDO0FBQ0o7Ozs7Ozs7VUN0ZnZCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05zRDtBQUNiO0FBQ007QUFDb0I7QUFDM0M7QUFDRDtBQUN2QixxQkFBcUIscURBQVc7QUFDaEMseUJBQXlCLCtEQUFlO0FBQ3hDLHNCQUFzQix3REFBWSIsInNvdXJjZXMiOlsid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9ldmVudC1oYW5kbGVyLnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL3NhbmtleS1jaGFydC1kYXRhLnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL3NhbmtleS1jaGFydC50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlZJSVNhbmtleUNoYXJ0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlZJSVNhbmtleUNoYXJ0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsImNsYXNzIEV2ZW50SGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZXZlbnQsIFtdKTtcbiAgICAgICAgfVxuICAgICAgICAoX2EgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBldmVudExpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBldmVudExpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KS5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBldmVudExpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IHsgRXZlbnRIYW5kbGVyIH07XG4iLCJ2YXIgSW5jbHVkZUtpbmQ7XG4oZnVuY3Rpb24gKEluY2x1ZGVLaW5kKSB7XG4gICAgSW5jbHVkZUtpbmRbXCJXSVRIX1NBTUVfVEFSR0VUXCJdID0gXCJXSVRIX1NBTUVfVEFSR0VUXCI7XG59KShJbmNsdWRlS2luZCB8fCAoSW5jbHVkZUtpbmQgPSB7fSkpO1xuY2xhc3MgU2Fua2V5Q2hhcnREYXRhIHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZVRhZ0NvbG9yID0gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbm9kZS50YWdzID8gbm9kZS50YWdzLm1hcCh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSB0aGlzLm9wdGlvbnMudGFnQ29sb3JNYXApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVt0YWddOyB9KS5maW5kKGNvbG9yID0+IGNvbG9yICE9PSB1bmRlZmluZWQpIDogdGhpcy5vcHRpb25zLmRlZmF1bHRDb2xvcjtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmNvbG9yIHx8IGNvbG9yO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHsgcmVsYXRpb25zOiBbXSwgaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kczogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLm9yaWdpbmFsRGF0YSA9IHsgbmFtZTogZGF0YS5uYW1lLCBjb2xvcjogZGF0YS5jb2xvciwgbm9kZXM6IGRhdGEubm9kZXMgfHwgW10sIHJlbGF0aW9uczogZGF0YS5yZWxhdGlvbnMgfHwgW10gfTtcbiAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSB7fTtcbiAgICAgICAgdGhpcy50aXRsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgbm9UYWc6ICdPdGhlcnMnLFxuICAgICAgICAgICAgbm9UYWdTdWZmaXhDaGFyYWN0ZXI6ICfigKYnLFxuICAgICAgICAgICAgcmVsYXRpb25EZWZhdWx0V2lkdGg6IDE1LFxuICAgICAgICAgICAgdHJhZmZpY0xvZzEwRmFjdG9yOiAxMixcbiAgICAgICAgICAgIGRlZmF1bHRDb2xvcjogXCJvcmFuZ2VcIixcbiAgICAgICAgICAgIHRhZ0NvbG9yTWFwOiB7fSxcbiAgICAgICAgICAgIGtpbmRzOiBbXSxcbiAgICAgICAgICAgIHNob3dSZWxhdGVkS2luZHM6IGZhbHNlLFxuICAgICAgICAgICAgc2VsZWN0QW5kRmlsdGVyOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU29ydFJlbGF0aW9ucygpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVSZWxhdGlvbnNJbmZvKCk7XG4gICAgICAgIHRoaXMuc29ydE5vZGVzKHRoaXMubm9kZXMpO1xuICAgIH1cbiAgICByZXNldENvbG9ycygpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCk7XG4gICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzU29tZSA9IHRhZ3Muc29tZSh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBub2RlLnRhZ3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyh0YWcpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzU29tZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZVsnY29sb3InXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub2RlID0+IGRlbGV0ZSBub2RlWydjb2xvciddKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5yZXNldENvbG9ycygpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyksIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCBwcmV2aW91c05vZGUgPSB0aGlzLnNlbGVjdGVkTm9kZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUocHJldmlvdXNOb2RlKTtcbiAgICB9XG4gICAgYXBwZW5kRGF0YShkYXRhLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubWVyZ2VEYXRhKHRoaXMub3JpZ2luYWxEYXRhLCBkYXRhKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShzZWxlY3RlZE5vZGUpO1xuICAgIH1cbiAgICBnZXROb2RlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXMgfHwgW107XG4gICAgfVxuICAgIGdldE5vZGVzQnlLaW5kKGtpbmQpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5ub2Rlc0J5S2luZHNba2luZF0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgIH1cbiAgICBnZXRSZWxhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcGVuZGVuY2llcy5yZWxhdGlvbnMgfHwgW107XG4gICAgfVxuICAgIGdldEtpbmRzKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZEtpbmRzID0gT2JqZWN0LmtleXModGhpcy5ub2Rlc0J5S2luZHMpO1xuICAgICAgICBpZiAoKChfYiA9IChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtpbmRzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubGVuZ3RoKSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMua2luZHMuZmlsdGVyKGtpbmQgPT4gZmlsdGVyZWRLaW5kcy5pbmNsdWRlcyhraW5kLm5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWRLaW5kcy5tYXAoa2luZCA9PiAoeyBuYW1lOiBraW5kIH0pKTtcbiAgICB9XG4gICAgZ2V0VGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBzZXRUaXRsZSh0aXRsZSkge1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGUgPyB7IHRpdGxlOiB0aXRsZS50aXRsZSwgbmFtZTogdGl0bGUubmFtZSwgY29sb3I6IHRpdGxlLmNvbG9yIH0gOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGdldFNlbGVjdGVkTm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgIH1cbiAgICBzZWxlY3ROb2RlKG5vZGUpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBCeUtpbmQgPSAobm9kZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFCeUtpbmRzID0ge307XG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YUJ5S2luZHNbbm9kZS5raW5kXSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhQnlLaW5kc1tub2RlLmtpbmRdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW25vZGUua2luZF0ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCBraW5kIGluIGRhdGFCeUtpbmRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RBbmRGaWx0ZXIgJiYgbm9kZSAmJiBraW5kID09PSBub2RlLmtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJ5S2luZHNba2luZF0uc29ydCgoYSwgYikgPT4gYS5uYW1lID09PSBub2RlLm5hbWUgPyAtMSA6IChiLm5hbWUgPT09IG5vZGUubmFtZSA/IDEgOiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhQnlLaW5kc1traW5kXS5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YUJ5S2luZHM7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzO1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUmVsYXRpb25XZWlnaHRzKHRoaXMubm9kZXMsIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbm9kZS5raW5kIHx8ICFub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZSBtdXN0IGhhdmUga2luZCBhbmQgbmFtZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICYmIG5vZGUubmFtZSA9PT0gdGhpcy5zZWxlY3RlZE5vZGUubmFtZSAmJiBub2RlLmtpbmQgPT09IHRoaXMuc2VsZWN0ZWROb2RlLmtpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdGhpcy5vcmlnaW5hbERhdGEubm9kZXMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbm9kZS5uYW1lICYmIGl0ZW0ua2luZCA9PT0gbm9kZS5raW5kKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkS2luZCA9IHRoaXMub3B0aW9ucy5raW5kcy5maW5kKGtpbmQgPT4geyB2YXIgX2E7IHJldHVybiBraW5kLm5hbWUgPT09ICgoX2EgPSB0aGlzLnNlbGVjdGVkTm9kZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtpbmQpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVsnaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kcyddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNlbGVjdGVkTm9kZVsnaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kcyddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVsnaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kcyddID0gKHNlbGVjdGVkS2luZCA9PT0gbnVsbCB8fCBzZWxlY3RlZEtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkS2luZC5pbmNsdWRlQWx0ZXJuYXRpdmUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0QW5kRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1JlbGF0ZWRLaW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZpbHRlckRlcGVuZGVuY2llcyh0aGlzLnNlbGVjdGVkTm9kZSwgc2VsZWN0ZWRLaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gdGhpcy5maWx0ZXJEZXBlbmRlbmNpZXModGhpcy5zZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMgPSB0aGlzLmZpbHRlck5vZGVzKHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzUmVsYXRlZFNvdXJjZU9mU2FtZUtpbmQgPSB0aGlzLmRlcGVuZGVuY2llcy5yZWxhdGlvbnMuZmluZChyZWxhdGlvbiA9PiByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gbm9kZS5raW5kICYmIHJlbGF0aW9uLnRhcmdldC5uYW1lID09PSBub2RlLm5hbWUgJiYgcmVsYXRpb24uc291cmNlLmtpbmQgPT09IG5vZGUua2luZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVJlbGF0aW9uV2VpZ2h0cyh0aGlzLm5vZGVzLCB0aGlzLmRlcGVuZGVuY2llcy5yZWxhdGlvbnMsIHRoaXMuc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGVzQnlLaW5kcyA9IGdyb3VwQnlLaW5kKHRoaXMubm9kZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkTm9kZTtcbiAgICB9XG4gICAgc29ydE5vZGVzKG5vZGVzKSB7XG4gICAgICAgIGNvbnN0IHVuZGVmaW5lZFRhZyA9ICh0aGlzLm9wdGlvbnMubm9UYWcgfHwgJycpICsgdGhpcy5vcHRpb25zLm5vVGFnU3VmZml4Q2hhcmFjdGVyO1xuICAgICAgICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5uYW1lID09PSB1bmRlZmluZWRUYWcgJiYgYi5uYW1lICE9PSB1bmRlZmluZWRUYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGEubmFtZSAhPT0gdW5kZWZpbmVkVGFnICYmIGIubmFtZSA9PT0gdW5kZWZpbmVkVGFnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0aWFsaXplU29ydFJlbGF0aW9ucygpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5zb3VyY2Uua2luZCAhPT0gYi5zb3VyY2Uua2luZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnNvdXJjZS5raW5kLmxvY2FsZUNvbXBhcmUoYi5zb3VyY2Uua2luZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5zb3VyY2UubmFtZS5sb2NhbGVDb21wYXJlKGIuc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5zb3VyY2Uua2luZCA9PT0gYi5zb3VyY2Uua2luZCAmJiBhLnNvdXJjZS5uYW1lID09PSBiLnNvdXJjZS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEudGFyZ2V0LmtpbmQgIT09IGIudGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudGFyZ2V0LmtpbmQubG9jYWxlQ29tcGFyZShiLnRhcmdldC5raW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnRhcmdldC5uYW1lLmxvY2FsZUNvbXBhcmUoYi50YXJnZXQubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0aWFsaXplUmVsYXRpb25zSW5mbygpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBzdW1tYXJ5ID0ge307XG4gICAgICAgIChfYSA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGxpbmsuc291cmNlLmtpbmQgKyAnOjonICsgbGluay5zb3VyY2UubmFtZTtcbiAgICAgICAgICAgIGlmICghc3VtbWFyeVtrZXldKSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldID0geyBzb3VyY2VDb3VudDogMCwgdGFyZ2V0Q291bnQ6IDAsIHJlZnM6IDAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW5rLnNvdXJjZS5raW5kID09PSBsaW5rLnRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldLnJlZnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlba2V5XS5zb3VyY2VDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0S2V5ID0gbGluay50YXJnZXQua2luZCArICc6OicgKyBsaW5rLnRhcmdldC5uYW1lO1xuICAgICAgICAgICAgaWYgKCFzdW1tYXJ5W3RhcmdldEtleV0pIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W3RhcmdldEtleV0gPSB7IHNvdXJjZUNvdW50OiAwLCB0YXJnZXRDb3VudDogMCwgcmVmczogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VtbWFyeVt0YXJnZXRLZXldLnRhcmdldENvdW50Kys7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBmZXRjaE1vcmVOb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0eSA9IHN1bW1hcnlbbm9kZS5raW5kICsgJzo6JyArIG5vZGUubmFtZV07XG4gICAgICAgICAgICBub2RlLmNvbG9yID0gdGhpcy5nZXROb2RlVGFnQ29sb3Iobm9kZSk7XG4gICAgICAgICAgICBpZiAobm9kZS50YXJnZXRDb3VudCB8fCBub2RlLnNvdXJjZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jYXJkaW5hbGl0eSA9IHsgc291cmNlQ291bnQ6IG5vZGUuc291cmNlQ291bnQsIHRhcmdldENvdW50OiBub2RlLnRhcmdldENvdW50LCBmZXRjaE1vcmU6IHRydWUsIHJlZnM6IDAgfTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zb3VyY2VDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5zb3VyY2VDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dE5vZGUgPSB0aGlzLmFwcGVuZE5leHROb2RlKG5vZGUsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaE1vcmVOb2Rlcy5wdXNoKG5leHROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS50YXJnZXRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS50YXJnZXRDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dE5vZGUgPSB0aGlzLmFwcGVuZE5leHROb2RlKG5vZGUsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoTW9yZU5vZGVzLnB1c2gobmV4dE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jYXJkaW5hbGl0eSA9IGNhcmRpbmFsaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmV0Y2hNb3JlTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRJbmRleEJ5S2luZChraW5kLCBvZmZzZXQpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgY29uc3QgaW5kZXggPSAoX2IgPSAoX2EgPSB0aGlzLm9wdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5raW5kcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmZpbmRJbmRleChvYmogPT4gb2JqLm5hbWUgPT09IGtpbmQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgbGV0IG5ld0luZGV4ID0gaW5kZXggKyBvZmZzZXQ7XG4gICAgICAgICAgICBpZiAobmV3SW5kZXggPCAwIHx8IG5ld0luZGV4ID49IHRoaXMub3B0aW9ucy5raW5kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXBwZW5kTmV4dE5vZGUobm9kZSwgb2Zmc2V0KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5S2luZChub2RlLmtpbmQsIG9mZnNldCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0Tm9kZUtpbmQgPSB0aGlzLm9wdGlvbnMua2luZHNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgbmV4dE5vZGUgPSB7IGtpbmQ6IG5leHROb2RlS2luZC5uYW1lLCBuYW1lOiAn4oCmJywgcGxhY2VIb2xkZXI6IHRydWUgfTtcbiAgICAgICAgICAgIGNvbnN0IG5leHROb2RlUmVsYXRpb24gPSBvZmZzZXQgPT09IC0xID8geyBzb3VyY2U6IG5leHROb2RlLCB0YXJnZXQ6IG5vZGUgfSA6IHsgc291cmNlOiBub2RlLCB0YXJnZXQ6IG5leHROb2RlIH07XG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMucHVzaChuZXh0Tm9kZVJlbGF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzZWFyY2hCeU5hbWUobm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUua2luZCB8fCAhbm9kZS5uYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbHRlciBjcml0ZXJpYSBpcyBlbXB0eScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmtpbmQgPT09IG5vZGUua2luZCAmJiBpdGVtLm5hbWUuaW5jbHVkZXMobm9kZS5uYW1lKSk7XG4gICAgfVxuICAgIGZpbmRCeU5hbWUobmFtZSwgZGF0YUFycmF5KSB7XG4gICAgICAgIHJldHVybiBkYXRhQXJyYXkuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSk7XG4gICAgfVxuICAgIGZpbHRlckRlcGVuZGVuY2llcyhzZWxlY3RlZE5vZGUsIHNlbGVjdGVkS2luZCkge1xuICAgICAgICBsZXQgcmVsYXRlZFJlbGF0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCBraW5kTmFtZXMgPSB0aGlzLmdldEtpbmRzKCkubWFwKGtpbmQgPT4ga2luZC5uYW1lKTtcbiAgICAgICAgbGV0IHRhcmdldFJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi5zb3VyY2UubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRhcmdldFJlbGF0aW9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRTb3VyY2VzID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnNvdXJjZS5raW5kKSA6IHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFNvdXJjZU5hbWVzID0gc2VsZWN0ZWRTb3VyY2VzLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB0YXJnZXRSZWxhdGlvbnMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHNlbGVjdGVkU291cmNlTmFtZXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YXJnZXRSZWxhdGlvbnMucHVzaCguLi5zZWxlY3RlZFNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhcmdldEtleXMgPSB0YXJnZXRSZWxhdGlvbnMgPyBbLi4ubmV3IFNldCh0YXJnZXRSZWxhdGlvbnMuZmxhdE1hcChyZWxhdGlvbiA9PiBgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkpXSA6IFtdO1xuICAgICAgICBjb25zdCB0YXJnZXRUYXJnZXRSZWxhdGlvbnMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24udGFyZ2V0LmtpbmQpIDogdHJ1ZSkgJiYgdGFyZ2V0S2V5cy5pbmNsdWRlcyhyZWxhdGlvbi5zb3VyY2Uua2luZCArICc6OicgKyByZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEtpbmRLZXlzID0gWy4uLm5ldyBTZXQodGFyZ2V0UmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV07XG4gICAgICAgICAgICByZWxhdGVkUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRLaW5kS2V5cy5pbmNsdWRlcyhgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkgJiYgc2VsZWN0ZWRLaW5kLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VLZXlzID0gc291cmNlUmVsYXRpb25zID8gWy4uLm5ldyBTZXQoc291cmNlUmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV0gOiBbXTtcbiAgICAgICAgY29uc3Qgc291cmNlU291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHNvdXJjZUtleXMuaW5jbHVkZXMoYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZWxhdGlvbnMgPSBbLi4ubmV3IFNldChbLi4udGFyZ2V0UmVsYXRpb25zLCAuLi50YXJnZXRUYXJnZXRSZWxhdGlvbnMsIC4uLnNvdXJjZVNvdXJjZVJlbGF0aW9ucywgLi4ucmVsYXRlZFJlbGF0aW9ucywgLi4uc291cmNlUmVsYXRpb25zXS5tYXAocmVsID0+IEpTT04uc3RyaW5naWZ5KHJlbCkpKV0ubWFwKHJlbFN0cmluZyA9PiBKU09OLnBhcnNlKHJlbFN0cmluZykpO1xuICAgICAgICBzZWxlY3RlZE5vZGUuaGFzUmVsYXRpb25zT2ZTYW1lS2luZHMgPSBkaXN0aW5jdFJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCB8fCByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVsYXRpb25zOiBkaXN0aW5jdFJlbGF0aW9ucyxcbiAgICAgICAgICAgIGhhc1JlbGF0ZWRTb3VyY2VPZk90aGVyS2luZHM6IHJlbGF0ZWRSZWxhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmaWx0ZXJOb2RlcyhyZWxhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25LZXlzID0gcmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICBjb25zdCByZWxhdGlvblNvdXJjZUtleXMgPSByZWxhdGlvbnMuZmxhdE1hcChyZWxhdGlvbiA9PiBgJHtyZWxhdGlvbi5zb3VyY2Uua2luZH06OiR7cmVsYXRpb24uc291cmNlLm5hbWV9YCk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZSkge1xuICAgICAgICAgICAgcmVsYXRpb25Tb3VyY2VLZXlzLnB1c2goYCR7dGhpcy5zZWxlY3RlZE5vZGUua2luZH06OiR7dGhpcy5zZWxlY3RlZE5vZGUubmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXN0aW5jdEtleXMgPSBbLi4ubmV3IFNldChyZWxhdGlvbktleXMuY29uY2F0KHJlbGF0aW9uU291cmNlS2V5cykpXTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZpbHRlcihub2RlID0+IGRpc3RpbmN0S2V5cy5pbmNsdWRlcyhgJHtub2RlLmtpbmR9Ojoke25vZGUubmFtZX1gKSk7XG4gICAgfVxuICAgIHVwZGF0ZVJlbGF0aW9uV2VpZ2h0cyhub2RlcywgcmVsYXRpb25zLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgaWYgKCFyZWxhdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWxhdGlvbldlaWdodHMgPSByZWxhdGlvbnMucmVkdWNlKChhY2MsIHJlbGF0aW9uKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIGFuYWx5dGljcyB9ID0gcmVsYXRpb247XG4gICAgICAgICAgICBpZiAoc291cmNlLmtpbmQgPT09IHRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRpb24uaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc291cmNlS2V5ID0gYHMke3NvdXJjZS5raW5kfToke3NvdXJjZS5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRLZXkgPSBgdCR7dGFyZ2V0LmtpbmR9OiR7dGFyZ2V0Lm5hbWV9YDtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEFuYWx5dGljcyA9IGFuYWx5dGljcztcbiAgICAgICAgICAgIGNvbnN0IHdlaWdodCA9IHNlbGVjdGVkQW5hbHl0aWNzICYmICd0cmFmZmljJyBpbiBzZWxlY3RlZEFuYWx5dGljcyAmJiAoKF9hID0gc2VsZWN0ZWRBbmFseXRpY3MudHJhZmZpYykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCkgPiAwXG4gICAgICAgICAgICAgICAgPyBNYXRoLnJvdW5kKE1hdGgubG9nMTAoTWF0aC5tYXgoc2VsZWN0ZWRBbmFseXRpY3MudHJhZmZpYywgMikgfHwgMikgKiAoKF9iID0gdGhpcy5vcHRpb25zLnRyYWZmaWNMb2cxMEZhY3RvcikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMTIpKVxuICAgICAgICAgICAgICAgIDogKChfYyA9IHRoaXMub3B0aW9ucy5yZWxhdGlvbkRlZmF1bHRXaWR0aCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogMTApO1xuICAgICAgICAgICAgcmVsYXRpb24uaGVpZ2h0ID0gd2VpZ2h0O1xuICAgICAgICAgICAgYWNjW3NvdXJjZUtleV0gPSAoYWNjW3NvdXJjZUtleV0gfHwgMCkgKyB3ZWlnaHQ7XG4gICAgICAgICAgICBhY2NbdGFyZ2V0S2V5XSA9IChhY2NbdGFyZ2V0S2V5XSB8fCAwKSArIHdlaWdodDtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBub2RlLmhlaWdodCA9IE1hdGgubWF4KChfYSA9IHJlbGF0aW9uV2VpZ2h0c1tgcyR7bm9kZS5raW5kfToke25vZGUubmFtZX1gXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCwgKF9iID0gcmVsYXRpb25XZWlnaHRzW2B0JHtub2RlLmtpbmR9OiR7bm9kZS5uYW1lfWBdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1lcmdlRGF0YShvcmlnaW5EYXRhLCBhcHBlbmREYXRhKSB7XG4gICAgICAgIGFwcGVuZERhdGEubm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gb3JpZ2luRGF0YS5ub2Rlcy5maW5kSW5kZXgoZXhpc3RpbmdOb2RlID0+IGV4aXN0aW5nTm9kZS5raW5kID09PSBub2RlLmtpbmQgJiYgZXhpc3RpbmdOb2RlLm5hbWUgPT09IG5vZGUubmFtZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdOb2RlID0gb3JpZ2luRGF0YS5ub2Rlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZWxhdGlvbnNUb1JlbW92ZSA9IG9yaWdpbkRhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ05vZGUua2luZCA9PT0gcmVsYXRpb24uc291cmNlLmtpbmQgJiYgZXhpc3RpbmdOb2RlLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5uYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZ05vZGUua2luZCA9PT0gcmVsYXRpb24udGFyZ2V0LmtpbmQgJiYgZXhpc3RpbmdOb2RlLm5hbWUgPT09IHJlbGF0aW9uLnRhcmdldC5uYW1lO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvdW5kUmVsYXRpb25zVG9SZW1vdmUuZm9yRWFjaChyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uSW5kZXggPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5pbmRleE9mKHJlbGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5EYXRhLnJlbGF0aW9ucy5zcGxpY2UocmVsYXRpb25JbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvcmlnaW5EYXRhLm5vZGVzW2luZGV4XSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5EYXRhLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhcHBlbmREYXRhLnJlbGF0aW9ucy5mb3JFYWNoKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUmVsYXRpb25JbmRleCA9IG9yaWdpbkRhdGEucmVsYXRpb25zLmZpbmRJbmRleChleGlzdGluZ1JlbGF0aW9uID0+IGV4aXN0aW5nUmVsYXRpb24uc291cmNlLmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kICYmXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWxhdGlvbi5zb3VyY2UubmFtZSA9PT0gcmVsYXRpb24uc291cmNlLm5hbWUgJiZcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlbGF0aW9uLnRhcmdldC5raW5kID09PSByZWxhdGlvbi50YXJnZXQua2luZCAmJlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVsYXRpb24udGFyZ2V0Lm5hbWUgPT09IHJlbGF0aW9uLnRhcmdldC5uYW1lKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1JlbGF0aW9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5yZWxhdGlvbnMucHVzaChyZWxhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3JpZ2luRGF0YTtcbiAgICB9XG59XG5leHBvcnQgeyBTYW5rZXlDaGFydERhdGEsIEluY2x1ZGVLaW5kIH07XG4iLCJpbXBvcnQgeyBFdmVudEhhbmRsZXIgfSBmcm9tICcuL2V2ZW50LWhhbmRsZXInO1xuY2xhc3MgU2Fua2V5Q2hhcnQge1xuICAgIGNvbnN0cnVjdG9yKHN2Z0VsZW1lbnQsIGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5TVkdfTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG4gICAgICAgIHRoaXMuc2hvd0NvbnRleHRNZW51ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgY29uc3QgY29udGV4dE1lbnUgPSB0aGlzLmNvbnRleHRNZW51RWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSB7IG5vZGU6IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0U2VsZWN0ZWROb2RlKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG1lbnVJdGVtcyA9ICgoX2IgPSB0aGlzLmNvbnRleHRNZW51RHluYW1pY0xpbmtzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbCh0aGlzLCBjb250ZXh0KSkgfHwgW107XG4gICAgICAgICAgICBpZiAobWVudUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0TWVudS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBtZW51SXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5jbGFzc05hbWUgPSAnY29udGV4dC1pdGVtJztcbiAgICAgICAgICAgICAgICAgICAgZGl2LnRleHRDb250ZW50ID0gaXRlbS5sYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS11cmwnLCBpdGVtLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JywgaXRlbS50YXJnZXQgfHwgJycpO1xuICAgICAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5QYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dE1lbnUuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VDb250ZXh0TWVudSk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0TWVudS5zdHlsZS5sZWZ0ID0gYCR7ZXZlbnQuY2xpZW50WH1weDsgY29udGV4dE1lbnUhLnN0eWxlLnRvcCA9ICR7ZXZlbnQuY2xpZW50WX1weGA7XG4gICAgICAgICAgICAgICAgY29udGV4dE1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3BlblBhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhIC0gdXJsJyk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRBdHRyID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YSAtIHRhcmdldCcpIHx8ICdfc2VsZic7XG4gICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCB0YXJnZXRBdHRyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbG9zZUNvbnRleHRNZW51ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGV4dE1lbnUgPSB0aGlzLmNvbnRleHRNZW51RWxlbWVudDtcbiAgICAgICAgICAgIGlmIChjb250ZXh0TWVudSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRNZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlQ29udGV4dE1lbnUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJlbmRlck5vZGVzID0gKG5vZGVzLCBwb3NpdGlvblgsIHNlbGVjdGVkTm9kZSwga2luZCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGNvbnN0IHN2Z0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgICAgICBsZXQgb3ZlcmFsbFkgPSB0aGlzLm9wdGlvbnMudG9wWTtcbiAgICAgICAgICAgIChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0S2luZHM7XG4gICAgICAgICAgICBjb25zdCB4ID0gcG9zaXRpb25YICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLm9wdGlvbnMudG9wWSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgIGxldCB4MiA9IHBvc2l0aW9uWCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGggKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblkgLyAyO1xuICAgICAgICAgICAgY29uc3QgeTIgPSB0aGlzLm9wdGlvbnMudG9wWSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2luZCA9PT0gbnVsbCB8fCBraW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBraW5kLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtpbmQuY29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlQ2lyY2xlKHgsIHksIDUsIGtpbmQuY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICd8ICc7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9ICh4MiAtIDEzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlS2luZFRpdGxlID0gdGhpcy5jcmVhdGVTdmdUZXh0KHByZWZpeCArIGtpbmQudGl0bGUsIFt0aGlzLmNsYXNzTmFtZS5OT0RFX1RZUEVfVElUTEVdKTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZUtpbmRUaXRsZS5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInlcIiwgeTIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKG5vZGVLaW5kVGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICBvdmVyYWxsWSArPSAyNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKF9iID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRUaXRsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5jaGFydERhdGEuZ2V0VGl0bGUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVDaXJjbGUoeCwgeSwgNSwgKHRpdGxlID09PSBudWxsIHx8IHRpdGxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0aXRsZS5jb2xvcikgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlS2luZFRpdGxlID0gdGhpcy5jcmVhdGVTdmdUZXh0KCgodGl0bGUgPT09IG51bGwgfHwgdGl0bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRpdGxlLm5hbWUpIHx8ICcnKSwgW3RoaXMuY2xhc3NOYW1lLk5PREVfVFlQRV9USVRMRV0pO1xuICAgICAgICAgICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInhcIiwgeDIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVLaW5kVGl0bGUuc2V0QXR0cmlidXRlKFwieVwiLCB5Mi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQobm9kZUtpbmRUaXRsZSk7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJhbGxZICs9IDI1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlua3NIZWlnaHQgPSAoX2EgPSBub2RlLmhlaWdodCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBub2RlLmNhcmRpbmFsaXR5ID8gMTAgOiAtMjA7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkTm9kZSAmJiBzZWxlY3RlZE5vZGUubmFtZSA9PT0gbm9kZS5uYW1lICYmIHNlbGVjdGVkTm9kZS5raW5kID09PSBub2RlLmtpbmQ7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdEhlaWdodCA9IGhlaWdodCArIE1hdGgubWF4KGxpbmtzSGVpZ2h0ICsgMiAqIHRoaXMub3B0aW9ucy5tYXJnaW5ZLCB0aGlzLm9wdGlvbnMubm9kZU1pbkhlaWdodCArICh0aGlzLm9wdGlvbnMucmVuZGVyS2luZEFzQ29sdW1zID8gMCA6IDEwKSArIChub2RlLnN1YnRpdGxlID8gMTAgOiAwKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgb3ZlcmFsbFk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBub2RlLmNvbG9yIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgICAgIGxldCBwb3NYID0gcG9zaXRpb25YO1xuICAgICAgICAgICAgICAgIGxldCByZWN0UG9zaXRpb25XaWR0aCA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aDtcbiAgICAgICAgICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc1JlbGF0ZWRTb3VyY2VPZlNhbWVLaW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSBwb3NYICsgdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNhbWVLaW5kSW5kZW50YXRpb247XG4gICAgICAgICAgICAgICAgICAgIHJlY3RQb3NpdGlvbldpZHRoID0gcmVjdFBvc2l0aW9uV2lkdGggLSB0aGlzLm9wdGlvbnMucmVsYXRpb24uc2FtZUtpbmRJbmRlbnRhdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnZycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3RIb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncmVjdCcpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ3gnLCBwb3NYLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ3knLCB5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgcmVjdFBvc2l0aW9uV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgcmVjdEhlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKCdyeCcsIFwiNVwiKTtcbiAgICAgICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKCdyeScsIFwiNVwiKTtcbiAgICAgICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKCdmaWxsJywgY29sb3IpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ2ZpbHRlcicsICd1cmwoI2Ryb3BzaGFkb3cpJyk7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgXCIwXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcbiAgICAgICAgICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgneCcsIHBvc1gudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCB5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHJlY3RIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J4JywgXCI1XCIpO1xuICAgICAgICAgICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeScsIFwiNVwiKTtcbiAgICAgICAgICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnZmlsbCcsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWN0U2hhZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdyZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCd4JywgU3RyaW5nKHBvc1ggLSAyKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCd5JywgU3RyaW5nKHkgLSAyKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyh0aGlzLm9wdGlvbnMubm9kZVdpZHRoICsgNCkpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKHJlY3RIZWlnaHQgKyA0KSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdyeCcsIFwiNlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3J5JywgXCI2XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5kcm9wU2hhZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsbCcsICdibGFjaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbHRlcicsICd1cmwoI2Ryb3BzaGFkb3cpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgXCIwLjJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ib3JkZXJDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIFwiMlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjFcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0U2hhZG93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0SG92ZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5ID0gbm9kZS5jYXJkaW5hbGl0eTtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZGluYWxpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChfYiA9IGNhcmRpbmFsaXR5LnNvdXJjZUNvdW50KSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc291cmNlVGV4dCA9IHRoaXMuY3JlYXRlU3ZnVGV4dCgnLSAnICsgY2FyZGluYWxpdHkuc291cmNlQ291bnQgKyAoY2FyZGluYWxpdHkucmVmcyA+IDAgPyAnKycgOiAnJyksIFt0aGlzLmNsYXNzTmFtZS5DQVJESU5BTElUWSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YIC0gNikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5ICsgcmVjdEhlaWdodCAtIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHNvdXJjZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgoX2MgPSBjYXJkaW5hbGl0eS50YXJnZXRDb3VudCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogMCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoY2FyZGluYWxpdHkudGFyZ2V0Q291bnQgKyAnIC0nLCBbdGhpcy5jbGFzc05hbWUuQ0FSRElOQUxJVFksIGlzU2VsZWN0ZWQgPyB0aGlzLmNsYXNzTmFtZS5TRUxFQ1RFRCA6ICcnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCAtIDE0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyByZWN0SGVpZ2h0IC0gMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHNvdXJjZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJycsIFt0aGlzLmNsYXNzTmFtZS5OT0RFX1RJVExFLCBpc1NlbGVjdGVkID8gdGhpcy5jbGFzc05hbWUuU0VMRUNURUQgOiAnJ10pO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YKSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVkVGl0bGUgPSB0aGlzLnRydW5jYXRlTmFtZShub2RlLnRpdGxlID8gbm9kZS50aXRsZSA6IG5vZGUubmFtZSwgdGhpcy5vcHRpb25zLm5hbWVNYXhMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gW3RydW5jYXRlZFRpdGxlXTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gobm9kZS50YWdzLmpvaW4oJywgJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChub2RlLmtpbmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBub2RlLmtpbmQuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaGVhZGxpbmVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IHN1YnRpdGxlTGluZUluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuc3VidGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVkU3VidGl0bGUgPSB0aGlzLnRydW5jYXRlTmFtZShub2RlLnN1YnRpdGxlLCB0aGlzLm9wdGlvbnMubmFtZU1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnNwbGljZSgxLCAwLCB0cnVuY2F0ZWRTdWJ0aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRsaW5lSW5kZXggPSAxO1xuICAgICAgICAgICAgICAgICAgICBzdWJ0aXRsZUxpbmVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCkpO1xuICAgICAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJkeVwiLCBcIjEuMmVtXCIpO1xuICAgICAgICAgICAgICAgICAgICB0c3Bhbi50ZXh0Q29udGVudCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gaGVhZGxpbmVJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHNwYW4uY2xhc3NMaXN0LmFkZChcImhlYWRsaW5lXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGkgPT09IHN1YnRpdGxlTGluZUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0c3Bhbi5jbGFzc0xpc3QuYWRkKFwic3VidGl0bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0c3Bhbi5jbGFzc0xpc3QuYWRkKFwiZGVzY3JpcHRpb25cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGV4dC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKCEobm9kZSA9PT0gbnVsbCB8fCBub2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBub2RlLnBsYWNlSG9sZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICByZWN0SG92ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNlbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChfYiA9IG5vZGUgPT09IG51bGwgfHwgbm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbm9kZS5jYXJkaW5hbGl0eSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmZldGNoTW9yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLmRpc3BhdGNoRXZlbnQoJ2ZldGNoRGF0YScsIHsgbm9kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuZGlzcGF0Y2hFdmVudCgnc2VsZWN0aW9uQ2hhbmdlZCcsIHsgbm9kZSwgcG9zaXRpb246IHsgeTogdGhpcy5zZWxlY3RlZE5vZGVQb3NpdGlvblkgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIHRoaXMub3B0aW9ucy5zZWxlY3RlZE5vZGUuaG92ZXJPcGFjaXR5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdEhvdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgdGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ob3Zlck9wYWNpdHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWN0SG92ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKGcpO1xuICAgICAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkICYmICEobm9kZSA9PT0gbnVsbCB8fCBub2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBub2RlLnBsYWNlSG9sZGVyKSAmJiB0aGlzLmNvbnRleHRNZW51RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlckVsaXBzaXNNZW51KHBvc1gsIHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlUG9zaXRpb25zW25vZGUua2luZCArICc6OicgKyBub2RlLm5hbWVdID0geyB4OiBwb3NYLCB5LCBpbmRleCwgc291cmNlWTogeSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZLCB0YXJnZXRZOiB5LCBoOiByZWN0SGVpZ2h0LCBjb2xvcjogbm9kZS5jb2xvciB9O1xuICAgICAgICAgICAgICAgIG92ZXJhbGxZID0gb3ZlcmFsbFkgKyByZWN0SGVpZ2h0ICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSBNYXRoLm1heCh0aGlzLmNhbGN1bGF0ZWRIZWlnaHQsIG92ZXJhbGxZICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZICogMik7XG4gICAgICAgICAgICByZXR1cm4gc3ZnR3JvdXA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY3JlYXRlU3ZnVGV4dCA9ICh0ZXh0Q29udGVudCwgY2xhc3NOYW1lcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0ZXh0XCIpO1xuICAgICAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiBjbGFzc05hbWUpKTtcbiAgICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJlbmRlclJlbGF0aW9ucyA9IChyZWxhdGlvbnMsIHNlbGVjdGVkTm9kZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBuYW1lLCBraW5kLCBjb2xvciB9ID0gc2VsZWN0ZWROb2RlIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdENvbG9yID0gY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgICBjb25zdCBsb2NhbE5vZGVQb3NpdGlvbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMubm9kZVBvc2l0aW9ucykpO1xuICAgICAgICAgICAgY29uc3QgZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGdQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgICAgICByZWxhdGlvbnMgPT09IG51bGwgfHwgcmVsYXRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWxhdGlvbnMuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc291cmNlUG9zaXRpb24gPSBsb2NhbE5vZGVQb3NpdGlvbnNbbGluay5zb3VyY2Uua2luZCArICc6OicgKyBsaW5rLnNvdXJjZS5uYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGxvY2FsTm9kZVBvc2l0aW9uc1tsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0UG9zaXRpb24gfHwgIXNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGlua0NvbG9yID0gc291cmNlUG9zaXRpb24uY29sb3IgfHwgZGVmYXVsdENvbG9yO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIGhlaWdodCB9ID0gbGluaztcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQxWCA9IHNvdXJjZVBvc2l0aW9uLnggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDFZID0gc291cmNlUG9zaXRpb24uc291cmNlWSArICgoaGVpZ2h0IHx8IDApIC8gMik7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKChoZWlnaHQgfHwgMCkgLyAyKSArIDU7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MlggPSAoc291cmNlUG9zaXRpb24ueCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGggKyB0YXJnZXRQb3NpdGlvbi54KSAvIDI7XG4gICAgICAgICAgICAgICAgbGV0IHBhdGhEO1xuICAgICAgICAgICAgICAgIGxldCBvcGFjaXR5ID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgbGV0IHN0cm9rZVdpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBvcGFjaXR5RW1waGFzaXplU2VsZWN0ZWQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICgobGluay5zb3VyY2Uua2luZCA9PT0ga2luZCAmJiBsaW5rLnNvdXJjZS5uYW1lID09PSBuYW1lKSB8fCAobGluay50YXJnZXQua2luZCA9PT0ga2luZCAmJiBsaW5rLnRhcmdldC5uYW1lID09PSBuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ICs9IHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zZWxlY3RlZE9wYWNpdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZVBvc2l0aW9uLmluZGV4IDwgdGFyZ2V0UG9zaXRpb24uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVggPSBzb3VyY2VQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSBzb3VyY2VQb3NpdGlvbi55ICsgc291cmNlUG9zaXRpb24uaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlggPSB0YXJnZXRQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi55ICsgKHRhcmdldFBvc2l0aW9uLmggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhEID0gYE0ke3BvaW50MVh9LCR7cG9pbnQxWX0gQyR7cG9pbnQxWH0sJHtwb2ludDJZfSAke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDJYfSwke3BvaW50Mll9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlggPSBzb3VyY2VQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSBzb3VyY2VQb3NpdGlvbi55ICsgKHNvdXJjZVBvc2l0aW9uLmggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVggPSB0YXJnZXRQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSB0YXJnZXRQb3NpdGlvbi55ICsgdGFyZ2V0UG9zaXRpb24uaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhEID0gYE0ke3BvaW50MVh9LCR7cG9pbnQxWX0gQyR7cG9pbnQxWH0sJHtwb2ludDJZfSAke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDJYfSwke3BvaW50Mll9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aCA9IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtjb250cm9sUG9pbnQxWH0sJHtjb250cm9sUG9pbnQxWX0gQyR7Y29udHJvbFBvaW50Mlh9LCR7Y29udHJvbFBvaW50MVl9ICR7Y29udHJvbFBvaW50Mlh9LCR7Y29udHJvbFBvaW50Mll9ICR7dGFyZ2V0UG9zaXRpb24ueH0sJHtjb250cm9sUG9pbnQyWX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoRCk7XG4gICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBTdHJpbmcoc3Ryb2tlV2lkdGggfHwgMCkpO1xuICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCBsaW5rQ29sb3IpO1xuICAgICAgICAgICAgICAgIGdQYXRoLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgICAgIGxldCBhbmFseXRpY3M7XG4gICAgICAgICAgICAgICAgaWYgKGFuYWx5dGljcykge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5hbHl0aWNzID0gbGluay5hbmFseXRpY3M7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWRLaW5kID0gbGluay50YXJnZXQua2luZCA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSB8fCBsaW5rLnNvdXJjZS5raW5kID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKF9hID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLnRyYWZmaWMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJycsIFt0aGlzLmNsYXNzTmFtZS5SRUxBVElPTl0pO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHRhcmdldFBvc2l0aW9uLnggLSB0aGlzLm9wdGlvbnMubWFyZ2luWSkpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHRhcmdldFBvc2l0aW9uLnRhcmdldFkgKyAoaGVpZ2h0IHx8IDAgLyAyKSArIDgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FbnYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRW52LnRleHRDb250ZW50ID0gKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudCkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW5FbnYpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudCkgJiYgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmVudmlyb25tZW50W2FuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaGFycmF5JywgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmVudmlyb25tZW50W2FuYWx5dGljcy5lbnZpcm9ubWVudF0uZGFzaEFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoKF9iID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVycm9ycykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yUmF0aW8gPSAoMTAwIC8gKChfYyA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAwKSAqICgoX2QgPSBhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MuZXJyb3JzKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiAwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0c3BhbkVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0c3BhbkVyci50ZXh0Q29udGVudCA9ICcgJyArIChlcnJvclJhdGlvID09IDAgPyBcIig8MC4wMSUpXCIgOiAnKCcgKyBlcnJvclJhdGlvLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICclKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC5hcHBlbmRDaGlsZCh0c3BhbkVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuLnRleHRDb250ZW50ID0gJyAnICsgKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljLnRvTG9jYWxlU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgZ1RleHQuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5ICsgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmFuYWx5dGljc09wYWNpdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNvdXJjZS5raW5kICE9IHRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNvdXJjZVBvc2l0aW9uLnNvdXJjZVkgKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uLnRhcmdldFkgKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdmdFbGVtZW50LmFwcGVuZENoaWxkKGdQYXRoKTtcbiAgICAgICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnVGV4dCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5vZGVXaWR0aDogMTAsXG4gICAgICAgICAgICBub2RlTWluSGVpZ2h0OiA2NSxcbiAgICAgICAgICAgIG1hcmdpblg6IDE1LFxuICAgICAgICAgICAgbWFyZ2luWTogNSxcbiAgICAgICAgICAgIGxlZnRYOiAxNSxcbiAgICAgICAgICAgIHRvcFk6IDEwLFxuICAgICAgICAgICAgbm9kZU1hcmdpblk6IDEwLFxuICAgICAgICAgICAgbmFtZU1heExlbmd0aDogNTAsXG4gICAgICAgICAgICBub2RlQ29sdW1uV2l0aDogMzAwLFxuICAgICAgICAgICAgZGVmYXVsdE5vZGVDb2xvcjogXCJncmF5XCIsXG4gICAgICAgICAgICByZW5kZXJLaW5kQXNDb2x1bXM6IHRydWUsXG4gICAgICAgICAgICByZWxhdGlvbjoge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkT3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIGFuYWx5dGljc09wYWNpdHk6IDAuMixcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbm9uUFJPRDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGFzaEFycmF5OiAnMTAsMSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2FtZUtpbmRJbmRlbnRhdGlvbjogMjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxlY3RlZE5vZGU6IHtcbiAgICAgICAgICAgICAgICBkcm9wU2hhZG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzY2FsZTogMS4yLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmMTAxMCcsXG4gICAgICAgICAgICAgICAgaG92ZXJPcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgaG92ZXJDb2xvcjogJyMxNDE0MTQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZWxsaXBzZUNoYXJhY3RlcjogJ+KApicsXG4gICAgICAgICAgICByb290Q2hhcmFjdGVyOiAn4oyCJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMoY3VzdG9tT3B0aW9ucyB8fCB7fSk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlZEhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudCA9IHN2Z0VsZW1lbnQ7XG4gICAgICAgIHRoaXMubm9kZVBvc2l0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudUVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVEeW5hbWljTGlua3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgTk9ERV9UWVBFX1RJVExFOiBcIm5vZGUta2luZC10aXRsZVwiLFxuICAgICAgICAgICAgTk9ERV9USVRMRTogXCJub2RlLXRpdGxlXCIsXG4gICAgICAgICAgICBSRUxBVElPTjogXCJyZWxhdGlvblwiLFxuICAgICAgICAgICAgQ0FSRElOQUxJVFk6IFwiY2FyZGluYWxpdHlcIixcbiAgICAgICAgICAgIFNFTEVDVEVEOiAnc2VsZWN0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlUG9zaXRpb25ZID0gLTE7XG4gICAgfVxuICAgIHNldE9wdGlvbnMoY3VzdG9tT3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLl9kZWVwTWVyZ2UodGhpcy5vcHRpb25zLCBjdXN0b21PcHRpb25zKTtcbiAgICB9XG4gICAgc2V0RGF0YShjaGFydERhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhcnREYXRhICE9PSBjaGFydERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcnREYXRhID0gY2hhcnREYXRhO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLmRpc3BhdGNoRXZlbnQoJ3NlbGVjdGlvbkNoYW5nZWQnLCB7IG5vZGU6IHRoaXMuY2hhcnREYXRhLmdldFNlbGVjdGVkTm9kZSgpLCBwb3NpdGlvbjogeyB5OiAwIH0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnREYXRhO1xuICAgIH1cbiAgICBhZGRTZWxlY3Rpb25DaGFuZ2VkTGlzdGVuZXJzKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLnN1YnNjcmliZSgnc2VsZWN0aW9uQ2hhbmdlZCcsIGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgICAgICAgICAgY2FsbGJhY2tGdW5jdGlvbih7IG5vZGU6IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0U2VsZWN0ZWROb2RlKCksIHBvc2l0aW9uOiB7IHk6IDAgfSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGRDb250ZXh0TWVudUxpc3RlbmVycyhjb250ZXh0TWVudUVsZW1lbnQsIGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51RWxlbWVudCA9IGNvbnRleHRNZW51RWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVEeW5hbWljTGlua3MgPSBjYWxsYmFja0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZEZldGNoRGF0YUxpc3RlbmVycyhjYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuc3Vic2NyaWJlKCdmZXRjaERhdGEnLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnVuY2F0ZU5hbWUobmFtZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGlmIChuYW1lICYmIChuYW1lID09PSBudWxsIHx8IG5hbWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5hbWUubGVuZ3RoKSA+IG1heExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIG1heExlbmd0aCAtIDMpICsgdGhpcy5vcHRpb25zLmVsbGlwc2VDaGFyYWN0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWUgfHwgJyc7XG4gICAgfVxuICAgIHJlc2V0U3ZnKCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuaW5uZXJIVE1MID0gYFxuICAgICAgPGRlZnM+XG4gICAgICAgIDxmaWx0ZXIgaWQ9XCJkcm9wc2hhZG93XCI+XG4gICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj1cIjAuNFwiIC8+XG4gICAgICAgIDwvZmlsdGVyPlxuICAgICAgPC9kZWZzPlxuICAgIGA7XG4gICAgfVxuICAgIHVwZGF0ZUhlaWdodCgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCB3aWR0aCA9ICh0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpdGggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoKSAqIE1hdGgubWF4KDEsICgoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEtpbmRzKCkubGVuZ3RoKSB8fCAwKSArICh0aGlzLm9wdGlvbnMubWFyZ2luWCAqIDIpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHJlbmRlckVsaXBzaXNNZW51KHgsIHkpIHtcbiAgICAgICAgY29uc3QgbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnZycpO1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgnaWQnLCAnZWxsaXBzaXNNZW51Jyk7XG4gICAgICAgIG1lbnUuc2V0QXR0cmlidXRlKCdzdHlsZScsICdjdXJzb3I6IHBvaW50ZXI7Jyk7XG4gICAgICAgIG1lbnUuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eCArIDIuNX0sICR7eX0pYCk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNob3dDb250ZXh0TWVudSk7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnLTIuNScpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjInKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J4JywgJzUnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J5JywgJzUnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnYmxhY2snKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ29wYWNpdHknLCAnMC4yJyk7XG4gICAgICAgIG1lbnUuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgIGZvciAobGV0IGl5ID0gNTsgaXkgPD0gMTU7IGl5ICs9IDUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlQ2lyY2xlKDIuNSwgaXksIDIsIFwid2hpdGVcIik7XG4gICAgICAgICAgICBtZW51LmFwcGVuZENoaWxkKGNpcmNsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lbnU7XG4gICAgfVxuICAgIGNyZWF0ZUNpcmNsZShjeCwgY3ksIHIsIGZpbGwpIHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdjaXJjbGUnKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3gnLCBjeC50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3knLCBjeS50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgncicsIHIudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBmaWxsKTtcbiAgICAgICAgcmV0dXJuIGNpcmNsZTtcbiAgICB9XG4gICAgX2RlZXBNZXJnZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgfHwgdGFyZ2V0ID09PSBudWxsIHx8IHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnIHx8IHNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc291cmNlW2tleV0gPT09ICdvYmplY3QnICYmIHNvdXJjZVtrZXldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9kZWVwTWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xuICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGUgPSAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFNlbGVjdGVkTm9kZSgpO1xuICAgICAgICB0aGlzLnJlc2V0U3ZnKCk7XG4gICAgICAgIGxldCBjb2x1bW4gPSAwO1xuICAgICAgICBjb25zdCBjb2x1bW5XaWR0aCA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGg7XG4gICAgICAgIGNvbnN0IGtpbmRzID0gKF9iID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRLaW5kcygpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgICAgICBjb25zdCBzdmdOb2RlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBpZiAoa2luZHMgJiYga2luZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAga2luZHMuZm9yRWFjaChraW5kID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHN2Z05vZGVzLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyTm9kZXMoKF9iID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXROb2Rlc0J5S2luZChraW5kLm5hbWUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSwgdGhpcy5vcHRpb25zLmxlZnRYICsgY29sdW1uV2lkdGggKiBjb2x1bW4rKywgc2VsZWN0ZWROb2RlLCBraW5kKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN2Z05vZGVzLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyTm9kZXMoKF9kID0gKF9jID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5nZXROb2RlcygpKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBbXSwgdGhpcy5vcHRpb25zLmxlZnRYICsgMCkpO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgdGhpcy5yZW5kZXJSZWxhdGlvbnMoKF9lID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5nZXRSZWxhdGlvbnMoKSwgc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50LmFwcGVuZENoaWxkKHN2Z05vZGVzKTtcbiAgICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBTYW5rZXlDaGFydDtcbmV4cG9ydCB7IFNhbmtleUNoYXJ0IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNhbmtleUNoYXJ0RGF0YSB9IGZyb20gJy4vc2Fua2V5LWNoYXJ0LWRhdGEnO1xuaW1wb3J0IFNhbmtleUNoYXJ0IGZyb20gJy4vc2Fua2V5LWNoYXJ0JztcbmltcG9ydCB7IEV2ZW50SGFuZGxlciB9IGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5leHBvcnQgeyBTYW5rZXlDaGFydERhdGEsIEluY2x1ZGVLaW5kIH0gZnJvbSAnLi9zYW5rZXktY2hhcnQtZGF0YSc7XG5leHBvcnQgeyBFdmVudEhhbmRsZXIgfTtcbmV4cG9ydCB7IFNhbmtleUNoYXJ0IH07XG53aW5kb3cuU2Fua2V5Q2hhcnQgPSBTYW5rZXlDaGFydDtcbndpbmRvdy5TYW5rZXlDaGFydERhdGEgPSBTYW5rZXlDaGFydERhdGE7XG53aW5kb3cuRXZlbnRIYW5kbGVyID0gRXZlbnRIYW5kbGVyO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9