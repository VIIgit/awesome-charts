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
                var _a, _b, _c, _d, _e;
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
                if (((_a = link.analytics) === null || _a === void 0 ? void 0 : _a.drillDown) && link.source.kind != (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind)) {
                }
                if (analytics) {
                }
                else {
                    analytics = link.analytics;
                    const isSelectedKind = link.target.kind === (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind) || link.source.kind === (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind);
                }
                if ((_b = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _b !== void 0 ? _b : 0 > 0) {
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
                    if ((_c = analytics === null || analytics === void 0 ? void 0 : analytics.errors) !== null && _c !== void 0 ? _c : 0 > 0) {
                        const errorRatio = (100 / ((_d = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _d !== void 0 ? _d : 0) * ((_e = analytics === null || analytics === void 0 ? void 0 : analytics.errors) !== null && _e !== void 0 ? _e : 0));
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

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUN3Qjs7Ozs7Ozs7Ozs7Ozs7OztBQzdCeEI7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxrQ0FBa0M7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELFFBQVEsc0ZBQXNGO0FBQzNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFFBQVEsZ0ZBQWdGO0FBQzNJO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDJEQUEyRDtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RSxRQUFRLCtGQUErRjtBQUM5SztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQix1REFBdUQsaUNBQWlDLElBQUk7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0dBQWdHLHFCQUFxQixJQUFJLHFCQUFxQjtBQUM5STtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsdUZBQXVGLHFCQUFxQixJQUFJLHFCQUFxQjtBQUNySTtBQUNBLG1EQUFtRCxxQkFBcUIsSUFBSSxxQkFBcUI7QUFDakcsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxnR0FBZ0cscUJBQXFCLElBQUkscUJBQXFCO0FBQzlJO0FBQ0Esc0hBQXNILHFCQUFxQixJQUFJLHFCQUFxQjtBQUNwSyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxxQkFBcUIsSUFBSSxxQkFBcUI7QUFDNUcsb0VBQW9FLHFCQUFxQixJQUFJLHFCQUFxQjtBQUNsSDtBQUNBLHVDQUF1Qyx1QkFBdUIsSUFBSSx1QkFBdUI7QUFDekY7QUFDQTtBQUNBLCtFQUErRSxVQUFVLElBQUksVUFBVTtBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsWUFBWSxHQUFHLFlBQVk7QUFDN0Qsa0NBQWtDLFlBQVksR0FBRyxZQUFZO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0EsNkRBQTZELFVBQVUsR0FBRyxVQUFVLGtFQUFrRSxVQUFVLEdBQUcsVUFBVTtBQUM3SyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUN3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzWE87QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLDRDQUE0QyxjQUFjLElBQUksMkJBQTJCLGNBQWM7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsTUFBTTtBQUNqRjtBQUNBO0FBQ0E7QUFDQSw4RUFBOEUsa0JBQWtCLGlDQUFpQztBQUNqSTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixvQkFBb0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUJBQXlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUSxHQUFHLFNBQVMsR0FBRyxRQUFRLEdBQUcsU0FBUyxFQUFFLFFBQVEsR0FBRyxTQUFTLEVBQUUsUUFBUSxHQUFHLFFBQVE7QUFDMUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFFBQVEsR0FBRyxTQUFTLEdBQUcsUUFBUSxHQUFHLFNBQVMsRUFBRSxRQUFRLEdBQUcsU0FBUyxFQUFFLFFBQVEsR0FBRyxRQUFRO0FBQzFIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZUFBZSxHQUFHLGdCQUFnQixHQUFHLGVBQWUsR0FBRyxnQkFBZ0IsRUFBRSxlQUFlLEdBQUcsZ0JBQWdCLEVBQUUsaUJBQWlCLEdBQUcsZUFBZTtBQUNoTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyx3REFBWTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0Usb0RBQW9ELFFBQVE7QUFDOUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1HQUFtRyxRQUFRO0FBQzFJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQsb0RBQW9ELFFBQVEsSUFBSSxFQUFFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsVUFBVTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLFdBQVcsRUFBQztBQUNKOzs7Ozs7O1VDeGZ2QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnNEO0FBQ2I7QUFDTTtBQUNvQjtBQUMzQztBQUNEO0FBQ3ZCLHFCQUFxQixxREFBVztBQUNoQyx5QkFBeUIsK0RBQWU7QUFDeEMsc0JBQXNCLHdEQUFZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL2V2ZW50LWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvc2Fua2V5LWNoYXJ0LWRhdGEudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvc2Fua2V5LWNoYXJ0LnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVklJU2Fua2V5Q2hhcnRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiVklJU2Fua2V5Q2hhcnRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiY2xhc3MgRXZlbnRIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIHN1YnNjcmliZShldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNldChldmVudCwgW10pO1xuICAgICAgICB9XG4gICAgICAgIChfYSA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gICAgdW5zdWJzY3JpYmUoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudExpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCk7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGV2ZW50TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGlzcGF0Y2hFdmVudChldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGV2ZW50TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgeyBFdmVudEhhbmRsZXIgfTtcbiIsInZhciBJbmNsdWRlS2luZDtcbihmdW5jdGlvbiAoSW5jbHVkZUtpbmQpIHtcbiAgICBJbmNsdWRlS2luZFtcIldJVEhfU0FNRV9UQVJHRVRcIl0gPSBcIldJVEhfU0FNRV9UQVJHRVRcIjtcbn0pKEluY2x1ZGVLaW5kIHx8IChJbmNsdWRlS2luZCA9IHt9KSk7XG5jbGFzcyBTYW5rZXlDaGFydERhdGEge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5nZXROb2RlVGFnQ29sb3IgPSAobm9kZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBub2RlLnRhZ3MgPyBub2RlLnRhZ3MubWFwKHRhZyA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW3RhZ107IH0pLmZpbmQoY29sb3IgPT4gY29sb3IgIT09IHVuZGVmaW5lZCkgOiB0aGlzLm9wdGlvbnMuZGVmYXVsdENvbG9yO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuY29sb3IgfHwgY29sb3I7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0geyByZWxhdGlvbnM6IFtdLCBoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMub3JpZ2luYWxEYXRhID0geyBuYW1lOiBkYXRhLm5hbWUsIGNvbG9yOiBkYXRhLmNvbG9yLCBub2RlczogZGF0YS5ub2RlcyB8fCBbXSwgcmVsYXRpb25zOiBkYXRhLnJlbGF0aW9ucyB8fCBbXSB9O1xuICAgICAgICB0aGlzLm5vZGVzQnlLaW5kcyA9IHt9O1xuICAgICAgICB0aGlzLnRpdGxlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBub1RhZzogJ090aGVycycsXG4gICAgICAgICAgICBub1RhZ1N1ZmZpeENoYXJhY3RlcjogJ+KApicsXG4gICAgICAgICAgICByZWxhdGlvbkRlZmF1bHRXaWR0aDogMTUsXG4gICAgICAgICAgICB0cmFmZmljTG9nMTBGYWN0b3I6IDEyLFxuICAgICAgICAgICAgZGVmYXVsdENvbG9yOiBcIm9yYW5nZVwiLFxuICAgICAgICAgICAgdGFnQ29sb3JNYXA6IHt9LFxuICAgICAgICAgICAga2luZHM6IFtdLFxuICAgICAgICAgICAgc2hvd1JlbGF0ZWRLaW5kczogZmFsc2UsXG4gICAgICAgICAgICBzZWxlY3RBbmRGaWx0ZXI6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVTb3J0UmVsYXRpb25zKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbGF0aW9uc0luZm8oKTtcbiAgICAgICAgdGhpcy5zb3J0Tm9kZXModGhpcy5ub2Rlcyk7XG4gICAgfVxuICAgIHJlc2V0Q29sb3JzKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRhZ0NvbG9yTWFwKSB7XG4gICAgICAgICAgICBjb25zdCB0YWdzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLnRhZ0NvbG9yTWFwKTtcbiAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNTb21lID0gdGFncy5zb21lKHRhZyA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IG5vZGUudGFncykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKHRhZyk7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChoYXNTb21lKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlWydjb2xvciddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4gZGVsZXRlIG5vZGVbJ2NvbG9yJ10pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlc2V0Q29sb3JzKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzTm9kZSA9IHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShwcmV2aW91c05vZGUpO1xuICAgIH1cbiAgICBhcHBlbmREYXRhKGRhdGEsIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5tZXJnZURhdGEodGhpcy5vcmlnaW5hbERhdGEsIGRhdGEpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKHNlbGVjdGVkTm9kZSk7XG4gICAgfVxuICAgIGdldE5vZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlcyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0Tm9kZXNCeUtpbmQoa2luZCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgfVxuICAgIGdldFJlbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0S2luZHMoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkS2luZHMgPSBPYmplY3Qua2V5cyh0aGlzLm5vZGVzQnlLaW5kcyk7XG4gICAgICAgIGlmICgoKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5sZW5ndGgpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5raW5kcy5maWx0ZXIoa2luZCA9PiBmaWx0ZXJlZEtpbmRzLmluY2x1ZGVzKGtpbmQubmFtZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZEtpbmRzLm1hcChraW5kID0+ICh7IG5hbWU6IGtpbmQgfSkpO1xuICAgIH1cbiAgICBnZXRUaXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGU7XG4gICAgfVxuICAgIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZSA/IHsgdGl0bGU6IHRpdGxlLnRpdGxlLCBuYW1lOiB0aXRsZS5uYW1lLCBjb2xvcjogdGl0bGUuY29sb3IgfSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0U2VsZWN0ZWROb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZE5vZGU7XG4gICAgfVxuICAgIHNlbGVjdE5vZGUobm9kZSkge1xuICAgICAgICBjb25zdCBncm91cEJ5S2luZCA9IChub2RlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUJ5S2luZHMgPSB7fTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhQnlLaW5kc1tub2RlLmtpbmRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW25vZGUua2luZF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YUJ5S2luZHNbbm9kZS5raW5kXS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtpbmQgaW4gZGF0YUJ5S2luZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdEFuZEZpbHRlciAmJiBub2RlICYmIGtpbmQgPT09IG5vZGUua2luZCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhQnlLaW5kc1traW5kXS5zb3J0KChhLCBiKSA9PiBhLm5hbWUgPT09IG5vZGUubmFtZSA/IC0xIDogKGIubmFtZSA9PT0gbm9kZS5uYW1lID8gMSA6IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW2tpbmRdLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhQnlLaW5kcztcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVzID0gdGhpcy5vcmlnaW5hbERhdGEubm9kZXM7XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcy5yZWxhdGlvbnMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMgfHwgW107XG4gICAgICAgICAgICB0aGlzLm5vZGVzQnlLaW5kcyA9IGdyb3VwQnlLaW5kKHRoaXMubm9kZXMpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVSZWxhdGlvbldlaWdodHModGhpcy5ub2RlcywgdGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFub2RlLmtpbmQgfHwgIW5vZGUubmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIG11c3QgaGF2ZSBraW5kIGFuZCBuYW1lJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgJiYgbm9kZS5uYW1lID09PSB0aGlzLnNlbGVjdGVkTm9kZS5uYW1lICYmIG5vZGUua2luZCA9PT0gdGhpcy5zZWxlY3RlZE5vZGUua2luZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBub2RlLm5hbWUgJiYgaXRlbS5raW5kID09PSBub2RlLmtpbmQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRLaW5kID0gdGhpcy5vcHRpb25zLmtpbmRzLmZpbmQoa2luZCA9PiB7IHZhciBfYTsgcmV0dXJuIGtpbmQubmFtZSA9PT0gKChfYSA9IHRoaXMuc2VsZWN0ZWROb2RlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZCk7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEtpbmQgPT09IG51bGwgfHwgc2VsZWN0ZWRLaW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEtpbmQuaW5jbHVkZUFsdGVybmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RBbmRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UmVsYXRlZEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHRoaXMuZmlsdGVyRGVwZW5kZW5jaWVzKHRoaXMuc2VsZWN0ZWROb2RlLCBzZWxlY3RlZEtpbmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZpbHRlckRlcGVuZGVuY2llcyh0aGlzLnNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMuZmlsdGVyTm9kZXModGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNSZWxhdGVkU291cmNlT2ZTYW1lS2luZCA9IHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBub2RlLmtpbmQgJiYgcmVsYXRpb24udGFyZ2V0Lm5hbWUgPT09IG5vZGUubmFtZSAmJiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gbm9kZS5raW5kKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUmVsYXRpb25XZWlnaHRzKHRoaXMubm9kZXMsIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucywgdGhpcy5zZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm9kZXNCeUtpbmRzID0gZ3JvdXBCeUtpbmQodGhpcy5ub2Rlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgIH1cbiAgICBzb3J0Tm9kZXMobm9kZXMpIHtcbiAgICAgICAgY29uc3QgdW5kZWZpbmVkVGFnID0gKHRoaXMub3B0aW9ucy5ub1RhZyB8fCAnJykgKyB0aGlzLm9wdGlvbnMubm9UYWdTdWZmaXhDaGFyYWN0ZXI7XG4gICAgICAgIG5vZGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLm5hbWUgPT09IHVuZGVmaW5lZFRhZyAmJiBiLm5hbWUgIT09IHVuZGVmaW5lZFRhZykge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYS5uYW1lICE9PSB1bmRlZmluZWRUYWcgJiYgYi5uYW1lID09PSB1bmRlZmluZWRUYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYWxpemVTb3J0UmVsYXRpb25zKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnNvdXJjZS5raW5kICE9PSBiLnNvdXJjZS5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuc291cmNlLmtpbmQubG9jYWxlQ29tcGFyZShiLnNvdXJjZS5raW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnNvdXJjZS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnNvdXJjZS5raW5kID09PSBiLnNvdXJjZS5raW5kICYmIGEuc291cmNlLm5hbWUgPT09IGIuc291cmNlLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQua2luZCAhPT0gYi50YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS50YXJnZXQua2luZC5sb2NhbGVDb21wYXJlKGIudGFyZ2V0LmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudGFyZ2V0Lm5hbWUubG9jYWxlQ29tcGFyZShiLnRhcmdldC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYWxpemVSZWxhdGlvbnNJbmZvKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB7fTtcbiAgICAgICAgKF9hID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gbGluay5zb3VyY2Uua2luZCArICc6OicgKyBsaW5rLnNvdXJjZS5uYW1lO1xuICAgICAgICAgICAgaWYgKCFzdW1tYXJ5W2tleV0pIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0gPSB7IHNvdXJjZUNvdW50OiAwLCB0YXJnZXRDb3VudDogMCwgcmVmczogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmsuc291cmNlLmtpbmQgPT09IGxpbmsudGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0ucmVmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldLnNvdXJjZUNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRLZXkgPSBsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICBpZiAoIXN1bW1hcnlbdGFyZ2V0S2V5XSkge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlbdGFyZ2V0S2V5XSA9IHsgc291cmNlQ291bnQ6IDAsIHRhcmdldENvdW50OiAwLCByZWZzOiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5W3RhcmdldEtleV0udGFyZ2V0Q291bnQrKztcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGZldGNoTW9yZU5vZGVzID0gW107XG4gICAgICAgIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5ID0gc3VtbWFyeVtub2RlLmtpbmQgKyAnOjonICsgbm9kZS5uYW1lXTtcbiAgICAgICAgICAgIG5vZGUuY29sb3IgPSB0aGlzLmdldE5vZGVUYWdDb2xvcihub2RlKTtcbiAgICAgICAgICAgIGlmIChub2RlLnRhcmdldENvdW50IHx8IG5vZGUuc291cmNlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBub2RlLmNhcmRpbmFsaXR5ID0geyBzb3VyY2VDb3VudDogbm9kZS5zb3VyY2VDb3VudCwgdGFyZ2V0Q291bnQ6IG5vZGUudGFyZ2V0Q291bnQsIGZldGNoTW9yZTogdHJ1ZSwgcmVmczogMCB9O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnNvdXJjZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnNvdXJjZUNvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHRoaXMuYXBwZW5kTmV4dE5vZGUobm9kZSwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoTW9yZU5vZGVzLnB1c2gobmV4dE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLnRhcmdldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnRhcmdldENvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHRoaXMuYXBwZW5kTmV4dE5vZGUobm9kZSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hNb3JlTm9kZXMucHVzaChuZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLmNhcmRpbmFsaXR5ID0gY2FyZGluYWxpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmZXRjaE1vcmVOb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbERhdGEubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldEluZGV4QnlLaW5kKGtpbmQsIG9mZnNldCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBjb25zdCBpbmRleCA9IChfYiA9IChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtpbmRzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZmluZEluZGV4KG9iaiA9PiBvYmoubmFtZSA9PT0ga2luZCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBsZXQgbmV3SW5kZXggPSBpbmRleCArIG9mZnNldDtcbiAgICAgICAgICAgIGlmIChuZXdJbmRleCA8IDAgfHwgbmV3SW5kZXggPj0gdGhpcy5vcHRpb25zLmtpbmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhcHBlbmROZXh0Tm9kZShub2RlLCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdldEluZGV4QnlLaW5kKG5vZGUua2luZCwgb2Zmc2V0KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHROb2RlS2luZCA9IHRoaXMub3B0aW9ucy5raW5kc1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHsga2luZDogbmV4dE5vZGVLaW5kLm5hbWUsIG5hbWU6ICfigKYnLCBwbGFjZUhvbGRlcjogdHJ1ZSB9O1xuICAgICAgICAgICAgY29uc3QgbmV4dE5vZGVSZWxhdGlvbiA9IG9mZnNldCA9PT0gLTEgPyB7IHNvdXJjZTogbmV4dE5vZGUsIHRhcmdldDogbm9kZSB9IDogeyBzb3VyY2U6IG5vZGUsIHRhcmdldDogbmV4dE5vZGUgfTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5wdXNoKG5leHROb2RlUmVsYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIG5leHROb2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHNlYXJjaEJ5TmFtZShub2RlKSB7XG4gICAgICAgIGlmICghbm9kZS5raW5kIHx8ICFub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsdGVyIGNyaXRlcmlhIGlzIGVtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZpbHRlcihpdGVtID0+IGl0ZW0ua2luZCA9PT0gbm9kZS5raW5kICYmIGl0ZW0ubmFtZS5pbmNsdWRlcyhub2RlLm5hbWUpKTtcbiAgICB9XG4gICAgZmluZEJ5TmFtZShuYW1lLCBkYXRhQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFBcnJheS5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcbiAgICB9XG4gICAgZmlsdGVyRGVwZW5kZW5jaWVzKHNlbGVjdGVkTm9kZSwgc2VsZWN0ZWRLaW5kKSB7XG4gICAgICAgIGxldCByZWxhdGVkUmVsYXRpb25zID0gW107XG4gICAgICAgIGNvbnN0IGtpbmROYW1lcyA9IHRoaXMuZ2V0S2luZHMoKS5tYXAoa2luZCA9PiBraW5kLm5hbWUpO1xuICAgICAgICBjb25zdCB0YXJnZXRSZWxhdGlvbnMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgJiYgcmVsYXRpb24uc291cmNlLm5hbWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lICYmIChraW5kTmFtZXMubGVuZ3RoID4gMCA/IGtpbmROYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi50YXJnZXQua2luZCkgOiB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRhcmdldEtleXMgPSB0YXJnZXRSZWxhdGlvbnMgPyBbLi4ubmV3IFNldCh0YXJnZXRSZWxhdGlvbnMuZmxhdE1hcChyZWxhdGlvbiA9PiBgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkpXSA6IFtdO1xuICAgICAgICBjb25zdCB0YXJnZXRUYXJnZXRSZWxhdGlvbnMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24udGFyZ2V0LmtpbmQpIDogdHJ1ZSkgJiYgdGFyZ2V0S2V5cy5pbmNsdWRlcyhyZWxhdGlvbi5zb3VyY2Uua2luZCArICc6OicgKyByZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEtpbmRLZXlzID0gWy4uLm5ldyBTZXQodGFyZ2V0UmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV07XG4gICAgICAgICAgICByZWxhdGVkUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRLaW5kS2V5cy5pbmNsdWRlcyhgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkgJiYgc2VsZWN0ZWRLaW5kLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VLZXlzID0gc291cmNlUmVsYXRpb25zID8gWy4uLm5ldyBTZXQoc291cmNlUmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV0gOiBbXTtcbiAgICAgICAgY29uc3Qgc291cmNlU291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHNvdXJjZUtleXMuaW5jbHVkZXMoYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZWxhdGlvbnMgPSBbLi4ubmV3IFNldChbLi4udGFyZ2V0UmVsYXRpb25zLCAuLi50YXJnZXRUYXJnZXRSZWxhdGlvbnMsIC4uLnNvdXJjZVNvdXJjZVJlbGF0aW9ucywgLi4ucmVsYXRlZFJlbGF0aW9ucywgLi4uc291cmNlUmVsYXRpb25zXS5tYXAocmVsID0+IEpTT04uc3RyaW5naWZ5KHJlbCkpKV0ubWFwKHJlbFN0cmluZyA9PiBKU09OLnBhcnNlKHJlbFN0cmluZykpO1xuICAgICAgICBzZWxlY3RlZE5vZGUuaGFzUmVsYXRpb25zT2ZTYW1lS2luZHMgPSBkaXN0aW5jdFJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCB8fCByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVsYXRpb25zOiBkaXN0aW5jdFJlbGF0aW9ucyxcbiAgICAgICAgICAgIGhhc1JlbGF0ZWRTb3VyY2VPZk90aGVyS2luZHM6IHJlbGF0ZWRSZWxhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmaWx0ZXJOb2RlcyhyZWxhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25LZXlzID0gcmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICBjb25zdCByZWxhdGlvblNvdXJjZUtleXMgPSByZWxhdGlvbnMuZmxhdE1hcChyZWxhdGlvbiA9PiBgJHtyZWxhdGlvbi5zb3VyY2Uua2luZH06OiR7cmVsYXRpb24uc291cmNlLm5hbWV9YCk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZSkge1xuICAgICAgICAgICAgcmVsYXRpb25Tb3VyY2VLZXlzLnB1c2goYCR7dGhpcy5zZWxlY3RlZE5vZGUua2luZH06OiR7dGhpcy5zZWxlY3RlZE5vZGUubmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXN0aW5jdEtleXMgPSBbLi4ubmV3IFNldChyZWxhdGlvbktleXMuY29uY2F0KHJlbGF0aW9uU291cmNlS2V5cykpXTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZpbHRlcihub2RlID0+IGRpc3RpbmN0S2V5cy5pbmNsdWRlcyhgJHtub2RlLmtpbmR9Ojoke25vZGUubmFtZX1gKSk7XG4gICAgfVxuICAgIHVwZGF0ZVJlbGF0aW9uV2VpZ2h0cyhub2RlcywgcmVsYXRpb25zLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgaWYgKCFyZWxhdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWxhdGlvbldlaWdodHMgPSByZWxhdGlvbnMucmVkdWNlKChhY2MsIHJlbGF0aW9uKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIGFuYWx5dGljcyB9ID0gcmVsYXRpb247XG4gICAgICAgICAgICBpZiAoc291cmNlLmtpbmQgPT09IHRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRpb24uaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc291cmNlS2V5ID0gYHMke3NvdXJjZS5raW5kfToke3NvdXJjZS5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRLZXkgPSBgdCR7dGFyZ2V0LmtpbmR9OiR7dGFyZ2V0Lm5hbWV9YDtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEFuYWx5dGljcztcbiAgICAgICAgICAgIGlmICgoYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmRyaWxsRG93bikgJiYgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRBbmFseXRpY3MgPSBhbmFseXRpY3MuZHJpbGxEb3duLmZpbmQoaXRlbSA9PiBpdGVtLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIGl0ZW0ubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZEFuYWx5dGljcykge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkQW5hbHl0aWNzID0gYW5hbHl0aWNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd2VpZ2h0ID0gc2VsZWN0ZWRBbmFseXRpY3MgJiYgJ3RyYWZmaWMnIGluIHNlbGVjdGVkQW5hbHl0aWNzICYmICgoX2EgPSBzZWxlY3RlZEFuYWx5dGljcy50cmFmZmljKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwKSA+IDBcbiAgICAgICAgICAgICAgICA/IE1hdGgucm91bmQoTWF0aC5sb2cxMChNYXRoLm1heChzZWxlY3RlZEFuYWx5dGljcy50cmFmZmljLCAyKSB8fCAyKSAqICgoX2IgPSB0aGlzLm9wdGlvbnMudHJhZmZpY0xvZzEwRmFjdG9yKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAxMikpXG4gICAgICAgICAgICAgICAgOiAoKF9jID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uRGVmYXVsdFdpZHRoKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAxMCk7XG4gICAgICAgICAgICByZWxhdGlvbi5oZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgICAgICBhY2Nbc291cmNlS2V5XSA9IChhY2Nbc291cmNlS2V5XSB8fCAwKSArIHdlaWdodDtcbiAgICAgICAgICAgIGFjY1t0YXJnZXRLZXldID0gKGFjY1t0YXJnZXRLZXldIHx8IDApICsgd2VpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIG5vZGUuaGVpZ2h0ID0gTWF0aC5tYXgoKF9hID0gcmVsYXRpb25XZWlnaHRzW2BzJHtub2RlLmtpbmR9OiR7bm9kZS5uYW1lfWBdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwLCAoX2IgPSByZWxhdGlvbldlaWdodHNbYHQke25vZGUua2luZH06JHtub2RlLm5hbWV9YF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWVyZ2VEYXRhKG9yaWdpbkRhdGEsIGFwcGVuZERhdGEpIHtcbiAgICAgICAgYXBwZW5kRGF0YS5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBvcmlnaW5EYXRhLm5vZGVzLmZpbmRJbmRleChleGlzdGluZ05vZGUgPT4gZXhpc3RpbmdOb2RlLmtpbmQgPT09IG5vZGUua2luZCAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gbm9kZS5uYW1lKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ05vZGUgPSBvcmlnaW5EYXRhLm5vZGVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlbGF0aW9uc1RvUmVtb3ZlID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTm9kZS5raW5kID09PSByZWxhdGlvbi5zb3VyY2Uua2luZCAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gcmVsYXRpb24uc291cmNlLm5hbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nTm9kZS5raW5kID09PSByZWxhdGlvbi50YXJnZXQua2luZCAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gcmVsYXRpb24udGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm91bmRSZWxhdGlvbnNUb1JlbW92ZS5mb3JFYWNoKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25JbmRleCA9IG9yaWdpbkRhdGEucmVsYXRpb25zLmluZGV4T2YocmVsYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEucmVsYXRpb25zLnNwbGljZShyZWxhdGlvbkluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEubm9kZXNbaW5kZXhdID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcGVuZERhdGEucmVsYXRpb25zLmZvckVhY2gocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdSZWxhdGlvbkluZGV4ID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuZmluZEluZGV4KGV4aXN0aW5nUmVsYXRpb24gPT4gZXhpc3RpbmdSZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gcmVsYXRpb24uc291cmNlLmtpbmQgJiZcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlbGF0aW9uLnNvdXJjZS5uYW1lID09PSByZWxhdGlvbi5zb3VyY2UubmFtZSAmJlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHJlbGF0aW9uLnRhcmdldC5raW5kICYmXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gcmVsYXRpb24udGFyZ2V0Lm5hbWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUmVsYXRpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5EYXRhLnJlbGF0aW9ucy5wdXNoKHJlbGF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvcmlnaW5EYXRhO1xuICAgIH1cbn1cbmV4cG9ydCB7IFNhbmtleUNoYXJ0RGF0YSwgSW5jbHVkZUtpbmQgfTtcbiIsImltcG9ydCB7IEV2ZW50SGFuZGxlciB9IGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5jbGFzcyBTYW5rZXlDaGFydCB7XG4gICAgY29uc3RydWN0b3Ioc3ZnRWxlbWVudCwgY3VzdG9tT3B0aW9ucykge1xuICAgICAgICB0aGlzLlNWR19OUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbiAgICAgICAgdGhpcy5zaG93Q29udGV4dE1lbnUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0TWVudSA9IHRoaXMuY29udGV4dE1lbnVFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHsgbm9kZTogKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRTZWxlY3RlZE5vZGUoKSB9O1xuICAgICAgICAgICAgY29uc3QgbWVudUl0ZW1zID0gKChfYiA9IHRoaXMuY29udGV4dE1lbnVEeW5hbWljTGlua3MpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKHRoaXMsIGNvbnRleHQpKSB8fCBbXTtcbiAgICAgICAgICAgIGlmIChtZW51SXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRNZW51LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIG1lbnVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgZGl2LmNsYXNzTmFtZSA9ICdjb250ZXh0LWl0ZW0nO1xuICAgICAgICAgICAgICAgICAgICBkaXYudGV4dENvbnRlbnQgPSBpdGVtLmxhYmVsO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXVybCcsIGl0ZW0udXJsKTtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnLCBpdGVtLnRhcmdldCB8fCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub3BlblBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TWVudS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZUNvbnRleHRNZW51KTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRNZW51LnN0eWxlLmxlZnQgPSBgJHtldmVudC5jbGllbnRYfXB4OyBjb250ZXh0TWVudSEuc3R5bGUudG9wID0gJHtldmVudC5jbGllbnRZfXB4YDtcbiAgICAgICAgICAgICAgICBjb250ZXh0TWVudS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vcGVuUGFnZSA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEgLSB1cmwnKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhIC0gdGFyZ2V0JykgfHwgJ19zZWxmJztcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1cmwsIHRhcmdldEF0dHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNsb3NlQ29udGV4dE1lbnUgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0TWVudSA9IHRoaXMuY29udGV4dE1lbnVFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGNvbnRleHRNZW51KSB7XG4gICAgICAgICAgICAgICAgY29udGV4dE1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VDb250ZXh0TWVudSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVuZGVyTm9kZXMgPSAobm9kZXMsIHBvc2l0aW9uWCwgc2VsZWN0ZWROb2RlLCBraW5kKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgY29uc3Qgc3ZnR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgICAgIGxldCBvdmVyYWxsWSA9IHRoaXMub3B0aW9ucy50b3BZO1xuICAgICAgICAgICAgKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRLaW5kcztcbiAgICAgICAgICAgIGNvbnN0IHggPSBwb3NpdGlvblggKyAodGhpcy5vcHRpb25zLm5vZGVXaWR0aCAvIDIpO1xuICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMub3B0aW9ucy50b3BZICsgdGhpcy5vcHRpb25zLm1hcmdpblkgKyAodGhpcy5vcHRpb25zLm5vZGVXaWR0aCAvIDIpO1xuICAgICAgICAgICAgbGV0IHgyID0gcG9zaXRpb25YICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIHRoaXMub3B0aW9ucy5ub2RlTWFyZ2luWSAvIDI7XG4gICAgICAgICAgICBjb25zdCB5MiA9IHRoaXMub3B0aW9ucy50b3BZICsgdGhpcy5vcHRpb25zLm1hcmdpblkgKyAodGhpcy5vcHRpb25zLm5vZGVXaWR0aCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJlbmRlcktpbmRBc0NvbHVtcykge1xuICAgICAgICAgICAgICAgIGlmIChraW5kID09PSBudWxsIHx8IGtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGtpbmQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByZWZpeCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2luZC5jb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVDaXJjbGUoeCwgeSwgNSwga2luZC5jb2xvciB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gJ3wgJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gKHgyIC0gMTMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVLaW5kVGl0bGUgPSB0aGlzLmNyZWF0ZVN2Z1RleHQocHJlZml4ICsga2luZC50aXRsZSwgW3RoaXMuY2xhc3NOYW1lLk5PREVfVFlQRV9USVRMRV0pO1xuICAgICAgICAgICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInhcIiwgeDIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVLaW5kVGl0bGUuc2V0QXR0cmlidXRlKFwieVwiLCB5Mi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQobm9kZUtpbmRUaXRsZSk7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJhbGxZICs9IDI1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoX2IgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdldFRpdGxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmNoYXJ0RGF0YS5nZXRUaXRsZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNyZWF0ZUNpcmNsZSh4LCB5LCA1LCAodGl0bGUgPT09IG51bGwgfHwgdGl0bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRpdGxlLmNvbG9yKSB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKGNpcmNsZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVLaW5kVGl0bGUgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoKCh0aXRsZSA9PT0gbnVsbCB8fCB0aXRsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGl0bGUubmFtZSkgfHwgJycpLCBbdGhpcy5jbGFzc05hbWUuTk9ERV9UWVBFX1RJVExFXSk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVLaW5kVGl0bGUuc2V0QXR0cmlidXRlKFwieFwiLCB4Mi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZUtpbmRUaXRsZS5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChub2RlS2luZFRpdGxlKTtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmFsbFkgKz0gMjU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rc0hlaWdodCA9IChfYSA9IG5vZGUuaGVpZ2h0KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IG5vZGUuY2FyZGluYWxpdHkgPyAxMCA6IC0yMDtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1NlbGVjdGVkID0gc2VsZWN0ZWROb2RlICYmIHNlbGVjdGVkTm9kZS5uYW1lID09PSBub2RlLm5hbWUgJiYgc2VsZWN0ZWROb2RlLmtpbmQgPT09IG5vZGUua2luZDtcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0SGVpZ2h0ID0gaGVpZ2h0ICsgTWF0aC5tYXgobGlua3NIZWlnaHQgKyAyICogdGhpcy5vcHRpb25zLm1hcmdpblksIHRoaXMub3B0aW9ucy5ub2RlTWluSGVpZ2h0ICsgKHRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMgPyAwIDogMTApICsgKG5vZGUuc3VidGl0bGUgPyAxMCA6IDApKTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5vcHRpb25zLm1hcmdpblkgKyBvdmVyYWxsWTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IG5vZGUuY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgICAgICAgbGV0IHBvc1ggPSBwb3NpdGlvblg7XG4gICAgICAgICAgICAgICAgbGV0IHJlY3RQb3NpdGlvbldpZHRoID0gdGhpcy5vcHRpb25zLm5vZGVDb2x1bW5XaXRoO1xuICAgICAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlUG9zaXRpb25ZID0geTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzUmVsYXRlZFNvdXJjZU9mU2FtZUtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9IHBvc1ggKyB0aGlzLm9wdGlvbnMucmVsYXRpb24uc2FtZUtpbmRJbmRlbnRhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFBvc2l0aW9uV2lkdGggPSByZWN0UG9zaXRpb25XaWR0aCAtIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zYW1lS2luZEluZGVudGF0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdnJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdEhvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdyZWN0Jyk7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZSgneCcsIHBvc1gudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZSgneScsIHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCByZWN0UG9zaXRpb25XaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCByZWN0SGVpZ2h0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ3J4JywgXCI1XCIpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ3J5JywgXCI1XCIpO1xuICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZSgnZmlsdGVyJywgJ3VybCgjZHJvcHNoYWRvdyknKTtcbiAgICAgICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjBcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncmVjdCcpO1xuICAgICAgICAgICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd4JywgcG9zWC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgneScsIHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5vcHRpb25zLm5vZGVXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgcmVjdEhlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgncngnLCBcIjVcIik7XG4gICAgICAgICAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J5JywgXCI1XCIpO1xuICAgICAgICAgICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdmaWxsJywgY29sb3IpO1xuICAgICAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY3RTaGFkb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3gnLCBTdHJpbmcocG9zWCAtIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3knLCBTdHJpbmcoeSAtIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgU3RyaW5nKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggKyA0KSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBTdHJpbmcocmVjdEhlaWdodCArIDQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3J4JywgXCI2XCIpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgncnknLCBcIjZcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmRyb3BTaGFkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdmaWxsJywgJ2JsYWNrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsdGVyJywgJ3VybCgjZHJvcHNoYWRvdyknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjAuMlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgXCIyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMub3B0aW9ucy5zZWxlY3RlZE5vZGUuYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RTaGFkb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICAgICAgcmVjdEhvdmVyLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RIb3Zlcik7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FyZGluYWxpdHkgPSBub2RlLmNhcmRpbmFsaXR5O1xuICAgICAgICAgICAgICAgIGlmIChjYXJkaW5hbGl0eSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKF9iID0gY2FyZGluYWxpdHkuc291cmNlQ291bnQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VUZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KCctICcgKyBjYXJkaW5hbGl0eS5zb3VyY2VDb3VudCArIChjYXJkaW5hbGl0eS5yZWZzID4gMCA/ICcrJyA6ICcnKSwgW3RoaXMuY2xhc3NOYW1lLkNBUkRJTkFMSVRZLCBpc1NlbGVjdGVkID8gdGhpcy5jbGFzc05hbWUuU0VMRUNURUQgOiAnJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblggLSA2KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyByZWN0SGVpZ2h0IC0gMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoc291cmNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKChfYyA9IGNhcmRpbmFsaXR5LnRhcmdldENvdW50KSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc291cmNlVGV4dCA9IHRoaXMuY3JlYXRlU3ZnVGV4dChjYXJkaW5hbGl0eS50YXJnZXRDb3VudCArICcgLScsIFt0aGlzLmNsYXNzTmFtZS5DQVJESU5BTElUWSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YIC0gMTQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSArIHJlY3RIZWlnaHQgLSAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoc291cmNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuY3JlYXRlU3ZnVGV4dCgnJywgW3RoaXMuY2xhc3NOYW1lLk5PREVfVElUTEUsIGlzU2VsZWN0ZWQgPyB0aGlzLmNsYXNzTmFtZS5TRUxFQ1RFRCA6ICcnXSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblgpKTtcbiAgICAgICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgeS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cnVuY2F0ZWRUaXRsZSA9IHRoaXMudHJ1bmNhdGVOYW1lKG5vZGUudGl0bGUgPyBub2RlLnRpdGxlIDogbm9kZS5uYW1lLCB0aGlzLm9wdGlvbnMubmFtZU1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBbdHJ1bmNhdGVkVGl0bGVdO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChub2RlLnRhZ3Muam9pbignLCAnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbmRlcktpbmRBc0NvbHVtcykge1xuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKG5vZGUua2luZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5vZGUua2luZC5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBoZWFkbGluZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgc3VidGl0bGVMaW5lSW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zdWJ0aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cnVuY2F0ZWRTdWJ0aXRsZSA9IHRoaXMudHJ1bmNhdGVOYW1lKG5vZGUuc3VidGl0bGUsIHRoaXMub3B0aW9ucy5uYW1lTWF4TGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMuc3BsaWNlKDEsIDAsIHRydW5jYXRlZFN1YnRpdGxlKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGxpbmVJbmRleCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHN1YnRpdGxlTGluZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YKSk7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZShcImR5XCIsIFwiMS4yZW1cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuLnRleHRDb250ZW50ID0gbGluZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSBoZWFkbGluZUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0c3Bhbi5jbGFzc0xpc3QuYWRkKFwiaGVhZGxpbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaSA9PT0gc3VidGl0bGVMaW5lSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRzcGFuLmNsYXNzTGlzdC5hZGQoXCJzdWJ0aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRzcGFuLmNsYXNzTGlzdC5hZGQoXCJkZXNjcmlwdGlvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoIShub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGxhY2VIb2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0Tm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKF9iID0gbm9kZSA9PT0gbnVsbCB8fCBub2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZmV0Y2hNb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuZGlzcGF0Y2hFdmVudCgnZmV0Y2hEYXRhJywgeyBub2RlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5kaXNwYXRjaEV2ZW50KCdzZWxlY3Rpb25DaGFuZ2VkJywgeyBub2RlLCBwb3NpdGlvbjogeyB5OiB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSB9IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgdGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ob3Zlck9wYWNpdHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWN0SG92ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmhvdmVyT3BhY2l0eS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RIb3Zlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgXCIwXCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQoZyk7XG4gICAgICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQgJiYgIShub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGxhY2VIb2xkZXIpICYmIHRoaXMuY29udGV4dE1lbnVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyRWxpcHNpc01lbnUocG9zWCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVQb3NpdGlvbnNbbm9kZS5raW5kICsgJzo6JyArIG5vZGUubmFtZV0gPSB7IHg6IHBvc1gsIHksIGluZGV4LCBzb3VyY2VZOiB5ICsgdGhpcy5vcHRpb25zLm1hcmdpblksIHRhcmdldFk6IHksIGg6IHJlY3RIZWlnaHQsIGNvbG9yOiBub2RlLmNvbG9yIH07XG4gICAgICAgICAgICAgICAgb3ZlcmFsbFkgPSBvdmVyYWxsWSArIHJlY3RIZWlnaHQgKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZEhlaWdodCA9IE1hdGgubWF4KHRoaXMuY2FsY3VsYXRlZEhlaWdodCwgb3ZlcmFsbFkgKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblkgKiAyKTtcbiAgICAgICAgICAgIHJldHVybiBzdmdHcm91cDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdmdUZXh0ID0gKHRleHRDb250ZW50LCBjbGFzc05hbWVzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcInRleHRcIik7XG4gICAgICAgICAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcy5maWx0ZXIoY2xhc3NOYW1lID0+IGNsYXNzTmFtZSkpO1xuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVuZGVyUmVsYXRpb25zID0gKHJlbGF0aW9ucywgc2VsZWN0ZWROb2RlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG5hbWUsIGtpbmQsIGNvbG9yIH0gPSBzZWxlY3RlZE5vZGUgfHwge307XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSBjb2xvciB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsTm9kZVBvc2l0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlUG9zaXRpb25zKSk7XG4gICAgICAgICAgICBjb25zdCBnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICAgICAgY29uc3QgZ1BhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc291cmNlUG9zaXRpb24gPSBsb2NhbE5vZGVQb3NpdGlvbnNbbGluay5zb3VyY2Uua2luZCArICc6OicgKyBsaW5rLnNvdXJjZS5uYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGxvY2FsTm9kZVBvc2l0aW9uc1tsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0UG9zaXRpb24gfHwgIXNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGlua0NvbG9yID0gc291cmNlUG9zaXRpb24uY29sb3IgfHwgZGVmYXVsdENvbG9yO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIGhlaWdodCB9ID0gbGluaztcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQxWCA9IHNvdXJjZVBvc2l0aW9uLnggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDFZID0gc291cmNlUG9zaXRpb24uc291cmNlWSArICgoaGVpZ2h0IHx8IDApIC8gMik7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKChoZWlnaHQgfHwgMCkgLyAyKSArIDU7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MlggPSAoc291cmNlUG9zaXRpb24ueCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGggKyB0YXJnZXRQb3NpdGlvbi54KSAvIDI7XG4gICAgICAgICAgICAgICAgbGV0IHBhdGhEO1xuICAgICAgICAgICAgICAgIGxldCBvcGFjaXR5ID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgbGV0IHN0cm9rZVdpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBvcGFjaXR5RW1waGFzaXplU2VsZWN0ZWQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICgobGluay5zb3VyY2Uua2luZCA9PT0ga2luZCAmJiBsaW5rLnNvdXJjZS5uYW1lID09PSBuYW1lKSB8fCAobGluay50YXJnZXQua2luZCA9PT0ga2luZCAmJiBsaW5rLnRhcmdldC5uYW1lID09PSBuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ICs9IHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zZWxlY3RlZE9wYWNpdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZVBvc2l0aW9uLmluZGV4IDwgdGFyZ2V0UG9zaXRpb24uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVggPSBzb3VyY2VQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSBzb3VyY2VQb3NpdGlvbi55ICsgc291cmNlUG9zaXRpb24uaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlggPSB0YXJnZXRQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi55ICsgKHRhcmdldFBvc2l0aW9uLmggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhEID0gYE0ke3BvaW50MVh9LCR7cG9pbnQxWX0gQyR7cG9pbnQxWH0sJHtwb2ludDJZfSAke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDJYfSwke3BvaW50Mll9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlggPSBzb3VyY2VQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSBzb3VyY2VQb3NpdGlvbi55ICsgKHNvdXJjZVBvc2l0aW9uLmggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVggPSB0YXJnZXRQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSB0YXJnZXRQb3NpdGlvbi55ICsgdGFyZ2V0UG9zaXRpb24uaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhEID0gYE0ke3BvaW50MVh9LCR7cG9pbnQxWX0gQyR7cG9pbnQxWH0sJHtwb2ludDJZfSAke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDJYfSwke3BvaW50Mll9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aCA9IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtjb250cm9sUG9pbnQxWH0sJHtjb250cm9sUG9pbnQxWX0gQyR7Y29udHJvbFBvaW50Mlh9LCR7Y29udHJvbFBvaW50MVl9ICR7Y29udHJvbFBvaW50Mlh9LCR7Y29udHJvbFBvaW50Mll9ICR7dGFyZ2V0UG9zaXRpb24ueH0sJHtjb250cm9sUG9pbnQyWX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoRCk7XG4gICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBTdHJpbmcoc3Ryb2tlV2lkdGggfHwgMCkpO1xuICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCBsaW5rQ29sb3IpO1xuICAgICAgICAgICAgICAgIGdQYXRoLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgICAgIGxldCBhbmFseXRpY3M7XG4gICAgICAgICAgICAgICAgaWYgKCgoX2EgPSBsaW5rLmFuYWx5dGljcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmRyaWxsRG93bikgJiYgbGluay5zb3VyY2Uua2luZCAhPSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbmFseXRpY3MpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFuYWx5dGljcyA9IGxpbmsuYW5hbHl0aWNzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1NlbGVjdGVkS2luZCA9IGxpbmsudGFyZ2V0LmtpbmQgPT09IChzZWxlY3RlZE5vZGUgPT09IG51bGwgfHwgc2VsZWN0ZWROb2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZE5vZGUua2luZCkgfHwgbGluay5zb3VyY2Uua2luZCA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChfYiA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KCcnLCBbdGhpcy5jbGFzc05hbWUuUkVMQVRJT05dKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh0YXJnZXRQb3NpdGlvbi54IC0gdGhpcy5vcHRpb25zLm1hcmdpblkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKGhlaWdodCB8fCAwIC8gMikgKyA4KSk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRzcGFuRW52ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcInRzcGFuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0c3BhbkVudi50ZXh0Q29udGVudCA9IChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MuZW52aXJvbm1lbnQpIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuRW52KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MuZW52aXJvbm1lbnQpICYmIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5lbnZpcm9ubWVudFthbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MuZW52aXJvbm1lbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5lbnZpcm9ubWVudFthbmFseXRpY3MuZW52aXJvbm1lbnRdLmRhc2hBcnJheSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKChfYyA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lcnJvcnMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IDAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvclJhdGlvID0gKDEwMCAvICgoX2QgPSBhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogMCkgKiAoKF9lID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVycm9ycykgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0c3BhbkVyci5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwicmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHNwYW5FcnIudGV4dENvbnRlbnQgPSAnICcgKyAoZXJyb3JSYXRpbyA9PSAwID8gXCIoPDAuMDElKVwiIDogJygnICsgZXJyb3JSYXRpby50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnJSknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW5FcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcInRzcGFuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0c3Bhbi50ZXh0Q29udGVudCA9ICcgJyArIChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYy50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIGdUZXh0LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ID0gb3BhY2l0eSArIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5hbmFseXRpY3NPcGFjaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzb3VyY2Uua2luZCAhPSB0YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzb3VyY2VQb3NpdGlvbi5zb3VyY2VZICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi50YXJnZXRZICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsIFN0cmluZyhvcGFjaXR5KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnUGF0aCk7XG4gICAgICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuYXBwZW5kQ2hpbGQoZ1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBub2RlV2lkdGg6IDEwLFxuICAgICAgICAgICAgbm9kZU1pbkhlaWdodDogNjUsXG4gICAgICAgICAgICBtYXJnaW5YOiAxNSxcbiAgICAgICAgICAgIG1hcmdpblk6IDUsXG4gICAgICAgICAgICBsZWZ0WDogMTUsXG4gICAgICAgICAgICB0b3BZOiAxMCxcbiAgICAgICAgICAgIG5vZGVNYXJnaW5ZOiAxMCxcbiAgICAgICAgICAgIG5hbWVNYXhMZW5ndGg6IDUwLFxuICAgICAgICAgICAgbm9kZUNvbHVtbldpdGg6IDMwMCxcbiAgICAgICAgICAgIGRlZmF1bHROb2RlQ29sb3I6IFwiZ3JheVwiLFxuICAgICAgICAgICAgcmVuZGVyS2luZEFzQ29sdW1zOiB0cnVlLFxuICAgICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZE9wYWNpdHk6IDAuMixcbiAgICAgICAgICAgICAgICBhbmFseXRpY3NPcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIG5vblBST0Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNhbWVLaW5kSW5kZW50YXRpb246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlOiB7XG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2NhbGU6IDEuMixcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZjEwMTAnLFxuICAgICAgICAgICAgICAgIGhvdmVyT3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIGhvdmVyQ29sb3I6ICcjMTQxNDE0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVsbGlwc2VDaGFyYWN0ZXI6ICfigKYnLFxuICAgICAgICAgICAgcm9vdENoYXJhY3RlcjogJ+KMgidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKGN1c3RvbU9wdGlvbnMgfHwge30pO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQgPSBzdmdFbGVtZW50O1xuICAgICAgICB0aGlzLm5vZGVQb3NpdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51RHluYW1pY0xpbmtzID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIE5PREVfVFlQRV9USVRMRTogXCJub2RlLWtpbmQtdGl0bGVcIixcbiAgICAgICAgICAgIE5PREVfVElUTEU6IFwibm9kZS10aXRsZVwiLFxuICAgICAgICAgICAgUkVMQVRJT046IFwicmVsYXRpb25cIixcbiAgICAgICAgICAgIENBUkRJTkFMSVRZOiBcImNhcmRpbmFsaXR5XCIsXG4gICAgICAgICAgICBTRUxFQ1RFRDogJ3NlbGVjdGVkJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgIH1cbiAgICBzZXRPcHRpb25zKGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5fZGVlcE1lcmdlKHRoaXMub3B0aW9ucywgY3VzdG9tT3B0aW9ucyk7XG4gICAgfVxuICAgIHNldERhdGEoY2hhcnREYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0RGF0YSAhPT0gY2hhcnREYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJ0RGF0YSA9IGNoYXJ0RGF0YTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5kaXNwYXRjaEV2ZW50KCdzZWxlY3Rpb25DaGFuZ2VkJywgeyBub2RlOiB0aGlzLmNoYXJ0RGF0YS5nZXRTZWxlY3RlZE5vZGUoKSwgcG9zaXRpb246IHsgeTogMCB9IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0RGF0YTtcbiAgICB9XG4gICAgYWRkU2VsZWN0aW9uQ2hhbmdlZExpc3RlbmVycyhjYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5zdWJzY3JpYmUoJ3NlbGVjdGlvbkNoYW5nZWQnLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICAgICAgICAgIGNhbGxiYWNrRnVuY3Rpb24oeyBub2RlOiAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFNlbGVjdGVkTm9kZSgpLCBwb3NpdGlvbjogeyB5OiAwIH0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkQ29udGV4dE1lbnVMaXN0ZW5lcnMoY29udGV4dE1lbnVFbGVtZW50LCBjYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudUVsZW1lbnQgPSBjb250ZXh0TWVudUVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51RHluYW1pY0xpbmtzID0gY2FsbGJhY2tGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGRGZXRjaERhdGFMaXN0ZW5lcnMoY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLnN1YnNjcmliZSgnZmV0Y2hEYXRhJywgY2FsbGJhY2tGdW5jdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ1bmNhdGVOYW1lKG5hbWUsIG1heExlbmd0aCkge1xuICAgICAgICBpZiAobmFtZSAmJiAobmFtZSA9PT0gbnVsbCB8fCBuYW1lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuYW1lLmxlbmd0aCkgPiBtYXhMZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lLnN1YnN0cmluZygwLCBtYXhMZW5ndGggLSAzKSArIHRoaXMub3B0aW9ucy5lbGxpcHNlQ2hhcmFjdGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lIHx8ICcnO1xuICAgIH1cbiAgICByZXNldFN2ZygpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVkSGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50LmlubmVySFRNTCA9IGBcbiAgICAgIDxkZWZzPlxuICAgICAgICA8ZmlsdGVyIGlkPVwiZHJvcHNoYWRvd1wiPlxuICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249XCIwLjRcIiAvPlxuICAgICAgICA8L2ZpbHRlcj5cbiAgICAgIDwvZGVmcz5cbiAgICBgO1xuICAgIH1cbiAgICB1cGRhdGVIZWlnaHQoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3Qgd2lkdGggPSAodGhpcy5vcHRpb25zLm5vZGVDb2x1bW5XaXRoICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCkgKiBNYXRoLm1heCgxLCAoKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRLaW5kcygpLmxlbmd0aCkgfHwgMCkgKyAodGhpcy5vcHRpb25zLm1hcmdpblggKiAyKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5jYWxjdWxhdGVkSGVpZ2h0LnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICByZW5kZXJFbGlwc2lzTWVudSh4LCB5KSB7XG4gICAgICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2cnKTtcbiAgICAgICAgbWVudS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2VsbGlwc2lzTWVudScpO1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnY3Vyc29yOiBwb2ludGVyOycpO1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3ggKyAyLjV9LCAke3l9KWApO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93Q29udGV4dE1lbnUpO1xuICAgICAgICBjb25zdCByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdyZWN0Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd4JywgJy0yLjUnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLm9wdGlvbnMubm9kZVdpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIyJyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeCcsICc1Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeScsICc1Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdmaWxsJywgJ2JsYWNrJyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAuMicpO1xuICAgICAgICBtZW51LmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICBmb3IgKGxldCBpeSA9IDU7IGl5IDw9IDE1OyBpeSArPSA1KSB7XG4gICAgICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNyZWF0ZUNpcmNsZSgyLjUsIGl5LCAyLCBcIndoaXRlXCIpO1xuICAgICAgICAgICAgbWVudS5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZW51O1xuICAgIH1cbiAgICBjcmVhdGVDaXJjbGUoY3gsIGN5LCByLCBmaWxsKSB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgY3gudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N5JywgY3kudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3InLCByLnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgZmlsbCk7XG4gICAgICAgIHJldHVybiBjaXJjbGU7XG4gICAgfVxuICAgIF9kZWVwTWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnIHx8IHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0JyB8fCBzb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc291cmNlKSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XS5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNvdXJjZVtrZXldID09PSAnb2JqZWN0JyAmJiBzb3VyY2Vba2V5XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVlcE1lcmdlKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRTZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgdGhpcy5yZXNldFN2ZygpO1xuICAgICAgICBsZXQgY29sdW1uID0gMDtcbiAgICAgICAgY29uc3QgY29sdW1uV2lkdGggPSB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpdGggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoO1xuICAgICAgICBjb25zdCBraW5kcyA9IChfYiA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZ2V0S2luZHMoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVQb3NpdGlvblkgPSAtMTtcbiAgICAgICAgY29uc3Qgc3ZnTm9kZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgaWYgKGtpbmRzICYmIGtpbmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGtpbmRzLmZvckVhY2goa2luZCA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICBzdmdOb2Rlcy5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlck5vZGVzKChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0Tm9kZXNCeUtpbmQoa2luZC5uYW1lKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10sIHRoaXMub3B0aW9ucy5sZWZ0WCArIGNvbHVtbldpZHRoICogY29sdW1uKyssIHNlbGVjdGVkTm9kZSwga2luZCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdmdOb2Rlcy5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlck5vZGVzKChfZCA9IChfYyA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZ2V0Tm9kZXMoKSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogW10sIHRoaXMub3B0aW9ucy5sZWZ0WCArIDApKTtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHRoaXMucmVuZGVyUmVsYXRpb25zKChfZSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuZ2V0UmVsYXRpb25zKCksIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChzdmdOb2Rlcyk7XG4gICAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KCk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2Fua2V5Q2hhcnQ7XG5leHBvcnQgeyBTYW5rZXlDaGFydCB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBTYW5rZXlDaGFydERhdGEgfSBmcm9tICcuL3NhbmtleS1jaGFydC1kYXRhJztcbmltcG9ydCBTYW5rZXlDaGFydCBmcm9tICcuL3NhbmtleS1jaGFydCc7XG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgfSBmcm9tICcuL2V2ZW50LWhhbmRsZXInO1xuZXhwb3J0IHsgU2Fua2V5Q2hhcnREYXRhLCBJbmNsdWRlS2luZCB9IGZyb20gJy4vc2Fua2V5LWNoYXJ0LWRhdGEnO1xuZXhwb3J0IHsgRXZlbnRIYW5kbGVyIH07XG5leHBvcnQgeyBTYW5rZXlDaGFydCB9O1xud2luZG93LlNhbmtleUNoYXJ0ID0gU2Fua2V5Q2hhcnQ7XG53aW5kb3cuU2Fua2V5Q2hhcnREYXRhID0gU2Fua2V5Q2hhcnREYXRhO1xud2luZG93LkV2ZW50SGFuZGxlciA9IEV2ZW50SGFuZGxlcjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==