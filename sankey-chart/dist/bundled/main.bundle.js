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
        this.initialize();
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
            nodes.sort((a, b) => a.name === selectedNode.name ? -1 : (b.name === selectedNode.name ? 1 : a.name.localeCompare(b.name)));
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
            const cardinality = summary[node.kind + '::' + node.name];
            node.color = this.getNodeTagColor(node);
            node.cardinality = cardinality;
            if (node.targetCount) {
                node['cardinality'] = { targetCount: node.targetCount, sameKindCount: 0 };
            }
            if (node.sourceCount) {
                node['cardinality'] = Object.assign(node['cardinality'], { sourceCount: node.sourceCount, sameKindCount: 0 });
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
        this.options = {
            nodeWidth: 10,
            nodeLineHeight: 18,
            marginX: 15,
            marginY: 5,
            leftX: 15,
            topY: 10,
            nodeMarginY: 10,
            nodeColumnWith: 300,
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
        this.svgElement = svgElement;
        this.nodePositions = {};
        this.eventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__.EventHandler();
        this.contextMenuCallbackFunction = undefined;
        this.className = {
            NODE_TYPE_TITLE: "node-kind-title",
            NODE_TITLE: "node-title",
            RELATION: "relation",
            CARDINALITY: "cardinality",
            SELECTED: 'selected'
        };
        this.selectedNodePositionY = -1;
        this.truncateText = this.createTruncateText();
    }
    setOptions(customOptions) {
        this.options = this.deepMerge(this.options, customOptions);
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
        const width = (((_a = this.options.nodeColumnWith) !== null && _a !== void 0 ? _a : 0) + ((_b = this.options.nodeWidth) !== null && _b !== void 0 ? _b : 0)) * Math.max(1, ((_c = this.chartData) === null || _c === void 0 ? void 0 : _c.getKinds().length) || 0) + (this.options.marginX * 2);
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
            let rectPositionWidth = this.options.nodeColumnWith;
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
            const lines = this.createTextLines(node, this.options.nodeColumnWith - this.options.nodeWidth);
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
        const selectedNode = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getSelectedNode();
        this.resetSvg();
        this.updateRelationWeights((_c = (_b = this.chartData) === null || _b === void 0 ? void 0 : _b.getNodes()) !== null && _c !== void 0 ? _c : [], (_e = (_d = this.chartData) === null || _d === void 0 ? void 0 : _d.getRelations()) !== null && _e !== void 0 ? _e : [], selectedNode);
        let column = 0;
        const columnWidth = this.options.nodeColumnWith + this.options.nodeWidth;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnNEO0FBQ2I7QUFDTTtBQUNYO0FBQytCO0FBQzNDO0FBQ0Q7QUFDSjtBQUNuQixxQkFBcUIscURBQVc7QUFDaEMseUJBQXlCLCtEQUFlO0FBQ3hDLHNCQUFzQix3REFBWTtBQUNsQyxpQkFBaUIsNkNBQU8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvZXZlbnQtaGFuZGxlci50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9taW5pbWFwLnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL3NhbmtleS1jaGFydC1kYXRhLnRzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL3NhbmtleS1jaGFydC50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlZJSVNhbmtleUNoYXJ0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlZJSVNhbmtleUNoYXJ0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsImNsYXNzIEV2ZW50SGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZXZlbnQsIFtdKTtcbiAgICAgICAgfVxuICAgICAgICAoX2EgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBldmVudExpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBldmVudExpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KS5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBldmVudExpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IHsgRXZlbnRIYW5kbGVyIH07XG4iLCJjbGFzcyBNaW5pbWFwIHtcbiAgICBjb25zdHJ1Y3RvcihjaGFydEVsZW1lbnQsIGNvbnRhaW5lckVsZW1lbnQsIG1haW5WaWV3RWxlbWVudCkge1xuICAgICAgICB0aGlzLm1haW5WaWV3SGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5tYWluVmlld1dpZHRoID0gMDtcbiAgICAgICAgdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuc2NhbGVVbml0WSA9IDE7XG4gICAgICAgIHRoaXMuc2NhbGVVbml0WCA9IDE7XG4gICAgICAgIHRoaXMuZHJhZyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWluaW1hcFJlY3QgPSB0aGlzLm1pbmltYXBQYW5lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgbGVuc2VSZWN0ID0gdGhpcy52aXNpYmxlU2VjdGlvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGxldCBuZXdYID0gZXZlbnQuY2xpZW50WCAtIG1pbmltYXBSZWN0LmxlZnQgLSBsZW5zZVJlY3Qud2lkdGggLyAyO1xuICAgICAgICAgICAgbGV0IG5ld1kgPSBldmVudC5jbGllbnRZIC0gbWluaW1hcFJlY3QudG9wIC0gbGVuc2VSZWN0LmhlaWdodCAvIDI7XG4gICAgICAgICAgICBuZXdYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obmV3WCwgbWluaW1hcFJlY3Qud2lkdGggLSBsZW5zZVJlY3Qud2lkdGgpKTtcbiAgICAgICAgICAgIG5ld1kgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihuZXdZLCBtaW5pbWFwUmVjdC5oZWlnaHQgLSBsZW5zZVJlY3QuaGVpZ2h0KSk7XG4gICAgICAgICAgICBjb25zdCBtaW5pbWFwSGVpZ2h0ID0gdGhpcy5taW5pbWFwUGFuZS5zY3JvbGxIZWlnaHQgPiB0aGlzLm1pbmltYXBQYW5lLmNsaWVudEhlaWdodCA/IG1pbmltYXBSZWN0LmhlaWdodCA6IHRoaXMubWluaU1hcFNWRy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxQb3NZSW5QZXJjZW50YWdlID0gbmV3WSAvIChtaW5pbWFwSGVpZ2h0IC0gbGVuc2VSZWN0LmhlaWdodCk7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxQb3NYSW5QZXJjZW50YWdlID0gbmV3WCAvIChtaW5pbWFwUmVjdC53aWR0aCAtIGxlbnNlUmVjdC53aWR0aCk7XG4gICAgICAgICAgICB0aGlzLm1haW5WaWV3LnNjcm9sbFRvcCA9IHNjcm9sbFBvc1lJblBlcmNlbnRhZ2UgKiAodGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCAtIHRoaXMubWFpblZpZXdIZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxMZWZ0ID0gc2Nyb2xsUG9zWEluUGVyY2VudGFnZSAqICh0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggLSB0aGlzLm1haW5WaWV3V2lkdGgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVuZERyYWcgPSAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmRyYWcpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kRHJhZyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWFpblZpZXcgPSBtYWluVmlld0VsZW1lbnQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyRWxlbWVudDtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbiA9IHRoaXMuY3JlYXRlVmlzaWJsZVNlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5taW5pTWFwU1ZHID0gdGhpcy5jcmVhdGVNaW5pTWFwU1ZHKGNoYXJ0RWxlbWVudC5pZCk7XG4gICAgICAgIHRoaXMubWluaU1hcFNWRy5hcHBlbmRDaGlsZCh0aGlzLnZpc2libGVTZWN0aW9uKTtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZSA9IHRoaXMuY3JlYXRlTWluaW1hcFBhbmUoKTtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5hcHBlbmRDaGlsZCh0aGlzLm1pbmlNYXBTVkcpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm1pbmltYXBQYW5lKTtcbiAgICAgICAgdGhpcy5tYWluVmlldy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnN5bmNTY3JvbGwuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5zdGFydERyYWcuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLm1haW5WaWV3SGVpZ2h0ID0gdGhpcy5tYWluVmlldy5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHRoaXMubWFpblZpZXdXaWR0aCA9IHRoaXMubWFpblZpZXcuY2xpZW50V2lkdGg7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCA9IHRoaXMubWFpblZpZXcuc2Nyb2xsV2lkdGg7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgPSB0aGlzLm1haW5WaWV3LnNjcm9sbEhlaWdodDtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5tYWluVmlld1dpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5tYWluVmlld0hlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5taW5pTWFwU1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHt0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGh9ICR7dGhpcy5tYWluVmlld1Njcm9sbEhlaWdodH1gKTtcbiAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxUb3AgPSAwO1xuICAgICAgICB0aGlzLm1haW5WaWV3LnNjcm9sbExlZnQgPSAwO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLm1haW5WaWV3V2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLm1haW5WaWV3SGVpZ2h0LnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnNjYWxlVW5pdFkgPSB0aGlzLm1haW5WaWV3SGVpZ2h0ID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ID8gMSA6IC0xIC8gKHRoaXMubWFpblZpZXdIZWlnaHQgLSB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5zY2FsZVVuaXRYID0gdGhpcy5tYWluVmlld1dpZHRoID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggPyAxIDogLTEgLyAodGhpcy5tYWluVmlld1dpZHRoIC0gdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoKTtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zdHlsZS5taW5IZWlnaHQgPSBgJHt0aGlzLm1haW5WaWV3SGVpZ2h0fXB4YDtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgY29uc3QgbWluaW1hcEhlaWdodCA9IE1hdGgubWluKHRoaXMubWluaW1hcFBhbmUuY2xpZW50SGVpZ2h0LCB0aGlzLm1haW5WaWV3SGVpZ2h0KTtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zdHlsZS5taW5IZWlnaHQgPSBgJHttaW5pbWFwSGVpZ2h0fXB4YDtcbiAgICAgICAgaWYgKHRoaXMubWFpblZpZXdIZWlnaHQgPT09IHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgJiYgdGhpcy5tYWluVmlld1dpZHRoID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN5bmNTY3JvbGwoKTtcbiAgICB9XG4gICAgY3JlYXRlTWluaU1hcFNWRyhzdmdIcmVmKSB7XG4gICAgICAgIGNvbnN0IHByZXZpZXdTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgICAgICBwcmV2aWV3U1ZHLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncHJldmlldy1zdmcnKTtcbiAgICAgICAgY29uc3QgdXNlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAndXNlJyk7XG4gICAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgYCMke3N2Z0hyZWZ9YCk7XG4gICAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgICAgIHByZXZpZXdTVkcuYXBwZW5kQ2hpbGQodXNlRWxlbWVudCk7XG4gICAgICAgIHByZXZpZXdTVkcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLnRvcCA9ICcwJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgICAgcmV0dXJuIHByZXZpZXdTVkc7XG4gICAgfVxuICAgIGNyZWF0ZU1pbmltYXBQYW5lKCkge1xuICAgICAgICBjb25zdCBtaW5pbWFwUGFuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtaW5pbWFwUGFuZS5jbGFzc05hbWUgPSAnbWluaW1hcC1wYW5lJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBtaW5pbWFwUGFuZS5zdHlsZS5yaWdodCA9ICcwJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUudG9wID0gJzAnO1xuICAgICAgICByZXR1cm4gbWluaW1hcFBhbmU7XG4gICAgfVxuICAgIGNyZWF0ZVZpc2libGVTZWN0aW9uKCkge1xuICAgICAgICBjb25zdCB2aXNpYmxlU2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncmVjdCcpO1xuICAgICAgICB2aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21pbmltYXAtdmlzaWJsZS1zZWN0aW9uJyk7XG4gICAgICAgIHZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgICAgIHZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgICAgIHJldHVybiB2aXNpYmxlU2VjdGlvbjtcbiAgICB9XG4gICAgc3luY1Njcm9sbCgpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWUluUGVyY2VudGFnZSA9IHRoaXMuc2NhbGVVbml0WSAqIHRoaXMubWFpblZpZXcuc2Nyb2xsVG9wO1xuICAgICAgICBjb25zdCBzY3JvbGxQb3NYSW5QZXJjZW50YWdlID0gdGhpcy5zY2FsZVVuaXRYICogdGhpcy5tYWluVmlldy5zY3JvbGxMZWZ0O1xuICAgICAgICB0aGlzLm1pbmltYXBQYW5lLnNjcm9sbFRvcCA9ICh0aGlzLm1pbmltYXBQYW5lLnNjcm9sbEhlaWdodCAtIHRoaXMubWluaW1hcFBhbmUuY2xpZW50SGVpZ2h0KSAqIHNjcm9sbFBvc1lJblBlcmNlbnRhZ2U7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc2Nyb2xsTGVmdCA9ICh0aGlzLm1pbmltYXBQYW5lLnNjcm9sbFdpZHRoIC0gdGhpcy5taW5pbWFwUGFuZS5jbGllbnRXaWR0aCkgKiBzY3JvbGxQb3NYSW5QZXJjZW50YWdlO1xuICAgICAgICBjb25zdCBvdmVybGF5WSA9ICh0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0IC0gdGhpcy5tYWluVmlld0hlaWdodCkgKiBzY3JvbGxQb3NZSW5QZXJjZW50YWdlO1xuICAgICAgICBjb25zdCBvdmVybGF5WCA9ICh0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggLSB0aGlzLm1haW5WaWV3V2lkdGgpICogc2Nyb2xsUG9zWEluUGVyY2VudGFnZTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3knLCBvdmVybGF5WS50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3gnLCBvdmVybGF5WC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhcnREcmFnKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuZHJhZyk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZERyYWcpO1xuICAgIH1cbn1cbmV4cG9ydCB7IE1pbmltYXAgfTtcbiIsInZhciBJbmNsdWRlS2luZDtcbihmdW5jdGlvbiAoSW5jbHVkZUtpbmQpIHtcbiAgICBJbmNsdWRlS2luZFtcIldJVEhfU0FNRV9UQVJHRVRcIl0gPSBcIldJVEhfU0FNRV9UQVJHRVRcIjtcbn0pKEluY2x1ZGVLaW5kIHx8IChJbmNsdWRlS2luZCA9IHt9KSk7XG5jbGFzcyBTYW5rZXlDaGFydERhdGEge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMsIHBhcnRpYWxEYXRhID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5nZXROb2RlVGFnQ29sb3IgPSAobm9kZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBub2RlLnRhZ3MgPyBub2RlLnRhZ3MubWFwKHRhZyA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW3RhZ107IH0pLmZpbmQoY29sb3IgPT4gY29sb3IgIT09IHVuZGVmaW5lZCkgOiB0aGlzLm9wdGlvbnMuZGVmYXVsdENvbG9yO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuY29sb3IgfHwgY29sb3I7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0geyByZWxhdGlvbnM6IFtdLCBoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLm9yaWdpbmFsRGF0YSA9IHsgbmFtZTogZGF0YS5uYW1lLCBjb2xvcjogZGF0YS5jb2xvciwgbm9kZXM6IGRhdGEubm9kZXMgfHwgW10sIHJlbGF0aW9uczogZGF0YS5yZWxhdGlvbnMgfHwgW10gfTtcbiAgICAgICAgdGhpcy5hbGxOb2Rlc0xvYWRlZCA9ICFwYXJ0aWFsRGF0YTtcbiAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSB7fTtcbiAgICAgICAgdGhpcy50aXRsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgbm9UYWc6ICdPdGhlcnMnLFxuICAgICAgICAgICAgbm9UYWdTdWZmaXhDaGFyYWN0ZXI6ICfigKYnLFxuICAgICAgICAgICAgcmVsYXRpb25EZWZhdWx0V2lkdGg6IDE1LFxuICAgICAgICAgICAgZGVmYXVsdENvbG9yOiBcIm9yYW5nZVwiLFxuICAgICAgICAgICAgdGFnQ29sb3JNYXA6IHt9LFxuICAgICAgICAgICAga2luZHM6IFtdLFxuICAgICAgICAgICAgc2hvd1JlbGF0ZWRLaW5kczogZmFsc2UsXG4gICAgICAgICAgICBzZWxlY3RBbmRGaWx0ZXI6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVTb3J0UmVsYXRpb25zKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbGF0aW9uc0luZm8oKTtcbiAgICAgICAgdGhpcy5zb3J0Tm9kZXModGhpcy5ub2Rlcyk7XG4gICAgfVxuICAgIHJlc2V0Q29sb3JzKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRhZ0NvbG9yTWFwKSB7XG4gICAgICAgICAgICBjb25zdCB0YWdzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLnRhZ0NvbG9yTWFwKTtcbiAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNTb21lID0gdGFncy5zb21lKHRhZyA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IG5vZGUudGFncykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKHRhZyk7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChoYXNTb21lKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlWydjb2xvciddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4gZGVsZXRlIG5vZGVbJ2NvbG9yJ10pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlc2V0Q29sb3JzKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzTm9kZSA9IHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShwcmV2aW91c05vZGUpO1xuICAgIH1cbiAgICBhcHBlbmREYXRhKGRhdGEsIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5tZXJnZURhdGEodGhpcy5vcmlnaW5hbERhdGEsIGRhdGEpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKHNlbGVjdGVkTm9kZSk7XG4gICAgfVxuICAgIGdldE5vZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlcyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0Tm9kZXNCeUtpbmQoa2luZCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgfVxuICAgIGdldFJlbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyB8fCBbXTtcbiAgICB9XG4gICAgZ2V0S2luZHMoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkS2luZHMgPSBPYmplY3Qua2V5cyh0aGlzLm5vZGVzQnlLaW5kcyk7XG4gICAgICAgIGlmICgoKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5sZW5ndGgpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5raW5kcy5maWx0ZXIoa2luZCA9PiBmaWx0ZXJlZEtpbmRzLmluY2x1ZGVzKGtpbmQubmFtZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZEtpbmRzLm1hcChraW5kID0+ICh7IG5hbWU6IGtpbmQgfSkpO1xuICAgIH1cbiAgICBnZXRUaXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGU7XG4gICAgfVxuICAgIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZSA/IHsgdGl0bGU6IHRpdGxlLnRpdGxlLCBuYW1lOiB0aXRsZS5uYW1lLCBjb2xvcjogdGl0bGUuY29sb3IgfSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0U2VsZWN0ZWROb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZE5vZGU7XG4gICAgfVxuICAgIHNlbGVjdE5vZGUobm9kZSkge1xuICAgICAgICBjb25zdCBncm91cEJ5S2luZCA9IChub2RlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YUJ5S2luZHMgPSB7fTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhQnlLaW5kc1tub2RlLmtpbmRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW25vZGUua2luZF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YUJ5S2luZHNbbm9kZS5raW5kXS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUJ5S2luZHM7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzO1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFub2RlLmtpbmQgfHwgIW5vZGUubmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIG11c3QgaGF2ZSBraW5kIGFuZCBuYW1lJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgJiYgbm9kZS5uYW1lID09PSB0aGlzLnNlbGVjdGVkTm9kZS5uYW1lICYmIG5vZGUua2luZCA9PT0gdGhpcy5zZWxlY3RlZE5vZGUua2luZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBub2RlLm5hbWUgJiYgaXRlbS5raW5kID09PSBub2RlLmtpbmQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRLaW5kID0gdGhpcy5vcHRpb25zLmtpbmRzLmZpbmQoa2luZCA9PiB7IHZhciBfYTsgcmV0dXJuIGtpbmQubmFtZSA9PT0gKChfYSA9IHRoaXMuc2VsZWN0ZWROb2RlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZCk7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEtpbmQgPT09IG51bGwgfHwgc2VsZWN0ZWRLaW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEtpbmQuaW5jbHVkZUFsdGVybmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlWydoYXNSZWxhdGVkU291cmNlT2ZPdGhlcktpbmRzJ10gPSAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RBbmRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UmVsYXRlZEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHRoaXMuZmlsdGVyRGVwZW5kZW5jaWVzKHRoaXMuc2VsZWN0ZWROb2RlLCBzZWxlY3RlZEtpbmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZpbHRlckRlcGVuZGVuY2llcyh0aGlzLnNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMuZmlsdGVyTm9kZXModGhpcy5kZXBlbmRlbmNpZXMucmVsYXRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNSZWxhdGVkU291cmNlT2ZTYW1lS2luZCA9IHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBub2RlLmtpbmQgJiYgcmVsYXRpb24udGFyZ2V0Lm5hbWUgPT09IG5vZGUubmFtZSAmJiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gbm9kZS5raW5kKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub2Rlc0J5S2luZHMgPSBncm91cEJ5S2luZCh0aGlzLm5vZGVzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvcnROb2Rlcyh0aGlzLm5vZGVzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgIH1cbiAgICBzb3J0Tm9kZXNBbHBhYmV0aWNhbGx5KG5vZGVzKSB7XG4gICAgICAgIGNvbnN0IHVuZGVmaW5lZFRhZyA9ICh0aGlzLm9wdGlvbnMubm9UYWcgfHwgJycpICsgdGhpcy5vcHRpb25zLm5vVGFnU3VmZml4Q2hhcmFjdGVyO1xuICAgICAgICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5uYW1lID09PSB1bmRlZmluZWRUYWcgJiYgYi5uYW1lICE9PSB1bmRlZmluZWRUYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGEubmFtZSAhPT0gdW5kZWZpbmVkVGFnICYmIGIubmFtZSA9PT0gdW5kZWZpbmVkVGFnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0Tm9kZXMobm9kZXMpIHtcbiAgICAgICAgY29uc3QgdW5kZWZpbmVkVGFnID0gKHRoaXMub3B0aW9ucy5ub1RhZyB8fCAnJykgKyB0aGlzLm9wdGlvbnMubm9UYWdTdWZmaXhDaGFyYWN0ZXI7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IHRoaXMuZ2V0U2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnROb2Rlc0FscGFiZXRpY2FsbHkodGhpcy5nZXROb2RlcygpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJldmlvdXNLaW5kcyA9IFtdO1xuICAgICAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5vcHRpb25zLmtpbmRzLmZpbmRJbmRleChrID0+IGsubmFtZSA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSk7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleDsgaW5kZXggPCB0aGlzLm9wdGlvbnMua2luZHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBraW5kID0gdGhpcy5vcHRpb25zLmtpbmRzW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRLaW5kcyA9IHRoaXMubm9kZXNCeUtpbmRzW2tpbmQubmFtZV07XG4gICAgICAgICAgICBpZiAoY3VycmVudEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0Tm9kZXNPZktpbmQoa2luZCwgY3VycmVudEtpbmRzLCBwcmV2aW91c0tpbmRzLCBzZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzS2luZHMgPSBjdXJyZW50S2luZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qga2luZCA9IHRoaXMub3B0aW9ucy5raW5kc1tzdGFydEluZGV4XTtcbiAgICAgICAgcHJldmlvdXNLaW5kcyA9IHRoaXMubm9kZXNCeUtpbmRzW2tpbmQubmFtZV07XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGtpbmQgPSB0aGlzLm9wdGlvbnMua2luZHNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEtpbmRzID0gdGhpcy5ub2Rlc0J5S2luZHNba2luZC5uYW1lXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50S2luZHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvcnROb2Rlc09mS2luZChraW5kLCBjdXJyZW50S2luZHMsIHByZXZpb3VzS2luZHMsIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNLaW5kcyA9IGN1cnJlbnRLaW5kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvcnRSZWxhdGlvbnMoKTtcbiAgICB9XG4gICAgc29ydE5vZGVzT2ZLaW5kKGtpbmQsIG5vZGVzLCBwcmV2aW91c0tpbmRzLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgaWYgKGtpbmQubmFtZSA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSkge1xuICAgICAgICAgICAgbm9kZXMuc29ydCgoYSwgYikgPT4gYS5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSA/IC0xIDogKGIubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgPyAxIDogYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zID0gdGhpcy5nZXRSZWxhdGlvbnMoKTtcbiAgICAgICAgICAgIG5vZGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhUHJldm91c05vZGVzID0gcmVsYXRpb25zLmZpbHRlcihyZWwgPT4gcmVsLnRhcmdldC5uYW1lID09PSBhLm5hbWUgJiYgcmVsLnRhcmdldC5raW5kID09PSBhLmtpbmQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQcmV2b3VzTm9kZXMgPSByZWxhdGlvbnMuZmlsdGVyKHJlbCA9PiByZWwudGFyZ2V0Lm5hbWUgPT09IGIubmFtZSAmJiByZWwudGFyZ2V0LmtpbmQgPT09IGIua2luZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYUluZGV4ID0gcHJldmlvdXNLaW5kcy5maW5kSW5kZXgoaXRlbSA9PiBhUHJldm91c05vZGVzLnNvbWUocmVsID0+IHJlbC5zb3VyY2UubmFtZSA9PT0gaXRlbS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYkluZGV4ID0gcHJldmlvdXNLaW5kcy5maW5kSW5kZXgoaXRlbSA9PiBiUHJldm91c05vZGVzLnNvbWUocmVsID0+IHJlbC5zb3VyY2UubmFtZSA9PT0gaXRlbS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgaWYgKGFJbmRleCAhPT0gLTEgfHwgYkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYUluZGV4ID09PSBiSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiSW5kZXggPiBhSW5kZXggPyAtMSA6IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xuICAgIHNvcnRSZWxhdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkTm9kZXMgPSB7fTtcbiAgICAgICAgY29uc3Qgc2hpZnQgPSAxMDAwMDA7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubm9kZXNCeUtpbmRzKS5mb3JFYWNoKGtpbmQgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSBzaGlmdDtcbiAgICAgICAgICAgIHRoaXMubm9kZXNCeUtpbmRzW2tpbmRdLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29tYmluZWROb2Rlc1traW5kICsgJzo6JyArIG5vZGUubmFtZV0gPSAoaSsrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zID0gdGhpcy5nZXRSZWxhdGlvbnMoKTtcbiAgICAgICAgcmVsYXRpb25zID09PSBudWxsIHx8IHJlbGF0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVsYXRpb25zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgICAgIGNvbnN0IGFTb3VyY2VLZXkgPSBgJHthLnNvdXJjZS5raW5kfTo6JHthLnNvdXJjZS5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCBiU291cmNlS2V5ID0gYCR7Yi5zb3VyY2Uua2luZH06OiR7Yi5zb3VyY2UubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgYVRhcmdldEtleSA9IGAke2EudGFyZ2V0LmtpbmR9Ojoke2EudGFyZ2V0Lm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IGJUYXJnZXRLZXkgPSBgJHtiLnRhcmdldC5raW5kfTo6JHtiLnRhcmdldC5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCBhU291cmNlSW5kZXggPSAoX2EgPSBjb21iaW5lZE5vZGVzW2FTb3VyY2VLZXldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICAgIGNvbnN0IGJTb3VyY2VJbmRleCA9IChfYiA9IGNvbWJpbmVkTm9kZXNbYlNvdXJjZUtleV0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICAgICAgY29uc3QgYVRhcmdldEluZGV4ID0gKF9jID0gY29tYmluZWROb2Rlc1thVGFyZ2V0S2V5XSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgICBjb25zdCBiVGFyZ2V0SW5kZXggPSAoX2QgPSBjb21iaW5lZE5vZGVzW2JUYXJnZXRLZXldKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICAgIGNvbnN0IGFJbmRleCA9IGFTb3VyY2VJbmRleCAqIHNoaWZ0ICsgYVRhcmdldEluZGV4O1xuICAgICAgICAgICAgY29uc3QgYkluZGV4ID0gYlNvdXJjZUluZGV4ICogc2hpZnQgKyBiVGFyZ2V0SW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gYUluZGV4IC0gYkluZGV4O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZVNvcnRSZWxhdGlvbnMoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEuc291cmNlLmtpbmQgIT09IGIuc291cmNlLmtpbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5zb3VyY2Uua2luZC5sb2NhbGVDb21wYXJlKGIuc291cmNlLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuc291cmNlLm5hbWUubG9jYWxlQ29tcGFyZShiLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEuc291cmNlLmtpbmQgPT09IGIuc291cmNlLmtpbmQgJiYgYS5zb3VyY2UubmFtZSA9PT0gYi5zb3VyY2UubmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChhLnRhcmdldC5raW5kICE9PSBiLnRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnRhcmdldC5raW5kLmxvY2FsZUNvbXBhcmUoYi50YXJnZXQua2luZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS50YXJnZXQubmFtZS5sb2NhbGVDb21wYXJlKGIudGFyZ2V0Lm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZVJlbGF0aW9uc0luZm8oKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3Qgc3VtbWFyeSA9IHt9O1xuICAgICAgICAoX2EgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBsaW5rLnNvdXJjZS5raW5kICsgJzo6JyArIGxpbmsuc291cmNlLm5hbWU7XG4gICAgICAgICAgICBpZiAoIXN1bW1hcnlba2V5XSkge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlba2V5XSA9IHsgc291cmNlQ291bnQ6IDAsIHRhcmdldENvdW50OiAwLCBzYW1lS2luZENvdW50OiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluay5zb3VyY2Uua2luZCA9PT0gbGluay50YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlba2V5XS5zYW1lS2luZENvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0uc291cmNlQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEtleSA9IGxpbmsudGFyZ2V0LmtpbmQgKyAnOjonICsgbGluay50YXJnZXQubmFtZTtcbiAgICAgICAgICAgIGlmICghc3VtbWFyeVt0YXJnZXRLZXldKSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVt0YXJnZXRLZXldID0geyBzb3VyY2VDb3VudDogMCwgdGFyZ2V0Q291bnQ6IDAsIHNhbWVLaW5kQ291bnQ6IDAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1bW1hcnlbdGFyZ2V0S2V5XS50YXJnZXRDb3VudCsrO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbERhdGEubm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FyZGluYWxpdHkgPSBzdW1tYXJ5W25vZGUua2luZCArICc6OicgKyBub2RlLm5hbWVdO1xuICAgICAgICAgICAgbm9kZS5jb2xvciA9IHRoaXMuZ2V0Tm9kZVRhZ0NvbG9yKG5vZGUpO1xuICAgICAgICAgICAgbm9kZS5jYXJkaW5hbGl0eSA9IGNhcmRpbmFsaXR5O1xuICAgICAgICAgICAgaWYgKG5vZGUudGFyZ2V0Q291bnQpIHtcbiAgICAgICAgICAgICAgICBub2RlWydjYXJkaW5hbGl0eSddID0geyB0YXJnZXRDb3VudDogbm9kZS50YXJnZXRDb3VudCwgc2FtZUtpbmRDb3VudDogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc291cmNlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBub2RlWydjYXJkaW5hbGl0eSddID0gT2JqZWN0LmFzc2lnbihub2RlWydjYXJkaW5hbGl0eSddLCB7IHNvdXJjZUNvdW50OiBub2RlLnNvdXJjZUNvdW50LCBzYW1lS2luZENvdW50OiAwIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0SW5kZXhCeUtpbmQoa2luZCwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2luZHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5maW5kSW5kZXgob2JqID0+IG9iai5uYW1lID09PSBraW5kKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGxldCBuZXdJbmRleCA9IGluZGV4ICsgb2Zmc2V0O1xuICAgICAgICAgICAgaWYgKG5ld0luZGV4IDwgMCB8fCBuZXdJbmRleCA+PSB0aGlzLm9wdGlvbnMua2luZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0luZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNlYXJjaEJ5TmFtZShub2RlKSB7XG4gICAgICAgIGlmICghbm9kZS5raW5kIHx8ICFub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsdGVyIGNyaXRlcmlhIGlzIGVtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZpbHRlcihpdGVtID0+IGl0ZW0ua2luZCA9PT0gbm9kZS5raW5kICYmIGl0ZW0ubmFtZS5pbmNsdWRlcyhub2RlLm5hbWUpKTtcbiAgICB9XG4gICAgZmluZEJ5TmFtZShuYW1lLCBkYXRhQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFBcnJheS5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcbiAgICB9XG4gICAgZmlsdGVyRGVwZW5kZW5jaWVzKHNlbGVjdGVkTm9kZSwgc2VsZWN0ZWRLaW5kKSB7XG4gICAgICAgIGxldCByZWxhdGVkUmVsYXRpb25zID0gW107XG4gICAgICAgIGNvbnN0IGtpbmROYW1lcyA9IHRoaXMub3B0aW9ucy5raW5kcy5tYXAoayA9PiBrLm5hbWUpO1xuICAgICAgICBsZXQgdGFyZ2V0UmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHJlbGF0aW9uLnNvdXJjZS5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSAmJiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24udGFyZ2V0LmtpbmQpIDogdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGFyZ2V0UmVsYXRpb25zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFNvdXJjZXMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHJlbGF0aW9uLnRhcmdldC5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSAmJiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQpIDogdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU291cmNlTmFtZXMgPSBzZWxlY3RlZFNvdXJjZXMubWFwKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgICAgIHRhcmdldFJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgJiYgc2VsZWN0ZWRTb3VyY2VOYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhcmdldFJlbGF0aW9ucy5wdXNoKC4uLnNlbGVjdGVkU291cmNlcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0S2V5cyA9IHRhcmdldFJlbGF0aW9ucyA/IFsuLi5uZXcgU2V0KHRhcmdldFJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKSldIDogW107XG4gICAgICAgIGNvbnN0IHRhcmdldFRhcmdldFJlbGF0aW9ucyA9IHRoaXMudGFyZ2V0VGFyZ2V0UmVsYXRpb25zKHNlbGVjdGVkTm9kZS5raW5kLCBraW5kTmFtZXMsIHRhcmdldEtleXMpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEtpbmRLZXlzID0gWy4uLm5ldyBTZXQodGFyZ2V0UmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV07XG4gICAgICAgICAgICByZWxhdGVkUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRLaW5kS2V5cy5pbmNsdWRlcyhgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkgJiYgc2VsZWN0ZWRLaW5kLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VLZXlzID0gc291cmNlUmVsYXRpb25zID8gWy4uLm5ldyBTZXQoc291cmNlUmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV0gOiBbXTtcbiAgICAgICAgY29uc3Qgc291cmNlU291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHNvdXJjZUtleXMuaW5jbHVkZXMoYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZWxhdGlvbnMgPSBbLi4ubmV3IFNldChbLi4udGFyZ2V0UmVsYXRpb25zLCAuLi50YXJnZXRUYXJnZXRSZWxhdGlvbnMsIC4uLnNvdXJjZVNvdXJjZVJlbGF0aW9ucywgLi4ucmVsYXRlZFJlbGF0aW9ucywgLi4uc291cmNlUmVsYXRpb25zXS5tYXAocmVsID0+IEpTT04uc3RyaW5naWZ5KHJlbCkpKV0ubWFwKHJlbFN0cmluZyA9PiBKU09OLnBhcnNlKHJlbFN0cmluZykpO1xuICAgICAgICBzZWxlY3RlZE5vZGUuaGFzUmVsYXRpb25zT2ZTYW1lS2luZHMgPSBkaXN0aW5jdFJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCB8fCByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVsYXRpb25zOiBkaXN0aW5jdFJlbGF0aW9ucyxcbiAgICAgICAgICAgIGhhc1JlbGF0ZWRTb3VyY2VPZk90aGVyS2luZHM6IHJlbGF0ZWRSZWxhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICB9O1xuICAgIH1cbiAgICB0YXJnZXRUYXJnZXRSZWxhdGlvbnMoa2luZCwga2luZE5hbWVzLCB0YXJnZXRLZXlzKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1NhbWVLaW5kc09uTm9uU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHRhcmdldEtleXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQgKyAnOjonICsgcmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgocmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kKSA/IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBraW5kIDogdHJ1ZSkgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHRhcmdldEtleXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQgKyAnOjonICsgcmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlsdGVyTm9kZXMocmVsYXRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uS2V5cyA9IHJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25Tb3VyY2VLZXlzID0gcmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24uc291cmNlLmtpbmR9Ojoke3JlbGF0aW9uLnNvdXJjZS5uYW1lfWApO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uU291cmNlS2V5cy5wdXNoKGAke3RoaXMuc2VsZWN0ZWROb2RlLmtpbmR9Ojoke3RoaXMuc2VsZWN0ZWROb2RlLm5hbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGlzdGluY3RLZXlzID0gWy4uLm5ldyBTZXQocmVsYXRpb25LZXlzLmNvbmNhdChyZWxhdGlvblNvdXJjZUtleXMpKV07XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maWx0ZXIobm9kZSA9PiBkaXN0aW5jdEtleXMuaW5jbHVkZXMoYCR7bm9kZS5raW5kfTo6JHtub2RlLm5hbWV9YCkpO1xuICAgIH1cbiAgICBtZXJnZURhdGEob3JpZ2luRGF0YSwgYXBwZW5kRGF0YSkge1xuICAgICAgICBhcHBlbmREYXRhLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG9yaWdpbkRhdGEubm9kZXMuZmluZEluZGV4KGV4aXN0aW5nTm9kZSA9PiBleGlzdGluZ05vZGUua2luZCA9PT0gbm9kZS5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSBub2RlLm5hbWUpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IG9yaWdpbkRhdGEubm9kZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVsYXRpb25zVG9SZW1vdmUgPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdOb2RlLmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSByZWxhdGlvbi5zb3VyY2UubmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdOb2RlLmtpbmQgPT09IHJlbGF0aW9uLnRhcmdldC5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSByZWxhdGlvbi50YXJnZXQubmFtZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3VuZFJlbGF0aW9uc1RvUmVtb3ZlLmZvckVhY2gocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbkluZGV4ID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuaW5kZXhPZihyZWxhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5yZWxhdGlvbnMuc3BsaWNlKHJlbGF0aW9uSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5ub2Rlc1tpbmRleF0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwZW5kRGF0YS5yZWxhdGlvbnMuZm9yRWFjaChyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1JlbGF0aW9uSW5kZXggPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5maW5kSW5kZXgoZXhpc3RpbmdSZWxhdGlvbiA9PiBleGlzdGluZ1JlbGF0aW9uLnNvdXJjZS5raW5kID09PSByZWxhdGlvbi5zb3VyY2Uua2luZCAmJlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVsYXRpb24uc291cmNlLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5uYW1lICYmXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWxhdGlvbi50YXJnZXQua2luZCA9PT0gcmVsYXRpb24udGFyZ2V0LmtpbmQgJiZcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlbGF0aW9uLnRhcmdldC5uYW1lID09PSByZWxhdGlvbi50YXJnZXQubmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdSZWxhdGlvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEucmVsYXRpb25zLnB1c2gocmVsYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9yaWdpbkRhdGE7XG4gICAgfVxufVxuZXhwb3J0IHsgU2Fua2V5Q2hhcnREYXRhLCBJbmNsdWRlS2luZCB9O1xuIiwiaW1wb3J0IHsgRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi9ldmVudC1oYW5kbGVyJztcbmNsYXNzIFNhbmtleUNoYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcihzdmdFbGVtZW50LCBjdXN0b21PcHRpb25zKSB7XG4gICAgICAgIHRoaXMuU1ZHX05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBub2RlV2lkdGg6IDEwLFxuICAgICAgICAgICAgbm9kZUxpbmVIZWlnaHQ6IDE4LFxuICAgICAgICAgICAgbWFyZ2luWDogMTUsXG4gICAgICAgICAgICBtYXJnaW5ZOiA1LFxuICAgICAgICAgICAgbGVmdFg6IDE1LFxuICAgICAgICAgICAgdG9wWTogMTAsXG4gICAgICAgICAgICBub2RlTWFyZ2luWTogMTAsXG4gICAgICAgICAgICBub2RlQ29sdW1uV2l0aDogMzAwLFxuICAgICAgICAgICAgZGVmYXVsdE5vZGVDb2xvcjogXCJncmF5XCIsXG4gICAgICAgICAgICByZW5kZXJLaW5kQXNDb2x1bXM6IHRydWUsXG4gICAgICAgICAgICB0cmFmZmljTG9nMTBGYWN0b3I6IDEyLFxuICAgICAgICAgICAgcmVsYXRpb25EZWZhdWx0V2lkdGg6IDE1LFxuICAgICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZE9wYWNpdHk6IDAuMixcbiAgICAgICAgICAgICAgICBhbmFseXRpY3NPcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIG5vblBST0Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNhbWVLaW5kSW5kZW50YXRpb246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlOiB7XG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmYxMDEwJyxcbiAgICAgICAgICAgICAgICBob3Zlck9wYWNpdHk6IDAuMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydW5jYXRlVGV4dDoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRGb250U2l6ZUFuZEZhbWlseTogJzE2cHggQXJpYWwnLFxuICAgICAgICAgICAgICAgIGVsbGlwc2VDaGFyYWN0ZXI6ICfigKYnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm9vdENoYXJhY3RlcjogJ+KMgidcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucyhjdXN0b21PcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQgPSBzdmdFbGVtZW50O1xuICAgICAgICB0aGlzLm5vZGVQb3NpdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIE5PREVfVFlQRV9USVRMRTogXCJub2RlLWtpbmQtdGl0bGVcIixcbiAgICAgICAgICAgIE5PREVfVElUTEU6IFwibm9kZS10aXRsZVwiLFxuICAgICAgICAgICAgUkVMQVRJT046IFwicmVsYXRpb25cIixcbiAgICAgICAgICAgIENBUkRJTkFMSVRZOiBcImNhcmRpbmFsaXR5XCIsXG4gICAgICAgICAgICBTRUxFQ1RFRDogJ3NlbGVjdGVkJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgICAgICB0aGlzLnRydW5jYXRlVGV4dCA9IHRoaXMuY3JlYXRlVHJ1bmNhdGVUZXh0KCk7XG4gICAgfVxuICAgIHNldE9wdGlvbnMoY3VzdG9tT3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZXBNZXJnZSh0aGlzLm9wdGlvbnMsIGN1c3RvbU9wdGlvbnMpO1xuICAgIH1cbiAgICBzZXREYXRhKGNoYXJ0RGF0YSkge1xuICAgICAgICBpZiAodGhpcy5jaGFydERhdGEgIT09IGNoYXJ0RGF0YSkge1xuICAgICAgICAgICAgdGhpcy5jaGFydERhdGEgPSBjaGFydERhdGE7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuZGlzcGF0Y2hFdmVudCgnc2VsZWN0aW9uQ2hhbmdlZCcsIHsgbm9kZTogdGhpcy5jaGFydERhdGEuZ2V0U2VsZWN0ZWROb2RlKCksIHBvc2l0aW9uOiB7IHk6IDAgfSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXREYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFydERhdGE7XG4gICAgfVxuICAgIGFkZFNlbGVjdGlvbkNoYW5nZWRMaXN0ZW5lcnMoY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuc3Vic2NyaWJlKCdzZWxlY3Rpb25DaGFuZ2VkJywgY2FsbGJhY2tGdW5jdGlvbik7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmN0aW9uKHsgbm9kZTogKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRTZWxlY3RlZE5vZGUoKSwgcG9zaXRpb246IHsgeTogMCB9IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZENvbnRleHRNZW51TGlzdGVuZXJzKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbiA9IGNhbGxiYWNrRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0RGlyZWN0VGFyZ2V0Tm9kZXNPZihzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0UmVsYXRpb25zKCkuZmlsdGVyKChyZWxhdGlvbikgPT4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmXG4gICAgICAgICAgICByZWxhdGlvbi5zb3VyY2UubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi50YXJnZXQpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICB9XG4gICAgZ2V0RGlyZWN0U291cmNlTm9kZXNPZihzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0UmVsYXRpb25zKCkuZmlsdGVyKChyZWxhdGlvbikgPT4gcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmXG4gICAgICAgICAgICByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUpLm1hcChyZWxhdGlvbiA9PiByZWxhdGlvbi5zb3VyY2UpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICB9XG4gICAgY3JlYXRlVHJ1bmNhdGVUZXh0KCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgY29uc3QgY2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGVsbGlwc2VDaGFyID0gdGhpcy5vcHRpb25zLnRydW5jYXRlVGV4dC5lbGxpcHNlQ2hhcmFjdGVyO1xuICAgICAgICBjb25zdCBmb250U2l6ZUFuZEZhbWlseSA9IHRoaXMub3B0aW9ucy50cnVuY2F0ZVRleHQuZGVmYXVsdEZvbnRTaXplQW5kRmFtaWx5O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gdHJ1bmNhdGVUZXh0KHRleHQsIG1heFdpZHRoLCBmb250ID0gZm9udFNpemVBbmRGYW1pbHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gYCR7dGV4dH0tJHttYXhXaWR0aH0tJHtmb250fWA7XG4gICAgICAgICAgICBpZiAoY2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBmb250O1xuICAgICAgICAgICAgaWYgKGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGggPD0gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjYWNoZS5zZXQoY2FjaGVLZXksIHRleHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRydW5jYXRlZFRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQubWVhc3VyZVRleHQodHJ1bmNhdGVkVGV4dCArIGVsbGlwc2VDaGFyKS53aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgdHJ1bmNhdGVkVGV4dCA9IHRydW5jYXRlZFRleHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdHJ1bmNhdGVkVGV4dCArIGVsbGlwc2VDaGFyO1xuICAgICAgICAgICAgY2FjaGUuc2V0KGNhY2hlS2V5LCByZXN1bHQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVzZXRTdmcoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlZEhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICA8ZGVmcz5cbiAgICAgICAgPGZpbHRlciBpZD1cImRyb3BzaGFkb3dcIj5cbiAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPVwiMC40XCIgLz5cbiAgICAgICAgPC9maWx0ZXI+XG4gICAgICA8L2RlZnM+XG4gICAgYDtcbiAgICB9XG4gICAgdXBkYXRlSGVpZ2h0KCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgY29uc3Qgd2lkdGggPSAoKChfYSA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCkgKyAoKF9iID0gdGhpcy5vcHRpb25zLm5vZGVXaWR0aCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMCkpICogTWF0aC5tYXgoMSwgKChfYyA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZ2V0S2luZHMoKS5sZW5ndGgpIHx8IDApICsgKHRoaXMub3B0aW9ucy5tYXJnaW5YICogMik7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FsY3VsYXRlZEhlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmVuZGVyRWxpcHNpc01lbnUoeCwgeSwgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGNvbnN0IG1lbnVHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBtZW51R3JvdXAuc2V0QXR0cmlidXRlKCdpZCcsICdlbGxpcHNpc01lbnUnKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnY3Vyc29yOiBwb2ludGVyOycpO1xuICAgICAgICBtZW51R3JvdXAuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eCArIDIuNX0sICR7eX0pYCk7XG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNyZWF0ZVJlY3QoLTIuNSwgMCwgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCwgMjIsICdibGFjaycsICcwLjInKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J4JywgJzUnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J5JywgJzUnKTtcbiAgICAgICAgbWVudUdyb3VwLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICBmb3IgKGxldCBpeSA9IDU7IGl5IDw9IDE1OyBpeSArPSA1KSB7XG4gICAgICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNyZWF0ZUNpcmNsZSgyLjUsIGl5LCAyLCBcIndoaXRlXCIpO1xuICAgICAgICAgICAgbWVudUdyb3VwLmFwcGVuZENoaWxkKGNpcmNsZSk7XG4gICAgICAgIH1cbiAgICAgICAgbWVudUdyb3VwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbihldmVudCwgc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZW51R3JvdXA7XG4gICAgfVxuICAgIGRlZXBNZXJnZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgfHwgdGFyZ2V0ID09PSBudWxsIHx8IHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnIHx8IHNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc291cmNlW2tleV0gPT09ICdvYmplY3QnICYmIHNvdXJjZVtrZXldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRlZXBNZXJnZSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICByZW5kZXJOb2Rlcyhub2RlcywgcG9zaXRpb25YLCBzZWxlY3RlZE5vZGUsIGtpbmQsIGRpcmVjdFRhcmdldE5vZGVzLCBkaXJlY3RTb3VyY2VOb2Rlcykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgIGNvbnN0IHN2Z0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIGxldCBvdmVyYWxsWSA9IHRoaXMub3B0aW9ucy50b3BZO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJlbmRlcktpbmRBc0NvbHVtcykge1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSAoa2luZCA9PT0gbnVsbCB8fCBraW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBraW5kLnRpdGxlKSB8fCAoKF9iID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRUaXRsZSgpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IChraW5kID09PSBudWxsIHx8IGtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGtpbmQuY29sb3IpIHx8ICgoX2QgPSAoX2MgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmdldFRpdGxlKCkpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5jb2xvcikgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgICBjb25zdCB4ID0gcG9zaXRpb25YICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLm9wdGlvbnMudG9wWSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGggLyAyKTtcbiAgICAgICAgICAgIGxldCB4MiA9IHBvc2l0aW9uWCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGggKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblkgLyAyO1xuICAgICAgICAgICAgY29uc3QgeTIgPSB0aGlzLm9wdGlvbnMudG9wWSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgKHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpO1xuICAgICAgICAgICAgbGV0IHByZWZpeCA9ICcnO1xuICAgICAgICAgICAgaWYgKGtpbmQgPT09IG51bGwgfHwga2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDoga2luZC5jb2xvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlQ2lyY2xlKHgsIHksIDUsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ID0gJ3wgJztcbiAgICAgICAgICAgICAgICB4MiAtPSAxMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5vZGVLaW5kVGl0bGUgPSB0aGlzLmNyZWF0ZVN2Z1RleHQocHJlZml4ICsgdGl0bGUsIFt0aGlzLmNsYXNzTmFtZS5OT0RFX1RZUEVfVElUTEVdKTtcbiAgICAgICAgICAgIG5vZGVLaW5kVGl0bGUuc2V0QXR0cmlidXRlKFwieFwiLCB4Mi50b1N0cmluZygpKTtcbiAgICAgICAgICAgIG5vZGVLaW5kVGl0bGUuc2V0QXR0cmlidXRlKFwieVwiLCB5Mi50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKG5vZGVLaW5kVGl0bGUpO1xuICAgICAgICAgICAgb3ZlcmFsbFkgKz0gMjU7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZXMuZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVJlbGF0aW9ucyA9IG5vZGUuc291cmNlUmVsYXRpb25zIHx8IHsgaGVpZ2h0OiAwLCBjb3VudDogMCB9O1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UmVsYXRpb25zID0gbm9kZS50YXJnZXRSZWxhdGlvbnMgfHwgeyBoZWlnaHQ6IDAsIGNvdW50OiAwIH07XG4gICAgICAgICAgICBjb25zdCBsaW5lc0NvdW50ID0gMSArIChub2RlLnN1YnRpdGxlID8gMSA6IDApICsgKCgoX2EgPSBub2RlLnRhZ3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID8gMSA6IDApICsgKHRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMgPyAwIDogMSk7XG4gICAgICAgICAgICBjb25zdCBsaW5lc0hlaWdodCA9IGxpbmVzQ291bnQgKiB0aGlzLm9wdGlvbnMubm9kZUxpbmVIZWlnaHQgKyB0aGlzLm9wdGlvbnMubWFyZ2luWTtcbiAgICAgICAgICAgIG5vZGUudGV4dExpbmVzSGVpZ2h0ID0gbGluZXNIZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBpc1NlbGVjdGVkID0gc2VsZWN0ZWROb2RlICYmIHNlbGVjdGVkTm9kZS5uYW1lID09PSBub2RlLm5hbWUgJiYgc2VsZWN0ZWROb2RlLmtpbmQgPT09IG5vZGUua2luZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3RIZWlnaHQgPSAyICogdGhpcy5vcHRpb25zLm1hcmdpblkgKyBNYXRoLm1heChsaW5lc0hlaWdodCwgbGluZXNIZWlnaHQgKyAoc291cmNlUmVsYXRpb25zLmhlaWdodCA+IDAgPyBzb3VyY2VSZWxhdGlvbnMuaGVpZ2h0ICsgMTIgOiAwKSwgKHRhcmdldFJlbGF0aW9ucy5oZWlnaHQgPiAwID8gdGFyZ2V0UmVsYXRpb25zLmhlaWdodCArIDEyIDogMCkpO1xuICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgb3ZlcmFsbFk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5vZGUuY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgICBsZXQgcG9zWCA9IHBvc2l0aW9uWDtcbiAgICAgICAgICAgIGxldCByZWN0UG9zaXRpb25XaWR0aCA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aDtcbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVQb3NpdGlvblkgPSB5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuaGFzUmVsYXRlZFNvdXJjZU9mU2FtZUtpbmQpIHtcbiAgICAgICAgICAgICAgICBwb3NYICs9IHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zYW1lS2luZEluZGVudGF0aW9uO1xuICAgICAgICAgICAgICAgIHJlY3RQb3NpdGlvbldpZHRoIC09IHRoaXMub3B0aW9ucy5yZWxhdGlvbi5zYW1lS2luZEluZGVudGF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgJ2cnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3RIb3ZlciA9IHRoaXMuY3JlYXRlUmVjdChwb3NYLCB5LCByZWN0UG9zaXRpb25XaWR0aCwgcmVjdEhlaWdodCwgY29sb3IsICcwJyk7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jcmVhdGVSZWN0KHBvc1gsIHksIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgsIHJlY3RIZWlnaHQsIGNvbG9yKTtcbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdFNoYWRvdyA9IHRoaXMuY3JlYXRlUmVjdChwb3NYIC0gMiwgeSAtIDIsIHRoaXMub3B0aW9ucy5ub2RlV2lkdGggKyA0LCByZWN0SGVpZ2h0ICsgNCwgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgncngnLCBcIjZcIik7XG4gICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ3J5JywgXCI2XCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmRyb3BTaGFkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnYmxhY2snKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbHRlcicsICd1cmwoI2Ryb3BzaGFkb3cpJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjAuMlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ib3JkZXJDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgXCIyXCIpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ib3JkZXJDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0U2hhZG93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICByZWN0SG92ZXIuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0SG92ZXIpO1xuICAgICAgICAgICAgaWYgKG5vZGUuY2FyZGluYWxpdHkgfHwgbm9kZS50YXJnZXRDb3VudCB8fCBub2RlLnNvdXJjZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNEaXJlY3RUYXJnZXROb2RlcyA9IChkaXJlY3RUYXJnZXROb2RlcyA9PT0gbnVsbCB8fCBkaXJlY3RUYXJnZXROb2RlcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGlyZWN0VGFyZ2V0Tm9kZXMuZmluZChkaXJlY3ROb2RlID0+IG5vZGUubmFtZSA9PT0gZGlyZWN0Tm9kZS5uYW1lICYmIG5vZGUua2luZCA9PT0gZGlyZWN0Tm9kZS5raW5kKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNEaXJlY3RTb3VyY2VOb2RlcyA9IChkaXJlY3RTb3VyY2VOb2RlcyA9PT0gbnVsbCB8fCBkaXJlY3RTb3VyY2VOb2RlcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGlyZWN0U291cmNlTm9kZXMuZmluZChkaXJlY3ROb2RlID0+IG5vZGUubmFtZSA9PT0gZGlyZWN0Tm9kZS5uYW1lICYmIG5vZGUua2luZCA9PT0gZGlyZWN0Tm9kZS5raW5kKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDYXJkaW5hbGl0eVRleHQoZywgbm9kZSwgcG9zWCwgeSwgcmVjdEhlaWdodCwgY29sb3IsIGlzU2VsZWN0ZWQsIGlzRGlyZWN0VGFyZ2V0Tm9kZXMsIGlzRGlyZWN0U291cmNlTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuY3JlYXRlU3ZnVGV4dCgnJywgW3RoaXMuY2xhc3NOYW1lLk5PREVfVElUTEUsIGlzU2VsZWN0ZWQgPyB0aGlzLmNsYXNzTmFtZS5TRUxFQ1RFRCA6ICcnXSk7XG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCkpO1xuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMuY3JlYXRlVGV4dExpbmVzKG5vZGUsIHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aCAtIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpO1xuICAgICAgICAgICAgbGluZXMuZm9yRWFjaCgobGluZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcInRzcGFuXCIpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCkpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZShcImR5XCIsIFwiMS4yZW1cIik7XG4gICAgICAgICAgICAgICAgdHNwYW4udGV4dENvbnRlbnQgPSBsaW5lLnRleHQ7XG4gICAgICAgICAgICAgICAgdHNwYW4uY2xhc3NMaXN0LmFkZChsaW5lLmNsYXNzKTtcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgIGlmICghKG5vZGUgPT09IG51bGwgfHwgbm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbm9kZS5wbGFjZUhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEhvdmVyQW5kQ2xpY2tFdmVudHMoZywgcmVjdEhvdmVyLCBub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKGcpO1xuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQgJiYgIShub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGxhY2VIb2xkZXIpICYmIHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJFbGlwc2lzTWVudShwb3NYLCB5LCBub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGVQb3NpdGlvbnNbbm9kZS5raW5kICsgJzo6JyArIG5vZGUubmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICB4OiBwb3NYLFxuICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgc291cmNlWTogeSArIHRoaXMub3B0aW9ucy5tYXJnaW5ZLFxuICAgICAgICAgICAgICAgIHRhcmdldFk6IHksXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiByZWN0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIHRleHRMaW5lc0hlaWdodDogbm9kZS50ZXh0TGluZXNIZWlnaHQsXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgYWNjdW11bGF0ZWRTb3VyY2VZOiAwLFxuICAgICAgICAgICAgICAgIGFjY3VtdWxhdGVkVGFyZ2V0WTogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG92ZXJhbGxZICs9IHJlY3RIZWlnaHQgKyB0aGlzLm9wdGlvbnMubm9kZU1hcmdpblk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSBNYXRoLm1heCh0aGlzLmNhbGN1bGF0ZWRIZWlnaHQsIG92ZXJhbGxZICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZICogMik7XG4gICAgICAgIHJldHVybiBzdmdHcm91cDtcbiAgICB9XG4gICAgY3JlYXRlQ2lyY2xlKGN4LCBjeSwgciwgZmlsbCkge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2NpcmNsZScpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeCcsIGN4LnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsIGN5LnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgci50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIGZpbGwpO1xuICAgICAgICByZXR1cm4gY2lyY2xlO1xuICAgIH1cbiAgICBjcmVhdGVSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQsIGZpbGwsIG9wYWNpdHkgPSBcIjFcIikge1xuICAgICAgICBjb25zdCByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCAncmVjdCcpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgneCcsIHgudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd5JywgeS50b1N0cmluZygpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeCcsIFwiNVwiKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3J5JywgXCI1XCIpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnZmlsbCcsIGZpbGwpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgb3BhY2l0eSk7XG4gICAgICAgIHJldHVybiByZWN0O1xuICAgIH1cbiAgICBhcHBlbmRDYXJkaW5hbGl0eVRleHQoZywgbm9kZSwgcG9zWCwgeSwgcmVjdEhlaWdodCwgY29sb3IsIGlzU2VsZWN0ZWQsIGlzRGlyZWN0UmVsYXRlZFRvU2VsZWN0ZWQsIGlzRGlyZWN0U291cmNlTm9kZXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rLCBfbCwgX207XG4gICAgICAgIGlmICgoX2IgPSAoX2EgPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc291cmNlQ291bnQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDAgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxOb2Rlc0xvYWRlZCA9ICgoX2MgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmFsbE5vZGVzTG9hZGVkKSB8fCBpc1NlbGVjdGVkIHx8IGlzRGlyZWN0UmVsYXRlZFRvU2VsZWN0ZWQ7XG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0eVRleHQgPSAoKF9kID0gbm9kZS5jYXJkaW5hbGl0eSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLnNvdXJjZUNvdW50KSArIChhbGxOb2Rlc0xvYWRlZCA/ICcnIDogJy4uKicpICsgKCgoX2YgPSAoX2UgPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Uuc2FtZUtpbmRDb3VudCkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogMCkgPiAwID8gJysnICsgKChfaCA9IChfZyA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5zYW1lS2luZENvdW50KSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiAwKSA6ICcnKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJy0gJyArIGNhcmRpbmFsaXR5VGV4dCwgW3RoaXMuY2xhc3NOYW1lLkNBUkRJTkFMSVRZLCBpc1NlbGVjdGVkID8gdGhpcy5jbGFzc05hbWUuU0VMRUNURUQgOiAnJ10pO1xuICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblggLSA2KSk7XG4gICAgICAgICAgICBzb3VyY2VUZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyByZWN0SGVpZ2h0IC0gMikpO1xuICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoc291cmNlVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChfayA9IChfaiA9IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai50YXJnZXRDb3VudCkgIT09IG51bGwgJiYgX2sgIT09IHZvaWQgMCA/IF9rIDogMCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFsbE5vZGVzTG9hZGVkID0gKChfbCA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2wuYWxsTm9kZXNMb2FkZWQpIHx8IGlzU2VsZWN0ZWQgfHwgaXNEaXJlY3RTb3VyY2VOb2RlcztcbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5VGV4dCA9ICgoX20gPSBub2RlLmNhcmRpbmFsaXR5KSA9PT0gbnVsbCB8fCBfbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX20udGFyZ2V0Q291bnQpICsgKGFsbE5vZGVzTG9hZGVkID8gJycgOiAnLi4qJyk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRUZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KGNhcmRpbmFsaXR5VGV4dCArICcgLScsIFt0aGlzLmNsYXNzTmFtZS5DQVJESU5BTElUWSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgIHRhcmdldFRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YIC0gMTQpKTtcbiAgICAgICAgICAgIHRhcmdldFRleHQuc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSArIHJlY3RIZWlnaHQgLSAyKSk7XG4gICAgICAgICAgICB0YXJnZXRUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgY29sb3IpO1xuICAgICAgICAgICAgdGFyZ2V0VGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQodGFyZ2V0VGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY3JlYXRlVGV4dExpbmVzKG5vZGUsIG1heFRleHRXaWR0aCkge1xuICAgICAgICBjb25zdCB0cnVuY2F0ZWRUaXRsZSA9IHRoaXMudHJ1bmNhdGVUZXh0ID8gdGhpcy50cnVuY2F0ZVRleHQobm9kZS50aXRsZSA/IG5vZGUudGl0bGUgOiBub2RlLm5hbWUsIG1heFRleHRXaWR0aCkgOiAobm9kZS50aXRsZSA/IG5vZGUudGl0bGUgOiBub2RlLm5hbWUpO1xuICAgICAgICBjb25zdCBsaW5lcyA9IFt7IHRleHQ6IHRydW5jYXRlZFRpdGxlLCBjbGFzczogXCJoZWFkbGluZVwiIH1dO1xuICAgICAgICBpZiAobm9kZS5zdWJ0aXRsZSkge1xuICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVkU3VidGl0bGUgPSB0aGlzLnRydW5jYXRlVGV4dCA/IHRoaXMudHJ1bmNhdGVUZXh0KG5vZGUuc3VidGl0bGUsIG1heFRleHRXaWR0aCkgOiBub2RlLnN1YnRpdGxlO1xuICAgICAgICAgICAgbGluZXMuc3BsaWNlKDEsIDAsIHsgdGV4dDogdHJ1bmNhdGVkU3VidGl0bGUsIGNsYXNzOiBcInN1YnRpdGxlXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudGFncykge1xuICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVUYWdzID0gdGhpcy50cnVuY2F0ZVRleHQgPyB0aGlzLnRydW5jYXRlVGV4dChub2RlLnRhZ3Muam9pbignLCAnKSwgbWF4VGV4dFdpZHRoKSA6IG5vZGUudGFncy5qb2luKCcsICcpO1xuICAgICAgICAgICAgbGluZXMucHVzaCh7IHRleHQ6IHRydW5jYXRlVGFncywgY2xhc3M6IFwiZGVzY3JpcHRpb25cIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW5kZXJLaW5kQXNDb2x1bXMpIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goeyB0ZXh0OiBub2RlLmtpbmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBub2RlLmtpbmQuc2xpY2UoMSksIGNsYXNzOiBcImRlc2NyaXB0aW9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbiAgICBhZGRIb3ZlckFuZENsaWNrRXZlbnRzKGdyb3VwLCByZWN0SG92ZXIsIG5vZGUpIHtcbiAgICAgICAgZ3JvdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VsZWN0Tm9kZShub2RlKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5kaXNwYXRjaEV2ZW50KCdzZWxlY3Rpb25DaGFuZ2VkJywgeyBub2RlLCBwb3NpdGlvbjogeyB5OiB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSB9IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3JvdXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgdGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ob3Zlck9wYWNpdHkudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBncm91cC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjBcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVTdmdUZXh0KHRleHRDb250ZW50LCBjbGFzc05hbWVzKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidGV4dFwiKTtcbiAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiBjbGFzc05hbWUpKTtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmVuZGVyUmVsYXRpb25zKHJlbGF0aW9ucywgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwga2luZCwgY29sb3IgfSA9IHNlbGVjdGVkTm9kZSB8fCB7fTtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbG9yID0gY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgIGNvbnN0IGxvY2FsTm9kZVBvc2l0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlUG9zaXRpb25zKSk7XG4gICAgICAgIGNvbnN0IGdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIGNvbnN0IGdQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVBvc2l0aW9uID0gbG9jYWxOb2RlUG9zaXRpb25zW2xpbmsuc291cmNlLmtpbmQgKyAnOjonICsgbGluay5zb3VyY2UubmFtZV07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGxvY2FsTm9kZVBvc2l0aW9uc1tsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWVdO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRQb3NpdGlvbiB8fCAhc291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsaW5rQ29sb3IgPSBzb3VyY2VQb3NpdGlvbi5ub2RlLmNvbG9yIHx8IGRlZmF1bHRDb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IHNhbWVLaW5kID0gbGluay5zb3VyY2Uua2luZCA9PT0gbGluay50YXJnZXQua2luZDtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU291cmNlID0gc2FtZUtpbmQgPyAwIDogdGhpcy5jYWxjdWxhdGVHYXAoc291cmNlUG9zaXRpb24uc291cmNlSW5kZXgrKyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdFRleHRMaW5lc0hlaWd0aCA9IChfYSA9IHNvdXJjZVBvc2l0aW9uLnRleHRMaW5lc0hlaWdodCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICAgICAgICAgIGlmIChmaXJzdFRleHRMaW5lc0hlaWd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VQb3NpdGlvbi50ZXh0TGluZXNIZWlnaHQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc291cmNlUG9zaXRpb24uYWNjdW11bGF0ZWRTb3VyY2VZID0gZmlyc3RUZXh0TGluZXNIZWlndGggKyBzb3VyY2VQb3NpdGlvbi5hY2N1bXVsYXRlZFNvdXJjZVkgKyBzZWxlY3RlZFNvdXJjZTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGFyZ2V0ID0gc2FtZUtpbmQgPyAwIDogdGhpcy5jYWxjdWxhdGVHYXAodGFyZ2V0UG9zaXRpb24udGFyZ2V0SW5kZXgrKyk7XG4gICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFkgPSAoKF9iID0gdGFyZ2V0UG9zaXRpb24uYWNjdW11bGF0ZWRUYXJnZXRZKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKSArIHNlbGVjdGVkVGFyZ2V0O1xuICAgICAgICAgICAgY29uc3QgeyBzb3VyY2UsIHRhcmdldCwgaGVpZ2h0IH0gPSBsaW5rO1xuICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MVggPSBzb3VyY2VQb3NpdGlvbi54ICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDFZID0gc291cmNlUG9zaXRpb24uc291cmNlWSArICgoaGVpZ2h0IHx8IDApIC8gMikgKyBzb3VyY2VQb3NpdGlvbi5hY2N1bXVsYXRlZFNvdXJjZVk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQyWSA9IHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgdGFyZ2V0UG9zaXRpb24udGFyZ2V0WSArICgoaGVpZ2h0IHx8IDApIC8gMikgKyB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQyWCA9IChzb3VyY2VQb3NpdGlvbi54ICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIHRhcmdldFBvc2l0aW9uLngpIC8gMjtcbiAgICAgICAgICAgIGxldCBwYXRoRDtcbiAgICAgICAgICAgIGxldCBvcGFjaXR5ID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLm9wYWNpdHk7XG4gICAgICAgICAgICBsZXQgc3Ryb2tlV2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgICB2YXIgb3BhY2l0eUVtcGhhc2l6ZVNlbGVjdGVkID0gMDtcbiAgICAgICAgICAgIGlmICgobGluay5zb3VyY2Uua2luZCA9PT0ga2luZCAmJiBsaW5rLnNvdXJjZS5uYW1lID09PSBuYW1lKSB8fCAobGluay50YXJnZXQua2luZCA9PT0ga2luZCAmJiBsaW5rLnRhcmdldC5uYW1lID09PSBuYW1lKSkge1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgKz0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNlbGVjdGVkT3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlUG9zaXRpb24uaW5kZXggPCB0YXJnZXRQb3NpdGlvbi5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDFYID0gc291cmNlUG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSBzb3VyY2VQb3NpdGlvbi55ICsgc291cmNlUG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDJYID0gdGFyZ2V0UG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi55ICsgKHRhcmdldFBvc2l0aW9uLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtwb2ludDFYfSwke3BvaW50MVl9IEMke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDFYfSwke3BvaW50Mll9ICR7cG9pbnQyWH0sJHtwb2ludDJZfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDJYID0gc291cmNlUG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSBzb3VyY2VQb3NpdGlvbi55ICsgKHNvdXJjZVBvc2l0aW9uLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDFYID0gdGFyZ2V0UG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSB0YXJnZXRQb3NpdGlvbi55ICsgdGFyZ2V0UG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtwb2ludDFYfSwke3BvaW50MVl9IEMke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDFYfSwke3BvaW50Mll9ICR7cG9pbnQyWH0sJHtwb2ludDJZfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGggPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0aEQgPSBgTSR7Y29udHJvbFBvaW50MVh9LCR7Y29udHJvbFBvaW50MVl9IEMke2NvbnRyb2xQb2ludDJYfSwke2NvbnRyb2xQb2ludDFZfSAke2NvbnRyb2xQb2ludDJYfSwke2NvbnRyb2xQb2ludDJZfSAke3RhcmdldFBvc2l0aW9uLnh9LCR7Y29udHJvbFBvaW50Mll9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgcGF0aEQpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIFN0cmluZyhzdHJva2VXaWR0aCB8fCAwKSk7XG4gICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgbGlua0NvbG9yKTtcbiAgICAgICAgICAgIGdQYXRoLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgbGV0IGFuYWx5dGljcztcbiAgICAgICAgICAgIGlmIChhbmFseXRpY3MpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuYWx5dGljcyA9IGxpbmsuYW5hbHl0aWNzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWRLaW5kID0gbGluay50YXJnZXQua2luZCA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSB8fCBsaW5rLnNvdXJjZS5raW5kID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChfYyA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJycsIFt0aGlzLmNsYXNzTmFtZS5SRUxBVElPTl0pO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcodGFyZ2V0UG9zaXRpb24ueCAtIHRoaXMub3B0aW9ucy5tYXJnaW5ZKSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKGhlaWdodCB8fCAwIC8gMikgKyBzZWxlY3RlZFRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FbnYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgdHNwYW5FbnYudGV4dENvbnRlbnQgPSAoYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVudmlyb25tZW50KSB8fCAnJztcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuRW52KTtcbiAgICAgICAgICAgICAgICBpZiAoKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudCkgJiYgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmVudmlyb25tZW50W2FuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNoYXJyYXknLCB0aGlzLm9wdGlvbnMucmVsYXRpb24uZW52aXJvbm1lbnRbYW5hbHl0aWNzLmVudmlyb25tZW50XS5kYXNoQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKF9kID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVycm9ycykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogMCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JSYXRpbyA9ICgxMDAgLyAoKF9lID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLnRyYWZmaWMpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IDApICogKChfZiA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lcnJvcnMpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IDApKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnRleHRDb250ZW50ID0gJyAnICsgKGVycm9yUmF0aW8gPT0gMCA/IFwiKDwwLjAxJSlcIiA6ICcoJyArIGVycm9yUmF0aW8udG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyUpJyk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW5FcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi50ZXh0Q29udGVudCA9ICcgJyArIChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYy50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgICAgICBnVGV4dC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gb3BhY2l0eSArIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5hbmFseXRpY3NPcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc291cmNlLmtpbmQgIT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZVBvc2l0aW9uLnNvdXJjZVkgKz0gaGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCAhPT0gdm9pZCAwID8gaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uLnRhcmdldFkgKz0gaGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCAhPT0gdm9pZCAwID8gaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnUGF0aCk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnVGV4dCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0U2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIHRoaXMucmVzZXRTdmcoKTtcbiAgICAgICAgdGhpcy51cGRhdGVSZWxhdGlvbldlaWdodHMoKF9jID0gKF9iID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXROb2RlcygpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBbXSwgKF9lID0gKF9kID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5nZXRSZWxhdGlvbnMoKSkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogW10sIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgIGxldCBjb2x1bW4gPSAwO1xuICAgICAgICBjb25zdCBjb2x1bW5XaWR0aCA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGg7XG4gICAgICAgIGNvbnN0IGtpbmRzID0gKF9mID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5nZXRLaW5kcygpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgICAgICBjb25zdCBzdmdOb2RlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBpZiAoa2luZHMgJiYga2luZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0VGFyZ2V0Tm9kZXMgPSBzZWxlY3RlZE5vZGUgPyB0aGlzLmdldERpcmVjdFRhcmdldE5vZGVzT2Yoc2VsZWN0ZWROb2RlKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0U291cmNlTm9kZXMgPSBzZWxlY3RlZE5vZGUgPyB0aGlzLmdldERpcmVjdFNvdXJjZU5vZGVzT2Yoc2VsZWN0ZWROb2RlKSA6IFtdO1xuICAgICAgICAgICAga2luZHMuZm9yRWFjaChraW5kID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHN2Z05vZGVzLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyTm9kZXMoKF9iID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXROb2Rlc0J5S2luZChraW5kLm5hbWUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSwgdGhpcy5vcHRpb25zLmxlZnRYICsgY29sdW1uV2lkdGggKiBjb2x1bW4rKywgc2VsZWN0ZWROb2RlLCBraW5kLCBkaXJlY3RUYXJnZXROb2RlcywgZGlyZWN0U291cmNlTm9kZXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3ZnTm9kZXMuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJOb2RlcygoX2ggPSAoX2cgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2cgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9nLmdldE5vZGVzKCkpICE9PSBudWxsICYmIF9oICE9PSB2b2lkIDAgPyBfaCA6IFtdLCB0aGlzLm9wdGlvbnMubGVmdFggKyAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICB0aGlzLnJlbmRlclJlbGF0aW9ucygoX2ogPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2ogPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9qLmdldFJlbGF0aW9ucygpLCBzZWxlY3RlZE5vZGUpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnTm9kZXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpO1xuICAgIH1cbiAgICB1cGRhdGVSZWxhdGlvbldlaWdodHMobm9kZXMsIHJlbGF0aW9ucywgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGlmICghcmVsYXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVsYXRpb25XZWlnaHRzID0gcmVsYXRpb25zLnJlZHVjZSgoYWNjLCByZWxhdGlvbikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIGFuYWx5dGljcyB9ID0gcmVsYXRpb247XG4gICAgICAgICAgICBpZiAoc291cmNlLmtpbmQgPT09IHRhcmdldC5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRpb24uaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc291cmNlS2V5ID0gYHMke3NvdXJjZS5raW5kfToke3NvdXJjZS5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRLZXkgPSBgdCR7dGFyZ2V0LmtpbmR9OiR7dGFyZ2V0Lm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IHdlaWdodCA9IChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYykgJiYgYW5hbHl0aWNzLnRyYWZmaWMgPiAwXG4gICAgICAgICAgICAgICAgPyBNYXRoLnJvdW5kKE1hdGgubG9nMTAoTWF0aC5tYXgoYW5hbHl0aWNzLnRyYWZmaWMsIDIpKSAqICgoX2EgPSB0aGlzLm9wdGlvbnMudHJhZmZpY0xvZzEwRmFjdG9yKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAxMikpXG4gICAgICAgICAgICAgICAgOiAoKF9iID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uRGVmYXVsdFdpZHRoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAxMCk7XG4gICAgICAgICAgICByZWxhdGlvbi5oZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgICAgICBpZiAoIWFjY1tzb3VyY2VLZXldKSB7XG4gICAgICAgICAgICAgICAgYWNjW3NvdXJjZUtleV0gPSB7IGhlaWdodDogMCwgY291bnQ6IDAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYWNjW3RhcmdldEtleV0pIHtcbiAgICAgICAgICAgICAgICBhY2NbdGFyZ2V0S2V5XSA9IHsgaGVpZ2h0OiAwLCBjb3VudDogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWNjW3NvdXJjZUtleV0uaGVpZ2h0ICs9IHdlaWdodCArIHRoaXMuY2FsY3VsYXRlR2FwKGFjY1tzb3VyY2VLZXldLmNvdW50KTtcbiAgICAgICAgICAgIGFjY1tzb3VyY2VLZXldLmNvdW50ICs9IDE7XG4gICAgICAgICAgICBhY2NbdGFyZ2V0S2V5XS5oZWlnaHQgKz0gd2VpZ2h0ICsgdGhpcy5jYWxjdWxhdGVHYXAoYWNjW3RhcmdldEtleV0uY291bnQpO1xuICAgICAgICAgICAgYWNjW3RhcmdldEtleV0uY291bnQgKz0gMTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIG5vZGUuc291cmNlUmVsYXRpb25zID0gcmVsYXRpb25XZWlnaHRzW2BzJHtub2RlLmtpbmR9OiR7bm9kZS5uYW1lfWBdO1xuICAgICAgICAgICAgbm9kZS50YXJnZXRSZWxhdGlvbnMgPSByZWxhdGlvbldlaWdodHNbYHQke25vZGUua2luZH06JHtub2RlLm5hbWV9YF07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjYWxjdWxhdGVHYXAoaXRlcmF0aW9ucykge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oODAsIGl0ZXJhdGlvbnMgKiAzKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBTYW5rZXlDaGFydDtcbmV4cG9ydCB7IFNhbmtleUNoYXJ0IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNhbmtleUNoYXJ0RGF0YSB9IGZyb20gJy4vc2Fua2V5LWNoYXJ0LWRhdGEnO1xuaW1wb3J0IFNhbmtleUNoYXJ0IGZyb20gJy4vc2Fua2V5LWNoYXJ0JztcbmltcG9ydCB7IEV2ZW50SGFuZGxlciB9IGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5pbXBvcnQgeyBNaW5pbWFwIH0gZnJvbSAnLi9taW5pbWFwJztcbmV4cG9ydCB7IFNhbmtleUNoYXJ0RGF0YSwgSW5jbHVkZUtpbmQgfSBmcm9tICcuL3NhbmtleS1jaGFydC1kYXRhJztcbmV4cG9ydCB7IEV2ZW50SGFuZGxlciB9O1xuZXhwb3J0IHsgU2Fua2V5Q2hhcnQgfTtcbmV4cG9ydCB7IE1pbmltYXAgfTtcbndpbmRvdy5TYW5rZXlDaGFydCA9IFNhbmtleUNoYXJ0O1xud2luZG93LlNhbmtleUNoYXJ0RGF0YSA9IFNhbmtleUNoYXJ0RGF0YTtcbndpbmRvdy5FdmVudEhhbmRsZXIgPSBFdmVudEhhbmRsZXI7XG53aW5kb3cuTWluaU1hcCA9IE1pbmltYXA7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=