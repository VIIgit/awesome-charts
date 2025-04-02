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
        this.originalData = { name: data.name, color: data.color, nodes: data.nodes || [], relations: data.relations || [] };
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
        this.sortNodes(this.nodes);
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
        this.sortNodes(this.nodes);
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
    sortNodes(nodes) {
        const undefinedTag = (this.options.noTag || '') + this.options.noTagSuffixCharacter;
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
                node['cardinality'] = { targetCount: node.targetCount, sameKindCount: 0 };
            }
            if (node.sourceCount) {
                node['cardinality'] = Object.assign((_a = node['cardinality']) !== null && _a !== void 0 ? _a : {}, { sourceCount: node.sourceCount, sameKindCount: 0 });
            }
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
    }
    setOptions(customOptions) {
        customOptions.nodeColumnWidth = Number(customOptions.nodeColumnWidth);
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
            const sourceRelations = node.sourceRelations || { height: 0, count: 0 };
            const targetRelations = node.targetRelations || { height: 0, count: 0 };
            const linesCount = 1 + (node.subtitle ? 1 : 0) + (((_a = node.tags) === null || _a === void 0 ? void 0 : _a.length) ? 1 : 0) + (this.options.renderKindAsColums ? 0 : 1);
            const linesHeight = linesCount * this.options.nodeLineHeight + this.options.marginY;
            node.textLinesHeight = linesHeight;
            const isSelected = selectedNode && selectedNode.name === node.name && selectedNode.kind === node.kind ? true : false;
            const rectHeight = 2 * this.options.marginY + Math.max(linesHeight, linesHeight + (sourceRelations.height > 0 ? sourceRelations.height + 12 : 0), (targetRelations.height > 0 ? targetRelations.height + 12 : 0));
            const y = this.options.marginY + overallY;
            const color = node.color || this.options.defaultNodeColor;
            let posX = positionX;
            let rectPositionWidth = this.options.nodeColumnWidth;
            if (isSelected) {
                this.selectedNodePositionY = y;
            }
            if (node.hasRelatedSourceOfSameKind) {
                posX += this.options.relation.sameKindIndentation;
                rectPositionWidth -= this.options.relation.sameKindIndentation;
            }
            const g = document.createElementNS(this.SVG_NS, 'g');
            const rectHover = this.createRect(posX, y, rectPositionWidth, rectHeight, color, '0');
            const rect = this.createRect(posX, y, this.options.nodeWidth, rectHeight, color);
            if (isSelected) {
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
            if (!(node === null || node === void 0 ? void 0 : node.placeHolder)) {
                this.addHoverAndClickEvents(g, rectHover, node);
            }
            svgGroup.appendChild(g);
            if (isSelected && !(node === null || node === void 0 ? void 0 : node.placeHolder) && this.contextMenuCallbackFunction) {
                svgGroup.appendChild(this.renderElipsisMenu(posX, y, node));
            }
            this.nodePositions[node.kind + '::' + node.name] = {
                node,
                x: posX,
                y,
                index,
                sourceY: y + this.options.marginY,
                targetY: y,
                height: rectHeight,
                textLinesHeight: node.textLinesHeight,
                sourceIndex: 0,
                targetIndex: 0,
                accumulatedSourceY: 0,
                accumulatedTargetY: 0
            };
            overallY += rectHeight + this.options.nodeMarginY;
        });
        this.calculatedHeight = Math.max(this.calculatedHeight, overallY + this.options.nodeMarginY * 2);
        return svgGroup;
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
        const { name, kind, color } = selectedNode || {};
        const defaultColor = color || this.options.defaultNodeColor;
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
            const linkColor = sourcePosition.node.color || defaultColor;
            const sameKind = link.source.kind === link.target.kind;
            const selectedSource = sameKind ? 0 : this.calculateGap(sourcePosition.sourceIndex++);
            const firstTextLinesHeigth = (_a = sourcePosition.textLinesHeight) !== null && _a !== void 0 ? _a : 0;
            if (firstTextLinesHeigth > 0) {
                sourcePosition.textLinesHeight = 0;
            }
            sourcePosition.accumulatedSourceY = firstTextLinesHeigth + sourcePosition.accumulatedSourceY + selectedSource;
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
            else if (source.kind != target.kind) {
            }
            sourcePosition.sourceY += height !== null && height !== void 0 ? height : 0;
            targetPosition.targetY += height !== null && height !== void 0 ? height : 0;
            path.setAttribute('opacity', String(opacity));
        });
        this.svgElement.appendChild(gPath);
        this.svgElement.appendChild(gText);
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!this.chartData) {
            return;
        }
        const selectedNode = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode();
        this.resetSvg();
        this.updateRelationWeights((_c = (_b = this.chartData) === null || _b === void 0 ? void 0 : _b.getNodes()) !== null && _c !== void 0 ? _c : [], (_e = (_d = this.chartData) === null || _d === void 0 ? void 0 : _d.getRelations()) !== null && _e !== void 0 ? _e : [], selectedNode);
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
            svgNodes.appendChild(this.renderNodes((_h = (_g = this.chartData) === null || _g === void 0 ? void 0 : _g.getNodes()) !== null && _h !== void 0 ? _h : [], this.options.leftX + 0));
        }
        ;
        this.renderRelations((_j = this.chartData) === null || _j === void 0 ? void 0 : _j.getRelations(), selectedNode);
        this.svgElement.appendChild(svgNodes);
        this.updateHeight();
    }
    updateRelationWeights(nodes, relations, selectedNode) {
        if (!relations) {
            return;
        }
        const relationWeights = relations.reduce((acc, relation) => {
            var _a, _b;
            const { source, target, analytics } = relation;
            if (source.kind === target.kind) {
                relation.height = 0;
                return acc;
            }
            const sourceKey = `s${source.kind}:${source.name}`;
            const targetKey = `t${target.kind}:${target.name}`;
            const weight = (analytics === null || analytics === void 0 ? void 0 : analytics.traffic) && analytics.traffic > 0
                ? Math.round(Math.log10(Math.max(analytics.traffic, 2)) * ((_a = this.options.trafficLog10Factor) !== null && _a !== void 0 ? _a : 12))
                : ((_b = this.options.relationDefaultWidth) !== null && _b !== void 0 ? _b : 10);
            relation.height = weight;
            if (!acc[sourceKey]) {
                acc[sourceKey] = { height: 0, count: 0 };
            }
            if (!acc[targetKey]) {
                acc[targetKey] = { height: 0, count: 0 };
            }
            acc[sourceKey].height += weight + this.calculateGap(acc[sourceKey].count);
            acc[sourceKey].count += 1;
            acc[targetKey].height += weight + this.calculateGap(acc[targetKey].count);
            acc[targetKey].count += 1;
            return acc;
        }, {});
        nodes.forEach(node => {
            node.sourceRelations = relationWeights[`s${node.kind}:${node.name}`];
            node.targetRelations = relationWeights[`t${node.kind}:${node.name}`];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQseURBQXlELFFBQVEsSUFBSSxFQUFFO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLFVBQVU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNU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QUNKOzs7Ozs7O1VDNWhCdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOc0Q7QUFDYjtBQUNNO0FBQ1g7QUFDK0I7QUFDM0M7QUFDRDtBQUNKO0FBQ25CLHFCQUFxQixxREFBVztBQUNoQyx5QkFBeUIsK0RBQWU7QUFDeEMsc0JBQXNCLHdEQUFZO0FBQ2xDLGlCQUFpQiw2Q0FBTyIsInNvdXJjZXMiOlsid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9ldmVudC1oYW5kbGVyLnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL21pbmltYXAudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvc2Fua2V5LWNoYXJ0LWRhdGEudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvc2Fua2V5LWNoYXJ0LnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVklJU2Fua2V5Q2hhcnRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiVklJU2Fua2V5Q2hhcnRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiY2xhc3MgRXZlbnRIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIHN1YnNjcmliZShldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNldChldmVudCwgW10pO1xuICAgICAgICB9XG4gICAgICAgIChfYSA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gICAgdW5zdWJzY3JpYmUoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudExpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCk7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGV2ZW50TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGlzcGF0Y2hFdmVudChldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGV2ZW50TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgeyBFdmVudEhhbmRsZXIgfTtcbiIsImNsYXNzIE1pbmltYXAge1xuICAgIGNvbnN0cnVjdG9yKGNoYXJ0RWxlbWVudCwgY29udGFpbmVyRWxlbWVudCwgbWFpblZpZXdFbGVtZW50KSB7XG4gICAgICAgIHRoaXMubWFpblZpZXdIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLm1haW5WaWV3V2lkdGggPSAwO1xuICAgICAgICB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggPSAwO1xuICAgICAgICB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5zY2FsZVVuaXRZID0gMTtcbiAgICAgICAgdGhpcy5zY2FsZVVuaXRYID0gMTtcbiAgICAgICAgdGhpcy5kcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtaW5pbWFwUmVjdCA9IHRoaXMubWluaW1hcFBhbmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBsZW5zZVJlY3QgPSB0aGlzLnZpc2libGVTZWN0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbGV0IG5ld1ggPSBldmVudC5jbGllbnRYIC0gbWluaW1hcFJlY3QubGVmdCAtIGxlbnNlUmVjdC53aWR0aCAvIDI7XG4gICAgICAgICAgICBsZXQgbmV3WSA9IGV2ZW50LmNsaWVudFkgLSBtaW5pbWFwUmVjdC50b3AgLSBsZW5zZVJlY3QuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIG5ld1ggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihuZXdYLCBtaW5pbWFwUmVjdC53aWR0aCAtIGxlbnNlUmVjdC53aWR0aCkpO1xuICAgICAgICAgICAgbmV3WSA9IE1hdGgubWF4KDAsIE1hdGgubWluKG5ld1ksIG1pbmltYXBSZWN0LmhlaWdodCAtIGxlbnNlUmVjdC5oZWlnaHQpKTtcbiAgICAgICAgICAgIGNvbnN0IG1pbmltYXBIZWlnaHQgPSB0aGlzLm1pbmltYXBQYW5lLnNjcm9sbEhlaWdodCA+IHRoaXMubWluaW1hcFBhbmUuY2xpZW50SGVpZ2h0ID8gbWluaW1hcFJlY3QuaGVpZ2h0IDogdGhpcy5taW5pTWFwU1ZHLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFBvc1lJblBlcmNlbnRhZ2UgPSBuZXdZIC8gKG1pbmltYXBIZWlnaHQgLSBsZW5zZVJlY3QuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFBvc1hJblBlcmNlbnRhZ2UgPSBuZXdYIC8gKG1pbmltYXBSZWN0LndpZHRoIC0gbGVuc2VSZWN0LndpZHRoKTtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2Nyb2xsVG9wID0gc2Nyb2xsUG9zWUluUGVyY2VudGFnZSAqICh0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0IC0gdGhpcy5tYWluVmlld0hlaWdodCk7XG4gICAgICAgICAgICB0aGlzLm1haW5WaWV3LnNjcm9sbExlZnQgPSBzY3JvbGxQb3NYSW5QZXJjZW50YWdlICogKHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCAtIHRoaXMubWFpblZpZXdXaWR0aCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW5kRHJhZyA9ICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuZHJhZyk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmREcmFnKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5tYWluVmlldyA9IG1haW5WaWV3RWxlbWVudDtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJFbGVtZW50O1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uID0gdGhpcy5jcmVhdGVWaXNpYmxlU2VjdGlvbigpO1xuICAgICAgICB0aGlzLm1pbmlNYXBTVkcgPSB0aGlzLmNyZWF0ZU1pbmlNYXBTVkcoY2hhcnRFbGVtZW50LmlkKTtcbiAgICAgICAgdGhpcy5taW5pTWFwU1ZHLmFwcGVuZENoaWxkKHRoaXMudmlzaWJsZVNlY3Rpb24pO1xuICAgICAgICB0aGlzLm1pbmltYXBQYW5lID0gdGhpcy5jcmVhdGVNaW5pbWFwUGFuZSgpO1xuICAgICAgICB0aGlzLm1pbmltYXBQYW5lLmFwcGVuZENoaWxkKHRoaXMubWluaU1hcFNWRyk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubWluaW1hcFBhbmUpO1xuICAgICAgICB0aGlzLm1haW5WaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc3luY1Njcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnN0YXJ0RHJhZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgY29uc3QgcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLm1haW5WaWV3KTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5tYWluVmlld0hlaWdodCA9IHRoaXMubWFpblZpZXcuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLm1haW5WaWV3V2lkdGggPSB0aGlzLm1haW5WaWV3LmNsaWVudFdpZHRoO1xuICAgICAgICB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggPSB0aGlzLm1haW5WaWV3LnNjcm9sbFdpZHRoO1xuICAgICAgICB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ID0gdGhpcy5tYWluVmlldy5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMubWFpblZpZXdXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMubWFpblZpZXdIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMubWluaU1hcFNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy5tYWluVmlld1Njcm9sbFdpZHRofSAke3RoaXMubWFpblZpZXdTY3JvbGxIZWlnaHR9YCk7XG4gICAgICAgIHRoaXMubWFpblZpZXcuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5tYWluVmlld1dpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5tYWluVmlld0hlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5zY2FsZVVuaXRZID0gdGhpcy5tYWluVmlld0hlaWdodCA9PT0gdGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCA/IDEgOiAtMSAvICh0aGlzLm1haW5WaWV3SGVpZ2h0IC0gdGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCk7XG4gICAgICAgIHRoaXMuc2NhbGVVbml0WCA9IHRoaXMubWFpblZpZXdXaWR0aCA9PT0gdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoID8gMSA6IC0xIC8gKHRoaXMubWFpblZpZXdXaWR0aCAtIHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCk7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUubWluSGVpZ2h0ID0gYCR7dGhpcy5tYWluVmlld0hlaWdodH1weGA7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGNvbnN0IG1pbmltYXBIZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1pbmltYXBQYW5lLmNsaWVudEhlaWdodCwgdGhpcy5tYWluVmlld0hlaWdodCk7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUubWluSGVpZ2h0ID0gYCR7bWluaW1hcEhlaWdodH1weGA7XG4gICAgICAgIGlmICh0aGlzLm1haW5WaWV3SGVpZ2h0ID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ICYmIHRoaXMubWFpblZpZXdXaWR0aCA9PT0gdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmltYXBQYW5lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW5jU2Nyb2xsKCk7XG4gICAgfVxuICAgIGNyZWF0ZU1pbmlNYXBTVkcoc3ZnSHJlZikge1xuICAgICAgICBjb25zdCBwcmV2aWV3U1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICAgICAgcHJldmlld1NWRy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3ByZXZpZXctc3ZnJyk7XG4gICAgICAgIGNvbnN0IHVzZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3VzZScpO1xuICAgICAgICB1c2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGAjJHtzdmdIcmVmfWApO1xuICAgICAgICB1c2VFbGVtZW50LnNldEF0dHJpYnV0ZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuICAgICAgICBwcmV2aWV3U1ZHLmFwcGVuZENoaWxkKHVzZUVsZW1lbnQpO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS50b3AgPSAnMCc7XG4gICAgICAgIHByZXZpZXdTVkcuc3R5bGUubGVmdCA9ICcwJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICAgIHJldHVybiBwcmV2aWV3U1ZHO1xuICAgIH1cbiAgICBjcmVhdGVNaW5pbWFwUGFuZSgpIHtcbiAgICAgICAgY29uc3QgbWluaW1hcFBhbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbWluaW1hcFBhbmUuY2xhc3NOYW1lID0gJ21pbmltYXAtcGFuZSc7XG4gICAgICAgIG1pbmltYXBQYW5lLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIG1pbmltYXBQYW5lLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUucmlnaHQgPSAnMCc7XG4gICAgICAgIG1pbmltYXBQYW5lLnN0eWxlLnRvcCA9ICcwJztcbiAgICAgICAgcmV0dXJuIG1pbmltYXBQYW5lO1xuICAgIH1cbiAgICBjcmVhdGVWaXNpYmxlU2VjdGlvbigpIHtcbiAgICAgICAgY29uc3QgdmlzaWJsZVNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcbiAgICAgICAgdmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdtaW5pbWFwLXZpc2libGUtc2VjdGlvbicpO1xuICAgICAgICB2aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3gnLCAnMCcpO1xuICAgICAgICB2aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgICAgICByZXR1cm4gdmlzaWJsZVNlY3Rpb247XG4gICAgfVxuICAgIHN5bmNTY3JvbGwoKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbFBvc1lJblBlcmNlbnRhZ2UgPSB0aGlzLnNjYWxlVW5pdFkgKiB0aGlzLm1haW5WaWV3LnNjcm9sbFRvcDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWEluUGVyY2VudGFnZSA9IHRoaXMuc2NhbGVVbml0WCAqIHRoaXMubWFpblZpZXcuc2Nyb2xsTGVmdDtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zY3JvbGxUb3AgPSAodGhpcy5taW5pbWFwUGFuZS5zY3JvbGxIZWlnaHQgLSB0aGlzLm1pbmltYXBQYW5lLmNsaWVudEhlaWdodCkgKiBzY3JvbGxQb3NZSW5QZXJjZW50YWdlO1xuICAgICAgICB0aGlzLm1pbmltYXBQYW5lLnNjcm9sbExlZnQgPSAodGhpcy5taW5pbWFwUGFuZS5zY3JvbGxXaWR0aCAtIHRoaXMubWluaW1hcFBhbmUuY2xpZW50V2lkdGgpICogc2Nyb2xsUG9zWEluUGVyY2VudGFnZTtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVkgPSAodGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCAtIHRoaXMubWFpblZpZXdIZWlnaHQpICogc2Nyb2xsUG9zWUluUGVyY2VudGFnZTtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVggPSAodGhpcy5tYWluVmlld1Njcm9sbFdpZHRoIC0gdGhpcy5tYWluVmlld1dpZHRoKSAqIHNjcm9sbFBvc1hJblBlcmNlbnRhZ2U7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCd5Jywgb3ZlcmxheVkudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCd4Jywgb3ZlcmxheVgudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXJ0RHJhZyhldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmRyYWcpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmREcmFnKTtcbiAgICB9XG59XG5leHBvcnQgeyBNaW5pbWFwIH07XG4iLCJ2YXIgSW5jbHVkZUtpbmQ7XG4oZnVuY3Rpb24gKEluY2x1ZGVLaW5kKSB7XG4gICAgSW5jbHVkZUtpbmRbXCJXSVRIX1NBTUVfVEFSR0VUXCJdID0gXCJXSVRIX1NBTUVfVEFSR0VUXCI7XG59KShJbmNsdWRlS2luZCB8fCAoSW5jbHVkZUtpbmQgPSB7fSkpO1xuY2xhc3MgU2Fua2V5Q2hhcnREYXRhIHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zLCBwYXJ0aWFsRGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZVRhZ0NvbG9yID0gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbm9kZS50YWdzID8gbm9kZS50YWdzLm1hcCh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSB0aGlzLm9wdGlvbnMudGFnQ29sb3JNYXApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVt0YWddOyB9KS5maW5kKGNvbG9yID0+IGNvbG9yICE9PSB1bmRlZmluZWQpIDogdGhpcy5vcHRpb25zLmRlZmF1bHRDb2xvcjtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmNvbG9yIHx8IGNvbG9yO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHsgcmVsYXRpb25zOiBbXSwgaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kczogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbERhdGEgPSB7IG5hbWU6IGRhdGEubmFtZSwgY29sb3I6IGRhdGEuY29sb3IsIG5vZGVzOiBkYXRhLm5vZGVzIHx8IFtdLCByZWxhdGlvbnM6IGRhdGEucmVsYXRpb25zIHx8IFtdIH07XG4gICAgICAgIHRoaXMuYWxsTm9kZXNMb2FkZWQgPSAhcGFydGlhbERhdGE7XG4gICAgICAgIHRoaXMubm9kZXNCeUtpbmRzID0ge307XG4gICAgICAgIHRoaXMudGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5vVGFnOiAnT3RoZXJzJyxcbiAgICAgICAgICAgIG5vVGFnU3VmZml4Q2hhcmFjdGVyOiAn4oCmJyxcbiAgICAgICAgICAgIHJlbGF0aW9uRGVmYXVsdFdpZHRoOiAxNSxcbiAgICAgICAgICAgIGRlZmF1bHRDb2xvcjogXCJvcmFuZ2VcIixcbiAgICAgICAgICAgIHRhZ0NvbG9yTWFwOiB7fSxcbiAgICAgICAgICAgIGtpbmRzOiBbXSxcbiAgICAgICAgICAgIHNob3dSZWxhdGVkS2luZHM6IGZhbHNlLFxuICAgICAgICAgICAgc2VsZWN0QW5kRmlsdGVyOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU29ydFJlbGF0aW9ucygpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVSZWxhdGlvbnNJbmZvKCk7XG4gICAgICAgIHRoaXMuc29ydE5vZGVzKHRoaXMubm9kZXMpO1xuICAgIH1cbiAgICByZXNldENvbG9ycygpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCk7XG4gICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzU29tZSA9IHRhZ3Muc29tZSh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBub2RlLnRhZ3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyh0YWcpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzU29tZSB8fCBub2RlWydjb2xvciddID09PSB0aGlzLm9wdGlvbnMuZGVmYXVsdENvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlWydjb2xvciddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4gZGVsZXRlIG5vZGVbJ2NvbG9yJ10pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlc2V0Q29sb3JzKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzTm9kZSA9IHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShwcmV2aW91c05vZGUpO1xuICAgIH1cbiAgICBhcHBlbmREYXRhKGRhdGEsIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5tZXJnZURhdGEodGhpcy5vcmlnaW5hbERhdGEsIGRhdGEpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKHNlbGVjdGVkTm9kZSk7XG4gICAgfVxuICAgIGdldE5vZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlcyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0Tm9kZXNCeUtpbmQoa2luZCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgfVxuICAgIGdldFJlbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0S2luZHMoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkS2luZHMgPSBPYmplY3Qua2V5cyh0aGlzLm5vZGVzQnlLaW5kcyk7XG4gICAgICAgIGlmICgoKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5sZW5ndGgpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5raW5kcy5maWx0ZXIoa2luZCA9PiBmaWx0ZXJlZEtpbmRzLmluY2x1ZGVzKGtpbmQubmFtZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZEtpbmRzLm1hcChraW5kID0+ICh7IG5hbWU6IGtpbmQgfSkpO1xuICAgIH1cbiAgICBnZXRUaXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGU7XG4gICAgfVxuICAgIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZSA/IHsgdGl0bGU6IHRpdGxlLnRpdGxlLCBuYW1lOiB0aXRsZS5uYW1lLCBjb2xvcjogdGl0bGUuY29sb3IgfSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0U2VsZWN0ZWROb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZE5vZGU7XG4gICAgfVxuICAgIHNlbGVjdE5vZGUobm9kZSkge1xuICAgICAgICBjb25zdCBncm91cEJ5S2luZCA9IChub2RlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUJ5S2luZHMgPSB7fTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhQnlLaW5kc1tub2RlLmtpbmRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW25vZGUua2luZF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YUJ5S2luZHNbbm9kZS5raW5kXS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUJ5S2luZHM7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzO1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFub2RlLmtpbmQgfHwgIW5vZGUubmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIG11c3QgaGF2ZSBraW5kIGFuZCBuYW1lJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgJiYgbm9kZS5uYW1lID09PSB0aGlzLnNlbGVjdGVkTm9kZS5uYW1lICYmIG5vZGUua2luZCA9PT0gdGhpcy5zZWxlY3RlZE5vZGUua2luZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBub2RlLm5hbWUgJiYgaXRlbS5raW5kID09PSBub2RlLmtpbmQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRLaW5kID0gdGhpcy5vcHRpb25zLmtpbmRzLmZpbmQoa2luZCA9PiB7IHZhciBfYTsgcmV0dXJuIGtpbmQubmFtZSA9PT0gKChfYSA9IHRoaXMuc2VsZWN0ZWROb2RlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZCk7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEtpbmQgPT09IG51bGwgfHwgc2VsZWN0ZWRLaW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEtpbmQuaW5jbHVkZUFsdGVybmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RBbmRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UmVsYXRlZEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHRoaXMuZmlsdGVyRGVwZW5kZW5jaWVzKHRoaXMuc2VsZWN0ZWROb2RlLCBzZWxlY3RlZEtpbmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZpbHRlckRlcGVuZGVuY2llcyh0aGlzLnNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMuZmlsdGVyTm9kZXModGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNSZWxhdGVkU291cmNlT2ZTYW1lS2luZCA9IHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBub2RlLmtpbmQgJiYgcmVsYXRpb24udGFyZ2V0Lm5hbWUgPT09IG5vZGUubmFtZSAmJiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gbm9kZS5raW5kKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvcnROb2Rlcyh0aGlzLm5vZGVzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgIH1cbiAgICBzb3J0Tm9kZXNBbHBhYmV0aWNhbGx5KG5vZGVzKSB7XG4gICAgICAgIGNvbnN0IHVuZGVmaW5lZFRhZyA9ICh0aGlzLm9wdGlvbnMubm9UYWcgfHwgJycpICsgdGhpcy5vcHRpb25zLm5vVGFnU3VmZml4Q2hhcmFjdGVyO1xuICAgICAgICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5uYW1lID09PSB1bmRlZmluZWRUYWcgJiYgYi5uYW1lICE9PSB1bmRlZmluZWRUYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGEubmFtZSAhPT0gdW5kZWZpbmVkVGFnICYmIGIubmFtZSA9PT0gdW5kZWZpbmVkVGFnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0Tm9kZXMobm9kZXMpIHtcbiAgICAgICAgY29uc3QgdW5kZWZpbmVkVGFnID0gKHRoaXMub3B0aW9ucy5ub1RhZyB8fCAnJykgKyB0aGlzLm9wdGlvbnMubm9UYWdTdWZmaXhDaGFyYWN0ZXI7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IHRoaXMuZ2V0U2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnROb2Rlc0FscGFiZXRpY2FsbHkodGhpcy5nZXROb2RlcygpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJldmlvdXNLaW5kcyA9IFtdO1xuICAgICAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5vcHRpb25zLmtpbmRzLmZpbmRJbmRleChrID0+IGsubmFtZSA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSk7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleDsgaW5kZXggPCB0aGlzLm9wdGlvbnMua2luZHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBraW5kID0gdGhpcy5vcHRpb25zLmtpbmRzW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRLaW5kcyA9IHRoaXMubm9kZXNCeUtpbmRzW2tpbmQubmFtZV07XG4gICAgICAgICAgICBpZiAoY3VycmVudEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0Tm9kZXNPZktpbmQoa2luZCwgY3VycmVudEtpbmRzLCBwcmV2aW91c0tpbmRzLCBzZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzS2luZHMgPSBjdXJyZW50S2luZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qga2luZCA9IHRoaXMub3B0aW9ucy5raW5kc1tzdGFydEluZGV4XTtcbiAgICAgICAgcHJldmlvdXNLaW5kcyA9IHRoaXMubm9kZXNCeUtpbmRzW2tpbmQubmFtZV07XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGtpbmQgPSB0aGlzLm9wdGlvbnMua2luZHNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEtpbmRzID0gdGhpcy5ub2Rlc0J5S2luZHNba2luZC5uYW1lXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50S2luZHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvcnROb2Rlc09mS2luZChraW5kLCBjdXJyZW50S2luZHMsIHByZXZpb3VzS2luZHMsIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNLaW5kcyA9IGN1cnJlbnRLaW5kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvcnRSZWxhdGlvbnMoKTtcbiAgICB9XG4gICAgc29ydE5vZGVzT2ZLaW5kKGtpbmQsIG5vZGVzLCBwcmV2aW91c0tpbmRzLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgaWYgKGtpbmQubmFtZSA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zID0gdGhpcy5nZXRSZWxhdGlvbnMoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRPZlNhbWVLaW5kTm9kZXMgPSByZWxhdGlvbnMuZmlsdGVyKHJlbCA9PiByZWwuc291cmNlLm5hbWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lICYmIHJlbC5zb3VyY2Uua2luZCA9PT0ga2luZC5uYW1lICYmIHJlbC50YXJnZXQua2luZCA9PT0ga2luZC5uYW1lKS5tYXAocmVsID0+IHJlbC50YXJnZXQubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXNPZlNhbWVLaW5kTm9kZXMgPSByZWxhdGlvbnMuZmlsdGVyKHJlbCA9PiByZWwudGFyZ2V0Lm5hbWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lICYmIHJlbC50YXJnZXQua2luZCA9PT0ga2luZC5uYW1lICYmIHJlbC5zb3VyY2Uua2luZCA9PT0ga2luZC5uYW1lKS5tYXAocmVsID0+IHJlbC5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSAobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVwZW5kZW5jaWVzT2ZTYW1lS2luZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXBlbmRlbmNpZXNPZlNhbWVLaW5kTm9kZXMuaW5jbHVkZXMobm9kZS5uYW1lKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5hbWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9mU2FtZUtpbmROb2Rlcy5pbmNsdWRlcyhub2RlLm5hbWUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAzO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBBID0gZ3JvdXAoYSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBCID0gZ3JvdXAoYik7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwQSAhPT0gZ3JvdXBCKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JvdXBBIC0gZ3JvdXBCO1xuICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnMgPSB0aGlzLmdldFJlbGF0aW9ucygpO1xuICAgICAgICAgICAgbm9kZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFQcmV2b3VzTm9kZXMgPSByZWxhdGlvbnMuZmlsdGVyKHJlbCA9PiByZWwudGFyZ2V0Lm5hbWUgPT09IGEubmFtZSAmJiByZWwudGFyZ2V0LmtpbmQgPT09IGEua2luZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYlByZXZvdXNOb2RlcyA9IHJlbGF0aW9ucy5maWx0ZXIocmVsID0+IHJlbC50YXJnZXQubmFtZSA9PT0gYi5uYW1lICYmIHJlbC50YXJnZXQua2luZCA9PT0gYi5raW5kKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhSW5kZXggPSBwcmV2aW91c0tpbmRzLmZpbmRJbmRleChpdGVtID0+IGFQcmV2b3VzTm9kZXMuc29tZShyZWwgPT4gcmVsLnNvdXJjZS5uYW1lID09PSBpdGVtLm5hbWUpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiSW5kZXggPSBwcmV2aW91c0tpbmRzLmZpbmRJbmRleChpdGVtID0+IGJQcmV2b3VzTm9kZXMuc29tZShyZWwgPT4gcmVsLnNvdXJjZS5uYW1lID09PSBpdGVtLm5hbWUpKTtcbiAgICAgICAgICAgICAgICBpZiAoYUluZGV4ICE9PSAtMSB8fCBiSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhSW5kZXggPT09IGJJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJJbmRleCA+IGFJbmRleCA/IC0xIDogMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG4gICAgc29ydFJlbGF0aW9ucygpIHtcbiAgICAgICAgY29uc3QgY29tYmluZWROb2RlcyA9IHt9O1xuICAgICAgICBjb25zdCBzaGlmdCA9IDEwMDAwMDtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5ub2Rlc0J5S2luZHMpLmZvckVhY2goa2luZCA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IHNoaWZ0O1xuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHNba2luZF0uZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb21iaW5lZE5vZGVzW2tpbmQgKyAnOjonICsgbm9kZS5uYW1lXSA9IChpKyspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZWxhdGlvbnMgPSB0aGlzLmdldFJlbGF0aW9ucygpO1xuICAgICAgICByZWxhdGlvbnMgPT09IG51bGwgfHwgcmVsYXRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWxhdGlvbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICAgICAgY29uc3QgYVNvdXJjZUtleSA9IGAke2Euc291cmNlLmtpbmR9Ojoke2Euc291cmNlLm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IGJTb3VyY2VLZXkgPSBgJHtiLnNvdXJjZS5raW5kfTo6JHtiLnNvdXJjZS5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCBhVGFyZ2V0S2V5ID0gYCR7YS50YXJnZXQua2luZH06OiR7YS50YXJnZXQubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgYlRhcmdldEtleSA9IGAke2IudGFyZ2V0LmtpbmR9Ojoke2IudGFyZ2V0Lm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IGFTb3VyY2VJbmRleCA9IChfYSA9IGNvbWJpbmVkTm9kZXNbYVNvdXJjZUtleV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICAgICAgY29uc3QgYlNvdXJjZUluZGV4ID0gKF9iID0gY29tYmluZWROb2Rlc1tiU291cmNlS2V5XSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgICBjb25zdCBhVGFyZ2V0SW5kZXggPSAoX2MgPSBjb21iaW5lZE5vZGVzW2FUYXJnZXRLZXldKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICAgIGNvbnN0IGJUYXJnZXRJbmRleCA9IChfZCA9IGNvbWJpbmVkTm9kZXNbYlRhcmdldEtleV0pICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICAgICAgY29uc3QgYUluZGV4ID0gYVNvdXJjZUluZGV4ICogc2hpZnQgKyBhVGFyZ2V0SW5kZXg7XG4gICAgICAgICAgICBjb25zdCBiSW5kZXggPSBiU291cmNlSW5kZXggKiBzaGlmdCArIGJUYXJnZXRJbmRleDtcbiAgICAgICAgICAgIHJldHVybiBhSW5kZXggLSBiSW5kZXg7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0aWFsaXplU29ydFJlbGF0aW9ucygpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5zb3VyY2Uua2luZCAhPT0gYi5zb3VyY2Uua2luZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnNvdXJjZS5raW5kLmxvY2FsZUNvbXBhcmUoYi5zb3VyY2Uua2luZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5zb3VyY2UubmFtZS5sb2NhbGVDb21wYXJlKGIuc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5zb3VyY2Uua2luZCA9PT0gYi5zb3VyY2Uua2luZCAmJiBhLnNvdXJjZS5uYW1lID09PSBiLnNvdXJjZS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEudGFyZ2V0LmtpbmQgIT09IGIudGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudGFyZ2V0LmtpbmQubG9jYWxlQ29tcGFyZShiLnRhcmdldC5raW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnRhcmdldC5uYW1lLmxvY2FsZUNvbXBhcmUoYi50YXJnZXQubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0aWFsaXplUmVsYXRpb25zSW5mbygpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBzdW1tYXJ5ID0ge307XG4gICAgICAgIChfYSA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGxpbmsuc291cmNlLmtpbmQgKyAnOjonICsgbGluay5zb3VyY2UubmFtZTtcbiAgICAgICAgICAgIGlmICghc3VtbWFyeVtrZXldKSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldID0geyBzb3VyY2VDb3VudDogMCwgdGFyZ2V0Q291bnQ6IDAsIHNhbWVLaW5kQ291bnQ6IDAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW5rLnNvdXJjZS5raW5kID09PSBsaW5rLnRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldLnNhbWVLaW5kQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlba2V5XS5zb3VyY2VDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0S2V5ID0gbGluay50YXJnZXQua2luZCArICc6OicgKyBsaW5rLnRhcmdldC5uYW1lO1xuICAgICAgICAgICAgaWYgKCFzdW1tYXJ5W3RhcmdldEtleV0pIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W3RhcmdldEtleV0gPSB7IHNvdXJjZUNvdW50OiAwLCB0YXJnZXRDb3VudDogMCwgc2FtZUtpbmRDb3VudDogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VtbWFyeVt0YXJnZXRLZXldLnRhcmdldENvdW50Kys7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0eSA9IHN1bW1hcnlbbm9kZS5raW5kICsgJzo6JyArIG5vZGUubmFtZV07XG4gICAgICAgICAgICBub2RlLmNvbG9yID0gdGhpcy5nZXROb2RlVGFnQ29sb3Iobm9kZSk7XG4gICAgICAgICAgICBub2RlLmNhcmRpbmFsaXR5ID0gY2FyZGluYWxpdHk7XG4gICAgICAgICAgICBpZiAobm9kZS50YXJnZXRDb3VudCkge1xuICAgICAgICAgICAgICAgIG5vZGVbJ2NhcmRpbmFsaXR5J10gPSB7IHRhcmdldENvdW50OiBub2RlLnRhcmdldENvdW50LCBzYW1lS2luZENvdW50OiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zb3VyY2VDb3VudCkge1xuICAgICAgICAgICAgICAgIG5vZGVbJ2NhcmRpbmFsaXR5J10gPSBPYmplY3QuYXNzaWduKChfYSA9IG5vZGVbJ2NhcmRpbmFsaXR5J10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9LCB7IHNvdXJjZUNvdW50OiBub2RlLnNvdXJjZUNvdW50LCBzYW1lS2luZENvdW50OiAwIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0SW5kZXhCeUtpbmQoa2luZCwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5maW5kSW5kZXgob2JqID0+IG9iai5uYW1lID09PSBraW5kKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGxldCBuZXdJbmRleCA9IGluZGV4ICsgb2Zmc2V0O1xuICAgICAgICAgICAgaWYgKG5ld0luZGV4IDwgMCB8fCBuZXdJbmRleCA+PSB0aGlzLm9wdGlvbnMua2luZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0luZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNlYXJjaEJ5TmFtZShub2RlKSB7XG4gICAgICAgIGlmICghbm9kZS5raW5kIHx8ICFub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsdGVyIGNyaXRlcmlhIGlzIGVtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZpbHRlcihpdGVtID0+IGl0ZW0ua2luZCA9PT0gbm9kZS5raW5kICYmIGl0ZW0ubmFtZS5pbmNsdWRlcyhub2RlLm5hbWUpKTtcbiAgICB9XG4gICAgZmluZEJ5TmFtZShuYW1lLCBkYXRhQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFBcnJheS5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcbiAgICB9XG4gICAgZmlsdGVyRGVwZW5kZW5jaWVzKHNlbGVjdGVkTm9kZSwgc2VsZWN0ZWRLaW5kKSB7XG4gICAgICAgIGxldCByZWxhdGVkUmVsYXRpb25zID0gW107XG4gICAgICAgIGNvbnN0IGtpbmROYW1lcyA9IHRoaXMub3B0aW9ucy5raW5kcy5tYXAoayA9PiBrLm5hbWUpO1xuICAgICAgICBsZXQgdGFyZ2V0UmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHJlbGF0aW9uLnNvdXJjZS5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSAmJiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24udGFyZ2V0LmtpbmQpIDogdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGFyZ2V0UmVsYXRpb25zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFNvdXJjZXMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHJlbGF0aW9uLnRhcmdldC5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSAmJiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQpIDogdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU291cmNlTmFtZXMgPSBzZWxlY3RlZFNvdXJjZXMubWFwKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgICAgIHRhcmdldFJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgJiYgc2VsZWN0ZWRTb3VyY2VOYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhcmdldFJlbGF0aW9ucy5wdXNoKC4uLnNlbGVjdGVkU291cmNlcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0S2V5cyA9IHRhcmdldFJlbGF0aW9ucyA/IFsuLi5uZXcgU2V0KHRhcmdldFJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKSldIDogW107XG4gICAgICAgIGNvbnN0IHRhcmdldFRhcmdldFJlbGF0aW9ucyA9IHRoaXMudGFyZ2V0VGFyZ2V0UmVsYXRpb25zKHNlbGVjdGVkTm9kZS5raW5kLCBraW5kTmFtZXMsIHRhcmdldEtleXMpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEtpbmRLZXlzID0gWy4uLm5ldyBTZXQodGFyZ2V0UmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV07XG4gICAgICAgICAgICByZWxhdGVkUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRLaW5kS2V5cy5pbmNsdWRlcyhgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkgJiYgc2VsZWN0ZWRLaW5kLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VLZXlzID0gc291cmNlUmVsYXRpb25zID8gWy4uLm5ldyBTZXQoc291cmNlUmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV0gOiBbXTtcbiAgICAgICAgY29uc3Qgc291cmNlU291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHNvdXJjZUtleXMuaW5jbHVkZXMoYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZWxhdGlvbnMgPSBbLi4ubmV3IFNldChbLi4udGFyZ2V0UmVsYXRpb25zLCAuLi50YXJnZXRUYXJnZXRSZWxhdGlvbnMsIC4uLnNvdXJjZVNvdXJjZVJlbGF0aW9ucywgLi4ucmVsYXRlZFJlbGF0aW9ucywgLi4uc291cmNlUmVsYXRpb25zXS5tYXAocmVsID0+IEpTT04uc3RyaW5naWZ5KHJlbCkpKV0ubWFwKHJlbFN0cmluZyA9PiBKU09OLnBhcnNlKHJlbFN0cmluZykpO1xuICAgICAgICBzZWxlY3RlZE5vZGUuaGFzUmVsYXRpb25zT2ZTYW1lS2luZHMgPSBkaXN0aW5jdFJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCB8fCByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVsYXRpb25zOiBkaXN0aW5jdFJlbGF0aW9ucyxcbiAgICAgICAgICAgIGhhc1JlbGF0ZWRTb3VyY2VPZk90aGVyS2luZHM6IHJlbGF0ZWRSZWxhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICB9O1xuICAgIH1cbiAgICB0YXJnZXRUYXJnZXRSZWxhdGlvbnMoa2luZCwga2luZE5hbWVzLCB0YXJnZXRLZXlzKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1NhbWVLaW5kc09uTm9uU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHRhcmdldEtleXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQgKyAnOjonICsgcmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgocmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kKSA/IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBraW5kIDogdHJ1ZSkgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHRhcmdldEtleXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQgKyAnOjonICsgcmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlsdGVyTm9kZXMocmVsYXRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uS2V5cyA9IHJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25Tb3VyY2VLZXlzID0gcmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24uc291cmNlLmtpbmR9Ojoke3JlbGF0aW9uLnNvdXJjZS5uYW1lfWApO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uU291cmNlS2V5cy5wdXNoKGAke3RoaXMuc2VsZWN0ZWROb2RlLmtpbmR9Ojoke3RoaXMuc2VsZWN0ZWROb2RlLm5hbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGlzdGluY3RLZXlzID0gWy4uLm5ldyBTZXQocmVsYXRpb25LZXlzLmNvbmNhdChyZWxhdGlvblNvdXJjZUtleXMpKV07XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maWx0ZXIobm9kZSA9PiBkaXN0aW5jdEtleXMuaW5jbHVkZXMoYCR7bm9kZS5raW5kfTo6JHtub2RlLm5hbWV9YCkpO1xuICAgIH1cbiAgICBtZXJnZURhdGEob3JpZ2luRGF0YSwgYXBwZW5kRGF0YSkge1xuICAgICAgICBhcHBlbmREYXRhLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG9yaWdpbkRhdGEubm9kZXMuZmluZEluZGV4KGV4aXN0aW5nTm9kZSA9PiBleGlzdGluZ05vZGUua2luZCA9PT0gbm9kZS5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSBub2RlLm5hbWUpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IG9yaWdpbkRhdGEubm9kZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVsYXRpb25zVG9SZW1vdmUgPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdOb2RlLmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSByZWxhdGlvbi5zb3VyY2UubmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdOb2RlLmtpbmQgPT09IHJlbGF0aW9uLnRhcmdldC5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSByZWxhdGlvbi50YXJnZXQubmFtZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3VuZFJlbGF0aW9uc1RvUmVtb3ZlLmZvckVhY2gocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbkluZGV4ID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuaW5kZXhPZihyZWxhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5yZWxhdGlvbnMuc3BsaWNlKHJlbGF0aW9uSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5ub2Rlc1tpbmRleF0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwZW5kRGF0YS5yZWxhdGlvbnMuZm9yRWFjaChyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1JlbGF0aW9uSW5kZXggPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5maW5kSW5kZXgoZXhpc3RpbmdSZWxhdGlvbiA9PiBleGlzdGluZ1JlbGF0aW9uLnNvdXJjZS5raW5kID09PSByZWxhdGlvbi5zb3VyY2Uua2luZCAmJlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVsYXRpb24uc291cmNlLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5uYW1lICYmXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWxhdGlvbi50YXJnZXQua2luZCA9PT0gcmVsYXRpb24udGFyZ2V0LmtpbmQgJiZcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlbGF0aW9uLnRhcmdldC5uYW1lID09PSByZWxhdGlvbi50YXJnZXQubmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdSZWxhdGlvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEucmVsYXRpb25zLnB1c2gocmVsYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9yaWdpbkRhdGE7XG4gICAgfVxufVxuZXhwb3J0IHsgU2Fua2V5Q2hhcnREYXRhLCBJbmNsdWRlS2luZCB9O1xuIiwiaW1wb3J0IHsgRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi9ldmVudC1oYW5kbGVyJztcbmNsYXNzIFNhbmtleUNoYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcihzdmdFbGVtZW50LCBjdXN0b21PcHRpb25zKSB7XG4gICAgICAgIHRoaXMuU1ZHX05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQgPSBzdmdFbGVtZW50O1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIE5PREVfVFlQRV9USVRMRTogXCJub2RlLWtpbmQtdGl0bGVcIixcbiAgICAgICAgICAgIE5PREVfVElUTEU6IFwibm9kZS10aXRsZVwiLFxuICAgICAgICAgICAgUkVMQVRJT046IFwicmVsYXRpb25cIixcbiAgICAgICAgICAgIENBUkRJTkFMSVRZOiBcImNhcmRpbmFsaXR5XCIsXG4gICAgICAgICAgICBTRUxFQ1RFRDogJ3NlbGVjdGVkJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBub2RlV2lkdGg6IDEwLFxuICAgICAgICAgICAgbm9kZUxpbmVIZWlnaHQ6IDE4LFxuICAgICAgICAgICAgbWFyZ2luWDogMTUsXG4gICAgICAgICAgICBtYXJnaW5ZOiA1LFxuICAgICAgICAgICAgbGVmdFg6IDE1LFxuICAgICAgICAgICAgdG9wWTogMTAsXG4gICAgICAgICAgICBub2RlTWFyZ2luWTogMTAsXG4gICAgICAgICAgICBub2RlQ29sdW1uV2lkdGg6IDMwMCxcbiAgICAgICAgICAgIGRlZmF1bHROb2RlQ29sb3I6IFwiZ3JheVwiLFxuICAgICAgICAgICAgcmVuZGVyS2luZEFzQ29sdW1zOiB0cnVlLFxuICAgICAgICAgICAgdHJhZmZpY0xvZzEwRmFjdG9yOiAxMixcbiAgICAgICAgICAgIHJlbGF0aW9uRGVmYXVsdFdpZHRoOiAxNSxcbiAgICAgICAgICAgIHJlbGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRPcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgYW5hbHl0aWNzT3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMixcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgICAgICBub25QUk9EOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXNoQXJyYXk6ICcxMCwxJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzYW1lS2luZEluZGVudGF0aW9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGVjdGVkTm9kZToge1xuICAgICAgICAgICAgICAgIGRyb3BTaGFkb3c6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmMTAxMCcsXG4gICAgICAgICAgICAgICAgaG92ZXJPcGFjaXR5OiAwLjJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVuY2F0ZVRleHQ6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0Rm9udFNpemVBbmRGYW1pbHk6ICcxNnB4IEFyaWFsJyxcbiAgICAgICAgICAgICAgICBlbGxpcHNlQ2hhcmFjdGVyOiAn4oCmJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvb3RDaGFyYWN0ZXI6ICfijIInXG4gICAgICAgIH07XG4gICAgICAgIGlmIChjdXN0b21PcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoY3VzdG9tT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVkSGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5ub2RlUG9zaXRpb25zID0ge307XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVQb3NpdGlvblkgPSAtMTtcbiAgICAgICAgdGhpcy50cnVuY2F0ZVRleHQgPSB0aGlzLmNyZWF0ZVRydW5jYXRlVGV4dCgpO1xuICAgIH1cbiAgICBzZXRPcHRpb25zKGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgY3VzdG9tT3B0aW9ucy5ub2RlQ29sdW1uV2lkdGggPSBOdW1iZXIoY3VzdG9tT3B0aW9ucy5ub2RlQ29sdW1uV2lkdGgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZXBNZXJnZSh0aGlzLm9wdGlvbnMsIGN1c3RvbU9wdGlvbnMpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgICBzZXREYXRhKGNoYXJ0RGF0YSkge1xuICAgICAgICBpZiAodGhpcy5jaGFydERhdGEgIT09IGNoYXJ0RGF0YSkge1xuICAgICAgICAgICAgdGhpcy5jaGFydERhdGEgPSBjaGFydERhdGE7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuZGlzcGF0Y2hFdmVudCgnc2VsZWN0aW9uQ2hhbmdlZCcsIHsgbm9kZTogdGhpcy5jaGFydERhdGEuZ2V0U2VsZWN0ZWROb2RlKCksIHBvc2l0aW9uOiB7IHk6IDAgfSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXREYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFydERhdGE7XG4gICAgfVxuICAgIGFkZFNlbGVjdGlvbkNoYW5nZWRMaXN0ZW5lcnMoY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuc3Vic2NyaWJlKCdzZWxlY3Rpb25DaGFuZ2VkJywgY2FsbGJhY2tGdW5jdGlvbik7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmN0aW9uKHsgbm9kZTogKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRTZWxlY3RlZE5vZGUoKSwgcG9zaXRpb246IHsgeTogMCB9IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZENvbnRleHRNZW51TGlzdGVuZXJzKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbiA9IGNhbGxiYWNrRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0RGlyZWN0VGFyZ2V0Tm9kZXNPZihzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0UmVsYXRpb25zKCkuZmlsdGVyKChyZWxhdGlvbikgPT4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmXG4gICAgICAgICAgICByZWxhdGlvbi5zb3VyY2UubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi50YXJnZXQpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICB9XG4gICAgZ2V0RGlyZWN0U291cmNlTm9kZXNPZihzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0UmVsYXRpb25zKCkuZmlsdGVyKChyZWxhdGlvbikgPT4gcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmXG4gICAgICAgICAgICByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi5zb3VyY2UpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICB9XG4gICAgY3JlYXRlVHJ1bmNhdGVUZXh0KCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgY29uc3QgY2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGVsbGlwc2VDaGFyID0gdGhpcy5vcHRpb25zLnRydW5jYXRlVGV4dC5lbGxpcHNlQ2hhcmFjdGVyO1xuICAgICAgICBjb25zdCBmb250U2l6ZUFuZEZhbWlseSA9IHRoaXMub3B0aW9ucy50cnVuY2F0ZVRleHQuZGVmYXVsdEZvbnRTaXplQW5kRmFtaWx5O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gdHJ1bmNhdGVUZXh0KHRleHQsIG1heFdpZHRoLCBmb250ID0gZm9udFNpemVBbmRGYW1pbHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gYCR7dGV4dH0tJHttYXhXaWR0aH0tJHtmb250fWA7XG4gICAgICAgICAgICBpZiAoY2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBmb250O1xuICAgICAgICAgICAgaWYgKGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGggPD0gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjYWNoZS5zZXQoY2FjaGVLZXksIHRleHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRydW5jYXRlZFRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQubWVhc3VyZVRleHQodHJ1bmNhdGVkVGV4dCArIGVsbGlwc2VDaGFyKS53aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgdHJ1bmNhdGVkVGV4dCA9IHRydW5jYXRlZFRleHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdHJ1bmNhdGVkVGV4dCArIGVsbGlwc2VDaGFyO1xuICAgICAgICAgICAgY2FjaGUuc2V0KGNhY2hlS2V5LCByZXN1bHQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVzZXRTdmcoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlZEhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICA8ZGVmcz5cbiAgICAgICAgPGZpbHRlciBpZD1cImRyb3BzaGFkb3dcIj5cbiAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPVwiMC40XCIgLz5cbiAgICAgICAgPC9maWx0ZXI+XG4gICAgICA8L2RlZnM+XG4gICAgYDtcbiAgICB9XG4gICAgdXBkYXRlSGVpZ2h0KCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgY29uc3Qgd2lkdGggPSAoKChfYSA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2lkdGgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApICsgKChfYiA9IHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApKSAqIE1hdGgubWF4KDEsICgoX2MgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmdldEtpbmRzKCkubGVuZ3RoKSB8fCAwKSArICh0aGlzLm9wdGlvbnMubWFyZ2luWCAqIDIpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHJlbmRlckVsaXBzaXNNZW51KHgsIHksIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICBjb25zdCBtZW51R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCAnZWxsaXBzaXNNZW51Jyk7XG4gICAgICAgIG1lbnVHcm91cC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2N1cnNvcjogcG9pbnRlcjsnKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3ggKyAyLjV9LCAke3l9KWApO1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jcmVhdGVSZWN0KC0yLjUsIDAsIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgsIDIyLCAnYmxhY2snLCAnMC4yJyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeCcsICc1Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeScsICc1Jyk7XG4gICAgICAgIG1lbnVHcm91cC5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgZm9yIChsZXQgaXkgPSA1OyBpeSA8PSAxNTsgaXkgKz0gNSkge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVDaXJjbGUoMi41LCBpeSwgMiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgIG1lbnVHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICB9XG4gICAgICAgIG1lbnVHcm91cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudUNhbGxiYWNrRnVuY3Rpb24oZXZlbnQsIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVudUdyb3VwO1xuICAgIH1cbiAgICBkZWVwTWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnIHx8IHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0JyB8fCBzb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc291cmNlKSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XS5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNvdXJjZVtrZXldID09PSAnb2JqZWN0JyAmJiBzb3VyY2Vba2V5XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kZWVwTWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgcmVuZGVyTm9kZXMobm9kZXMsIHBvc2l0aW9uWCwgc2VsZWN0ZWROb2RlLCBraW5kLCBkaXJlY3RUYXJnZXROb2RlcywgZGlyZWN0U291cmNlTm9kZXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICBjb25zdCBzdmdHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBsZXQgb3ZlcmFsbFkgPSB0aGlzLm9wdGlvbnMudG9wWTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gKGtpbmQgPT09IG51bGwgfHwga2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDoga2luZC50aXRsZSkgfHwgKChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0VGl0bGUoKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSAoa2luZCA9PT0gbnVsbCB8fCBraW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBraW5kLmNvbG9yKSB8fCAoKF9kID0gKF9jID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5nZXRUaXRsZSgpKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuY29sb3IpIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgY29uc3QgeCA9IHBvc2l0aW9uWCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5vcHRpb25zLnRvcFkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWSArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICBsZXQgeDIgPSBwb3NpdGlvblggKyB0aGlzLm9wdGlvbnMubm9kZVdpZHRoICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IHkyID0gdGhpcy5vcHRpb25zLnRvcFkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWSArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoKTtcbiAgICAgICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgICAgIGlmIChraW5kID09PSBudWxsIHx8IGtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGtpbmQuY29sb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNyZWF0ZUNpcmNsZSh4LCB5LCA1LCBjb2xvcik7XG4gICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9ICd8ICc7XG4gICAgICAgICAgICAgICAgeDIgLT0gMTM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub2RlS2luZFRpdGxlID0gdGhpcy5jcmVhdGVTdmdUZXh0KHByZWZpeCArIHRpdGxlLCBbdGhpcy5jbGFzc05hbWUuTk9ERV9UWVBFX1RJVExFXSk7XG4gICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInhcIiwgeDIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBub2RlS2luZFRpdGxlLnNldEF0dHJpYnV0ZShcInlcIiwgeTIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChub2RlS2luZFRpdGxlKTtcbiAgICAgICAgICAgIG92ZXJhbGxZICs9IDI1O1xuICAgICAgICB9XG4gICAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VSZWxhdGlvbnMgPSBub2RlLnNvdXJjZVJlbGF0aW9ucyB8fCB7IGhlaWdodDogMCwgY291bnQ6IDAgfTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFJlbGF0aW9ucyA9IG5vZGUudGFyZ2V0UmVsYXRpb25zIHx8IHsgaGVpZ2h0OiAwLCBjb3VudDogMCB9O1xuICAgICAgICAgICAgY29uc3QgbGluZXNDb3VudCA9IDEgKyAobm9kZS5zdWJ0aXRsZSA/IDEgOiAwKSArICgoKF9hID0gbm9kZS50YWdzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA/IDEgOiAwKSArICh0aGlzLm9wdGlvbnMucmVuZGVyS2luZEFzQ29sdW1zID8gMCA6IDEpO1xuICAgICAgICAgICAgY29uc3QgbGluZXNIZWlnaHQgPSBsaW5lc0NvdW50ICogdGhpcy5vcHRpb25zLm5vZGVMaW5lSGVpZ2h0ICsgdGhpcy5vcHRpb25zLm1hcmdpblk7XG4gICAgICAgICAgICBub2RlLnRleHRMaW5lc0hlaWdodCA9IGxpbmVzSGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkTm9kZSAmJiBzZWxlY3RlZE5vZGUubmFtZSA9PT0gbm9kZS5uYW1lICYmIHNlbGVjdGVkTm9kZS5raW5kID09PSBub2RlLmtpbmQgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZWN0SGVpZ2h0ID0gMiAqIHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgTWF0aC5tYXgobGluZXNIZWlnaHQsIGxpbmVzSGVpZ2h0ICsgKHNvdXJjZVJlbGF0aW9ucy5oZWlnaHQgPiAwID8gc291cmNlUmVsYXRpb25zLmhlaWdodCArIDEyIDogMCksICh0YXJnZXRSZWxhdGlvbnMuaGVpZ2h0ID4gMCA/IHRhcmdldFJlbGF0aW9ucy5oZWlnaHQgKyAxMiA6IDApKTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLm9wdGlvbnMubWFyZ2luWSArIG92ZXJhbGxZO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBub2RlLmNvbG9yIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgbGV0IHBvc1ggPSBwb3NpdGlvblg7XG4gICAgICAgICAgICBsZXQgcmVjdFBvc2l0aW9uV2lkdGggPSB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpZHRoO1xuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5oYXNSZWxhdGVkU291cmNlT2ZTYW1lS2luZCkge1xuICAgICAgICAgICAgICAgIHBvc1ggKz0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNhbWVLaW5kSW5kZW50YXRpb247XG4gICAgICAgICAgICAgICAgcmVjdFBvc2l0aW9uV2lkdGggLT0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNhbWVLaW5kSW5kZW50YXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCAnZycpO1xuICAgICAgICAgICAgY29uc3QgcmVjdEhvdmVyID0gdGhpcy5jcmVhdGVSZWN0KHBvc1gsIHksIHJlY3RQb3NpdGlvbldpZHRoLCByZWN0SGVpZ2h0LCBjb2xvciwgJzAnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNyZWF0ZVJlY3QocG9zWCwgeSwgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCwgcmVjdEhlaWdodCwgY29sb3IpO1xuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0U2hhZG93ID0gdGhpcy5jcmVhdGVSZWN0KHBvc1ggLSAyLCB5IC0gMiwgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIDQsIHJlY3RIZWlnaHQgKyA0LCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdyeCcsIFwiNlwiKTtcbiAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgncnknLCBcIjZcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RlZE5vZGUuZHJvcFNoYWRvdykge1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsbCcsICdibGFjaycpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsdGVyJywgJ3VybCgjZHJvcHNoYWRvdyknKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMC4yXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBcIjJcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgXCIxXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RTaGFkb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgICAgIHJlY3RIb3Zlci5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RIb3Zlcik7XG4gICAgICAgICAgICBpZiAobm9kZS5jYXJkaW5hbGl0eSB8fCBub2RlLnRhcmdldENvdW50IHx8IG5vZGUuc291cmNlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0RpcmVjdFRhcmdldE5vZGVzID0gKGRpcmVjdFRhcmdldE5vZGVzID09PSBudWxsIHx8IGRpcmVjdFRhcmdldE5vZGVzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXJlY3RUYXJnZXROb2Rlcy5maW5kKGRpcmVjdE5vZGUgPT4gbm9kZS5uYW1lID09PSBkaXJlY3ROb2RlLm5hbWUgJiYgbm9kZS5raW5kID09PSBkaXJlY3ROb2RlLmtpbmQpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0RpcmVjdFNvdXJjZU5vZGVzID0gKGRpcmVjdFNvdXJjZU5vZGVzID09PSBudWxsIHx8IGRpcmVjdFNvdXJjZU5vZGVzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXJlY3RTb3VyY2VOb2Rlcy5maW5kKGRpcmVjdE5vZGUgPT4gbm9kZS5uYW1lID09PSBkaXJlY3ROb2RlLm5hbWUgJiYgbm9kZS5raW5kID09PSBkaXJlY3ROb2RlLmtpbmQpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENhcmRpbmFsaXR5VGV4dChnLCBub2RlLCBwb3NYLCB5LCByZWN0SGVpZ2h0LCBjb2xvciwgaXNTZWxlY3RlZCwgaXNEaXJlY3RUYXJnZXROb2RlcywgaXNEaXJlY3RTb3VyY2VOb2Rlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KCcnLCBbdGhpcy5jbGFzc05hbWUuTk9ERV9USVRMRSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YKSk7XG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgeS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5jcmVhdGVUZXh0TGluZXMobm9kZSwgdGhpcy5vcHRpb25zLm5vZGVDb2x1bW5XaWR0aCAtIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpO1xuICAgICAgICAgICAgbGluZXMuZm9yRWFjaCgobGluZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcInRzcGFuXCIpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCkpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZShcImR5XCIsIFwiMS4yZW1cIik7XG4gICAgICAgICAgICAgICAgdHNwYW4udGV4dENvbnRlbnQgPSBsaW5lLnRleHQ7XG4gICAgICAgICAgICAgICAgdHNwYW4uY2xhc3NMaXN0LmFkZChsaW5lLmNsYXNzKTtcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgIGlmICghKG5vZGUgPT09IG51bGwgfHwgbm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbm9kZS5wbGFjZUhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEhvdmVyQW5kQ2xpY2tFdmVudHMoZywgcmVjdEhvdmVyLCBub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKGcpO1xuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQgJiYgIShub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGxhY2VIb2xkZXIpICYmIHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJFbGlwc2lzTWVudShwb3NYLCB5LCBub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGVQb3NpdGlvbnNbbm9kZS5raW5kICsgJzo6JyArIG5vZGUubmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICB4OiBwb3NYLFxuICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgc291cmNlWTogeSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZLFxuICAgICAgICAgICAgICAgIHRhcmdldFk6IHksXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiByZWN0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIHRleHRMaW5lc0hlaWdodDogbm9kZS50ZXh0TGluZXNIZWlnaHQsXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgYWNjdW11bGF0ZWRTb3VyY2VZOiAwLFxuICAgICAgICAgICAgICAgIGFjY3VtdWxhdGVkVGFyZ2V0WTogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG92ZXJhbGxZICs9IHJlY3RIZWlnaHQgKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSBNYXRoLm1heCh0aGlzLmNhbGN1bGF0ZWRIZWlnaHQsIG92ZXJhbGxZICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZICogMik7XG4gICAgICAgIHJldHVybiBzdmdHcm91cDtcbiAgICB9XG4gICAgY3JlYXRlQ2lyY2xlKGN4LCBjeSwgciwgZmlsbCkge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2NpcmNsZScpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeCcsIGN4LnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsIGN5LnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgci50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIGZpbGwpO1xuICAgICAgICByZXR1cm4gY2lyY2xlO1xuICAgIH1cbiAgICBjcmVhdGVSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQsIGZpbGwsIG9wYWNpdHkgPSBcIjFcIikge1xuICAgICAgICBjb25zdCByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCAncmVjdCcpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgneCcsIHgudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd5JywgeS50b1N0cmluZygpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeCcsIFwiNVwiKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J5JywgXCI1XCIpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnZmlsbCcsIGZpbGwpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgb3BhY2l0eSk7XG4gICAgICAgIHJldHVybiByZWN0O1xuICAgIH1cbiAgICBhcHBlbmRDYXJkaW5hbGl0eVRleHQoZywgbm9kZSwgcG9zWCwgeSwgcmVjdEhlaWdodCwgY29sb3IsIGlzU2VsZWN0ZWQsIGlzRGlyZWN0UmVsYXRlZFRvU2VsZWN0ZWQsIGlzRGlyZWN0U291cmNlTm9kZXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rLCBfbCwgX207XG4gICAgICAgIGlmICgoX2IgPSAoX2EgPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc291cmNlQ291bnQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDAgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxOb2Rlc0xvYWRlZCA9ICgoX2MgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmFsbE5vZGVzTG9hZGVkKSB8fCBpc1NlbGVjdGVkIHx8IGlzRGlyZWN0UmVsYXRlZFRvU2VsZWN0ZWQ7XG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0eVRleHQgPSAoKF9kID0gbm9kZS5jYXJkaW5hbGl0eSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLnNvdXJjZUNvdW50KSArIChhbGxOb2Rlc0xvYWRlZCA/ICcnIDogJy4uKicpICsgKCgoX2YgPSAoX2UgPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Uuc2FtZUtpbmRDb3VudCkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogMCkgPiAwID8gJysnICsgKChfaCA9IChfZyA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5zYW1lS2luZENvdW50KSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiAwKSA6ICcnKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJy0gJyArIGNhcmRpbmFsaXR5VGV4dCwgW3RoaXMuY2xhc3NOYW1lLkNBUkRJTkFMSVRZLCBpc1NlbGVjdGVkID8gdGhpcy5jbGFzc05hbWUuU0VMRUNURUQgOiAnJ10pO1xuICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblggLSA2KSk7XG4gICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyByZWN0SGVpZ2h0IC0gMikpO1xuICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoc291cmNlVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChfayA9IChfaiA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai50YXJnZXRDb3VudCkgIT09IG51bGwgJiYgX2sgIT09IHZvaWQgMCA/IF9rIDogMCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFsbE5vZGVzTG9hZGVkID0gKChfbCA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2wuYWxsTm9kZXNMb2FkZWQpIHx8IGlzU2VsZWN0ZWQgfHwgaXNEaXJlY3RTb3VyY2VOb2RlcztcbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5VGV4dCA9ICgoX20gPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX20udGFyZ2V0Q291bnQpICsgKGFsbE5vZGVzTG9hZGVkID8gJycgOiAnLi4qJyk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRUZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KGNhcmRpbmFsaXR5VGV4dCArICcgLScsIFt0aGlzLmNsYXNzTmFtZS5DQVJESU5BTElUWSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgIHRhcmdldFRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YIC0gMTQpKTtcbiAgICAgICAgICAgIHRhcmdldFRleHQuc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSArIHJlY3RIZWlnaHQgLSAyKSk7XG4gICAgICAgICAgICB0YXJnZXRUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgY29sb3IpO1xuICAgICAgICAgICAgdGFyZ2V0VGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQodGFyZ2V0VGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY3JlYXRlVGV4dExpbmVzKG5vZGUsIG1heFRleHRXaWR0aCkge1xuICAgICAgICBjb25zdCB0cnVuY2F0ZWRUaXRsZSA9IHRoaXMudHJ1bmNhdGVUZXh0ID8gdGhpcy50cnVuY2F0ZVRleHQobm9kZS50aXRsZSA/IG5vZGUudGl0bGUgOiBub2RlLm5hbWUsIG1heFRleHRXaWR0aCkgOiAobm9kZS50aXRsZSA/IG5vZGUudGl0bGUgOiBub2RlLm5hbWUpO1xuICAgICAgICBjb25zdCBsaW5lcyA9IFt7IHRleHQ6IHRydW5jYXRlZFRpdGxlLCBjbGFzczogXCJoZWFkbGluZVwiIH1dO1xuICAgICAgICBpZiAobm9kZS5zdWJ0aXRsZSkge1xuICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVkU3VidGl0bGUgPSB0aGlzLnRydW5jYXRlVGV4dCA/IHRoaXMudHJ1bmNhdGVUZXh0KG5vZGUuc3VidGl0bGUsIG1heFRleHRXaWR0aCkgOiBub2RlLnN1YnRpdGxlO1xuICAgICAgICAgICAgbGluZXMuc3BsaWNlKDEsIDAsIHsgdGV4dDogdHJ1bmNhdGVkU3VidGl0bGUsIGNsYXNzOiBcInN1YnRpdGxlXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudGFncykge1xuICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVUYWdzID0gdGhpcy50cnVuY2F0ZVRleHQgPyB0aGlzLnRydW5jYXRlVGV4dChub2RlLnRhZ3Muam9pbignLCAnKSwgbWF4VGV4dFdpZHRoKSA6IG5vZGUudGFncy5qb2luKCcsICcpO1xuICAgICAgICAgICAgbGluZXMucHVzaCh7IHRleHQ6IHRydW5jYXRlVGFncywgY2xhc3M6IFwiZGVzY3JpcHRpb25cIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMpIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goeyB0ZXh0OiBub2RlLmtpbmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBub2RlLmtpbmQuc2xpY2UoMSksIGNsYXNzOiBcImRlc2NyaXB0aW9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbiAgICBhZGRIb3ZlckFuZENsaWNrRXZlbnRzKGdyb3VwLCByZWN0SG92ZXIsIG5vZGUpIHtcbiAgICAgICAgZ3JvdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0Tm9kZShub2RlKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5kaXNwYXRjaEV2ZW50KCdzZWxlY3Rpb25DaGFuZ2VkJywgeyBub2RlLCBwb3NpdGlvbjogeyB5OiB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSB9IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3JvdXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgdGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ob3Zlck9wYWNpdHkudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBncm91cC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjBcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVTdmdUZXh0KHRleHRDb250ZW50LCBjbGFzc05hbWVzKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidGV4dFwiKTtcbiAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiBjbGFzc05hbWUpKTtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmVuZGVyUmVsYXRpb25zKHJlbGF0aW9ucywgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwga2luZCwgY29sb3IgfSA9IHNlbGVjdGVkTm9kZSB8fCB7fTtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbG9yID0gY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgIGNvbnN0IGxvY2FsTm9kZVBvc2l0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlUG9zaXRpb25zKSk7XG4gICAgICAgIGNvbnN0IGdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIGNvbnN0IGdQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVBvc2l0aW9uID0gbG9jYWxOb2RlUG9zaXRpb25zW2xpbmsuc291cmNlLmtpbmQgKyAnOjonICsgbGluay5zb3VyY2UubmFtZV07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGxvY2FsTm9kZVBvc2l0aW9uc1tsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWVdO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRQb3NpdGlvbiB8fCAhc291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsaW5rQ29sb3IgPSBzb3VyY2VQb3NpdGlvbi5ub2RlLmNvbG9yIHx8IGRlZmF1bHRDb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IHNhbWVLaW5kID0gbGluay5zb3VyY2Uua2luZCA9PT0gbGluay50YXJnZXQua2luZDtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU291cmNlID0gc2FtZUtpbmQgPyAwIDogdGhpcy5jYWxjdWxhdGVHYXAoc291cmNlUG9zaXRpb24uc291cmNlSW5kZXgrKyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdFRleHRMaW5lc0hlaWd0aCA9IChfYSA9IHNvdXJjZVBvc2l0aW9uLnRleHRMaW5lc0hlaWdodCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICAgICAgICAgIGlmIChmaXJzdFRleHRMaW5lc0hlaWd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VQb3NpdGlvbi50ZXh0TGluZXNIZWlnaHQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc291cmNlUG9zaXRpb24uYWNjdW11bGF0ZWRTb3VyY2VZID0gZmlyc3RUZXh0TGluZXNIZWlndGggKyBzb3VyY2VQb3NpdGlvbi5hY2N1bXVsYXRlZFNvdXJjZVkgKyBzZWxlY3RlZFNvdXJjZTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGFyZ2V0ID0gc2FtZUtpbmQgPyAwIDogdGhpcy5jYWxjdWxhdGVHYXAodGFyZ2V0UG9zaXRpb24udGFyZ2V0SW5kZXgrKyk7XG4gICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFkgPSAoKF9iID0gdGFyZ2V0UG9zaXRpb24uYWNjdW11bGF0ZWRUYXJnZXRZKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKSArIHNlbGVjdGVkVGFyZ2V0O1xuICAgICAgICAgICAgY29uc3QgeyBzb3VyY2UsIHRhcmdldCwgaGVpZ2h0IH0gPSBsaW5rO1xuICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MVggPSBzb3VyY2VQb3NpdGlvbi54ICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDFZID0gc291cmNlUG9zaXRpb24uc291cmNlWSArICgoaGVpZ2h0IHx8IDApIC8gMikgKyBzb3VyY2VQb3NpdGlvbi5hY2N1bXVsYXRlZFNvdXJjZVk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQyWSA9IHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgdGFyZ2V0UG9zaXRpb24udGFyZ2V0WSArICgoaGVpZ2h0IHx8IDApIC8gMikgKyB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQyWCA9IChzb3VyY2VQb3NpdGlvbi54ICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIHRhcmdldFBvc2l0aW9uLngpIC8gMjtcbiAgICAgICAgICAgIGxldCBwYXRoRDtcbiAgICAgICAgICAgIGxldCBvcGFjaXR5ID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLm9wYWNpdHk7XG4gICAgICAgICAgICBsZXQgc3Ryb2tlV2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgICB2YXIgb3BhY2l0eUVtcGhhc2l6ZVNlbGVjdGVkID0gMDtcbiAgICAgICAgICAgIGlmICgobGluay5zb3VyY2Uua2luZCA9PT0ga2luZCAmJiBsaW5rLnNvdXJjZS5uYW1lID09PSBuYW1lKSB8fCAobGluay50YXJnZXQua2luZCA9PT0ga2luZCAmJiBsaW5rLnRhcmdldC5uYW1lID09PSBuYW1lKSkge1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgKz0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNlbGVjdGVkT3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlUG9zaXRpb24uaW5kZXggPCB0YXJnZXRQb3NpdGlvbi5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDFYID0gc291cmNlUG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSBzb3VyY2VQb3NpdGlvbi55ICsgc291cmNlUG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDJYID0gdGFyZ2V0UG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi55ICsgKHRhcmdldFBvc2l0aW9uLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtwb2ludDFYfSwke3BvaW50MVl9IEMke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDFYfSwke3BvaW50Mll9ICR7cG9pbnQyWH0sJHtwb2ludDJZfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDJYID0gc291cmNlUG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSBzb3VyY2VQb3NpdGlvbi55ICsgKHNvdXJjZVBvc2l0aW9uLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDFYID0gdGFyZ2V0UG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSB0YXJnZXRQb3NpdGlvbi55ICsgdGFyZ2V0UG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtwb2ludDFYfSwke3BvaW50MVl9IEMke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDFYfSwke3BvaW50Mll9ICR7cG9pbnQyWH0sJHtwb2ludDJZfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGggPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0aEQgPSBgTSR7Y29udHJvbFBvaW50MVh9LCR7Y29udHJvbFBvaW50MVl9IEMke2NvbnRyb2xQb2ludDJYfSwke2NvbnRyb2xQb2ludDFZfSAke2NvbnRyb2xQb2ludDJYfSwke2NvbnRyb2xQb2ludDJZfSAke3RhcmdldFBvc2l0aW9uLnh9LCR7Y29udHJvbFBvaW50Mll9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgcGF0aEQpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIFN0cmluZyhzdHJva2VXaWR0aCB8fCAwKSk7XG4gICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgbGlua0NvbG9yKTtcbiAgICAgICAgICAgIGdQYXRoLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgbGV0IGFuYWx5dGljcztcbiAgICAgICAgICAgIGlmIChhbmFseXRpY3MpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuYWx5dGljcyA9IGxpbmsuYW5hbHl0aWNzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWRLaW5kID0gbGluay50YXJnZXQua2luZCA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSB8fCBsaW5rLnNvdXJjZS5raW5kID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChfYyA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJycsIFt0aGlzLmNsYXNzTmFtZS5SRUxBVElPTl0pO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcodGFyZ2V0UG9zaXRpb24ueCAtIHRoaXMub3B0aW9ucy5tYXJnaW5ZKSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKGhlaWdodCB8fCAwIC8gMikgKyBzZWxlY3RlZFRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FbnYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgdHNwYW5FbnYudGV4dENvbnRlbnQgPSAoYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVudmlyb25tZW50KSB8fCAnJztcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuRW52KTtcbiAgICAgICAgICAgICAgICBpZiAoKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudCkgJiYgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmVudmlyb25tZW50W2FuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNoYXJyYXknLCB0aGlzLm9wdGlvbnMucmVsYXRpb24uZW52aXJvbm1lbnRbYW5hbHl0aWNzLmVudmlyb25tZW50XS5kYXNoQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKF9kID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVycm9ycykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogMCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JSYXRpbyA9ICgxMDAgLyAoKF9lID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLnRyYWZmaWMpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IDApICogKChfZiA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lcnJvcnMpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IDApKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnRleHRDb250ZW50ID0gJyAnICsgKGVycm9yUmF0aW8gPT0gMCA/IFwiKDwwLjAxJSlcIiA6ICcoJyArIGVycm9yUmF0aW8udG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyUpJyk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW5FcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi50ZXh0Q29udGVudCA9ICcgJyArIChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYy50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgICAgICBnVGV4dC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gb3BhY2l0eSArIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5hbmFseXRpY3NPcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc291cmNlLmtpbmQgIT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZVBvc2l0aW9uLnNvdXJjZVkgKz0gaGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCAhPT0gdm9pZCAwID8gaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uLnRhcmdldFkgKz0gaGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCAhPT0gdm9pZCAwID8gaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnUGF0aCk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnVGV4dCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIGlmICghdGhpcy5jaGFydERhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGUgPSAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFNlbGVjdGVkTm9kZSgpO1xuICAgICAgICB0aGlzLnJlc2V0U3ZnKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUmVsYXRpb25XZWlnaHRzKChfYyA9IChfYiA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZ2V0Tm9kZXMoKSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogW10sIChfZSA9IChfZCA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuZ2V0UmVsYXRpb25zKCkpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IFtdLCBzZWxlY3RlZE5vZGUpO1xuICAgICAgICBsZXQgY29sdW1uID0gMDtcbiAgICAgICAgY29uc3QgY29sdW1uV2lkdGggPSB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpZHRoICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aDtcbiAgICAgICAgY29uc3Qga2luZHMgPSAoX2YgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLmdldEtpbmRzKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlUG9zaXRpb25ZID0gLTE7XG4gICAgICAgIGNvbnN0IHN2Z05vZGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIGlmIChraW5kcyAmJiBraW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBkaXJlY3RUYXJnZXROb2RlcyA9IHNlbGVjdGVkTm9kZSA/IHRoaXMuZ2V0RGlyZWN0VGFyZ2V0Tm9kZXNPZihzZWxlY3RlZE5vZGUpIDogW107XG4gICAgICAgICAgICBjb25zdCBkaXJlY3RTb3VyY2VOb2RlcyA9IHNlbGVjdGVkTm9kZSA/IHRoaXMuZ2V0RGlyZWN0U291cmNlTm9kZXNPZihzZWxlY3RlZE5vZGUpIDogW107XG4gICAgICAgICAgICBraW5kcy5mb3JFYWNoKGtpbmQgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgc3ZnTm9kZXMuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJOb2RlcygoX2IgPSAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldE5vZGVzQnlLaW5kKGtpbmQubmFtZSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdLCB0aGlzLm9wdGlvbnMubGVmdFggKyBjb2x1bW5XaWR0aCAqIGNvbHVtbisrLCBzZWxlY3RlZE5vZGUsIGtpbmQsIGRpcmVjdFRhcmdldE5vZGVzLCBkaXJlY3RTb3VyY2VOb2RlcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdmdOb2Rlcy5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlck5vZGVzKChfaCA9IChfZyA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cuZ2V0Tm9kZXMoKSkgIT09IG51bGwgJiYgX2ggIT09IHZvaWQgMCA/IF9oIDogW10sIHRoaXMub3B0aW9ucy5sZWZ0WCArIDApKTtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHRoaXMucmVuZGVyUmVsYXRpb25zKChfaiA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2ouZ2V0UmVsYXRpb25zKCksIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChzdmdOb2Rlcyk7XG4gICAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KCk7XG4gICAgfVxuICAgIHVwZGF0ZVJlbGF0aW9uV2VpZ2h0cyhub2RlcywgcmVsYXRpb25zLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgaWYgKCFyZWxhdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWxhdGlvbldlaWdodHMgPSByZWxhdGlvbnMucmVkdWNlKChhY2MsIHJlbGF0aW9uKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgY29uc3QgeyBzb3VyY2UsIHRhcmdldCwgYW5hbHl0aWNzIH0gPSByZWxhdGlvbjtcbiAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICByZWxhdGlvbi5oZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VLZXkgPSBgcyR7c291cmNlLmtpbmR9OiR7c291cmNlLm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEtleSA9IGB0JHt0YXJnZXQua2luZH06JHt0YXJnZXQubmFtZX1gO1xuICAgICAgICAgICAgY29uc3Qgd2VpZ2h0ID0gKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAmJiBhbmFseXRpY3MudHJhZmZpYyA+IDBcbiAgICAgICAgICAgICAgICA/IE1hdGgucm91bmQoTWF0aC5sb2cxMChNYXRoLm1heChhbmFseXRpY3MudHJhZmZpYywgMikpICogKChfYSA9IHRoaXMub3B0aW9ucy50cmFmZmljTG9nMTBGYWN0b3IpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDEyKSlcbiAgICAgICAgICAgICAgICA6ICgoX2IgPSB0aGlzLm9wdGlvbnMucmVsYXRpb25EZWZhdWx0V2lkdGgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDEwKTtcbiAgICAgICAgICAgIHJlbGF0aW9uLmhlaWdodCA9IHdlaWdodDtcbiAgICAgICAgICAgIGlmICghYWNjW3NvdXJjZUtleV0pIHtcbiAgICAgICAgICAgICAgICBhY2Nbc291cmNlS2V5XSA9IHsgaGVpZ2h0OiAwLCBjb3VudDogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhY2NbdGFyZ2V0S2V5XSkge1xuICAgICAgICAgICAgICAgIGFjY1t0YXJnZXRLZXldID0geyBoZWlnaHQ6IDAsIGNvdW50OiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2Nbc291cmNlS2V5XS5oZWlnaHQgKz0gd2VpZ2h0ICsgdGhpcy5jYWxjdWxhdGVHYXAoYWNjW3NvdXJjZUtleV0uY291bnQpO1xuICAgICAgICAgICAgYWNjW3NvdXJjZUtleV0uY291bnQgKz0gMTtcbiAgICAgICAgICAgIGFjY1t0YXJnZXRLZXldLmhlaWdodCArPSB3ZWlnaHQgKyB0aGlzLmNhbGN1bGF0ZUdhcChhY2NbdGFyZ2V0S2V5XS5jb3VudCk7XG4gICAgICAgICAgICBhY2NbdGFyZ2V0S2V5XS5jb3VudCArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgbm9kZS5zb3VyY2VSZWxhdGlvbnMgPSByZWxhdGlvbldlaWdodHNbYHMke25vZGUua2luZH06JHtub2RlLm5hbWV9YF07XG4gICAgICAgICAgICBub2RlLnRhcmdldFJlbGF0aW9ucyA9IHJlbGF0aW9uV2VpZ2h0c1tgdCR7bm9kZS5raW5kfToke25vZGUubmFtZX1gXTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhbGN1bGF0ZUdhcChpdGVyYXRpb25zKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbig4MCwgaXRlcmF0aW9ucyAqIDMpO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNhbmtleUNoYXJ0O1xuZXhwb3J0IHsgU2Fua2V5Q2hhcnQgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgU2Fua2V5Q2hhcnREYXRhIH0gZnJvbSAnLi9zYW5rZXktY2hhcnQtZGF0YSc7XG5pbXBvcnQgU2Fua2V5Q2hhcnQgZnJvbSAnLi9zYW5rZXktY2hhcnQnO1xuaW1wb3J0IHsgRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi9ldmVudC1oYW5kbGVyJztcbmltcG9ydCB7IE1pbmltYXAgfSBmcm9tICcuL21pbmltYXAnO1xuZXhwb3J0IHsgU2Fua2V5Q2hhcnREYXRhLCBJbmNsdWRlS2luZCB9IGZyb20gJy4vc2Fua2V5LWNoYXJ0LWRhdGEnO1xuZXhwb3J0IHsgRXZlbnRIYW5kbGVyIH07XG5leHBvcnQgeyBTYW5rZXlDaGFydCB9O1xuZXhwb3J0IHsgTWluaW1hcCB9O1xud2luZG93LlNhbmtleUNoYXJ0ID0gU2Fua2V5Q2hhcnQ7XG53aW5kb3cuU2Fua2V5Q2hhcnREYXRhID0gU2Fua2V5Q2hhcnREYXRhO1xud2luZG93LkV2ZW50SGFuZGxlciA9IEV2ZW50SGFuZGxlcjtcbndpbmRvdy5NaW5pTWFwID0gTWluaW1hcDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==