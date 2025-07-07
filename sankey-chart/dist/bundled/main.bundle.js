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

/***/ "./src/minimap.ts":
/*!************************!*\
  !*** ./src/minimap.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Minimap: () => (/* binding */ Minimap)
/* harmony export */ });
class Minimap {
    constructor(chartElement, containerElement, mainViewElement) {
        this.mainViewHeight = 0;
        this.mainViewWidth = 0;
        this.mainViewScrollWidth = 0;
        this.mainViewScrollHeight = 0;
        this.scaleUnitY = 1;
        this.scaleUnitX = 1;
        this.drag = (event) => {
            const minimapRect = this.minimapPane.getBoundingClientRect();
            const lenseRect = this.visibleSection.getBoundingClientRect();
            let newX = event.clientX - minimapRect.left - lenseRect.width / 2;
            let newY = event.clientY - minimapRect.top - lenseRect.height / 2;
            newX = Math.max(0, Math.min(newX, minimapRect.width - lenseRect.width));
            newY = Math.max(0, Math.min(newY, minimapRect.height - lenseRect.height));
            const minimapHeight = this.minimapPane.scrollHeight > this.minimapPane.clientHeight ? minimapRect.height : this.miniMapSVG.getBoundingClientRect().height;
            const scrollPosYInPercentage = newY / (minimapHeight - lenseRect.height);
            const scrollPosXInPercentage = newX / (minimapRect.width - lenseRect.width);
            this.mainView.scrollTop = scrollPosYInPercentage * (this.mainViewScrollHeight - this.mainViewHeight);
            this.mainView.scrollLeft = scrollPosXInPercentage * (this.mainViewScrollWidth - this.mainViewWidth);
        };
        this.endDrag = () => {
            document.removeEventListener('mousemove', this.drag);
            document.removeEventListener('mouseup', this.endDrag);
        };
        this.mainView = mainViewElement;
        this.container = containerElement;
        this.visibleSection = this.createVisibleSection();
        this.miniMapSVG = this.createMiniMapSVG(chartElement.id);
        this.miniMapSVG.appendChild(this.visibleSection);
        this.minimapPane = this.createMinimapPane();
        this.minimapPane.appendChild(this.miniMapSVG);
        this.container.appendChild(this.minimapPane);
        this.mainView.addEventListener('scroll', this.syncScroll.bind(this));
        this.visibleSection.addEventListener('mousedown', this.startDrag.bind(this));
        const resizeObserver = new ResizeObserver(() => {
            this.initialize();
        });
        resizeObserver.observe(this.container);
        resizeObserver.observe(this.mainView);
    }
    initialize() {
        this.mainViewHeight = this.mainView.clientHeight;
        this.mainViewWidth = this.mainView.clientWidth;
        this.mainViewScrollWidth = this.mainView.scrollWidth;
        this.mainViewScrollHeight = this.mainView.scrollHeight;
        this.visibleSection.setAttribute('width', this.mainViewWidth.toString());
        this.visibleSection.setAttribute('height', this.mainViewHeight.toString());
        this.miniMapSVG.setAttribute('viewBox', `0 0 ${this.mainViewScrollWidth} ${this.mainViewScrollHeight}`);
        this.mainView.scrollTop = 0;
        this.mainView.scrollLeft = 0;
        this.visibleSection.setAttribute('width', this.mainViewWidth.toString());
        this.visibleSection.setAttribute('height', this.mainViewHeight.toString());
        this.scaleUnitY = this.mainViewHeight === this.mainViewScrollHeight ? 1 : -1 / (this.mainViewHeight - this.mainViewScrollHeight);
        this.scaleUnitX = this.mainViewWidth === this.mainViewScrollWidth ? 1 : -1 / (this.mainViewWidth - this.mainViewScrollWidth);
        this.minimapPane.style.minHeight = `${this.mainViewHeight}px`;
        this.minimapPane.style.display = 'block';
        const minimapHeight = Math.min(this.minimapPane.clientHeight, this.mainViewHeight);
        this.minimapPane.style.minHeight = `${minimapHeight}px`;
        if (this.mainViewHeight === this.mainViewScrollHeight && this.mainViewWidth === this.mainViewScrollWidth) {
            this.minimapPane.style.display = 'none';
        }
        this.syncScroll();
    }
    createMiniMapSVG(svgHref) {
        const previewSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        previewSVG.setAttribute('class', 'preview-svg');
        const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        useElement.setAttribute('href', `#${svgHref}`);
        useElement.setAttribute('pointer-events', 'none');
        previewSVG.appendChild(useElement);
        previewSVG.style.position = 'absolute';
        previewSVG.style.top = '0';
        previewSVG.style.left = '0';
        previewSVG.style.width = '100%';
        previewSVG.style.height = 'auto';
        return previewSVG;
    }
    createMinimapPane() {
        const minimapPane = document.createElement('div');
        minimapPane.className = 'minimap-pane';
        minimapPane.style.overflow = 'hidden';
        minimapPane.style.position = 'absolute';
        minimapPane.style.right = '0';
        minimapPane.style.top = '0';
        return minimapPane;
    }
    createVisibleSection() {
        const visibleSection = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        visibleSection.setAttribute('class', 'minimap-visible-section');
        visibleSection.setAttribute('x', '0');
        visibleSection.setAttribute('y', '0');
        return visibleSection;
    }
    syncScroll() {
        const scrollPosYInPercentage = this.scaleUnitY * this.mainView.scrollTop;
        const scrollPosXInPercentage = this.scaleUnitX * this.mainView.scrollLeft;
        this.minimapPane.scrollTop = (this.minimapPane.scrollHeight - this.minimapPane.clientHeight) * scrollPosYInPercentage;
        this.minimapPane.scrollLeft = (this.minimapPane.scrollWidth - this.minimapPane.clientWidth) * scrollPosXInPercentage;
        const overlayY = (this.mainViewScrollHeight - this.mainViewHeight) * scrollPosYInPercentage;
        const overlayX = (this.mainViewScrollWidth - this.mainViewWidth) * scrollPosXInPercentage;
        this.visibleSection.setAttribute('y', overlayY.toString());
        this.visibleSection.setAttribute('x', overlayX.toString());
    }
    startDrag(event) {
        event.preventDefault();
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.endDrag);
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
    constructor(data, options, partialData = false) {
        this.getNodeTagColor = (node) => {
            const color = node.tags ? node.tags.map(tag => { var _a; return (_a = this.options.tagColorMap) === null || _a === void 0 ? void 0 : _a[tag]; }).find(color => color !== undefined) : this.options.defaultColor;
            return node.color || color;
        };
        this.selectedNode = undefined;
        this.nodes = [];
        this.dependencies = { relations: [], hasRelatedSourceOfOtherKinds: false };
        this.originalData = { name: data.name, color: data.color, nodes: (data.nodes || []).map(node => (Object.assign({}, node))), relations: data.relations || [] };
        this.allNodesLoaded = !partialData;
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
    }
    resetColors() {
        if (this.options.tagColorMap) {
            const tags = Object.keys(this.options.tagColorMap);
            this.nodes.forEach(node => {
                const hasSome = tags.some(tag => { var _a; return (_a = node.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); });
                if (hasSome || node['color'] === this.options.defaultColor) {
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
            return dataByKinds;
        };
        if (!node) {
            this.nodes = this.originalData.nodes;
            this.dependencies.relations = this.originalData.relations || [];
            this.nodesByKinds = groupByKind(this.nodes);
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
                }
            }
            else {
                this.nodes = [];
            }
            this.nodesByKinds = groupByKind(this.nodes);
        }
        this.sortNodes();
        return this.selectedNode;
    }
    sortNodesAlpabetically(nodes) {
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
    sortNodes() {
        const selectedNode = this.getSelectedNode();
        if (!selectedNode) {
            this.sortNodesAlpabetically(this.getNodes());
            return;
        }
        let previousKinds = [];
        const startIndex = this.options.kinds.findIndex(k => k.name === (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind));
        for (let index = startIndex; index < this.options.kinds.length; index++) {
            const kind = this.options.kinds[index];
            const currentKinds = this.nodesByKinds[kind.name];
            if (currentKinds) {
                this.sortNodesOfKind(kind, currentKinds, previousKinds, selectedNode);
                previousKinds = currentKinds;
            }
        }
        const kind = this.options.kinds[startIndex];
        previousKinds = this.nodesByKinds[kind.name];
        for (let index = startIndex - 1; index >= 0; index--) {
            const kind = this.options.kinds[index];
            const currentKinds = this.nodesByKinds[kind.name];
            if (currentKinds) {
                this.sortNodesOfKind(kind, currentKinds, previousKinds, selectedNode);
                previousKinds = currentKinds;
            }
        }
        this.sortRelations();
    }
    sortNodesOfKind(kind, nodes, previousKinds, selectedNode) {
        if (kind.name === (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.kind)) {
            const relations = this.getRelations();
            const relatedOfSameKindNodes = relations.filter(rel => rel.source.name === selectedNode.name && rel.source.kind === kind.name && rel.target.kind === kind.name).map(rel => rel.target.name);
            const dependenciesOfSameKindNodes = relations.filter(rel => rel.target.name === selectedNode.name && rel.target.kind === kind.name && rel.source.kind === kind.name).map(rel => rel.source.name);
            nodes.sort((a, b) => {
                const group = (node) => {
                    if (dependenciesOfSameKindNodes.length > 0) {
                        if (dependenciesOfSameKindNodes.includes(node.name))
                            return 1;
                        if (node.name === selectedNode.name)
                            return 2;
                    }
                    else {
                        if (node.name === selectedNode.name)
                            return 1;
                        if (relatedOfSameKindNodes.includes(node.name))
                            return 2;
                    }
                    return 3;
                };
                const groupA = group(a);
                const groupB = group(b);
                if (groupA !== groupB)
                    return groupA - groupB;
                return a.name.localeCompare(b.name);
            });
        }
        else {
            const relations = this.getRelations();
            nodes.sort((a, b) => {
                const aPrevousNodes = relations.filter(rel => rel.target.name === a.name && rel.target.kind === a.kind);
                const bPrevousNodes = relations.filter(rel => rel.target.name === b.name && rel.target.kind === b.kind);
                const aIndex = previousKinds.findIndex(item => aPrevousNodes.some(rel => rel.source.name === item.name));
                const bIndex = previousKinds.findIndex(item => bPrevousNodes.some(rel => rel.source.name === item.name));
                if (aIndex !== -1 || bIndex !== -1) {
                    if (aIndex === bIndex) {
                        return a.name.localeCompare(b.name);
                    }
                    return bIndex > aIndex ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
        }
    }
    ;
    sortRelations() {
        const combinedNodes = {};
        const shift = 100000;
        Object.keys(this.nodesByKinds).forEach(kind => {
            let i = shift;
            this.nodesByKinds[kind].forEach(node => {
                combinedNodes[kind + '::' + node.name] = (i++);
            });
        });
        const relations = this.getRelations();
        relations === null || relations === void 0 ? void 0 : relations.sort((a, b) => {
            var _a, _b, _c, _d;
            const aSourceKey = `${a.source.kind}::${a.source.name}`;
            const bSourceKey = `${b.source.kind}::${b.source.name}`;
            const aTargetKey = `${a.target.kind}::${a.target.name}`;
            const bTargetKey = `${b.target.kind}::${b.target.name}`;
            const aSourceIndex = (_a = combinedNodes[aSourceKey]) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
            const bSourceIndex = (_b = combinedNodes[bSourceKey]) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
            const aTargetIndex = (_c = combinedNodes[aTargetKey]) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
            const bTargetIndex = (_d = combinedNodes[bTargetKey]) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
            const aIndex = aSourceIndex * shift + aTargetIndex;
            const bIndex = bSourceIndex * shift + bTargetIndex;
            return aIndex - bIndex;
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
                summary[key] = { sourceCount: 0, targetCount: 0, sameKindCount: 0 };
            }
            if (link.source.kind === link.target.kind) {
                summary[key].sameKindCount++;
            }
            else {
                summary[key].sourceCount++;
            }
            const targetKey = link.target.kind + '::' + link.target.name;
            if (!summary[targetKey]) {
                summary[targetKey] = { sourceCount: 0, targetCount: 0, sameKindCount: 0 };
            }
            summary[targetKey].targetCount++;
        });
        this.originalData.nodes.forEach((node) => {
            var _a;
            const cardinality = summary[node.kind + '::' + node.name];
            node.color = this.getNodeTagColor(node);
            node.cardinality = cardinality;
            if (node.targetCount) {
                node.cardinality = { targetCount: node.targetCount, sameKindCount: 0 };
            }
            if (node.sourceCount) {
                node.cardinality = Object.assign((_a = node.cardinality) !== null && _a !== void 0 ? _a : {}, { sourceCount: node.sourceCount, sameKindCount: 0 });
            }
        });
    }
    searchByName(node) {
        if (!node.kind || !node.name) {
            throw new Error('Filter criteria is empty');
        }
        return this.originalData.nodes.filter(item => item.kind === node.kind && item.name.includes(node.name));
    }
    filterDependencies(selectedNode, selectedKind) {
        let relatedRelations = [];
        const kindNames = this.options.kinds.map(k => k.name);
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
        const targetTargetRelations = this.targetTargetRelations(selectedNode.kind, kindNames, targetKeys);
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
    targetTargetRelations(kind, kindNames, targetKeys) {
        if (this.options.showSameKindsOnNonSelected) {
            return this.originalData.relations.filter(relation => {
                return (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true) && targetKeys.includes(relation.source.kind + '::' + relation.source.name);
            });
        }
        return this.originalData.relations.filter(relation => {
            return ((relation.target.kind === relation.source.kind) ? relation.source.kind === kind : true) && (kindNames.length > 0 ? kindNames.includes(relation.target.kind) : true) && targetKeys.includes(relation.source.kind + '::' + relation.source.name);
        });
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
        this.svgElement = svgElement;
        this.className = {
            NODE_TYPE_TITLE: "node-kind-title",
            NODE_TITLE: "node-title",
            RELATION: "relation",
            CARDINALITY: "cardinality",
            SELECTED: 'selected'
        };
        this.options = {
            nodeWidth: 10,
            nodeLineHeight: 18,
            marginX: 15,
            marginY: 5,
            leftX: 15,
            topY: 10,
            nodeMarginY: 10,
            nodeColumnWidth: 300,
            defaultNodeColor: "gray",
            renderKindAsColums: true,
            trafficLog10Factor: 12,
            relationDefaultWidth: 15,
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
                borderColor: '#ff1010',
                hoverOpacity: 0.2
            },
            truncateText: {
                defaultFontSizeAndFamily: '16px Arial',
                ellipseCharacter: '…'
            },
            rootCharacter: '⌂'
        };
        if (customOptions) {
            this.setOptions(customOptions);
        }
        this.calculatedHeight = 0;
        this.nodePositions = {};
        this.eventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__.EventHandler();
        this.contextMenuCallbackFunction = undefined;
        this.selectedNodePositionY = -1;
        this.truncateText = this.createTruncateText();
        this.initCss();
    }
    setOptions(customOptions) {
        customOptions.nodeColumnWidth = Number(customOptions.nodeColumnWidth || this.options.nodeColumnWidth);
        this.options = this.deepMerge(this.options, customOptions);
        this.render();
    }
    setData(chartData) {
        if (this.chartData !== chartData) {
            this.chartData = chartData;
            this.render();
            this.eventHandler.dispatchEvent('selectionChanged', { node: this.chartData.getSelectedNode(), position: { y: 0 } });
        }
    }
    addSelectionChangedListeners(callbackFunction) {
        var _a;
        if (typeof callbackFunction === 'function') {
            this.eventHandler.subscribe('selectionChanged', callbackFunction);
            callbackFunction({ node: (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode(), position: { y: 0 } });
        }
    }
    addContextMenuListeners(callbackFunction) {
        if (typeof callbackFunction === 'function') {
            this.contextMenuCallbackFunction = callbackFunction;
        }
    }
    getDirectTargetNodesOf(selectedNode) {
        var _a, _b;
        return (_b = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getRelations().filter((relation) => relation.source.kind === selectedNode.kind &&
            relation.source.name === selectedNode.name).map(relation => relation.target)) !== null && _b !== void 0 ? _b : [];
    }
    initCss() {
        const styleId = "svg-style";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent =
                ` .svg-copy-icon { opacity: 0; transition: opacity 0.5s; }
        g:hover > .svg-copy-icon { opacity: 1; }
        .unselectable {user-select: none; -webkit-user-select: none;}`;
            document.head.insertBefore(style, document.head.firstChild);
        }
    }
    getDirectSourceNodesOf(selectedNode) {
        var _a, _b;
        return (_b = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getRelations().filter((relation) => relation.target.kind === selectedNode.kind &&
            relation.target.name === selectedNode.name).map(relation => relation.source)) !== null && _b !== void 0 ? _b : [];
    }
    createTruncateText() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const cache = new Map();
        const ellipseChar = this.options.truncateText.ellipseCharacter;
        const fontSizeAndFamily = this.options.truncateText.defaultFontSizeAndFamily;
        return function truncateText(text, maxWidth, font = fontSizeAndFamily) {
            const cacheKey = `${text}-${maxWidth}-${font}`;
            if (cache.has(cacheKey)) {
                return cache.get(cacheKey);
            }
            if (!context) {
                return text;
            }
            context.font = font;
            if (context.measureText(text).width <= maxWidth) {
                cache.set(cacheKey, text);
                return text;
            }
            let truncatedText = text;
            while (context.measureText(truncatedText + ellipseChar).width > maxWidth) {
                truncatedText = truncatedText.slice(0, -1);
            }
            const result = truncatedText + ellipseChar;
            cache.set(cacheKey, result);
            return result;
        };
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
        var _a, _b, _c;
        const width = (((_a = this.options.nodeColumnWidth) !== null && _a !== void 0 ? _a : 0) + ((_b = this.options.nodeWidth) !== null && _b !== void 0 ? _b : 0)) * Math.max(1, ((_c = this.chartData) === null || _c === void 0 ? void 0 : _c.getKinds().length) || 0) + (this.options.marginX * 2);
        this.svgElement.setAttribute('height', this.calculatedHeight.toString());
        this.svgElement.setAttribute('width', width.toString());
    }
    renderElipsisMenu(x, y, selectedNode) {
        const menuGroup = document.createElementNS(this.SVG_NS, "g");
        menuGroup.setAttribute('id', 'ellipsisMenu');
        menuGroup.setAttribute('style', 'cursor: pointer;');
        menuGroup.setAttribute('transform', `translate(${x + 2.5}, ${y})`);
        const rect = this.createRect(-2.5, 0, this.options.nodeWidth, 22, 'black', '0.2');
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        menuGroup.appendChild(rect);
        for (let iy = 5; iy <= 15; iy += 5) {
            const circle = this.createCircle(2.5, iy, 2, "white");
            menuGroup.appendChild(circle);
        }
        menuGroup.addEventListener('click', (event) => {
            if (this.contextMenuCallbackFunction) {
                this.contextMenuCallbackFunction(event, selectedNode);
                event.stopPropagation();
            }
        });
        return menuGroup;
    }
    deepMerge(target, source) {
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
                this.deepMerge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
        return target;
    }
    renderNodes(nodes, positionX, selectedNode, kind, directTargetNodes, directSourceNodes) {
        var _a, _b, _c, _d;
        const svgGroup = document.createElementNS(this.SVG_NS, "g");
        let overallY = this.options.topY;
        if (this.options.renderKindAsColums) {
            const title = (kind === null || kind === void 0 ? void 0 : kind.title) || ((_b = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getTitle()) === null || _b === void 0 ? void 0 : _b.name);
            const color = (kind === null || kind === void 0 ? void 0 : kind.color) || ((_d = (_c = this.chartData) === null || _c === void 0 ? void 0 : _c.getTitle()) === null || _d === void 0 ? void 0 : _d.color) || this.options.defaultNodeColor;
            const x = positionX + (this.options.nodeWidth / 2);
            const y = this.options.topY + this.options.marginY + (this.options.nodeWidth / 2);
            let x2 = positionX + this.options.nodeWidth + this.options.nodeMarginY / 2;
            const y2 = this.options.topY + this.options.marginY + (this.options.nodeWidth);
            let prefix = '';
            if (kind === null || kind === void 0 ? void 0 : kind.color) {
                const circle = this.createCircle(x, y, 5, color);
                svgGroup.appendChild(circle);
            }
            else {
                prefix = '| ';
                x2 -= 13;
            }
            const nodeKindTitle = this.createSvgText(prefix + title, [this.className.NODE_TYPE_TITLE]);
            nodeKindTitle.setAttribute("x", x2.toString());
            nodeKindTitle.setAttribute("y", y2.toString());
            svgGroup.appendChild(nodeKindTitle);
            overallY += 25;
        }
        nodes.forEach((node, index) => {
            var _a;
            const nodeKey = node.kind + '::' + node.name;
            const nodePos = this.nodePositions[nodeKey];
            const sourceRelations = nodePos.sourceRelations;
            const targetRelations = nodePos.targetRelations;
            const linesCount = 1 + (node.subtitle ? 1 : 0) + (((_a = node.tags) === null || _a === void 0 ? void 0 : _a.length) ? 1 : 0) + (this.options.renderKindAsColums ? 0 : 1);
            const linesHeight = linesCount * this.options.nodeLineHeight + this.options.marginY;
            const rectHeight = 2 * this.options.marginY + Math.max(linesHeight, linesHeight + (sourceRelations.height > 0 ? sourceRelations.height + 12 : 0), (targetRelations.height > 0 ? targetRelations.height + 12 : 0));
            const y = this.options.marginY + overallY;
            let posX = positionX;
            let rectPositionWidth = this.options.nodeColumnWidth;
            if (node.hasRelatedSourceOfSameKind) {
                posX += this.options.relation.sameKindIndentation;
                rectPositionWidth -= this.options.relation.sameKindIndentation;
            }
            Object.assign(nodePos, {
                x: posX,
                y,
                height: rectHeight,
                textLinesHeight: linesHeight,
                sourceY: y + this.options.marginY,
                targetY: y
            });
            overallY += rectHeight + this.options.nodeMarginY;
        });
        this.calculatedHeight = Math.max(this.calculatedHeight, overallY + this.options.nodeMarginY * 2);
        nodes.forEach(node => {
            const nodePos = this.nodePositions[node.kind + '::' + node.name];
            const isSelected = selectedNode && selectedNode.name === node.name && selectedNode.kind === node.kind ? true : false;
            const posX = nodePos.x;
            const y = nodePos.y;
            const rectHeight = nodePos.height;
            const rectPositionWidth = this.options.nodeColumnWidth - (node.hasRelatedSourceOfSameKind ? this.options.relation.sameKindIndentation : 0);
            const color = node.color || this.options.defaultNodeColor;
            const g = document.createElementNS(this.SVG_NS, 'g');
            const rectHover = this.createRect(posX, y, rectPositionWidth, rectHeight, color, '0');
            const rect = this.createRect(posX, y, this.options.nodeWidth, rectHeight, color);
            if (isSelected) {
                this.selectedNodePositionY = y;
                const rectShadow = this.createRect(posX - 2, y - 2, this.options.nodeWidth + 4, rectHeight + 4, 'none');
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
            g.appendChild(rect);
            rectHover.style.cursor = 'pointer';
            g.appendChild(rectHover);
            if (node.cardinality || node.targetCount || node.sourceCount) {
                const isDirectTargetNodes = (directTargetNodes === null || directTargetNodes === void 0 ? void 0 : directTargetNodes.find(directNode => node.name === directNode.name && node.kind === directNode.kind)) ? true : false;
                const isDirectSourceNodes = (directSourceNodes === null || directSourceNodes === void 0 ? void 0 : directSourceNodes.find(directNode => node.name === directNode.name && node.kind === directNode.kind)) ? true : false;
                this.appendCardinalityText(g, node, posX, y, rectHeight, color, isSelected, isDirectTargetNodes, isDirectSourceNodes);
            }
            const text = this.createSvgText('', [this.className.NODE_TITLE, isSelected ? this.className.SELECTED : '']);
            text.setAttribute("x", String(posX + this.options.marginX));
            text.setAttribute("y", y.toString());
            text.setAttribute("cursor", "pointer");
            text.classList.add('unselectable');
            const lines = this.createTextLines(node, this.options.nodeColumnWidth - this.options.nodeWidth);
            lines.forEach((line, i) => {
                const tspan = document.createElementNS(this.SVG_NS, "tspan");
                tspan.setAttribute("x", String(posX + this.options.marginX));
                tspan.setAttribute("dy", "1.2em");
                tspan.textContent = line.text;
                tspan.classList.add(line.class);
                text.appendChild(tspan);
            });
            g.appendChild(text);
            const copyIcon = this.createCopyIcon(posX, rectPositionWidth, y, lines[0].text);
            g.appendChild(copyIcon);
            if (!(node === null || node === void 0 ? void 0 : node.placeHolder)) {
                this.addHoverAndClickEvents(g, rectHover, node);
            }
            svgGroup.appendChild(g);
            if (isSelected && !(node === null || node === void 0 ? void 0 : node.placeHolder) && this.contextMenuCallbackFunction) {
                svgGroup.appendChild(this.renderElipsisMenu(posX, y, node));
            }
        });
        return svgGroup;
    }
    createCopyIcon(posX, rectPositionWidth, y, copyText) {
        const copyIcon = document.createElementNS("http://www.w3.org/2000/svg", "text");
        copyIcon.setAttribute("x", String(posX + rectPositionWidth - this.options.marginX));
        copyIcon.setAttribute("y", String(y + this.options.marginX));
        copyIcon.style.cursor = "pointer";
        copyIcon.textContent = "⧉";
        copyIcon.setAttribute("class", "svg-copy-icon");
        copyIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            navigator.clipboard.writeText(copyText).then(() => {
                copyIcon.textContent = "✓";
                setTimeout(() => (copyIcon.textContent = "⧉"), 1000);
            });
        });
        return copyIcon;
    }
    createCircle(cx, cy, r, fill) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx.toString());
        circle.setAttribute('cy', cy.toString());
        circle.setAttribute('r', r.toString());
        circle.setAttribute('fill', fill);
        return circle;
    }
    createRect(x, y, width, height, fill, opacity = "1") {
        const rect = document.createElementNS(this.SVG_NS, 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', width.toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('fill', fill);
        rect.setAttribute("opacity", opacity);
        return rect;
    }
    appendCardinalityText(g, node, posX, y, rectHeight, color, isSelected, isDirectRelatedToSelected, isDirectSourceNodes) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if ((_b = (_a = node.cardinality) === null || _a === void 0 ? void 0 : _a.sourceCount) !== null && _b !== void 0 ? _b : 0 > 0) {
            const allNodesLoaded = ((_c = this.chartData) === null || _c === void 0 ? void 0 : _c.allNodesLoaded) || isSelected || isDirectRelatedToSelected;
            const cardinalityText = ((_d = node.cardinality) === null || _d === void 0 ? void 0 : _d.sourceCount) + (allNodesLoaded ? '' : '..*') + (((_f = (_e = node.cardinality) === null || _e === void 0 ? void 0 : _e.sameKindCount) !== null && _f !== void 0 ? _f : 0) > 0 ? '+' + ((_h = (_g = node.cardinality) === null || _g === void 0 ? void 0 : _g.sameKindCount) !== null && _h !== void 0 ? _h : 0) : '');
            const sourceText = this.createSvgText('- ' + cardinalityText, [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
            sourceText.setAttribute("x", String(posX + this.options.marginX - 6));
            sourceText.setAttribute("y", String(y + rectHeight - 2));
            sourceText.setAttribute("fill", color);
            g.appendChild(sourceText);
        }
        if ((_k = (_j = node.cardinality) === null || _j === void 0 ? void 0 : _j.targetCount) !== null && _k !== void 0 ? _k : 0 > 0) {
            const allNodesLoaded = ((_l = this.chartData) === null || _l === void 0 ? void 0 : _l.allNodesLoaded) || isSelected || isDirectSourceNodes;
            const cardinalityText = ((_m = node.cardinality) === null || _m === void 0 ? void 0 : _m.targetCount) + (allNodesLoaded ? '' : '..*');
            const targetText = this.createSvgText(cardinalityText + ' -', [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
            targetText.setAttribute("x", String(posX + this.options.marginX - 14));
            targetText.setAttribute("y", String(y + rectHeight - 2));
            targetText.setAttribute("fill", color);
            targetText.setAttribute("text-anchor", "end");
            g.appendChild(targetText);
        }
    }
    createTextLines(node, maxTextWidth) {
        const truncatedTitle = this.truncateText ? this.truncateText(node.title ? node.title : node.name, maxTextWidth) : (node.title ? node.title : node.name);
        const lines = [{ text: truncatedTitle, class: "headline" }];
        if (node.subtitle) {
            const truncatedSubtitle = this.truncateText ? this.truncateText(node.subtitle, maxTextWidth) : node.subtitle;
            lines.splice(1, 0, { text: truncatedSubtitle, class: "subtitle" });
        }
        if (node.tags) {
            const truncateTags = this.truncateText ? this.truncateText(node.tags.join(', '), maxTextWidth) : node.tags.join(', ');
            lines.push({ text: truncateTags, class: "description" });
        }
        if (!this.options.renderKindAsColums) {
            lines.push({ text: node.kind.charAt(0).toUpperCase() + node.kind.slice(1), class: "description" });
        }
        return lines;
    }
    addHoverAndClickEvents(group, rectHover, node) {
        group.addEventListener('click', (event) => {
            var _a;
            (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.selectNode(node);
            this.render();
            this.eventHandler.dispatchEvent('selectionChanged', { node, position: { y: this.selectedNodePositionY } });
        });
        group.addEventListener('mouseenter', (event) => {
            rectHover.setAttribute("opacity", this.options.selectedNode.hoverOpacity.toString());
        });
        group.addEventListener('mouseleave', (event) => {
            rectHover.setAttribute("opacity", "0");
        });
    }
    createSvgText(textContent, classNames) {
        const text = document.createElementNS(this.SVG_NS, "text");
        text.classList.add(...classNames.filter(className => className));
        text.textContent = textContent;
        return text;
    }
    renderRelations(relations, selectedNode) {
        const { name, kind } = selectedNode || {};
        const localNodePositions = JSON.parse(JSON.stringify(this.nodePositions));
        const gText = document.createElementNS(this.SVG_NS, "g");
        const gPath = document.createElementNS(this.SVG_NS, "g");
        relations === null || relations === void 0 ? void 0 : relations.forEach((link) => {
            var _a, _b, _c, _d, _e, _f;
            const sourcePosition = localNodePositions[link.source.kind + '::' + link.source.name];
            const targetPosition = localNodePositions[link.target.kind + '::' + link.target.name];
            if (!targetPosition || !sourcePosition) {
                return;
            }
            const sameKind = link.source.kind === link.target.kind;
            const linkColor = sameKind ? targetPosition.color : sourcePosition.color;
            const selectedSource = sameKind ? 0 : this.calculateGap(sourcePosition.sourceIndex++);
            const firstTextLinesHeigth = (_a = sourcePosition.textLinesHeight) !== null && _a !== void 0 ? _a : 0;
            if (firstTextLinesHeigth > 0) {
                sourcePosition.textLinesHeight = 0;
            }
            sourcePosition.accumulatedSourceY += firstTextLinesHeigth + selectedSource;
            const selectedTarget = sameKind ? 0 : this.calculateGap(targetPosition.targetIndex++);
            targetPosition.accumulatedTargetY = ((_b = targetPosition.accumulatedTargetY) !== null && _b !== void 0 ? _b : 0) + selectedTarget;
            const { source, target, height } = link;
            const controlPoint1X = sourcePosition.x + this.options.nodeWidth;
            const controlPoint1Y = sourcePosition.sourceY + ((height || 0) / 2) + sourcePosition.accumulatedSourceY;
            const controlPoint2Y = this.options.marginY + targetPosition.targetY + ((height || 0) / 2) + targetPosition.accumulatedTargetY;
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
                    const point1Y = sourcePosition.y + sourcePosition.height;
                    const point2X = targetPosition.x + (this.options.nodeWidth / 2);
                    const point2Y = targetPosition.y + (targetPosition.height / 2);
                    pathD = `M${point1X},${point1Y} C${point1X},${point2Y} ${point1X},${point2Y} ${point2X},${point2Y}`;
                }
                else {
                    const point2X = sourcePosition.x + (this.options.nodeWidth / 2);
                    const point2Y = sourcePosition.y + (sourcePosition.height / 2);
                    const point1X = targetPosition.x + (this.options.nodeWidth / 2);
                    const point1Y = targetPosition.y + targetPosition.height;
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
            if ((_c = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _c !== void 0 ? _c : 0 > 0) {
                const text = this.createSvgText('', [this.className.RELATION]);
                text.setAttribute("x", String(targetPosition.x - this.options.marginY));
                text.setAttribute("y", String(targetPosition.targetY + (height || 0 / 2) + selectedTarget));
                text.setAttribute("text-anchor", "end");
                const tspanEnv = document.createElementNS(this.SVG_NS, "tspan");
                tspanEnv.textContent = (analytics === null || analytics === void 0 ? void 0 : analytics.environment) || '';
                text.appendChild(tspanEnv);
                if ((analytics === null || analytics === void 0 ? void 0 : analytics.environment) && this.options.relation.environment[analytics === null || analytics === void 0 ? void 0 : analytics.environment]) {
                    path.setAttribute('stroke-dasharray', this.options.relation.environment[analytics.environment].dashArray);
                }
                if ((_d = analytics === null || analytics === void 0 ? void 0 : analytics.errors) !== null && _d !== void 0 ? _d : 0 > 0) {
                    const errorRatio = (100 / ((_e = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _e !== void 0 ? _e : 0) * ((_f = analytics === null || analytics === void 0 ? void 0 : analytics.errors) !== null && _f !== void 0 ? _f : 0));
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
            sourcePosition.sourceY += height !== null && height !== void 0 ? height : 0;
            targetPosition.targetY += height !== null && height !== void 0 ? height : 0;
            path.setAttribute('opacity', String(opacity));
        });
        this.svgElement.appendChild(gPath);
        this.svgElement.appendChild(gText);
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!this.chartData) {
            return;
        }
        const selectedNode = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode();
        this.resetSvg();
        this.nodePositions = {};
        const nodes = (_c = (_b = this.chartData) === null || _b === void 0 ? void 0 : _b.getNodes()) !== null && _c !== void 0 ? _c : [];
        nodes.forEach((node, index) => {
            const nodeKey = node.kind + '::' + node.name;
            this.nodePositions[nodeKey] = {
                color: node.color || this.options.defaultNodeColor,
                index,
                sourceRelations: { height: 0, count: 0 },
                targetRelations: { height: 0, count: 0 },
                x: 0,
                y: 0,
                height: 0,
                textLinesHeight: 0,
                sourceY: 0,
                targetY: 0,
                sourceIndex: 0,
                targetIndex: 0,
                accumulatedSourceY: 0,
                accumulatedTargetY: 0
            };
        });
        this.updateRelationWeights((_e = (_d = this.chartData) === null || _d === void 0 ? void 0 : _d.getRelations()) !== null && _e !== void 0 ? _e : []);
        let column = 0;
        const columnWidth = this.options.nodeColumnWidth + this.options.nodeWidth;
        const kinds = (_f = this.chartData) === null || _f === void 0 ? void 0 : _f.getKinds();
        this.selectedNodePositionY = -1;
        const svgNodes = document.createElementNS(this.SVG_NS, "g");
        if (kinds && kinds.length > 0) {
            const directTargetNodes = selectedNode ? this.getDirectTargetNodesOf(selectedNode) : [];
            const directSourceNodes = selectedNode ? this.getDirectSourceNodesOf(selectedNode) : [];
            kinds.forEach(kind => {
                var _a, _b;
                svgNodes.appendChild(this.renderNodes((_b = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getNodesByKind(kind.name)) !== null && _b !== void 0 ? _b : [], this.options.leftX + columnWidth * column++, selectedNode, kind, directTargetNodes, directSourceNodes));
            });
        }
        else {
            svgNodes.appendChild(this.renderNodes(nodes, this.options.leftX + 0));
        }
        ;
        this.renderRelations((_g = this.chartData) === null || _g === void 0 ? void 0 : _g.getRelations(), selectedNode);
        this.svgElement.appendChild(svgNodes);
        this.updateHeight();
    }
    updateRelationWeights(relations) {
        if (!relations) {
            return;
        }
        relations.forEach((relation) => {
            var _a, _b;
            const { source, target, analytics } = relation;
            if (source.kind === target.kind) {
                return;
            }
            const weight = (analytics === null || analytics === void 0 ? void 0 : analytics.traffic) && analytics.traffic > 0
                ? Math.round(Math.log10(Math.max(analytics.traffic, 2)) * ((_a = this.options.trafficLog10Factor) !== null && _a !== void 0 ? _a : 12))
                : ((_b = this.options.relationDefaultWidth) !== null && _b !== void 0 ? _b : 10);
            relation.height = weight;
            const sourceKey = source.kind + '::' + source.name;
            if (this.nodePositions[sourceKey]) {
                const pos = this.nodePositions[sourceKey];
                pos.sourceRelations.height += weight + this.calculateGap(pos.sourceRelations.count);
                pos.sourceRelations.count += 1;
            }
            const targetKey = target.kind + '::' + target.name;
            if (this.nodePositions[targetKey]) {
                const pos = this.nodePositions[targetKey];
                pos.targetRelations.height += weight + this.calculateGap(pos.targetRelations.count);
                pos.targetRelations.count += 1;
            }
        });
    }
    calculateGap(iterations) {
        return Math.min(80, iterations * 3);
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
/* harmony export */   Minimap: () => (/* reexport safe */ _minimap__WEBPACK_IMPORTED_MODULE_3__.Minimap),
/* harmony export */   SankeyChart: () => (/* reexport safe */ _sankey_chart__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   SankeyChartData: () => (/* reexport safe */ _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__.SankeyChartData)
/* harmony export */ });
/* harmony import */ var _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sankey-chart-data */ "./src/sankey-chart-data.ts");
/* harmony import */ var _sankey_chart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sankey-chart */ "./src/sankey-chart.ts");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event-handler */ "./src/event-handler.ts");
/* harmony import */ var _minimap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./minimap */ "./src/minimap.ts");








window.SankeyChart = _sankey_chart__WEBPACK_IMPORTED_MODULE_1__["default"];
window.SankeyChartData = _sankey_chart_data__WEBPACK_IMPORTED_MODULE_0__.SankeyChartData;
window.EventHandler = _event_handler__WEBPACK_IMPORTED_MODULE_2__.EventHandler;
window.MiniMap = _minimap__WEBPACK_IMPORTED_MODULE_3__.Minimap;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pELHlEQUF5RCxRQUFRLElBQUksRUFBRTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixVQUFVO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsV0FBVyxFQUFDO0FBQ0o7Ozs7Ozs7VUN0a0J2QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05zRDtBQUNiO0FBQ007QUFDWDtBQUMrQjtBQUMzQztBQUNEO0FBQ0o7QUFDbkIscUJBQXFCLHFEQUFXO0FBQ2hDLHlCQUF5QiwrREFBZTtBQUN4QyxzQkFBc0Isd0RBQVk7QUFDbEMsaUJBQWlCLDZDQUFPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL2V2ZW50LWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvbWluaW1hcC50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9zYW5rZXktY2hhcnQtZGF0YS50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9zYW5rZXktY2hhcnQudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJWSUlTYW5rZXlDaGFydFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJWSUlTYW5rZXlDaGFydFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJjbGFzcyBFdmVudEhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgc3Vic2NyaWJlKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KGV2ZW50LCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgKF9hID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZShldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBkaXNwYXRjaEV2ZW50KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudExpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCkuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgZXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCB7IEV2ZW50SGFuZGxlciB9O1xuIiwiY2xhc3MgTWluaW1hcCB7XG4gICAgY29uc3RydWN0b3IoY2hhcnRFbGVtZW50LCBjb250YWluZXJFbGVtZW50LCBtYWluVmlld0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5tYWluVmlld0hlaWdodCA9IDA7XG4gICAgICAgIHRoaXMubWFpblZpZXdXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnNjYWxlVW5pdFkgPSAxO1xuICAgICAgICB0aGlzLnNjYWxlVW5pdFggPSAxO1xuICAgICAgICB0aGlzLmRyYWcgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1pbmltYXBSZWN0ID0gdGhpcy5taW5pbWFwUGFuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGxlbnNlUmVjdCA9IHRoaXMudmlzaWJsZVNlY3Rpb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBsZXQgbmV3WCA9IGV2ZW50LmNsaWVudFggLSBtaW5pbWFwUmVjdC5sZWZ0IC0gbGVuc2VSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgIGxldCBuZXdZID0gZXZlbnQuY2xpZW50WSAtIG1pbmltYXBSZWN0LnRvcCAtIGxlbnNlUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgbmV3WCA9IE1hdGgubWF4KDAsIE1hdGgubWluKG5ld1gsIG1pbmltYXBSZWN0LndpZHRoIC0gbGVuc2VSZWN0LndpZHRoKSk7XG4gICAgICAgICAgICBuZXdZID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obmV3WSwgbWluaW1hcFJlY3QuaGVpZ2h0IC0gbGVuc2VSZWN0LmhlaWdodCkpO1xuICAgICAgICAgICAgY29uc3QgbWluaW1hcEhlaWdodCA9IHRoaXMubWluaW1hcFBhbmUuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5taW5pbWFwUGFuZS5jbGllbnRIZWlnaHQgPyBtaW5pbWFwUmVjdC5oZWlnaHQgOiB0aGlzLm1pbmlNYXBTVkcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWUluUGVyY2VudGFnZSA9IG5ld1kgLyAobWluaW1hcEhlaWdodCAtIGxlbnNlUmVjdC5oZWlnaHQpO1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWEluUGVyY2VudGFnZSA9IG5ld1ggLyAobWluaW1hcFJlY3Qud2lkdGggLSBsZW5zZVJlY3Qud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxUb3AgPSBzY3JvbGxQb3NZSW5QZXJjZW50YWdlICogKHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgLSB0aGlzLm1haW5WaWV3SGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2Nyb2xsTGVmdCA9IHNjcm9sbFBvc1hJblBlcmNlbnRhZ2UgKiAodGhpcy5tYWluVmlld1Njcm9sbFdpZHRoIC0gdGhpcy5tYWluVmlld1dpZHRoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbmREcmFnID0gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5kcmFnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZERyYWcpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1haW5WaWV3ID0gbWFpblZpZXdFbGVtZW50O1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24gPSB0aGlzLmNyZWF0ZVZpc2libGVTZWN0aW9uKCk7XG4gICAgICAgIHRoaXMubWluaU1hcFNWRyA9IHRoaXMuY3JlYXRlTWluaU1hcFNWRyhjaGFydEVsZW1lbnQuaWQpO1xuICAgICAgICB0aGlzLm1pbmlNYXBTVkcuYXBwZW5kQ2hpbGQodGhpcy52aXNpYmxlU2VjdGlvbik7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUgPSB0aGlzLmNyZWF0ZU1pbmltYXBQYW5lKCk7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuYXBwZW5kQ2hpbGQodGhpcy5taW5pTWFwU1ZHKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5taW5pbWFwUGFuZSk7XG4gICAgICAgIHRoaXMubWFpblZpZXcuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zeW5jU2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuc3RhcnREcmFnLmJpbmQodGhpcykpO1xuICAgICAgICBjb25zdCByZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUodGhpcy5jb250YWluZXIpO1xuICAgICAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMubWFpblZpZXcpO1xuICAgIH1cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLm1haW5WaWV3SGVpZ2h0ID0gdGhpcy5tYWluVmlldy5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHRoaXMubWFpblZpZXdXaWR0aCA9IHRoaXMubWFpblZpZXcuY2xpZW50V2lkdGg7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCA9IHRoaXMubWFpblZpZXcuc2Nyb2xsV2lkdGg7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgPSB0aGlzLm1haW5WaWV3LnNjcm9sbEhlaWdodDtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5tYWluVmlld1dpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5tYWluVmlld0hlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5taW5pTWFwU1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHt0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGh9ICR7dGhpcy5tYWluVmlld1Njcm9sbEhlaWdodH1gKTtcbiAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxUb3AgPSAwO1xuICAgICAgICB0aGlzLm1haW5WaWV3LnNjcm9sbExlZnQgPSAwO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLm1haW5WaWV3V2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLm1haW5WaWV3SGVpZ2h0LnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnNjYWxlVW5pdFkgPSB0aGlzLm1haW5WaWV3SGVpZ2h0ID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ID8gMSA6IC0xIC8gKHRoaXMubWFpblZpZXdIZWlnaHQgLSB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5zY2FsZVVuaXRYID0gdGhpcy5tYWluVmlld1dpZHRoID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggPyAxIDogLTEgLyAodGhpcy5tYWluVmlld1dpZHRoIC0gdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoKTtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zdHlsZS5taW5IZWlnaHQgPSBgJHt0aGlzLm1haW5WaWV3SGVpZ2h0fXB4YDtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgY29uc3QgbWluaW1hcEhlaWdodCA9IE1hdGgubWluKHRoaXMubWluaW1hcFBhbmUuY2xpZW50SGVpZ2h0LCB0aGlzLm1haW5WaWV3SGVpZ2h0KTtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zdHlsZS5taW5IZWlnaHQgPSBgJHttaW5pbWFwSGVpZ2h0fXB4YDtcbiAgICAgICAgaWYgKHRoaXMubWFpblZpZXdIZWlnaHQgPT09IHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgJiYgdGhpcy5tYWluVmlld1dpZHRoID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN5bmNTY3JvbGwoKTtcbiAgICB9XG4gICAgY3JlYXRlTWluaU1hcFNWRyhzdmdIcmVmKSB7XG4gICAgICAgIGNvbnN0IHByZXZpZXdTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgICAgICBwcmV2aWV3U1ZHLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncHJldmlldy1zdmcnKTtcbiAgICAgICAgY29uc3QgdXNlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAndXNlJyk7XG4gICAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgYCMke3N2Z0hyZWZ9YCk7XG4gICAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgICAgIHByZXZpZXdTVkcuYXBwZW5kQ2hpbGQodXNlRWxlbWVudCk7XG4gICAgICAgIHByZXZpZXdTVkcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLnRvcCA9ICcwJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgICAgcmV0dXJuIHByZXZpZXdTVkc7XG4gICAgfVxuICAgIGNyZWF0ZU1pbmltYXBQYW5lKCkge1xuICAgICAgICBjb25zdCBtaW5pbWFwUGFuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtaW5pbWFwUGFuZS5jbGFzc05hbWUgPSAnbWluaW1hcC1wYW5lJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBtaW5pbWFwUGFuZS5zdHlsZS5yaWdodCA9ICcwJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUudG9wID0gJzAnO1xuICAgICAgICByZXR1cm4gbWluaW1hcFBhbmU7XG4gICAgfVxuICAgIGNyZWF0ZVZpc2libGVTZWN0aW9uKCkge1xuICAgICAgICBjb25zdCB2aXNpYmxlU2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncmVjdCcpO1xuICAgICAgICB2aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21pbmltYXAtdmlzaWJsZS1zZWN0aW9uJyk7XG4gICAgICAgIHZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgICAgIHZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgICAgIHJldHVybiB2aXNpYmxlU2VjdGlvbjtcbiAgICB9XG4gICAgc3luY1Njcm9sbCgpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWUluUGVyY2VudGFnZSA9IHRoaXMuc2NhbGVVbml0WSAqIHRoaXMubWFpblZpZXcuc2Nyb2xsVG9wO1xuICAgICAgICBjb25zdCBzY3JvbGxQb3NYSW5QZXJjZW50YWdlID0gdGhpcy5zY2FsZVVuaXRYICogdGhpcy5tYWluVmlldy5zY3JvbGxMZWZ0O1xuICAgICAgICB0aGlzLm1pbmltYXBQYW5lLnNjcm9sbFRvcCA9ICh0aGlzLm1pbmltYXBQYW5lLnNjcm9sbEhlaWdodCAtIHRoaXMubWluaW1hcFBhbmUuY2xpZW50SGVpZ2h0KSAqIHNjcm9sbFBvc1lJblBlcmNlbnRhZ2U7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc2Nyb2xsTGVmdCA9ICh0aGlzLm1pbmltYXBQYW5lLnNjcm9sbFdpZHRoIC0gdGhpcy5taW5pbWFwUGFuZS5jbGllbnRXaWR0aCkgKiBzY3JvbGxQb3NYSW5QZXJjZW50YWdlO1xuICAgICAgICBjb25zdCBvdmVybGF5WSA9ICh0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0IC0gdGhpcy5tYWluVmlld0hlaWdodCkgKiBzY3JvbGxQb3NZSW5QZXJjZW50YWdlO1xuICAgICAgICBjb25zdCBvdmVybGF5WCA9ICh0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggLSB0aGlzLm1haW5WaWV3V2lkdGgpICogc2Nyb2xsUG9zWEluUGVyY2VudGFnZTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3knLCBvdmVybGF5WS50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3gnLCBvdmVybGF5WC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhcnREcmFnKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuZHJhZyk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZERyYWcpO1xuICAgIH1cbn1cbmV4cG9ydCB7IE1pbmltYXAgfTtcbiIsInZhciBJbmNsdWRlS2luZDtcbihmdW5jdGlvbiAoSW5jbHVkZUtpbmQpIHtcbiAgICBJbmNsdWRlS2luZFtcIldJVEhfU0FNRV9UQVJHRVRcIl0gPSBcIldJVEhfU0FNRV9UQVJHRVRcIjtcbn0pKEluY2x1ZGVLaW5kIHx8IChJbmNsdWRlS2luZCA9IHt9KSk7XG5jbGFzcyBTYW5rZXlDaGFydERhdGEge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMsIHBhcnRpYWxEYXRhID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5nZXROb2RlVGFnQ29sb3IgPSAobm9kZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBub2RlLnRhZ3MgPyBub2RlLnRhZ3MubWFwKHRhZyA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW3RhZ107IH0pLmZpbmQoY29sb3IgPT4gY29sb3IgIT09IHVuZGVmaW5lZCkgOiB0aGlzLm9wdGlvbnMuZGVmYXVsdENvbG9yO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuY29sb3IgfHwgY29sb3I7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0geyByZWxhdGlvbnM6IFtdLCBoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLm9yaWdpbmFsRGF0YSA9IHsgbmFtZTogZGF0YS5uYW1lLCBjb2xvcjogZGF0YS5jb2xvciwgbm9kZXM6IChkYXRhLm5vZGVzIHx8IFtdKS5tYXAobm9kZSA9PiAoT2JqZWN0LmFzc2lnbih7fSwgbm9kZSkpKSwgcmVsYXRpb25zOiBkYXRhLnJlbGF0aW9ucyB8fCBbXSB9O1xuICAgICAgICB0aGlzLmFsbE5vZGVzTG9hZGVkID0gIXBhcnRpYWxEYXRhO1xuICAgICAgICB0aGlzLm5vZGVzQnlLaW5kcyA9IHt9O1xuICAgICAgICB0aGlzLnRpdGxlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBub1RhZzogJ090aGVycycsXG4gICAgICAgICAgICBub1RhZ1N1ZmZpeENoYXJhY3RlcjogJ+KApicsXG4gICAgICAgICAgICByZWxhdGlvbkRlZmF1bHRXaWR0aDogMTUsXG4gICAgICAgICAgICBkZWZhdWx0Q29sb3I6IFwib3JhbmdlXCIsXG4gICAgICAgICAgICB0YWdDb2xvck1hcDoge30sXG4gICAgICAgICAgICBraW5kczogW10sXG4gICAgICAgICAgICBzaG93UmVsYXRlZEtpbmRzOiBmYWxzZSxcbiAgICAgICAgICAgIHNlbGVjdEFuZEZpbHRlcjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNvcnRSZWxhdGlvbnMoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVsYXRpb25zSW5mbygpO1xuICAgIH1cbiAgICByZXNldENvbG9ycygpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCk7XG4gICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzU29tZSA9IHRhZ3Muc29tZSh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBub2RlLnRhZ3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyh0YWcpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzU29tZSB8fCBub2RlWydjb2xvciddID09PSB0aGlzLm9wdGlvbnMuZGVmYXVsdENvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlWydjb2xvciddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4gZGVsZXRlIG5vZGVbJ2NvbG9yJ10pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlc2V0Q29sb3JzKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzTm9kZSA9IHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShwcmV2aW91c05vZGUpO1xuICAgIH1cbiAgICBhcHBlbmREYXRhKGRhdGEsIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5tZXJnZURhdGEodGhpcy5vcmlnaW5hbERhdGEsIGRhdGEpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKHNlbGVjdGVkTm9kZSk7XG4gICAgfVxuICAgIGdldE5vZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlcyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0Tm9kZXNCeUtpbmQoa2luZCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgfVxuICAgIGdldFJlbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0S2luZHMoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkS2luZHMgPSBPYmplY3Qua2V5cyh0aGlzLm5vZGVzQnlLaW5kcyk7XG4gICAgICAgIGlmICgoKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5sZW5ndGgpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5raW5kcy5maWx0ZXIoa2luZCA9PiBmaWx0ZXJlZEtpbmRzLmluY2x1ZGVzKGtpbmQubmFtZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZEtpbmRzLm1hcChraW5kID0+ICh7IG5hbWU6IGtpbmQgfSkpO1xuICAgIH1cbiAgICBnZXRUaXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGU7XG4gICAgfVxuICAgIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZSA/IHsgdGl0bGU6IHRpdGxlLnRpdGxlLCBuYW1lOiB0aXRsZS5uYW1lLCBjb2xvcjogdGl0bGUuY29sb3IgfSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0U2VsZWN0ZWROb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZE5vZGU7XG4gICAgfVxuICAgIHNlbGVjdE5vZGUobm9kZSkge1xuICAgICAgICBjb25zdCBncm91cEJ5S2luZCA9IChub2RlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUJ5S2luZHMgPSB7fTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhQnlLaW5kc1tub2RlLmtpbmRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW25vZGUua2luZF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YUJ5S2luZHNbbm9kZS5raW5kXS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUJ5S2luZHM7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzO1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFub2RlLmtpbmQgfHwgIW5vZGUubmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIG11c3QgaGF2ZSBraW5kIGFuZCBuYW1lJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgJiYgbm9kZS5uYW1lID09PSB0aGlzLnNlbGVjdGVkTm9kZS5uYW1lICYmIG5vZGUua2luZCA9PT0gdGhpcy5zZWxlY3RlZE5vZGUua2luZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBub2RlLm5hbWUgJiYgaXRlbS5raW5kID09PSBub2RlLmtpbmQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRLaW5kID0gdGhpcy5vcHRpb25zLmtpbmRzLmZpbmQoa2luZCA9PiB7IHZhciBfYTsgcmV0dXJuIGtpbmQubmFtZSA9PT0gKChfYSA9IHRoaXMuc2VsZWN0ZWROb2RlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZCk7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEtpbmQgPT09IG51bGwgfHwgc2VsZWN0ZWRLaW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEtpbmQuaW5jbHVkZUFsdGVybmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RBbmRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UmVsYXRlZEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHRoaXMuZmlsdGVyRGVwZW5kZW5jaWVzKHRoaXMuc2VsZWN0ZWROb2RlLCBzZWxlY3RlZEtpbmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZpbHRlckRlcGVuZGVuY2llcyh0aGlzLnNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMuZmlsdGVyTm9kZXModGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNSZWxhdGVkU291cmNlT2ZTYW1lS2luZCA9IHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBub2RlLmtpbmQgJiYgcmVsYXRpb24udGFyZ2V0Lm5hbWUgPT09IG5vZGUubmFtZSAmJiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gbm9kZS5raW5kKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvcnROb2RlcygpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZE5vZGU7XG4gICAgfVxuICAgIHNvcnROb2Rlc0FscGFiZXRpY2FsbHkobm9kZXMpIHtcbiAgICAgICAgY29uc3QgdW5kZWZpbmVkVGFnID0gKHRoaXMub3B0aW9ucy5ub1RhZyB8fCAnJykgKyB0aGlzLm9wdGlvbnMubm9UYWdTdWZmaXhDaGFyYWN0ZXI7XG4gICAgICAgIG5vZGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLm5hbWUgPT09IHVuZGVmaW5lZFRhZyAmJiBiLm5hbWUgIT09IHVuZGVmaW5lZFRhZykge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYS5uYW1lICE9PSB1bmRlZmluZWRUYWcgJiYgYi5uYW1lID09PSB1bmRlZmluZWRUYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnROb2RlcygpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlID0gdGhpcy5nZXRTZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydE5vZGVzQWxwYWJldGljYWxseSh0aGlzLmdldE5vZGVzKCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcmV2aW91c0tpbmRzID0gW107XG4gICAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLm9wdGlvbnMua2luZHMuZmluZEluZGV4KGsgPT4gay5uYW1lID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpKTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4OyBpbmRleCA8IHRoaXMub3B0aW9ucy5raW5kcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGtpbmQgPSB0aGlzLm9wdGlvbnMua2luZHNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEtpbmRzID0gdGhpcy5ub2Rlc0J5S2luZHNba2luZC5uYW1lXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50S2luZHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvcnROb2Rlc09mS2luZChraW5kLCBjdXJyZW50S2luZHMsIHByZXZpb3VzS2luZHMsIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNLaW5kcyA9IGN1cnJlbnRLaW5kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBraW5kID0gdGhpcy5vcHRpb25zLmtpbmRzW3N0YXJ0SW5kZXhdO1xuICAgICAgICBwcmV2aW91c0tpbmRzID0gdGhpcy5ub2Rlc0J5S2luZHNba2luZC5uYW1lXTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4IC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgY29uc3Qga2luZCA9IHRoaXMub3B0aW9ucy5raW5kc1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50S2luZHMgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRLaW5kcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydE5vZGVzT2ZLaW5kKGtpbmQsIGN1cnJlbnRLaW5kcywgcHJldmlvdXNLaW5kcywgc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0tpbmRzID0gY3VycmVudEtpbmRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc29ydFJlbGF0aW9ucygpO1xuICAgIH1cbiAgICBzb3J0Tm9kZXNPZktpbmQoa2luZCwgbm9kZXMsIHByZXZpb3VzS2luZHMsIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICBpZiAoa2luZC5uYW1lID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnMgPSB0aGlzLmdldFJlbGF0aW9ucygpO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZE9mU2FtZUtpbmROb2RlcyA9IHJlbGF0aW9ucy5maWx0ZXIocmVsID0+IHJlbC5zb3VyY2UubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgJiYgcmVsLnNvdXJjZS5raW5kID09PSBraW5kLm5hbWUgJiYgcmVsLnRhcmdldC5raW5kID09PSBraW5kLm5hbWUpLm1hcChyZWwgPT4gcmVsLnRhcmdldC5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY2llc09mU2FtZUtpbmROb2RlcyA9IHJlbGF0aW9ucy5maWx0ZXIocmVsID0+IHJlbC50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgJiYgcmVsLnRhcmdldC5raW5kID09PSBraW5kLm5hbWUgJiYgcmVsLnNvdXJjZS5raW5kID09PSBraW5kLm5hbWUpLm1hcChyZWwgPT4gcmVsLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgICAgIG5vZGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cCA9IChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXBlbmRlbmNpZXNPZlNhbWVLaW5kTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVuY2llc09mU2FtZUtpbmROb2Rlcy5pbmNsdWRlcyhub2RlLm5hbWUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2ZTYW1lS2luZE5vZGVzLmluY2x1ZGVzKG5vZGUubmFtZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cEEgPSBncm91cChhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cEIgPSBncm91cChiKTtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBBICE9PSBncm91cEIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBncm91cEEgLSBncm91cEI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9ucyA9IHRoaXMuZ2V0UmVsYXRpb25zKCk7XG4gICAgICAgICAgICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYVByZXZvdXNOb2RlcyA9IHJlbGF0aW9ucy5maWx0ZXIocmVsID0+IHJlbC50YXJnZXQubmFtZSA9PT0gYS5uYW1lICYmIHJlbC50YXJnZXQua2luZCA9PT0gYS5raW5kKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiUHJldm91c05vZGVzID0gcmVsYXRpb25zLmZpbHRlcihyZWwgPT4gcmVsLnRhcmdldC5uYW1lID09PSBiLm5hbWUgJiYgcmVsLnRhcmdldC5raW5kID09PSBiLmtpbmQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFJbmRleCA9IHByZXZpb3VzS2luZHMuZmluZEluZGV4KGl0ZW0gPT4gYVByZXZvdXNOb2Rlcy5zb21lKHJlbCA9PiByZWwuc291cmNlLm5hbWUgPT09IGl0ZW0ubmFtZSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJJbmRleCA9IHByZXZpb3VzS2luZHMuZmluZEluZGV4KGl0ZW0gPT4gYlByZXZvdXNOb2Rlcy5zb21lKHJlbCA9PiByZWwuc291cmNlLm5hbWUgPT09IGl0ZW0ubmFtZSkpO1xuICAgICAgICAgICAgICAgIGlmIChhSW5kZXggIT09IC0xIHx8IGJJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFJbmRleCA9PT0gYkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYkluZGV4ID4gYUluZGV4ID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIDtcbiAgICBzb3J0UmVsYXRpb25zKCkge1xuICAgICAgICBjb25zdCBjb21iaW5lZE5vZGVzID0ge307XG4gICAgICAgIGNvbnN0IHNoaWZ0ID0gMTAwMDAwO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm5vZGVzQnlLaW5kcykuZm9yRWFjaChraW5kID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gc2hpZnQ7XG4gICAgICAgICAgICB0aGlzLm5vZGVzQnlLaW5kc1traW5kXS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbWJpbmVkTm9kZXNba2luZCArICc6OicgKyBub2RlLm5hbWVdID0gKGkrKyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9ucyA9IHRoaXMuZ2V0UmVsYXRpb25zKCk7XG4gICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgICAgICBjb25zdCBhU291cmNlS2V5ID0gYCR7YS5zb3VyY2Uua2luZH06OiR7YS5zb3VyY2UubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgYlNvdXJjZUtleSA9IGAke2Iuc291cmNlLmtpbmR9Ojoke2Iuc291cmNlLm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IGFUYXJnZXRLZXkgPSBgJHthLnRhcmdldC5raW5kfTo6JHthLnRhcmdldC5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCBiVGFyZ2V0S2V5ID0gYCR7Yi50YXJnZXQua2luZH06OiR7Yi50YXJnZXQubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgYVNvdXJjZUluZGV4ID0gKF9hID0gY29tYmluZWROb2Rlc1thU291cmNlS2V5XSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgICBjb25zdCBiU291cmNlSW5kZXggPSAoX2IgPSBjb21iaW5lZE5vZGVzW2JTb3VyY2VLZXldKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICAgIGNvbnN0IGFUYXJnZXRJbmRleCA9IChfYyA9IGNvbWJpbmVkTm9kZXNbYVRhcmdldEtleV0pICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICAgICAgY29uc3QgYlRhcmdldEluZGV4ID0gKF9kID0gY29tYmluZWROb2Rlc1tiVGFyZ2V0S2V5XSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgICBjb25zdCBhSW5kZXggPSBhU291cmNlSW5kZXggKiBzaGlmdCArIGFUYXJnZXRJbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGJJbmRleCA9IGJTb3VyY2VJbmRleCAqIHNoaWZ0ICsgYlRhcmdldEluZGV4O1xuICAgICAgICAgICAgcmV0dXJuIGFJbmRleCAtIGJJbmRleDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYWxpemVTb3J0UmVsYXRpb25zKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnNvdXJjZS5raW5kICE9PSBiLnNvdXJjZS5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuc291cmNlLmtpbmQubG9jYWxlQ29tcGFyZShiLnNvdXJjZS5raW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnNvdXJjZS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnNvdXJjZS5raW5kID09PSBiLnNvdXJjZS5raW5kICYmIGEuc291cmNlLm5hbWUgPT09IGIuc291cmNlLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQua2luZCAhPT0gYi50YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS50YXJnZXQua2luZC5sb2NhbGVDb21wYXJlKGIudGFyZ2V0LmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudGFyZ2V0Lm5hbWUubG9jYWxlQ29tcGFyZShiLnRhcmdldC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYWxpemVSZWxhdGlvbnNJbmZvKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB7fTtcbiAgICAgICAgKF9hID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gbGluay5zb3VyY2Uua2luZCArICc6OicgKyBsaW5rLnNvdXJjZS5uYW1lO1xuICAgICAgICAgICAgaWYgKCFzdW1tYXJ5W2tleV0pIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0gPSB7IHNvdXJjZUNvdW50OiAwLCB0YXJnZXRDb3VudDogMCwgc2FtZUtpbmRDb3VudDogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmsuc291cmNlLmtpbmQgPT09IGxpbmsudGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0uc2FtZUtpbmRDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldLnNvdXJjZUNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRLZXkgPSBsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICBpZiAoIXN1bW1hcnlbdGFyZ2V0S2V5XSkge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlbdGFyZ2V0S2V5XSA9IHsgc291cmNlQ291bnQ6IDAsIHRhcmdldENvdW50OiAwLCBzYW1lS2luZENvdW50OiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5W3RhcmdldEtleV0udGFyZ2V0Q291bnQrKztcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5ID0gc3VtbWFyeVtub2RlLmtpbmQgKyAnOjonICsgbm9kZS5uYW1lXTtcbiAgICAgICAgICAgIG5vZGUuY29sb3IgPSB0aGlzLmdldE5vZGVUYWdDb2xvcihub2RlKTtcbiAgICAgICAgICAgIG5vZGUuY2FyZGluYWxpdHkgPSBjYXJkaW5hbGl0eTtcbiAgICAgICAgICAgIGlmIChub2RlLnRhcmdldENvdW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jYXJkaW5hbGl0eSA9IHsgdGFyZ2V0Q291bnQ6IG5vZGUudGFyZ2V0Q291bnQsIHNhbWVLaW5kQ291bnQ6IDAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnNvdXJjZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jYXJkaW5hbGl0eSA9IE9iamVjdC5hc3NpZ24oKF9hID0gbm9kZS5jYXJkaW5hbGl0eSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge30sIHsgc291cmNlQ291bnQ6IG5vZGUuc291cmNlQ291bnQsIHNhbWVLaW5kQ291bnQ6IDAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZWFyY2hCeU5hbWUobm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUua2luZCB8fCAhbm9kZS5uYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbHRlciBjcml0ZXJpYSBpcyBlbXB0eScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmtpbmQgPT09IG5vZGUua2luZCAmJiBpdGVtLm5hbWUuaW5jbHVkZXMobm9kZS5uYW1lKSk7XG4gICAgfVxuICAgIGZpbHRlckRlcGVuZGVuY2llcyhzZWxlY3RlZE5vZGUsIHNlbGVjdGVkS2luZCkge1xuICAgICAgICBsZXQgcmVsYXRlZFJlbGF0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCBraW5kTmFtZXMgPSB0aGlzLm9wdGlvbnMua2luZHMubWFwKGsgPT4gay5uYW1lKTtcbiAgICAgICAgbGV0IHRhcmdldFJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi5zb3VyY2UubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRhcmdldFJlbGF0aW9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRTb3VyY2VzID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnNvdXJjZS5raW5kKSA6IHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFNvdXJjZU5hbWVzID0gc2VsZWN0ZWRTb3VyY2VzLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB0YXJnZXRSZWxhdGlvbnMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHNlbGVjdGVkU291cmNlTmFtZXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YXJnZXRSZWxhdGlvbnMucHVzaCguLi5zZWxlY3RlZFNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhcmdldEtleXMgPSB0YXJnZXRSZWxhdGlvbnMgPyBbLi4ubmV3IFNldCh0YXJnZXRSZWxhdGlvbnMuZmxhdE1hcChyZWxhdGlvbiA9PiBgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkpXSA6IFtdO1xuICAgICAgICBjb25zdCB0YXJnZXRUYXJnZXRSZWxhdGlvbnMgPSB0aGlzLnRhcmdldFRhcmdldFJlbGF0aW9ucyhzZWxlY3RlZE5vZGUua2luZCwga2luZE5hbWVzLCB0YXJnZXRLZXlzKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkS2luZCA9PT0gbnVsbCB8fCBzZWxlY3RlZEtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkS2luZC5pbmNsdWRlQWx0ZXJuYXRpdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRLaW5kS2V5cyA9IFsuLi5uZXcgU2V0KHRhcmdldFJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKSldO1xuICAgICAgICAgICAgcmVsYXRlZFJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWxhdGVkS2luZEtleXMuaW5jbHVkZXMoYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApICYmIHNlbGVjdGVkS2luZC5uYW1lID09PSByZWxhdGlvbi5zb3VyY2Uua2luZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZVJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChraW5kTmFtZXMubGVuZ3RoID4gMCA/IGtpbmROYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi50YXJnZXQua2luZCkgOiB0cnVlKSAmJiByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgJiYgcmVsYXRpb24udGFyZ2V0Lm5hbWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc291cmNlS2V5cyA9IHNvdXJjZVJlbGF0aW9ucyA/IFsuLi5uZXcgU2V0KHNvdXJjZVJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKSldIDogW107XG4gICAgICAgIGNvbnN0IHNvdXJjZVNvdXJjZVJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChraW5kTmFtZXMubGVuZ3RoID4gMCA/IGtpbmROYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi50YXJnZXQua2luZCkgOiB0cnVlKSAmJiBzb3VyY2VLZXlzLmluY2x1ZGVzKGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRpc3RpbmN0UmVsYXRpb25zID0gWy4uLm5ldyBTZXQoWy4uLnRhcmdldFJlbGF0aW9ucywgLi4udGFyZ2V0VGFyZ2V0UmVsYXRpb25zLCAuLi5zb3VyY2VTb3VyY2VSZWxhdGlvbnMsIC4uLnJlbGF0ZWRSZWxhdGlvbnMsIC4uLnNvdXJjZVJlbGF0aW9uc10ubWFwKHJlbCA9PiBKU09OLnN0cmluZ2lmeShyZWwpKSldLm1hcChyZWxTdHJpbmcgPT4gSlNPTi5wYXJzZShyZWxTdHJpbmcpKTtcbiAgICAgICAgc2VsZWN0ZWROb2RlLmhhc1JlbGF0aW9uc09mU2FtZUtpbmRzID0gZGlzdGluY3RSZWxhdGlvbnMuZmluZChyZWxhdGlvbiA9PiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgfHwgcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlbGF0aW9uczogZGlzdGluY3RSZWxhdGlvbnMsXG4gICAgICAgICAgICBoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzOiByZWxhdGVkUmVsYXRpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdGFyZ2V0VGFyZ2V0UmVsYXRpb25zKGtpbmQsIGtpbmROYW1lcywgdGFyZ2V0S2V5cykge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dTYW1lS2luZHNPbk5vblNlbGVjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChraW5kTmFtZXMubGVuZ3RoID4gMCA/IGtpbmROYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi50YXJnZXQua2luZCkgOiB0cnVlKSAmJiB0YXJnZXRLZXlzLmluY2x1ZGVzKHJlbGF0aW9uLnNvdXJjZS5raW5kICsgJzo6JyArIHJlbGF0aW9uLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKHJlbGF0aW9uLnRhcmdldC5raW5kID09PSByZWxhdGlvbi5zb3VyY2Uua2luZCkgPyByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0ga2luZCA6IHRydWUpICYmIChraW5kTmFtZXMubGVuZ3RoID4gMCA/IGtpbmROYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi50YXJnZXQua2luZCkgOiB0cnVlKSAmJiB0YXJnZXRLZXlzLmluY2x1ZGVzKHJlbGF0aW9uLnNvdXJjZS5raW5kICsgJzo6JyArIHJlbGF0aW9uLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZpbHRlck5vZGVzKHJlbGF0aW9ucykge1xuICAgICAgICBjb25zdCByZWxhdGlvbktleXMgPSByZWxhdGlvbnMuZmxhdE1hcChyZWxhdGlvbiA9PiBgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uU291cmNlS2V5cyA9IHJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnNvdXJjZS5raW5kfTo6JHtyZWxhdGlvbi5zb3VyY2UubmFtZX1gKTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICByZWxhdGlvblNvdXJjZUtleXMucHVzaChgJHt0aGlzLnNlbGVjdGVkTm9kZS5raW5kfTo6JHt0aGlzLnNlbGVjdGVkTm9kZS5uYW1lfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpc3RpbmN0S2V5cyA9IFsuLi5uZXcgU2V0KHJlbGF0aW9uS2V5cy5jb25jYXQocmVsYXRpb25Tb3VyY2VLZXlzKSldO1xuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbERhdGEubm9kZXMuZmlsdGVyKG5vZGUgPT4gZGlzdGluY3RLZXlzLmluY2x1ZGVzKGAke25vZGUua2luZH06OiR7bm9kZS5uYW1lfWApKTtcbiAgICB9XG4gICAgbWVyZ2VEYXRhKG9yaWdpbkRhdGEsIGFwcGVuZERhdGEpIHtcbiAgICAgICAgYXBwZW5kRGF0YS5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBvcmlnaW5EYXRhLm5vZGVzLmZpbmRJbmRleChleGlzdGluZ05vZGUgPT4gZXhpc3RpbmdOb2RlLmtpbmQgPT09IG5vZGUua2luZCAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gbm9kZS5uYW1lKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ05vZGUgPSBvcmlnaW5EYXRhLm5vZGVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlbGF0aW9uc1RvUmVtb3ZlID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTm9kZS5raW5kID09PSByZWxhdGlvbi5zb3VyY2Uua2luZCAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gcmVsYXRpb24uc291cmNlLm5hbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nTm9kZS5raW5kID09PSByZWxhdGlvbi50YXJnZXQua2luZCAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gcmVsYXRpb24udGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm91bmRSZWxhdGlvbnNUb1JlbW92ZS5mb3JFYWNoKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25JbmRleCA9IG9yaWdpbkRhdGEucmVsYXRpb25zLmluZGV4T2YocmVsYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEucmVsYXRpb25zLnNwbGljZShyZWxhdGlvbkluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEubm9kZXNbaW5kZXhdID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcGVuZERhdGEucmVsYXRpb25zLmZvckVhY2gocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdSZWxhdGlvbkluZGV4ID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuZmluZEluZGV4KGV4aXN0aW5nUmVsYXRpb24gPT4gZXhpc3RpbmdSZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gcmVsYXRpb24uc291cmNlLmtpbmQgJiZcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlbGF0aW9uLnNvdXJjZS5uYW1lID09PSByZWxhdGlvbi5zb3VyY2UubmFtZSAmJlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHJlbGF0aW9uLnRhcmdldC5raW5kICYmXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gcmVsYXRpb24udGFyZ2V0Lm5hbWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUmVsYXRpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5EYXRhLnJlbGF0aW9ucy5wdXNoKHJlbGF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvcmlnaW5EYXRhO1xuICAgIH1cbn1cbmV4cG9ydCB7IFNhbmtleUNoYXJ0RGF0YSwgSW5jbHVkZUtpbmQgfTtcbiIsImltcG9ydCB7IEV2ZW50SGFuZGxlciB9IGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5jbGFzcyBTYW5rZXlDaGFydCB7XG4gICAgY29uc3RydWN0b3Ioc3ZnRWxlbWVudCwgY3VzdG9tT3B0aW9ucykge1xuICAgICAgICB0aGlzLlNWR19OUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50ID0gc3ZnRWxlbWVudDtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBOT0RFX1RZUEVfVElUTEU6IFwibm9kZS1raW5kLXRpdGxlXCIsXG4gICAgICAgICAgICBOT0RFX1RJVExFOiBcIm5vZGUtdGl0bGVcIixcbiAgICAgICAgICAgIFJFTEFUSU9OOiBcInJlbGF0aW9uXCIsXG4gICAgICAgICAgICBDQVJESU5BTElUWTogXCJjYXJkaW5hbGl0eVwiLFxuICAgICAgICAgICAgU0VMRUNURUQ6ICdzZWxlY3RlZCdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgbm9kZVdpZHRoOiAxMCxcbiAgICAgICAgICAgIG5vZGVMaW5lSGVpZ2h0OiAxOCxcbiAgICAgICAgICAgIG1hcmdpblg6IDE1LFxuICAgICAgICAgICAgbWFyZ2luWTogNSxcbiAgICAgICAgICAgIGxlZnRYOiAxNSxcbiAgICAgICAgICAgIHRvcFk6IDEwLFxuICAgICAgICAgICAgbm9kZU1hcmdpblk6IDEwLFxuICAgICAgICAgICAgbm9kZUNvbHVtbldpZHRoOiAzMDAsXG4gICAgICAgICAgICBkZWZhdWx0Tm9kZUNvbG9yOiBcImdyYXlcIixcbiAgICAgICAgICAgIHJlbmRlcktpbmRBc0NvbHVtczogdHJ1ZSxcbiAgICAgICAgICAgIHRyYWZmaWNMb2cxMEZhY3RvcjogMTIsXG4gICAgICAgICAgICByZWxhdGlvbkRlZmF1bHRXaWR0aDogMTUsXG4gICAgICAgICAgICByZWxhdGlvbjoge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkT3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIGFuYWx5dGljc09wYWNpdHk6IDAuMixcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbm9uUFJPRDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGFzaEFycmF5OiAnMTAsMSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2FtZUtpbmRJbmRlbnRhdGlvbjogMjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxlY3RlZE5vZGU6IHtcbiAgICAgICAgICAgICAgICBkcm9wU2hhZG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZjEwMTAnLFxuICAgICAgICAgICAgICAgIGhvdmVyT3BhY2l0eTogMC4yXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJ1bmNhdGVUZXh0OiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdEZvbnRTaXplQW5kRmFtaWx5OiAnMTZweCBBcmlhbCcsXG4gICAgICAgICAgICAgICAgZWxsaXBzZUNoYXJhY3RlcjogJ+KApidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb290Q2hhcmFjdGVyOiAn4oyCJ1xuICAgICAgICB9O1xuICAgICAgICBpZiAoY3VzdG9tT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb25zKGN1c3RvbU9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlZEhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMubm9kZVBvc2l0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudUNhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlUG9zaXRpb25ZID0gLTE7XG4gICAgICAgIHRoaXMudHJ1bmNhdGVUZXh0ID0gdGhpcy5jcmVhdGVUcnVuY2F0ZVRleHQoKTtcbiAgICAgICAgdGhpcy5pbml0Q3NzKCk7XG4gICAgfVxuICAgIHNldE9wdGlvbnMoY3VzdG9tT3B0aW9ucykge1xuICAgICAgICBjdXN0b21PcHRpb25zLm5vZGVDb2x1bW5XaWR0aCA9IE51bWJlcihjdXN0b21PcHRpb25zLm5vZGVDb2x1bW5XaWR0aCB8fCB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpZHRoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5kZWVwTWVyZ2UodGhpcy5vcHRpb25zLCBjdXN0b21PcHRpb25zKTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gICAgc2V0RGF0YShjaGFydERhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhcnREYXRhICE9PSBjaGFydERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcnREYXRhID0gY2hhcnREYXRhO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLmRpc3BhdGNoRXZlbnQoJ3NlbGVjdGlvbkNoYW5nZWQnLCB7IG5vZGU6IHRoaXMuY2hhcnREYXRhLmdldFNlbGVjdGVkTm9kZSgpLCBwb3NpdGlvbjogeyB5OiAwIH0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkU2VsZWN0aW9uQ2hhbmdlZExpc3RlbmVycyhjYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5zdWJzY3JpYmUoJ3NlbGVjdGlvbkNoYW5nZWQnLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICAgICAgICAgIGNhbGxiYWNrRnVuY3Rpb24oeyBub2RlOiAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFNlbGVjdGVkTm9kZSgpLCBwb3NpdGlvbjogeyB5OiAwIH0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkQ29udGV4dE1lbnVMaXN0ZW5lcnMoY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uID0gY2FsbGJhY2tGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXREaXJlY3RUYXJnZXROb2Rlc09mKHNlbGVjdGVkTm9kZSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICByZXR1cm4gKF9iID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRSZWxhdGlvbnMoKS5maWx0ZXIoKHJlbGF0aW9uKSA9PiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgJiZcbiAgICAgICAgICAgIHJlbGF0aW9uLnNvdXJjZS5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSkubWFwKHJlbGF0aW9uID0+IHJlbGF0aW9uLnRhcmdldCkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdO1xuICAgIH1cbiAgICBpbml0Q3NzKCkge1xuICAgICAgICBjb25zdCBzdHlsZUlkID0gXCJzdmctc3R5bGVcIjtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdHlsZUlkKSkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICBzdHlsZS5pZCA9IHN0eWxlSWQ7XG4gICAgICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgYCAuc3ZnLWNvcHktaWNvbiB7IG9wYWNpdHk6IDA7IHRyYW5zaXRpb246IG9wYWNpdHkgMC41czsgfVxuICAgICAgICBnOmhvdmVyID4gLnN2Zy1jb3B5LWljb24geyBvcGFjaXR5OiAxOyB9XG4gICAgICAgIC51bnNlbGVjdGFibGUge3VzZXItc2VsZWN0OiBub25lOyAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO31gO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGRvY3VtZW50LmhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0RGlyZWN0U291cmNlTm9kZXNPZihzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0UmVsYXRpb25zKCkuZmlsdGVyKChyZWxhdGlvbikgPT4gcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmXG4gICAgICAgICAgICByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi5zb3VyY2UpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICB9XG4gICAgY3JlYXRlVHJ1bmNhdGVUZXh0KCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgY29uc3QgY2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGVsbGlwc2VDaGFyID0gdGhpcy5vcHRpb25zLnRydW5jYXRlVGV4dC5lbGxpcHNlQ2hhcmFjdGVyO1xuICAgICAgICBjb25zdCBmb250U2l6ZUFuZEZhbWlseSA9IHRoaXMub3B0aW9ucy50cnVuY2F0ZVRleHQuZGVmYXVsdEZvbnRTaXplQW5kRmFtaWx5O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gdHJ1bmNhdGVUZXh0KHRleHQsIG1heFdpZHRoLCBmb250ID0gZm9udFNpemVBbmRGYW1pbHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gYCR7dGV4dH0tJHttYXhXaWR0aH0tJHtmb250fWA7XG4gICAgICAgICAgICBpZiAoY2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBmb250O1xuICAgICAgICAgICAgaWYgKGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGggPD0gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjYWNoZS5zZXQoY2FjaGVLZXksIHRleHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRydW5jYXRlZFRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQubWVhc3VyZVRleHQodHJ1bmNhdGVkVGV4dCArIGVsbGlwc2VDaGFyKS53aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgdHJ1bmNhdGVkVGV4dCA9IHRydW5jYXRlZFRleHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdHJ1bmNhdGVkVGV4dCArIGVsbGlwc2VDaGFyO1xuICAgICAgICAgICAgY2FjaGUuc2V0KGNhY2hlS2V5LCByZXN1bHQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVzZXRTdmcoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlZEhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICA8ZGVmcz5cbiAgICAgICAgPGZpbHRlciBpZD1cImRyb3BzaGFkb3dcIj5cbiAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPVwiMC40XCIgLz5cbiAgICAgICAgPC9maWx0ZXI+XG4gICAgICA8L2RlZnM+XG4gICAgYDtcbiAgICB9XG4gICAgdXBkYXRlSGVpZ2h0KCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgY29uc3Qgd2lkdGggPSAoKChfYSA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2lkdGgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApICsgKChfYiA9IHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApKSAqIE1hdGgubWF4KDEsICgoX2MgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmdldEtpbmRzKCkubGVuZ3RoKSB8fCAwKSArICh0aGlzLm9wdGlvbnMubWFyZ2luWCAqIDIpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHJlbmRlckVsaXBzaXNNZW51KHgsIHksIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICBjb25zdCBtZW51R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCAnZWxsaXBzaXNNZW51Jyk7XG4gICAgICAgIG1lbnVHcm91cC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2N1cnNvcjogcG9pbnRlcjsnKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3ggKyAyLjV9LCAke3l9KWApO1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jcmVhdGVSZWN0KC0yLjUsIDAsIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgsIDIyLCAnYmxhY2snLCAnMC4yJyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeCcsICc1Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeScsICc1Jyk7XG4gICAgICAgIG1lbnVHcm91cC5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgZm9yIChsZXQgaXkgPSA1OyBpeSA8PSAxNTsgaXkgKz0gNSkge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVDaXJjbGUoMi41LCBpeSwgMiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgIG1lbnVHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICB9XG4gICAgICAgIG1lbnVHcm91cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudUNhbGxiYWNrRnVuY3Rpb24oZXZlbnQsIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVudUdyb3VwO1xuICAgIH1cbiAgICBkZWVwTWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnIHx8IHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0JyB8fCBzb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc291cmNlKSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XS5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNvdXJjZVtrZXldID09PSAnb2JqZWN0JyAmJiBzb3VyY2Vba2V5XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kZWVwTWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgcmVuZGVyTm9kZXMobm9kZXMsIHBvc2l0aW9uWCwgc2VsZWN0ZWROb2RlLCBraW5kLCBkaXJlY3RUYXJnZXROb2RlcywgZGlyZWN0U291cmNlTm9kZXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICBjb25zdCBzdmdHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBsZXQgb3ZlcmFsbFkgPSB0aGlzLm9wdGlvbnMudG9wWTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gKGtpbmQgPT09IG51bGwgfHwga2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDoga2luZC50aXRsZSkgfHwgKChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0VGl0bGUoKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSAoa2luZCA9PT0gbnVsbCB8fCBraW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBraW5kLmNvbG9yKSB8fCAoKF9kID0gKF9jID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5nZXRUaXRsZSgpKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuY29sb3IpIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgY29uc3QgeCA9IHBvc2l0aW9uWCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5vcHRpb25zLnRvcFkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWSArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICBsZXQgeDIgPSBwb3NpdGlvblggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IHkyID0gdGhpcy5vcHRpb25zLnRvcFkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWSArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoKTtcbiAgICAgICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgICAgIGlmIChraW5kID09PSBudWxsIHx8IGtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGtpbmQuY29sb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNyZWF0ZUNpcmNsZSh4LCB5LCA1LCBjb2xvcik7XG4gICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9ICd8ICc7XG4gICAgICAgICAgICAgICAgeDIgLT0gMTM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub2RlS2luZFRpdGxlID0gdGhpcy5jcmVhdGVTdmdUZXh0KHByZWZpeCArIHRpdGxlLCBbdGhpcy5jbGFzc05hbWUuTk9ERV9UWVBFX1RJVExFXSk7XG4gICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInhcIiwgeDIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInlcIiwgeTIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChub2RlS2luZFRpdGxlKTtcbiAgICAgICAgICAgIG92ZXJhbGxZICs9IDI1O1xuICAgICAgICB9XG4gICAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBub2RlS2V5ID0gbm9kZS5raW5kICsgJzo6JyArIG5vZGUubmFtZTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVQb3MgPSB0aGlzLm5vZGVQb3NpdGlvbnNbbm9kZUtleV07XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VSZWxhdGlvbnMgPSBub2RlUG9zLnNvdXJjZVJlbGF0aW9ucztcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFJlbGF0aW9ucyA9IG5vZGVQb3MudGFyZ2V0UmVsYXRpb25zO1xuICAgICAgICAgICAgY29uc3QgbGluZXNDb3VudCA9IDEgKyAobm9kZS5zdWJ0aXRsZSA/IDEgOiAwKSArICgoKF9hID0gbm9kZS50YWdzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA/IDEgOiAwKSArICh0aGlzLm9wdGlvbnMucmVuZGVyS2luZEFzQ29sdW1zID8gMCA6IDEpO1xuICAgICAgICAgICAgY29uc3QgbGluZXNIZWlnaHQgPSBsaW5lc0NvdW50ICogdGhpcy5vcHRpb25zLm5vZGVMaW5lSGVpZ2h0ICsgdGhpcy5vcHRpb25zLm1hcmdpblk7XG4gICAgICAgICAgICBjb25zdCByZWN0SGVpZ2h0ID0gMiAqIHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgTWF0aC5tYXgobGluZXNIZWlnaHQsIGxpbmVzSGVpZ2h0ICsgKHNvdXJjZVJlbGF0aW9ucy5oZWlnaHQgPiAwID8gc291cmNlUmVsYXRpb25zLmhlaWdodCArIDEyIDogMCksICh0YXJnZXRSZWxhdGlvbnMuaGVpZ2h0ID4gMCA/IHRhcmdldFJlbGF0aW9ucy5oZWlnaHQgKyAxMiA6IDApKTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLm9wdGlvbnMubWFyZ2luWSArIG92ZXJhbGxZO1xuICAgICAgICAgICAgbGV0IHBvc1ggPSBwb3NpdGlvblg7XG4gICAgICAgICAgICBsZXQgcmVjdFBvc2l0aW9uV2lkdGggPSB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpZHRoO1xuICAgICAgICAgICAgaWYgKG5vZGUuaGFzUmVsYXRlZFNvdXJjZU9mU2FtZUtpbmQpIHtcbiAgICAgICAgICAgICAgICBwb3NYICs9IHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zYW1lS2luZEluZGVudGF0aW9uO1xuICAgICAgICAgICAgICAgIHJlY3RQb3NpdGlvbldpZHRoIC09IHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zYW1lS2luZEluZGVudGF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihub2RlUG9zLCB7XG4gICAgICAgICAgICAgICAgeDogcG9zWCxcbiAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgIGhlaWdodDogcmVjdEhlaWdodCxcbiAgICAgICAgICAgICAgICB0ZXh0TGluZXNIZWlnaHQ6IGxpbmVzSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHNvdXJjZVk6IHkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWSxcbiAgICAgICAgICAgICAgICB0YXJnZXRZOiB5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG92ZXJhbGxZICs9IHJlY3RIZWlnaHQgKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSBNYXRoLm1heCh0aGlzLmNhbGN1bGF0ZWRIZWlnaHQsIG92ZXJhbGxZICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZICogMik7XG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBub2RlUG9zID0gdGhpcy5ub2RlUG9zaXRpb25zW25vZGUua2luZCArICc6OicgKyBub2RlLm5hbWVdO1xuICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkTm9kZSAmJiBzZWxlY3RlZE5vZGUubmFtZSA9PT0gbm9kZS5uYW1lICYmIHNlbGVjdGVkTm9kZS5raW5kID09PSBub2RlLmtpbmQgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBwb3NYID0gbm9kZVBvcy54O1xuICAgICAgICAgICAgY29uc3QgeSA9IG5vZGVQb3MueTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3RIZWlnaHQgPSBub2RlUG9zLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHJlY3RQb3NpdGlvbldpZHRoID0gdGhpcy5vcHRpb25zLm5vZGVDb2x1bW5XaWR0aCAtIChub2RlLmhhc1JlbGF0ZWRTb3VyY2VPZlNhbWVLaW5kID8gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNhbWVLaW5kSW5kZW50YXRpb24gOiAwKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbm9kZS5jb2xvciB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsICdnJyk7XG4gICAgICAgICAgICBjb25zdCByZWN0SG92ZXIgPSB0aGlzLmNyZWF0ZVJlY3QocG9zWCwgeSwgcmVjdFBvc2l0aW9uV2lkdGgsIHJlY3RIZWlnaHQsIGNvbG9yLCAnMCcpO1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuY3JlYXRlUmVjdChwb3NYLCB5LCB0aGlzLm9wdGlvbnMubm9kZVdpZHRoLCByZWN0SGVpZ2h0LCBjb2xvcik7XG4gICAgICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlUG9zaXRpb25ZID0geTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0U2hhZG93ID0gdGhpcy5jcmVhdGVSZWN0KHBvc1ggLSAyLCB5IC0gMiwgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIDQsIHJlY3RIZWlnaHQgKyA0LCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdyeCcsIFwiNlwiKTtcbiAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgncnknLCBcIjZcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RlZE5vZGUuZHJvcFNoYWRvdykge1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsbCcsICdibGFjaycpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsdGVyJywgJ3VybCgjZHJvcHNoYWRvdyknKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMC4yXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBcIjJcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgXCIxXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RTaGFkb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgICAgIHJlY3RIb3Zlci5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RIb3Zlcik7XG4gICAgICAgICAgICBpZiAobm9kZS5jYXJkaW5hbGl0eSB8fCBub2RlLnRhcmdldENvdW50IHx8IG5vZGUuc291cmNlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0RpcmVjdFRhcmdldE5vZGVzID0gKGRpcmVjdFRhcmdldE5vZGVzID09PSBudWxsIHx8IGRpcmVjdFRhcmdldE5vZGVzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXJlY3RUYXJnZXROb2Rlcy5maW5kKGRpcmVjdE5vZGUgPT4gbm9kZS5uYW1lID09PSBkaXJlY3ROb2RlLm5hbWUgJiYgbm9kZS5raW5kID09PSBkaXJlY3ROb2RlLmtpbmQpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0RpcmVjdFNvdXJjZU5vZGVzID0gKGRpcmVjdFNvdXJjZU5vZGVzID09PSBudWxsIHx8IGRpcmVjdFNvdXJjZU5vZGVzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXJlY3RTb3VyY2VOb2Rlcy5maW5kKGRpcmVjdE5vZGUgPT4gbm9kZS5uYW1lID09PSBkaXJlY3ROb2RlLm5hbWUgJiYgbm9kZS5raW5kID09PSBkaXJlY3ROb2RlLmtpbmQpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENhcmRpbmFsaXR5VGV4dChnLCBub2RlLCBwb3NYLCB5LCByZWN0SGVpZ2h0LCBjb2xvciwgaXNTZWxlY3RlZCwgaXNEaXJlY3RUYXJnZXROb2RlcywgaXNEaXJlY3RTb3VyY2VOb2Rlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KCcnLCBbdGhpcy5jbGFzc05hbWUuTk9ERV9USVRMRSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YKSk7XG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgeS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgIHRleHQuY2xhc3NMaXN0LmFkZCgndW5zZWxlY3RhYmxlJyk7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMuY3JlYXRlVGV4dExpbmVzKG5vZGUsIHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2lkdGggLSB0aGlzLm9wdGlvbnMubm9kZVdpZHRoKTtcbiAgICAgICAgICAgIGxpbmVzLmZvckVhY2goKGxpbmUsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblgpKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJkeVwiLCBcIjEuMmVtXCIpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnRleHRDb250ZW50ID0gbGluZS50ZXh0O1xuICAgICAgICAgICAgICAgIHRzcGFuLmNsYXNzTGlzdC5hZGQobGluZS5jbGFzcyk7XG4gICAgICAgICAgICAgICAgdGV4dC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBjb25zdCBjb3B5SWNvbiA9IHRoaXMuY3JlYXRlQ29weUljb24ocG9zWCwgcmVjdFBvc2l0aW9uV2lkdGgsIHksIGxpbmVzWzBdLnRleHQpO1xuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChjb3B5SWNvbik7XG4gICAgICAgICAgICBpZiAoIShub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGxhY2VIb2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRIb3ZlckFuZENsaWNrRXZlbnRzKGcsIHJlY3RIb3Zlciwgbm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChnKTtcbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkICYmICEobm9kZSA9PT0gbnVsbCB8fCBub2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBub2RlLnBsYWNlSG9sZGVyKSAmJiB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyRWxpcHNpc01lbnUocG9zWCwgeSwgbm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN2Z0dyb3VwO1xuICAgIH1cbiAgICBjcmVhdGVDb3B5SWNvbihwb3NYLCByZWN0UG9zaXRpb25XaWR0aCwgeSwgY29weVRleHQpIHtcbiAgICAgICAgY29uc3QgY29weUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInRleHRcIik7XG4gICAgICAgIGNvcHlJY29uLnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyByZWN0UG9zaXRpb25XaWR0aCAtIHRoaXMub3B0aW9ucy5tYXJnaW5YKSk7XG4gICAgICAgIGNvcHlJY29uLnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWCkpO1xuICAgICAgICBjb3B5SWNvbi5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgY29weUljb24udGV4dENvbnRlbnQgPSBcIuKniVwiO1xuICAgICAgICBjb3B5SWNvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN2Zy1jb3B5LWljb25cIik7XG4gICAgICAgIGNvcHlJY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoY29weVRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvcHlJY29uLnRleHRDb250ZW50ID0gXCLinJNcIjtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IChjb3B5SWNvbi50ZXh0Q29udGVudCA9IFwi4qeJXCIpLCAxMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvcHlJY29uO1xuICAgIH1cbiAgICBjcmVhdGVDaXJjbGUoY3gsIGN5LCByLCBmaWxsKSB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgY3gudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N5JywgY3kudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3InLCByLnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgZmlsbCk7XG4gICAgICAgIHJldHVybiBjaXJjbGU7XG4gICAgfVxuICAgIGNyZWF0ZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCwgZmlsbCwgb3BhY2l0eSA9IFwiMVwiKSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsICdyZWN0Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd4JywgeC50b1N0cmluZygpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCB5LnRvU3RyaW5nKCkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGhlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J4JywgXCI1XCIpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgncnknLCBcIjVcIik7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdmaWxsJywgZmlsbCk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBvcGFjaXR5KTtcbiAgICAgICAgcmV0dXJuIHJlY3Q7XG4gICAgfVxuICAgIGFwcGVuZENhcmRpbmFsaXR5VGV4dChnLCBub2RlLCBwb3NYLCB5LCByZWN0SGVpZ2h0LCBjb2xvciwgaXNTZWxlY3RlZCwgaXNEaXJlY3RSZWxhdGVkVG9TZWxlY3RlZCwgaXNEaXJlY3RTb3VyY2VOb2Rlcykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfaiwgX2ssIF9sLCBfbTtcbiAgICAgICAgaWYgKChfYiA9IChfYSA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zb3VyY2VDb3VudCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFsbE5vZGVzTG9hZGVkID0gKChfYyA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuYWxsTm9kZXNMb2FkZWQpIHx8IGlzU2VsZWN0ZWQgfHwgaXNEaXJlY3RSZWxhdGVkVG9TZWxlY3RlZDtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5VGV4dCA9ICgoX2QgPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Quc291cmNlQ291bnQpICsgKGFsbE5vZGVzTG9hZGVkID8gJycgOiAnLi4qJykgKyAoKChfZiA9IChfZSA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5zYW1lS2luZENvdW50KSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiAwKSA+IDAgPyAnKycgKyAoKF9oID0gKF9nID0gbm9kZS5jYXJkaW5hbGl0eSkgPT09IG51bGwgfHwgX2cgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9nLnNhbWVLaW5kQ291bnQpICE9PSBudWxsICYmIF9oICE9PSB2b2lkIDAgPyBfaCA6IDApIDogJycpO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlVGV4dCA9IHRoaXMuY3JlYXRlU3ZnVGV4dCgnLSAnICsgY2FyZGluYWxpdHlUZXh0LCBbdGhpcy5jbGFzc05hbWUuQ0FSRElOQUxJVFksIGlzU2VsZWN0ZWQgPyB0aGlzLmNsYXNzTmFtZS5TRUxFQ1RFRCA6ICcnXSk7XG4gICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCAtIDYpKTtcbiAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSArIHJlY3RIZWlnaHQgLSAyKSk7XG4gICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgY29sb3IpO1xuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChzb3VyY2VUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKF9rID0gKF9qID0gbm9kZS5jYXJkaW5hbGl0eSkgPT09IG51bGwgfHwgX2ogPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9qLnRhcmdldENvdW50KSAhPT0gbnVsbCAmJiBfayAhPT0gdm9pZCAwID8gX2sgOiAwID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYWxsTm9kZXNMb2FkZWQgPSAoKF9sID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9sID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbC5hbGxOb2Rlc0xvYWRlZCkgfHwgaXNTZWxlY3RlZCB8fCBpc0RpcmVjdFNvdXJjZU5vZGVzO1xuICAgICAgICAgICAgY29uc3QgY2FyZGluYWxpdHlUZXh0ID0gKChfbSA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9tID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbS50YXJnZXRDb3VudCkgKyAoYWxsTm9kZXNMb2FkZWQgPyAnJyA6ICcuLionKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoY2FyZGluYWxpdHlUZXh0ICsgJyAtJywgW3RoaXMuY2xhc3NOYW1lLkNBUkRJTkFMSVRZLCBpc1NlbGVjdGVkID8gdGhpcy5jbGFzc05hbWUuU0VMRUNURUQgOiAnJ10pO1xuICAgICAgICAgICAgdGFyZ2V0VGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblggLSAxNCkpO1xuICAgICAgICAgICAgdGFyZ2V0VGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5ICsgcmVjdEhlaWdodCAtIDIpKTtcbiAgICAgICAgICAgIHRhcmdldFRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBjb2xvcik7XG4gICAgICAgICAgICB0YXJnZXRUZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZCh0YXJnZXRUZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjcmVhdGVUZXh0TGluZXMobm9kZSwgbWF4VGV4dFdpZHRoKSB7XG4gICAgICAgIGNvbnN0IHRydW5jYXRlZFRpdGxlID0gdGhpcy50cnVuY2F0ZVRleHQgPyB0aGlzLnRydW5jYXRlVGV4dChub2RlLnRpdGxlID8gbm9kZS50aXRsZSA6IG5vZGUubmFtZSwgbWF4VGV4dFdpZHRoKSA6IChub2RlLnRpdGxlID8gbm9kZS50aXRsZSA6IG5vZGUubmFtZSk7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gW3sgdGV4dDogdHJ1bmNhdGVkVGl0bGUsIGNsYXNzOiBcImhlYWRsaW5lXCIgfV07XG4gICAgICAgIGlmIChub2RlLnN1YnRpdGxlKSB7XG4gICAgICAgICAgICBjb25zdCB0cnVuY2F0ZWRTdWJ0aXRsZSA9IHRoaXMudHJ1bmNhdGVUZXh0ID8gdGhpcy50cnVuY2F0ZVRleHQobm9kZS5zdWJ0aXRsZSwgbWF4VGV4dFdpZHRoKSA6IG5vZGUuc3VidGl0bGU7XG4gICAgICAgICAgICBsaW5lcy5zcGxpY2UoMSwgMCwgeyB0ZXh0OiB0cnVuY2F0ZWRTdWJ0aXRsZSwgY2xhc3M6IFwic3VidGl0bGVcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50YWdzKSB7XG4gICAgICAgICAgICBjb25zdCB0cnVuY2F0ZVRhZ3MgPSB0aGlzLnRydW5jYXRlVGV4dCA/IHRoaXMudHJ1bmNhdGVUZXh0KG5vZGUudGFncy5qb2luKCcsICcpLCBtYXhUZXh0V2lkdGgpIDogbm9kZS50YWdzLmpvaW4oJywgJyk7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKHsgdGV4dDogdHJ1bmNhdGVUYWdzLCBjbGFzczogXCJkZXNjcmlwdGlvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbmRlcktpbmRBc0NvbHVtcykge1xuICAgICAgICAgICAgbGluZXMucHVzaCh7IHRleHQ6IG5vZGUua2luZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5vZGUua2luZC5zbGljZSgxKSwgY2xhc3M6IFwiZGVzY3JpcHRpb25cIiB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgfVxuICAgIGFkZEhvdmVyQW5kQ2xpY2tFdmVudHMoZ3JvdXAsIHJlY3RIb3Zlciwgbm9kZSkge1xuICAgICAgICBncm91cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZWxlY3ROb2RlKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLmRpc3BhdGNoRXZlbnQoJ3NlbGVjdGlvbkNoYW5nZWQnLCB7IG5vZGUsIHBvc2l0aW9uOiB7IHk6IHRoaXMuc2VsZWN0ZWROb2RlUG9zaXRpb25ZIH0gfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBncm91cC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmhvdmVyT3BhY2l0eS50b1N0cmluZygpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGdyb3VwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHJlY3RIb3Zlci5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMFwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZVN2Z1RleHQodGV4dENvbnRlbnQsIGNsYXNzTmFtZXMpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0ZXh0XCIpO1xuICAgICAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcy5maWx0ZXIoY2xhc3NOYW1lID0+IGNsYXNzTmFtZSkpO1xuICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQ7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICByZW5kZXJSZWxhdGlvbnMocmVsYXRpb25zLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgY29uc3QgeyBuYW1lLCBraW5kIH0gPSBzZWxlY3RlZE5vZGUgfHwge307XG4gICAgICAgIGNvbnN0IGxvY2FsTm9kZVBvc2l0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlUG9zaXRpb25zKSk7XG4gICAgICAgIGNvbnN0IGdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIGNvbnN0IGdQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVBvc2l0aW9uID0gbG9jYWxOb2RlUG9zaXRpb25zW2xpbmsuc291cmNlLmtpbmQgKyAnOjonICsgbGluay5zb3VyY2UubmFtZV07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGxvY2FsTm9kZVBvc2l0aW9uc1tsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWVdO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRQb3NpdGlvbiB8fCAhc291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzYW1lS2luZCA9IGxpbmsuc291cmNlLmtpbmQgPT09IGxpbmsudGFyZ2V0LmtpbmQ7XG4gICAgICAgICAgICBjb25zdCBsaW5rQ29sb3IgPSBzYW1lS2luZCA/IHRhcmdldFBvc2l0aW9uLmNvbG9yIDogc291cmNlUG9zaXRpb24uY29sb3I7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFNvdXJjZSA9IHNhbWVLaW5kID8gMCA6IHRoaXMuY2FsY3VsYXRlR2FwKHNvdXJjZVBvc2l0aW9uLnNvdXJjZUluZGV4KyspO1xuICAgICAgICAgICAgY29uc3QgZmlyc3RUZXh0TGluZXNIZWlndGggPSAoX2EgPSBzb3VyY2VQb3NpdGlvbi50ZXh0TGluZXNIZWlnaHQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDA7XG4gICAgICAgICAgICBpZiAoZmlyc3RUZXh0TGluZXNIZWlndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgc291cmNlUG9zaXRpb24udGV4dExpbmVzSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZVBvc2l0aW9uLmFjY3VtdWxhdGVkU291cmNlWSArPSBmaXJzdFRleHRMaW5lc0hlaWd0aCArIHNlbGVjdGVkU291cmNlO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRUYXJnZXQgPSBzYW1lS2luZCA/IDAgOiB0aGlzLmNhbGN1bGF0ZUdhcCh0YXJnZXRQb3NpdGlvbi50YXJnZXRJbmRleCsrKTtcbiAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uLmFjY3VtdWxhdGVkVGFyZ2V0WSA9ICgoX2IgPSB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApICsgc2VsZWN0ZWRUYXJnZXQ7XG4gICAgICAgICAgICBjb25zdCB7IHNvdXJjZSwgdGFyZ2V0LCBoZWlnaHQgfSA9IGxpbms7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQxWCA9IHNvdXJjZVBvc2l0aW9uLnggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoO1xuICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MVkgPSBzb3VyY2VQb3NpdGlvbi5zb3VyY2VZICsgKChoZWlnaHQgfHwgMCkgLyAyKSArIHNvdXJjZVBvc2l0aW9uLmFjY3VtdWxhdGVkU291cmNlWTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDJZID0gdGhpcy5vcHRpb25zLm1hcmdpblkgKyB0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKChoZWlnaHQgfHwgMCkgLyAyKSArIHRhcmdldFBvc2l0aW9uLmFjY3VtdWxhdGVkVGFyZ2V0WTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDJYID0gKHNvdXJjZVBvc2l0aW9uLnggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoICsgdGFyZ2V0UG9zaXRpb24ueCkgLyAyO1xuICAgICAgICAgICAgbGV0IHBhdGhEO1xuICAgICAgICAgICAgbGV0IG9wYWNpdHkgPSB0aGlzLm9wdGlvbnMucmVsYXRpb24ub3BhY2l0eTtcbiAgICAgICAgICAgIGxldCBzdHJva2VXaWR0aCA9IGhlaWdodDtcbiAgICAgICAgICAgIHZhciBvcGFjaXR5RW1waGFzaXplU2VsZWN0ZWQgPSAwO1xuICAgICAgICAgICAgaWYgKChsaW5rLnNvdXJjZS5raW5kID09PSBraW5kICYmIGxpbmsuc291cmNlLm5hbWUgPT09IG5hbWUpIHx8IChsaW5rLnRhcmdldC5raW5kID09PSBraW5kICYmIGxpbmsudGFyZ2V0Lm5hbWUgPT09IG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eSArPSB0aGlzLm9wdGlvbnMucmVsYXRpb24uc2VsZWN0ZWRPcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNvdXJjZS5raW5kID09PSB0YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VQb3NpdGlvbi5pbmRleCA8IHRhcmdldFBvc2l0aW9uLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVggPSBzb3VyY2VQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQxWSA9IHNvdXJjZVBvc2l0aW9uLnkgKyBzb3VyY2VQb3NpdGlvbi5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlggPSB0YXJnZXRQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQyWSA9IHRhcmdldFBvc2l0aW9uLnkgKyAodGFyZ2V0UG9zaXRpb24uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhEID0gYE0ke3BvaW50MVh9LCR7cG9pbnQxWX0gQyR7cG9pbnQxWH0sJHtwb2ludDJZfSAke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDJYfSwke3BvaW50Mll9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlggPSBzb3VyY2VQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQyWSA9IHNvdXJjZVBvc2l0aW9uLnkgKyAoc291cmNlUG9zaXRpb24uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVggPSB0YXJnZXRQb3NpdGlvbi54ICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQxWSA9IHRhcmdldFBvc2l0aW9uLnkgKyB0YXJnZXRQb3NpdGlvbi5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhEID0gYE0ke3BvaW50MVh9LCR7cG9pbnQxWX0gQyR7cG9pbnQxWH0sJHtwb2ludDJZfSAke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDJYfSwke3BvaW50Mll9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IDAuODtcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aCA9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtjb250cm9sUG9pbnQxWH0sJHtjb250cm9sUG9pbnQxWX0gQyR7Y29udHJvbFBvaW50Mlh9LCR7Y29udHJvbFBvaW50MVl9ICR7Y29udHJvbFBvaW50Mlh9LCR7Y29udHJvbFBvaW50Mll9ICR7dGFyZ2V0UG9zaXRpb24ueH0sJHtjb250cm9sUG9pbnQyWX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoRCk7XG4gICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZmlsbCcsICdub25lJyk7XG4gICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgU3RyaW5nKHN0cm9rZVdpZHRoIHx8IDApKTtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCBsaW5rQ29sb3IpO1xuICAgICAgICAgICAgZ1BhdGguYXBwZW5kQ2hpbGQocGF0aCk7XG4gICAgICAgICAgICBsZXQgYW5hbHl0aWNzO1xuICAgICAgICAgICAgaWYgKGFuYWx5dGljcykge1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5hbHl0aWNzID0gbGluay5hbmFseXRpY3M7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZEtpbmQgPSBsaW5rLnRhcmdldC5raW5kID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpIHx8IGxpbmsuc291cmNlLmtpbmQgPT09IChzZWxlY3RlZE5vZGUgPT09IG51bGwgfHwgc2VsZWN0ZWROb2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZE5vZGUua2luZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKF9jID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLnRyYWZmaWMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IDAgPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuY3JlYXRlU3ZnVGV4dCgnJywgW3RoaXMuY2xhc3NOYW1lLlJFTEFUSU9OXSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh0YXJnZXRQb3NpdGlvbi54IC0gdGhpcy5vcHRpb25zLm1hcmdpblkpKTtcbiAgICAgICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHRhcmdldFBvc2l0aW9uLnRhcmdldFkgKyAoaGVpZ2h0IHx8IDAgLyAyKSArIHNlbGVjdGVkVGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0c3BhbkVudiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICB0c3BhbkVudi50ZXh0Q29udGVudCA9IChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MuZW52aXJvbm1lbnQpIHx8ICcnO1xuICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW5FbnYpO1xuICAgICAgICAgICAgICAgIGlmICgoYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVudmlyb25tZW50KSAmJiB0aGlzLm9wdGlvbnMucmVsYXRpb24uZW52aXJvbm1lbnRbYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVudmlyb25tZW50XSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5lbnZpcm9ubWVudFthbmFseXRpY3MuZW52aXJvbm1lbnRdLmRhc2hBcnJheSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoX2QgPSBhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MuZXJyb3JzKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvclJhdGlvID0gKDEwMCAvICgoX2UgPSBhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYykgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogMCkgKiAoKF9mID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVycm9ycykgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogMCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0c3BhbkVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgdHNwYW5FcnIuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInJlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdHNwYW5FcnIudGV4dENvbnRlbnQgPSAnICcgKyAoZXJyb3JSYXRpbyA9PSAwID8gXCIoPDAuMDElKVwiIDogJygnICsgZXJyb3JSYXRpby50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnJSknKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5hcHBlbmRDaGlsZCh0c3BhbkVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcInRzcGFuXCIpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnRleHRDb250ZW50ID0gJyAnICsgKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljLnRvTG9jYWxlU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW4pO1xuICAgICAgICAgICAgICAgIGdUZXh0LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5ICsgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmFuYWx5dGljc09wYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb3VyY2VQb3NpdGlvbi5zb3VyY2VZICs9IGhlaWdodCAhPT0gbnVsbCAmJiBoZWlnaHQgIT09IHZvaWQgMCA/IGhlaWdodCA6IDA7XG4gICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi50YXJnZXRZICs9IGhlaWdodCAhPT0gbnVsbCAmJiBoZWlnaHQgIT09IHZvaWQgMCA/IGhlaWdodCA6IDA7XG4gICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsIFN0cmluZyhvcGFjaXR5KSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuYXBwZW5kQ2hpbGQoZ1BhdGgpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuYXBwZW5kQ2hpbGQoZ1RleHQpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZztcbiAgICAgICAgaWYgKCF0aGlzLmNoYXJ0RGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0U2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIHRoaXMucmVzZXRTdmcoKTtcbiAgICAgICAgdGhpcy5ub2RlUG9zaXRpb25zID0ge307XG4gICAgICAgIGNvbnN0IG5vZGVzID0gKF9jID0gKF9iID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXROb2RlcygpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBbXTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVLZXkgPSBub2RlLmtpbmQgKyAnOjonICsgbm9kZS5uYW1lO1xuICAgICAgICAgICAgdGhpcy5ub2RlUG9zaXRpb25zW25vZGVLZXldID0ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBub2RlLmNvbG9yIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yLFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIHNvdXJjZVJlbGF0aW9uczogeyBoZWlnaHQ6IDAsIGNvdW50OiAwIH0sXG4gICAgICAgICAgICAgICAgdGFyZ2V0UmVsYXRpb25zOiB7IGhlaWdodDogMCwgY291bnQ6IDAgfSxcbiAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIHRleHRMaW5lc0hlaWdodDogMCxcbiAgICAgICAgICAgICAgICBzb3VyY2VZOiAwLFxuICAgICAgICAgICAgICAgIHRhcmdldFk6IDAsXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgYWNjdW11bGF0ZWRTb3VyY2VZOiAwLFxuICAgICAgICAgICAgICAgIGFjY3VtdWxhdGVkVGFyZ2V0WTogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlUmVsYXRpb25XZWlnaHRzKChfZSA9IChfZCA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuZ2V0UmVsYXRpb25zKCkpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IFtdKTtcbiAgICAgICAgbGV0IGNvbHVtbiA9IDA7XG4gICAgICAgIGNvbnN0IGNvbHVtbldpZHRoID0gdGhpcy5vcHRpb25zLm5vZGVDb2x1bW5XaWR0aCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGg7XG4gICAgICAgIGNvbnN0IGtpbmRzID0gKF9mID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5nZXRLaW5kcygpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgICAgICBjb25zdCBzdmdOb2RlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBpZiAoa2luZHMgJiYga2luZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0VGFyZ2V0Tm9kZXMgPSBzZWxlY3RlZE5vZGUgPyB0aGlzLmdldERpcmVjdFRhcmdldE5vZGVzT2Yoc2VsZWN0ZWROb2RlKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0U291cmNlTm9kZXMgPSBzZWxlY3RlZE5vZGUgPyB0aGlzLmdldERpcmVjdFNvdXJjZU5vZGVzT2Yoc2VsZWN0ZWROb2RlKSA6IFtdO1xuICAgICAgICAgICAga2luZHMuZm9yRWFjaChraW5kID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHN2Z05vZGVzLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyTm9kZXMoKF9iID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXROb2Rlc0J5S2luZChraW5kLm5hbWUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSwgdGhpcy5vcHRpb25zLmxlZnRYICsgY29sdW1uV2lkdGggKiBjb2x1bW4rKywgc2VsZWN0ZWROb2RlLCBraW5kLCBkaXJlY3RUYXJnZXROb2RlcywgZGlyZWN0U291cmNlTm9kZXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3ZnTm9kZXMuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJOb2Rlcyhub2RlcywgdGhpcy5vcHRpb25zLmxlZnRYICsgMCkpO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgdGhpcy5yZW5kZXJSZWxhdGlvbnMoKF9nID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5nZXRSZWxhdGlvbnMoKSwgc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50LmFwcGVuZENoaWxkKHN2Z05vZGVzKTtcbiAgICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKTtcbiAgICB9XG4gICAgdXBkYXRlUmVsYXRpb25XZWlnaHRzKHJlbGF0aW9ucykge1xuICAgICAgICBpZiAoIXJlbGF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlbGF0aW9ucy5mb3JFYWNoKChyZWxhdGlvbikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIGFuYWx5dGljcyB9ID0gcmVsYXRpb247XG4gICAgICAgICAgICBpZiAoc291cmNlLmtpbmQgPT09IHRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd2VpZ2h0ID0gKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAmJiBhbmFseXRpY3MudHJhZmZpYyA+IDBcbiAgICAgICAgICAgICAgICA/IE1hdGgucm91bmQoTWF0aC5sb2cxMChNYXRoLm1heChhbmFseXRpY3MudHJhZmZpYywgMikpICogKChfYSA9IHRoaXMub3B0aW9ucy50cmFmZmljTG9nMTBGYWN0b3IpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDEyKSlcbiAgICAgICAgICAgICAgICA6ICgoX2IgPSB0aGlzLm9wdGlvbnMucmVsYXRpb25EZWZhdWx0V2lkdGgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDEwKTtcbiAgICAgICAgICAgIHJlbGF0aW9uLmhlaWdodCA9IHdlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUtleSA9IHNvdXJjZS5raW5kICsgJzo6JyArIHNvdXJjZS5uYW1lO1xuICAgICAgICAgICAgaWYgKHRoaXMubm9kZVBvc2l0aW9uc1tzb3VyY2VLZXldKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5ub2RlUG9zaXRpb25zW3NvdXJjZUtleV07XG4gICAgICAgICAgICAgICAgcG9zLnNvdXJjZVJlbGF0aW9ucy5oZWlnaHQgKz0gd2VpZ2h0ICsgdGhpcy5jYWxjdWxhdGVHYXAocG9zLnNvdXJjZVJlbGF0aW9ucy5jb3VudCk7XG4gICAgICAgICAgICAgICAgcG9zLnNvdXJjZVJlbGF0aW9ucy5jb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0S2V5ID0gdGFyZ2V0LmtpbmQgKyAnOjonICsgdGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlUG9zaXRpb25zW3RhcmdldEtleV0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLm5vZGVQb3NpdGlvbnNbdGFyZ2V0S2V5XTtcbiAgICAgICAgICAgICAgICBwb3MudGFyZ2V0UmVsYXRpb25zLmhlaWdodCArPSB3ZWlnaHQgKyB0aGlzLmNhbGN1bGF0ZUdhcChwb3MudGFyZ2V0UmVsYXRpb25zLmNvdW50KTtcbiAgICAgICAgICAgICAgICBwb3MudGFyZ2V0UmVsYXRpb25zLmNvdW50ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjYWxjdWxhdGVHYXAoaXRlcmF0aW9ucykge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oODAsIGl0ZXJhdGlvbnMgKiAzKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBTYW5rZXlDaGFydDtcbmV4cG9ydCB7IFNhbmtleUNoYXJ0IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNhbmtleUNoYXJ0RGF0YSB9IGZyb20gJy4vc2Fua2V5LWNoYXJ0LWRhdGEnO1xuaW1wb3J0IFNhbmtleUNoYXJ0IGZyb20gJy4vc2Fua2V5LWNoYXJ0JztcbmltcG9ydCB7IEV2ZW50SGFuZGxlciB9IGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5pbXBvcnQgeyBNaW5pbWFwIH0gZnJvbSAnLi9taW5pbWFwJztcbmV4cG9ydCB7IFNhbmtleUNoYXJ0RGF0YSwgSW5jbHVkZUtpbmQgfSBmcm9tICcuL3NhbmtleS1jaGFydC1kYXRhJztcbmV4cG9ydCB7IEV2ZW50SGFuZGxlciB9O1xuZXhwb3J0IHsgU2Fua2V5Q2hhcnQgfTtcbmV4cG9ydCB7IE1pbmltYXAgfTtcbndpbmRvdy5TYW5rZXlDaGFydCA9IFNhbmtleUNoYXJ0O1xud2luZG93LlNhbmtleUNoYXJ0RGF0YSA9IFNhbmtleUNoYXJ0RGF0YTtcbndpbmRvdy5FdmVudEhhbmRsZXIgPSBFdmVudEhhbmRsZXI7XG53aW5kb3cuTWluaU1hcCA9IE1pbmltYXA7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=