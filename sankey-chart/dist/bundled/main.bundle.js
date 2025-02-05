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
    constructor(data, options) {
        this.getNodeTagColor = (node) => {
            const color = node.tags ? node.tags.map(tag => { var _a; return (_a = this.options.tagColorMap) === null || _a === void 0 ? void 0 : _a[tag]; }).find(color => color !== undefined) : this.options.defaultColor;
            return node.color || color;
        };
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
    addFetchDataListeners(callbackFunction) {
        if (typeof callbackFunction === 'function') {
            this.eventHandler.subscribe('fetchData', callbackFunction);
        }
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
    renderNodes(nodes, positionX, selectedNode, kind) {
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
            if (node.cardinality) {
                this.appendCardinalityText(g, node.cardinality, posX, y, rectHeight, color, isSelected);
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
    appendCardinalityText(g, cardinality, posX, y, rectHeight, color, isSelected) {
        var _a, _b;
        if ((_a = cardinality.sourceCount) !== null && _a !== void 0 ? _a : 0 > 0) {
            const sourceText = this.createSvgText('- ' + cardinality.sourceCount + (cardinality.refs > 0 ? '+' + cardinality.refs : ''), [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
            sourceText.setAttribute("x", String(posX + this.options.marginX - 6));
            sourceText.setAttribute("y", String(y + rectHeight - 2));
            sourceText.setAttribute("fill", color);
            g.appendChild(sourceText);
        }
        if ((_b = cardinality.targetCount) !== null && _b !== void 0 ? _b : 0 > 0) {
            const targetText = this.createSvgText(cardinality.targetCount + ' -', [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
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
            var _a, _b;
            (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.selectNode(node);
            this.render();
            if ((_b = node === null || node === void 0 ? void 0 : node.cardinality) === null || _b === void 0 ? void 0 : _b.fetchMore) {
                this.eventHandler.dispatchEvent('fetchData', { node });
            }
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
            const g = document.createElementNS(this.SVG_NS, "g");
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
            kinds.forEach(kind => {
                var _a, _b;
                svgNodes.appendChild(this.renderNodes((_b = (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getNodesByKind(kind.name)) !== null && _b !== void 0 ? _b : [], this.options.leftX + columnWidth * column++, selectedNode, kind));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxtQ0FBbUM7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsY0FBYyxJQUFJLGNBQWM7QUFDbEUsa0NBQWtDLGNBQWMsSUFBSSxjQUFjO0FBQ2xFLGtDQUFrQyxjQUFjLElBQUksY0FBYztBQUNsRSxrQ0FBa0MsY0FBYyxJQUFJLGNBQWM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQseURBQXlELFFBQVEsSUFBSSxFQUFFO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLFVBQVU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05zRDtBQUNiO0FBQ007QUFDWDtBQUMrQjtBQUMzQztBQUNEO0FBQ0o7QUFDbkIscUJBQXFCLHFEQUFXO0FBQ2hDLHlCQUF5QiwrREFBZTtBQUN4QyxzQkFBc0Isd0RBQVk7QUFDbEMsaUJBQWlCLDZDQUFPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0Ly4vc3JjL2V2ZW50LWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvLi9zcmMvbWluaW1hcC50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9zYW5rZXktY2hhcnQtZGF0YS50cyIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9zYW5rZXktY2hhcnQudHMiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1ZJSVNhbmtleUNoYXJ0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vVklJU2Fua2V5Q2hhcnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9WSUlTYW5rZXlDaGFydC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJWSUlTYW5rZXlDaGFydFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJWSUlTYW5rZXlDaGFydFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJjbGFzcyBFdmVudEhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgc3Vic2NyaWJlKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KGV2ZW50LCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgKF9hID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZShldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBkaXNwYXRjaEV2ZW50KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudExpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCkuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgZXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCB7IEV2ZW50SGFuZGxlciB9O1xuIiwiY2xhc3MgTWluaW1hcCB7XG4gICAgY29uc3RydWN0b3IoY2hhcnRFbGVtZW50LCBjb250YWluZXJFbGVtZW50LCBtYWluVmlld0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5tYWluVmlld0hlaWdodCA9IDA7XG4gICAgICAgIHRoaXMubWFpblZpZXdXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnNjYWxlVW5pdFkgPSAxO1xuICAgICAgICB0aGlzLnNjYWxlVW5pdFggPSAxO1xuICAgICAgICB0aGlzLmRyYWcgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1pbmltYXBSZWN0ID0gdGhpcy5taW5pbWFwUGFuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGxlbnNlUmVjdCA9IHRoaXMudmlzaWJsZVNlY3Rpb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBsZXQgbmV3WCA9IGV2ZW50LmNsaWVudFggLSBtaW5pbWFwUmVjdC5sZWZ0IC0gbGVuc2VSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgIGxldCBuZXdZID0gZXZlbnQuY2xpZW50WSAtIG1pbmltYXBSZWN0LnRvcCAtIGxlbnNlUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgbmV3WCA9IE1hdGgubWF4KDAsIE1hdGgubWluKG5ld1gsIG1pbmltYXBSZWN0LndpZHRoIC0gbGVuc2VSZWN0LndpZHRoKSk7XG4gICAgICAgICAgICBuZXdZID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obmV3WSwgbWluaW1hcFJlY3QuaGVpZ2h0IC0gbGVuc2VSZWN0LmhlaWdodCkpO1xuICAgICAgICAgICAgY29uc3QgbWluaW1hcEhlaWdodCA9IHRoaXMubWluaW1hcFBhbmUuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5taW5pbWFwUGFuZS5jbGllbnRIZWlnaHQgPyBtaW5pbWFwUmVjdC5oZWlnaHQgOiB0aGlzLm1pbmlNYXBTVkcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWUluUGVyY2VudGFnZSA9IG5ld1kgLyAobWluaW1hcEhlaWdodCAtIGxlbnNlUmVjdC5oZWlnaHQpO1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWEluUGVyY2VudGFnZSA9IG5ld1ggLyAobWluaW1hcFJlY3Qud2lkdGggLSBsZW5zZVJlY3Qud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxUb3AgPSBzY3JvbGxQb3NZSW5QZXJjZW50YWdlICogKHRoaXMubWFpblZpZXdTY3JvbGxIZWlnaHQgLSB0aGlzLm1haW5WaWV3SGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2Nyb2xsTGVmdCA9IHNjcm9sbFBvc1hJblBlcmNlbnRhZ2UgKiAodGhpcy5tYWluVmlld1Njcm9sbFdpZHRoIC0gdGhpcy5tYWluVmlld1dpZHRoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbmREcmFnID0gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5kcmFnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZERyYWcpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1haW5WaWV3ID0gbWFpblZpZXdFbGVtZW50O1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24gPSB0aGlzLmNyZWF0ZVZpc2libGVTZWN0aW9uKCk7XG4gICAgICAgIHRoaXMubWluaU1hcFNWRyA9IHRoaXMuY3JlYXRlTWluaU1hcFNWRyhjaGFydEVsZW1lbnQuaWQpO1xuICAgICAgICB0aGlzLm1pbmlNYXBTVkcuYXBwZW5kQ2hpbGQodGhpcy52aXNpYmxlU2VjdGlvbik7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUgPSB0aGlzLmNyZWF0ZU1pbmltYXBQYW5lKCk7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuYXBwZW5kQ2hpbGQodGhpcy5taW5pTWFwU1ZHKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5taW5pbWFwUGFuZSk7XG4gICAgICAgIHRoaXMubWFpblZpZXcuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zeW5jU2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuc3RhcnREcmFnLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5tYWluVmlld0hlaWdodCA9IHRoaXMubWFpblZpZXcuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLm1haW5WaWV3V2lkdGggPSB0aGlzLm1haW5WaWV3LmNsaWVudFdpZHRoO1xuICAgICAgICB0aGlzLm1haW5WaWV3U2Nyb2xsV2lkdGggPSB0aGlzLm1haW5WaWV3LnNjcm9sbFdpZHRoO1xuICAgICAgICB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ID0gdGhpcy5tYWluVmlldy5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMubWFpblZpZXdXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMubWFpblZpZXdIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMubWluaU1hcFNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy5tYWluVmlld1Njcm9sbFdpZHRofSAke3RoaXMubWFpblZpZXdTY3JvbGxIZWlnaHR9YCk7XG4gICAgICAgIHRoaXMubWFpblZpZXcuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgdGhpcy5tYWluVmlldy5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgdGhpcy52aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5tYWluVmlld1dpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnZpc2libGVTZWN0aW9uLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5tYWluVmlld0hlaWdodC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5zY2FsZVVuaXRZID0gdGhpcy5tYWluVmlld0hlaWdodCA9PT0gdGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCA/IDEgOiAtMSAvICh0aGlzLm1haW5WaWV3SGVpZ2h0IC0gdGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCk7XG4gICAgICAgIHRoaXMuc2NhbGVVbml0WCA9IHRoaXMubWFpblZpZXdXaWR0aCA9PT0gdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoID8gMSA6IC0xIC8gKHRoaXMubWFpblZpZXdXaWR0aCAtIHRoaXMubWFpblZpZXdTY3JvbGxXaWR0aCk7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUubWluSGVpZ2h0ID0gYCR7dGhpcy5tYWluVmlld0hlaWdodH1weGA7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGNvbnN0IG1pbmltYXBIZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1pbmltYXBQYW5lLmNsaWVudEhlaWdodCwgdGhpcy5tYWluVmlld0hlaWdodCk7XG4gICAgICAgIHRoaXMubWluaW1hcFBhbmUuc3R5bGUubWluSGVpZ2h0ID0gYCR7bWluaW1hcEhlaWdodH1weGA7XG4gICAgICAgIGlmICh0aGlzLm1haW5WaWV3SGVpZ2h0ID09PSB0aGlzLm1haW5WaWV3U2Nyb2xsSGVpZ2h0ICYmIHRoaXMubWFpblZpZXdXaWR0aCA9PT0gdGhpcy5tYWluVmlld1Njcm9sbFdpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmltYXBQYW5lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW5jU2Nyb2xsKCk7XG4gICAgfVxuICAgIGNyZWF0ZU1pbmlNYXBTVkcoc3ZnSHJlZikge1xuICAgICAgICBjb25zdCBwcmV2aWV3U1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICAgICAgcHJldmlld1NWRy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3ByZXZpZXctc3ZnJyk7XG4gICAgICAgIGNvbnN0IHVzZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3VzZScpO1xuICAgICAgICB1c2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGAjJHtzdmdIcmVmfWApO1xuICAgICAgICB1c2VFbGVtZW50LnNldEF0dHJpYnV0ZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuICAgICAgICBwcmV2aWV3U1ZHLmFwcGVuZENoaWxkKHVzZUVsZW1lbnQpO1xuICAgICAgICBwcmV2aWV3U1ZHLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS50b3AgPSAnMCc7XG4gICAgICAgIHByZXZpZXdTVkcuc3R5bGUubGVmdCA9ICcwJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgcHJldmlld1NWRy5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICAgIHJldHVybiBwcmV2aWV3U1ZHO1xuICAgIH1cbiAgICBjcmVhdGVNaW5pbWFwUGFuZSgpIHtcbiAgICAgICAgY29uc3QgbWluaW1hcFBhbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbWluaW1hcFBhbmUuY2xhc3NOYW1lID0gJ21pbmltYXAtcGFuZSc7XG4gICAgICAgIG1pbmltYXBQYW5lLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIG1pbmltYXBQYW5lLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbWluaW1hcFBhbmUuc3R5bGUucmlnaHQgPSAnMCc7XG4gICAgICAgIG1pbmltYXBQYW5lLnN0eWxlLnRvcCA9ICcwJztcbiAgICAgICAgcmV0dXJuIG1pbmltYXBQYW5lO1xuICAgIH1cbiAgICBjcmVhdGVWaXNpYmxlU2VjdGlvbigpIHtcbiAgICAgICAgY29uc3QgdmlzaWJsZVNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcbiAgICAgICAgdmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdtaW5pbWFwLXZpc2libGUtc2VjdGlvbicpO1xuICAgICAgICB2aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3gnLCAnMCcpO1xuICAgICAgICB2aXNpYmxlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgICAgICByZXR1cm4gdmlzaWJsZVNlY3Rpb247XG4gICAgfVxuICAgIHN5bmNTY3JvbGwoKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbFBvc1lJblBlcmNlbnRhZ2UgPSB0aGlzLnNjYWxlVW5pdFkgKiB0aGlzLm1haW5WaWV3LnNjcm9sbFRvcDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsUG9zWEluUGVyY2VudGFnZSA9IHRoaXMuc2NhbGVVbml0WCAqIHRoaXMubWFpblZpZXcuc2Nyb2xsTGVmdDtcbiAgICAgICAgdGhpcy5taW5pbWFwUGFuZS5zY3JvbGxUb3AgPSAodGhpcy5taW5pbWFwUGFuZS5zY3JvbGxIZWlnaHQgLSB0aGlzLm1pbmltYXBQYW5lLmNsaWVudEhlaWdodCkgKiBzY3JvbGxQb3NZSW5QZXJjZW50YWdlO1xuICAgICAgICB0aGlzLm1pbmltYXBQYW5lLnNjcm9sbExlZnQgPSAodGhpcy5taW5pbWFwUGFuZS5zY3JvbGxXaWR0aCAtIHRoaXMubWluaW1hcFBhbmUuY2xpZW50V2lkdGgpICogc2Nyb2xsUG9zWEluUGVyY2VudGFnZTtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVkgPSAodGhpcy5tYWluVmlld1Njcm9sbEhlaWdodCAtIHRoaXMubWFpblZpZXdIZWlnaHQpICogc2Nyb2xsUG9zWUluUGVyY2VudGFnZTtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVggPSAodGhpcy5tYWluVmlld1Njcm9sbFdpZHRoIC0gdGhpcy5tYWluVmlld1dpZHRoKSAqIHNjcm9sbFBvc1hJblBlcmNlbnRhZ2U7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCd5Jywgb3ZlcmxheVkudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMudmlzaWJsZVNlY3Rpb24uc2V0QXR0cmlidXRlKCd4Jywgb3ZlcmxheVgudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXJ0RHJhZyhldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmRyYWcpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmREcmFnKTtcbiAgICB9XG59XG5leHBvcnQgeyBNaW5pbWFwIH07XG4iLCJ2YXIgSW5jbHVkZUtpbmQ7XG4oZnVuY3Rpb24gKEluY2x1ZGVLaW5kKSB7XG4gICAgSW5jbHVkZUtpbmRbXCJXSVRIX1NBTUVfVEFSR0VUXCJdID0gXCJXSVRIX1NBTUVfVEFSR0VUXCI7XG59KShJbmNsdWRlS2luZCB8fCAoSW5jbHVkZUtpbmQgPSB7fSkpO1xuY2xhc3MgU2Fua2V5Q2hhcnREYXRhIHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZVRhZ0NvbG9yID0gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbm9kZS50YWdzID8gbm9kZS50YWdzLm1hcCh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSB0aGlzLm9wdGlvbnMudGFnQ29sb3JNYXApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVt0YWddOyB9KS5maW5kKGNvbG9yID0+IGNvbG9yICE9PSB1bmRlZmluZWQpIDogdGhpcy5vcHRpb25zLmRlZmF1bHRDb2xvcjtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmNvbG9yIHx8IGNvbG9yO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHsgcmVsYXRpb25zOiBbXSwgaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kczogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbERhdGEgPSB7IG5hbWU6IGRhdGEubmFtZSwgY29sb3I6IGRhdGEuY29sb3IsIG5vZGVzOiBkYXRhLm5vZGVzIHx8IFtdLCByZWxhdGlvbnM6IGRhdGEucmVsYXRpb25zIHx8IFtdIH07XG4gICAgICAgIHRoaXMubm9kZXNCeUtpbmRzID0ge307XG4gICAgICAgIHRoaXMudGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG5vVGFnOiAnT3RoZXJzJyxcbiAgICAgICAgICAgIG5vVGFnU3VmZml4Q2hhcmFjdGVyOiAn4oCmJyxcbiAgICAgICAgICAgIHJlbGF0aW9uRGVmYXVsdFdpZHRoOiAxNSxcbiAgICAgICAgICAgIGRlZmF1bHRDb2xvcjogXCJvcmFuZ2VcIixcbiAgICAgICAgICAgIHRhZ0NvbG9yTWFwOiB7fSxcbiAgICAgICAgICAgIGtpbmRzOiBbXSxcbiAgICAgICAgICAgIHNob3dSZWxhdGVkS2luZHM6IGZhbHNlLFxuICAgICAgICAgICAgc2VsZWN0QW5kRmlsdGVyOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU29ydFJlbGF0aW9ucygpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVSZWxhdGlvbnNJbmZvKCk7XG4gICAgICAgIHRoaXMuc29ydE5vZGVzKHRoaXMubm9kZXMpO1xuICAgIH1cbiAgICByZXNldENvbG9ycygpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCkge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy50YWdDb2xvck1hcCk7XG4gICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzU29tZSA9IHRhZ3Muc29tZSh0YWcgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBub2RlLnRhZ3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcyh0YWcpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzU29tZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZVsnY29sb3InXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub2RlID0+IGRlbGV0ZSBub2RlWydjb2xvciddKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5yZXNldENvbG9ycygpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyksIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCBwcmV2aW91c05vZGUgPSB0aGlzLnNlbGVjdGVkTm9kZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUocHJldmlvdXNOb2RlKTtcbiAgICB9XG4gICAgYXBwZW5kRGF0YShkYXRhLCBzZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubWVyZ2VEYXRhKHRoaXMub3JpZ2luYWxEYXRhLCBkYXRhKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShzZWxlY3RlZE5vZGUpO1xuICAgIH1cbiAgICBnZXROb2RlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXMgfHwgW107XG4gICAgfVxuICAgIGdldE5vZGVzQnlLaW5kKGtpbmQpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5ub2Rlc0J5S2luZHNba2luZF0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgIH1cbiAgICBnZXRSZWxhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcGVuZGVuY2llcy5yZWxhdGlvbnMgfHwgW107XG4gICAgfVxuICAgIGdldEtpbmRzKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZEtpbmRzID0gT2JqZWN0LmtleXModGhpcy5ub2Rlc0J5S2luZHMpO1xuICAgICAgICBpZiAoKChfYiA9IChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtpbmRzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubGVuZ3RoKSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMua2luZHMuZmlsdGVyKGtpbmQgPT4gZmlsdGVyZWRLaW5kcy5pbmNsdWRlcyhraW5kLm5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWRLaW5kcy5tYXAoa2luZCA9PiAoeyBuYW1lOiBraW5kIH0pKTtcbiAgICB9XG4gICAgZ2V0VGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBzZXRUaXRsZSh0aXRsZSkge1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGUgPyB7IHRpdGxlOiB0aXRsZS50aXRsZSwgbmFtZTogdGl0bGUubmFtZSwgY29sb3I6IHRpdGxlLmNvbG9yIH0gOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGdldFNlbGVjdGVkTm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWROb2RlO1xuICAgIH1cbiAgICBzZWxlY3ROb2RlKG5vZGUpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBCeUtpbmQgPSAobm9kZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFCeUtpbmRzID0ge307XG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YUJ5S2luZHNbbm9kZS5raW5kXSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhQnlLaW5kc1tub2RlLmtpbmRdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRhdGFCeUtpbmRzW25vZGUua2luZF0ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFCeUtpbmRzO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZXMgPSB0aGlzLm9yaWdpbmFsRGF0YS5ub2RlcztcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucyB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMubm9kZXNCeUtpbmRzID0gZ3JvdXBCeUtpbmQodGhpcy5ub2Rlcyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbm9kZS5raW5kIHx8ICFub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZSBtdXN0IGhhdmUga2luZCBhbmQgbmFtZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICYmIG5vZGUubmFtZSA9PT0gdGhpcy5zZWxlY3RlZE5vZGUubmFtZSAmJiBub2RlLmtpbmQgPT09IHRoaXMuc2VsZWN0ZWROb2RlLmtpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gdGhpcy5vcmlnaW5hbERhdGEubm9kZXMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbm9kZS5uYW1lICYmIGl0ZW0ua2luZCA9PT0gbm9kZS5raW5kKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkS2luZCA9IHRoaXMub3B0aW9ucy5raW5kcy5maW5kKGtpbmQgPT4geyB2YXIgX2E7IHJldHVybiBraW5kLm5hbWUgPT09ICgoX2EgPSB0aGlzLnNlbGVjdGVkTm9kZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtpbmQpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVsnaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kcyddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNlbGVjdGVkTm9kZVsnaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kcyddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVsnaGFzUmVsYXRlZFNvdXJjZU9mT3RoZXJLaW5kcyddID0gKHNlbGVjdGVkS2luZCA9PT0gbnVsbCB8fCBzZWxlY3RlZEtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkS2luZC5pbmNsdWRlQWx0ZXJuYXRpdmUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0QW5kRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1JlbGF0ZWRLaW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZpbHRlckRlcGVuZGVuY2llcyh0aGlzLnNlbGVjdGVkTm9kZSwgc2VsZWN0ZWRLaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gdGhpcy5maWx0ZXJEZXBlbmRlbmNpZXModGhpcy5zZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMgPSB0aGlzLmZpbHRlck5vZGVzKHRoaXMuZGVwZW5kZW5jaWVzLnJlbGF0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzUmVsYXRlZFNvdXJjZU9mU2FtZUtpbmQgPSB0aGlzLmRlcGVuZGVuY2llcy5yZWxhdGlvbnMuZmluZChyZWxhdGlvbiA9PiByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gbm9kZS5raW5kICYmIHJlbGF0aW9uLnRhcmdldC5uYW1lID09PSBub2RlLm5hbWUgJiYgcmVsYXRpb24uc291cmNlLmtpbmQgPT09IG5vZGUua2luZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm9kZXNCeUtpbmRzID0gZ3JvdXBCeUtpbmQodGhpcy5ub2Rlcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3J0Tm9kZXModGhpcy5ub2Rlcyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkTm9kZTtcbiAgICB9XG4gICAgc29ydE5vZGVzQWxwYWJldGljYWxseShub2Rlcykge1xuICAgICAgICBjb25zdCB1bmRlZmluZWRUYWcgPSAodGhpcy5vcHRpb25zLm5vVGFnIHx8ICcnKSArIHRoaXMub3B0aW9ucy5ub1RhZ1N1ZmZpeENoYXJhY3RlcjtcbiAgICAgICAgbm9kZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEubmFtZSA9PT0gdW5kZWZpbmVkVGFnICYmIGIubmFtZSAhPT0gdW5kZWZpbmVkVGFnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhLm5hbWUgIT09IHVuZGVmaW5lZFRhZyAmJiBiLm5hbWUgPT09IHVuZGVmaW5lZFRhZykge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc29ydE5vZGVzKG5vZGVzKSB7XG4gICAgICAgIGNvbnN0IHVuZGVmaW5lZFRhZyA9ICh0aGlzLm9wdGlvbnMubm9UYWcgfHwgJycpICsgdGhpcy5vcHRpb25zLm5vVGFnU3VmZml4Q2hhcmFjdGVyO1xuICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGUgPSB0aGlzLmdldFNlbGVjdGVkTm9kZSgpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5zb3J0Tm9kZXNBbHBhYmV0aWNhbGx5KHRoaXMuZ2V0Tm9kZXMoKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByZXZpb3VzS2luZHMgPSBbXTtcbiAgICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMub3B0aW9ucy5raW5kcy5maW5kSW5kZXgoayA9PiBrLm5hbWUgPT09IChzZWxlY3RlZE5vZGUgPT09IG51bGwgfHwgc2VsZWN0ZWROb2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZE5vZGUua2luZCkpO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0SW5kZXg7IGluZGV4IDwgdGhpcy5vcHRpb25zLmtpbmRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3Qga2luZCA9IHRoaXMub3B0aW9ucy5raW5kc1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50S2luZHMgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRLaW5kcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydE5vZGVzT2ZLaW5kKGtpbmQsIGN1cnJlbnRLaW5kcywgcHJldmlvdXNLaW5kcywgc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0tpbmRzID0gY3VycmVudEtpbmRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtpbmQgPSB0aGlzLm9wdGlvbnMua2luZHNbc3RhcnRJbmRleF07XG4gICAgICAgIHByZXZpb3VzS2luZHMgPSB0aGlzLm5vZGVzQnlLaW5kc1traW5kLm5hbWVdO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0SW5kZXggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICBjb25zdCBraW5kID0gdGhpcy5vcHRpb25zLmtpbmRzW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRLaW5kcyA9IHRoaXMubm9kZXNCeUtpbmRzW2tpbmQubmFtZV07XG4gICAgICAgICAgICBpZiAoY3VycmVudEtpbmRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0Tm9kZXNPZktpbmQoa2luZCwgY3VycmVudEtpbmRzLCBwcmV2aW91c0tpbmRzLCBzZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzS2luZHMgPSBjdXJyZW50S2luZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3J0UmVsYXRpb25zKCk7XG4gICAgfVxuICAgIHNvcnROb2Rlc09mS2luZChraW5kLCBub2RlcywgcHJldmlvdXNLaW5kcywgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGlmIChraW5kLm5hbWUgPT09IChzZWxlY3RlZE5vZGUgPT09IG51bGwgfHwgc2VsZWN0ZWROb2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZE5vZGUua2luZCkpIHtcbiAgICAgICAgICAgIG5vZGVzLnNvcnQoKGEsIGIpID0+IGEubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgPyAtMSA6IChiLm5hbWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lID8gMSA6IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9ucyA9IHRoaXMuZ2V0UmVsYXRpb25zKCk7XG4gICAgICAgICAgICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYVByZXZvdXNOb2RlcyA9IHJlbGF0aW9ucy5maWx0ZXIocmVsID0+IHJlbC50YXJnZXQubmFtZSA9PT0gYS5uYW1lICYmIHJlbC50YXJnZXQua2luZCA9PT0gYS5raW5kKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiUHJldm91c05vZGVzID0gcmVsYXRpb25zLmZpbHRlcihyZWwgPT4gcmVsLnRhcmdldC5uYW1lID09PSBiLm5hbWUgJiYgcmVsLnRhcmdldC5raW5kID09PSBiLmtpbmQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFJbmRleCA9IHByZXZpb3VzS2luZHMuZmluZEluZGV4KGl0ZW0gPT4gYVByZXZvdXNOb2Rlcy5zb21lKHJlbCA9PiByZWwuc291cmNlLm5hbWUgPT09IGl0ZW0ubmFtZSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJJbmRleCA9IHByZXZpb3VzS2luZHMuZmluZEluZGV4KGl0ZW0gPT4gYlByZXZvdXNOb2Rlcy5zb21lKHJlbCA9PiByZWwuc291cmNlLm5hbWUgPT09IGl0ZW0ubmFtZSkpO1xuICAgICAgICAgICAgICAgIGlmIChhSW5kZXggIT09IC0xIHx8IGJJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFJbmRleCA9PT0gYkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYkluZGV4ID4gYUluZGV4ID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIDtcbiAgICBzb3J0UmVsYXRpb25zKCkge1xuICAgICAgICBjb25zdCBjb21iaW5lZE5vZGVzID0ge307XG4gICAgICAgIGNvbnN0IHNoaWZ0ID0gMTAwMDAwO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm5vZGVzQnlLaW5kcykuZm9yRWFjaChraW5kID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gc2hpZnQ7XG4gICAgICAgICAgICB0aGlzLm5vZGVzQnlLaW5kc1traW5kXS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbWJpbmVkTm9kZXNba2luZCArICc6OicgKyBub2RlLm5hbWVdID0gKGkrKyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9ucyA9IHRoaXMuZ2V0UmVsYXRpb25zKCk7XG4gICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgICAgICBjb25zdCBhU291cmNlS2V5ID0gYCR7YS5zb3VyY2Uua2luZH06OiR7YS5zb3VyY2UubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgYlNvdXJjZUtleSA9IGAke2Iuc291cmNlLmtpbmR9Ojoke2Iuc291cmNlLm5hbWV9YDtcbiAgICAgICAgICAgIGNvbnN0IGFUYXJnZXRLZXkgPSBgJHthLnRhcmdldC5raW5kfTo6JHthLnRhcmdldC5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCBiVGFyZ2V0S2V5ID0gYCR7Yi50YXJnZXQua2luZH06OiR7Yi50YXJnZXQubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgYVNvdXJjZUluZGV4ID0gKF9hID0gY29tYmluZWROb2Rlc1thU291cmNlS2V5XSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgICBjb25zdCBiU291cmNlSW5kZXggPSAoX2IgPSBjb21iaW5lZE5vZGVzW2JTb3VyY2VLZXldKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICAgIGNvbnN0IGFUYXJnZXRJbmRleCA9IChfYyA9IGNvbWJpbmVkTm9kZXNbYVRhcmdldEtleV0pICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICAgICAgY29uc3QgYlRhcmdldEluZGV4ID0gKF9kID0gY29tYmluZWROb2Rlc1tiVGFyZ2V0S2V5XSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgICAgICBjb25zdCBhSW5kZXggPSBhU291cmNlSW5kZXggKiBzaGlmdCArIGFUYXJnZXRJbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGJJbmRleCA9IGJTb3VyY2VJbmRleCAqIHNoaWZ0ICsgYlRhcmdldEluZGV4O1xuICAgICAgICAgICAgcmV0dXJuIGFJbmRleCAtIGJJbmRleDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYWxpemVTb3J0UmVsYXRpb25zKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnNvdXJjZS5raW5kICE9PSBiLnNvdXJjZS5raW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuc291cmNlLmtpbmQubG9jYWxlQ29tcGFyZShiLnNvdXJjZS5raW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnNvdXJjZS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnNvdXJjZS5raW5kID09PSBiLnNvdXJjZS5raW5kICYmIGEuc291cmNlLm5hbWUgPT09IGIuc291cmNlLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQua2luZCAhPT0gYi50YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS50YXJnZXQua2luZC5sb2NhbGVDb21wYXJlKGIudGFyZ2V0LmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudGFyZ2V0Lm5hbWUubG9jYWxlQ29tcGFyZShiLnRhcmdldC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRpYWxpemVSZWxhdGlvbnNJbmZvKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB7fTtcbiAgICAgICAgKF9hID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gbGluay5zb3VyY2Uua2luZCArICc6OicgKyBsaW5rLnNvdXJjZS5uYW1lO1xuICAgICAgICAgICAgaWYgKCFzdW1tYXJ5W2tleV0pIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0gPSB7IHNvdXJjZUNvdW50OiAwLCB0YXJnZXRDb3VudDogMCwgcmVmczogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmsuc291cmNlLmtpbmQgPT09IGxpbmsudGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5W2tleV0ucmVmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VtbWFyeVtrZXldLnNvdXJjZUNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRLZXkgPSBsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICBpZiAoIXN1bW1hcnlbdGFyZ2V0S2V5XSkge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlbdGFyZ2V0S2V5XSA9IHsgc291cmNlQ291bnQ6IDAsIHRhcmdldENvdW50OiAwLCByZWZzOiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5W3RhcmdldEtleV0udGFyZ2V0Q291bnQrKztcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGZldGNoTW9yZU5vZGVzID0gW107XG4gICAgICAgIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5ID0gc3VtbWFyeVtub2RlLmtpbmQgKyAnOjonICsgbm9kZS5uYW1lXTtcbiAgICAgICAgICAgIG5vZGUuY29sb3IgPSB0aGlzLmdldE5vZGVUYWdDb2xvcihub2RlKTtcbiAgICAgICAgICAgIGlmIChub2RlLnRhcmdldENvdW50IHx8IG5vZGUuc291cmNlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBub2RlLmNhcmRpbmFsaXR5ID0geyBzb3VyY2VDb3VudDogbm9kZS5zb3VyY2VDb3VudCwgdGFyZ2V0Q291bnQ6IG5vZGUudGFyZ2V0Q291bnQsIGZldGNoTW9yZTogdHJ1ZSwgcmVmczogMCB9O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnNvdXJjZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnNvdXJjZUNvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHRoaXMuYXBwZW5kTmV4dE5vZGUobm9kZSwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoTW9yZU5vZGVzLnB1c2gobmV4dE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLnRhcmdldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnRhcmdldENvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHRoaXMuYXBwZW5kTmV4dE5vZGUobm9kZSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hNb3JlTm9kZXMucHVzaChuZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLmNhcmRpbmFsaXR5ID0gY2FyZGluYWxpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmZXRjaE1vcmVOb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbERhdGEubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldEluZGV4QnlLaW5kKGtpbmQsIG9mZnNldCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBjb25zdCBpbmRleCA9IChfYiA9IChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtpbmRzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZmluZEluZGV4KG9iaiA9PiBvYmoubmFtZSA9PT0ga2luZCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBsZXQgbmV3SW5kZXggPSBpbmRleCArIG9mZnNldDtcbiAgICAgICAgICAgIGlmIChuZXdJbmRleCA8IDAgfHwgbmV3SW5kZXggPj0gdGhpcy5vcHRpb25zLmtpbmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhcHBlbmROZXh0Tm9kZShub2RlLCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdldEluZGV4QnlLaW5kKG5vZGUua2luZCwgb2Zmc2V0KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHROb2RlS2luZCA9IHRoaXMub3B0aW9ucy5raW5kc1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHsga2luZDogbmV4dE5vZGVLaW5kLm5hbWUsIG5hbWU6ICfigKYnLCBwbGFjZUhvbGRlcjogdHJ1ZSB9O1xuICAgICAgICAgICAgY29uc3QgbmV4dE5vZGVSZWxhdGlvbiA9IG9mZnNldCA9PT0gLTEgPyB7IHNvdXJjZTogbmV4dE5vZGUsIHRhcmdldDogbm9kZSB9IDogeyBzb3VyY2U6IG5vZGUsIHRhcmdldDogbmV4dE5vZGUgfTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5wdXNoKG5leHROb2RlUmVsYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIG5leHROb2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHNlYXJjaEJ5TmFtZShub2RlKSB7XG4gICAgICAgIGlmICghbm9kZS5raW5kIHx8ICFub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsdGVyIGNyaXRlcmlhIGlzIGVtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLm5vZGVzLmZpbHRlcihpdGVtID0+IGl0ZW0ua2luZCA9PT0gbm9kZS5raW5kICYmIGl0ZW0ubmFtZS5pbmNsdWRlcyhub2RlLm5hbWUpKTtcbiAgICB9XG4gICAgZmluZEJ5TmFtZShuYW1lLCBkYXRhQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFBcnJheS5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcbiAgICB9XG4gICAgZmlsdGVyRGVwZW5kZW5jaWVzKHNlbGVjdGVkTm9kZSwgc2VsZWN0ZWRLaW5kKSB7XG4gICAgICAgIGxldCByZWxhdGVkUmVsYXRpb25zID0gW107XG4gICAgICAgIGNvbnN0IGtpbmROYW1lcyA9IHRoaXMub3B0aW9ucy5raW5kcy5tYXAoayA9PiBrLm5hbWUpO1xuICAgICAgICBsZXQgdGFyZ2V0UmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRpb24uc291cmNlLmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHJlbGF0aW9uLnNvdXJjZS5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSAmJiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24udGFyZ2V0LmtpbmQpIDogdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGFyZ2V0UmVsYXRpb25zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFNvdXJjZXMgPSB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHNlbGVjdGVkTm9kZS5raW5kICYmIHJlbGF0aW9uLnRhcmdldC5uYW1lID09PSBzZWxlY3RlZE5vZGUubmFtZSAmJiAoa2luZE5hbWVzLmxlbmd0aCA+IDAgPyBraW5kTmFtZXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQpIDogdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU291cmNlTmFtZXMgPSBzZWxlY3RlZFNvdXJjZXMubWFwKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5uYW1lKTtcbiAgICAgICAgICAgIHRhcmdldFJlbGF0aW9ucyA9IHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWxhdGlvbi5zb3VyY2Uua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQgJiYgc2VsZWN0ZWRTb3VyY2VOYW1lcy5pbmNsdWRlcyhyZWxhdGlvbi5zb3VyY2UubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhcmdldFJlbGF0aW9ucy5wdXNoKC4uLnNlbGVjdGVkU291cmNlcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0S2V5cyA9IHRhcmdldFJlbGF0aW9ucyA/IFsuLi5uZXcgU2V0KHRhcmdldFJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKSldIDogW107XG4gICAgICAgIGNvbnN0IHRhcmdldFRhcmdldFJlbGF0aW9ucyA9IHRoaXMudGFyZ2V0VGFyZ2V0UmVsYXRpb25zKHNlbGVjdGVkTm9kZS5raW5kLCBraW5kTmFtZXMsIHRhcmdldEtleXMpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRLaW5kID09PSBudWxsIHx8IHNlbGVjdGVkS2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWRLaW5kLmluY2x1ZGVBbHRlcm5hdGl2ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEtpbmRLZXlzID0gWy4uLm5ldyBTZXQodGFyZ2V0UmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV07XG4gICAgICAgICAgICByZWxhdGVkUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRLaW5kS2V5cy5pbmNsdWRlcyhgJHtyZWxhdGlvbi50YXJnZXQua2luZH06OiR7cmVsYXRpb24udGFyZ2V0Lm5hbWV9YCkgJiYgc2VsZWN0ZWRLaW5kLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHJlbGF0aW9uLnRhcmdldC5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCAmJiByZWxhdGlvbi50YXJnZXQubmFtZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VLZXlzID0gc291cmNlUmVsYXRpb25zID8gWy4uLm5ldyBTZXQoc291cmNlUmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApKV0gOiBbXTtcbiAgICAgICAgY29uc3Qgc291cmNlU291cmNlUmVsYXRpb25zID0gdGhpcy5vcmlnaW5hbERhdGEucmVsYXRpb25zLmZpbHRlcihyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHNvdXJjZUtleXMuaW5jbHVkZXMoYCR7cmVsYXRpb24udGFyZ2V0LmtpbmR9Ojoke3JlbGF0aW9uLnRhcmdldC5uYW1lfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZWxhdGlvbnMgPSBbLi4ubmV3IFNldChbLi4udGFyZ2V0UmVsYXRpb25zLCAuLi50YXJnZXRUYXJnZXRSZWxhdGlvbnMsIC4uLnNvdXJjZVNvdXJjZVJlbGF0aW9ucywgLi4ucmVsYXRlZFJlbGF0aW9ucywgLi4uc291cmNlUmVsYXRpb25zXS5tYXAocmVsID0+IEpTT04uc3RyaW5naWZ5KHJlbCkpKV0ubWFwKHJlbFN0cmluZyA9PiBKU09OLnBhcnNlKHJlbFN0cmluZykpO1xuICAgICAgICBzZWxlY3RlZE5vZGUuaGFzUmVsYXRpb25zT2ZTYW1lS2luZHMgPSBkaXN0aW5jdFJlbGF0aW9ucy5maW5kKHJlbGF0aW9uID0+IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBzZWxlY3RlZE5vZGUua2luZCB8fCByZWxhdGlvbi50YXJnZXQua2luZCA9PT0gc2VsZWN0ZWROb2RlLmtpbmQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVsYXRpb25zOiBkaXN0aW5jdFJlbGF0aW9ucyxcbiAgICAgICAgICAgIGhhc1JlbGF0ZWRTb3VyY2VPZk90aGVyS2luZHM6IHJlbGF0ZWRSZWxhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICB9O1xuICAgIH1cbiAgICB0YXJnZXRUYXJnZXRSZWxhdGlvbnMoa2luZCwga2luZE5hbWVzLCB0YXJnZXRLZXlzKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1NhbWVLaW5kc09uTm9uU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5yZWxhdGlvbnMuZmlsdGVyKHJlbGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHRhcmdldEtleXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQgKyAnOjonICsgcmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxEYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgocmVsYXRpb24udGFyZ2V0LmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kKSA/IHJlbGF0aW9uLnNvdXJjZS5raW5kID09PSBraW5kIDogdHJ1ZSkgJiYgKGtpbmROYW1lcy5sZW5ndGggPiAwID8ga2luZE5hbWVzLmluY2x1ZGVzKHJlbGF0aW9uLnRhcmdldC5raW5kKSA6IHRydWUpICYmIHRhcmdldEtleXMuaW5jbHVkZXMocmVsYXRpb24uc291cmNlLmtpbmQgKyAnOjonICsgcmVsYXRpb24uc291cmNlLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlsdGVyTm9kZXMocmVsYXRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uS2V5cyA9IHJlbGF0aW9ucy5mbGF0TWFwKHJlbGF0aW9uID0+IGAke3JlbGF0aW9uLnRhcmdldC5raW5kfTo6JHtyZWxhdGlvbi50YXJnZXQubmFtZX1gKTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25Tb3VyY2VLZXlzID0gcmVsYXRpb25zLmZsYXRNYXAocmVsYXRpb24gPT4gYCR7cmVsYXRpb24uc291cmNlLmtpbmR9Ojoke3JlbGF0aW9uLnNvdXJjZS5uYW1lfWApO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uU291cmNlS2V5cy5wdXNoKGAke3RoaXMuc2VsZWN0ZWROb2RlLmtpbmR9Ojoke3RoaXMuc2VsZWN0ZWROb2RlLm5hbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGlzdGluY3RLZXlzID0gWy4uLm5ldyBTZXQocmVsYXRpb25LZXlzLmNvbmNhdChyZWxhdGlvblNvdXJjZUtleXMpKV07XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRGF0YS5ub2Rlcy5maWx0ZXIobm9kZSA9PiBkaXN0aW5jdEtleXMuaW5jbHVkZXMoYCR7bm9kZS5raW5kfTo6JHtub2RlLm5hbWV9YCkpO1xuICAgIH1cbiAgICBtZXJnZURhdGEob3JpZ2luRGF0YSwgYXBwZW5kRGF0YSkge1xuICAgICAgICBhcHBlbmREYXRhLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG9yaWdpbkRhdGEubm9kZXMuZmluZEluZGV4KGV4aXN0aW5nTm9kZSA9PiBleGlzdGluZ05vZGUua2luZCA9PT0gbm9kZS5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSBub2RlLm5hbWUpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IG9yaWdpbkRhdGEubm9kZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVsYXRpb25zVG9SZW1vdmUgPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5maWx0ZXIocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdOb2RlLmtpbmQgPT09IHJlbGF0aW9uLnNvdXJjZS5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSByZWxhdGlvbi5zb3VyY2UubmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdOb2RlLmtpbmQgPT09IHJlbGF0aW9uLnRhcmdldC5raW5kICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSByZWxhdGlvbi50YXJnZXQubmFtZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3VuZFJlbGF0aW9uc1RvUmVtb3ZlLmZvckVhY2gocmVsYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbkluZGV4ID0gb3JpZ2luRGF0YS5yZWxhdGlvbnMuaW5kZXhPZihyZWxhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5yZWxhdGlvbnMuc3BsaWNlKHJlbGF0aW9uSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5ub2Rlc1tpbmRleF0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luRGF0YS5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwZW5kRGF0YS5yZWxhdGlvbnMuZm9yRWFjaChyZWxhdGlvbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1JlbGF0aW9uSW5kZXggPSBvcmlnaW5EYXRhLnJlbGF0aW9ucy5maW5kSW5kZXgoZXhpc3RpbmdSZWxhdGlvbiA9PiBleGlzdGluZ1JlbGF0aW9uLnNvdXJjZS5raW5kID09PSByZWxhdGlvbi5zb3VyY2Uua2luZCAmJlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVsYXRpb24uc291cmNlLm5hbWUgPT09IHJlbGF0aW9uLnNvdXJjZS5uYW1lICYmXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWxhdGlvbi50YXJnZXQua2luZCA9PT0gcmVsYXRpb24udGFyZ2V0LmtpbmQgJiZcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlbGF0aW9uLnRhcmdldC5uYW1lID09PSByZWxhdGlvbi50YXJnZXQubmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdSZWxhdGlvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbkRhdGEucmVsYXRpb25zLnB1c2gocmVsYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9yaWdpbkRhdGE7XG4gICAgfVxufVxuZXhwb3J0IHsgU2Fua2V5Q2hhcnREYXRhLCBJbmNsdWRlS2luZCB9O1xuIiwiaW1wb3J0IHsgRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi9ldmVudC1oYW5kbGVyJztcbmNsYXNzIFNhbmtleUNoYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcihzdmdFbGVtZW50LCBjdXN0b21PcHRpb25zKSB7XG4gICAgICAgIHRoaXMuU1ZHX05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBub2RlV2lkdGg6IDEwLFxuICAgICAgICAgICAgbm9kZUxpbmVIZWlnaHQ6IDE4LFxuICAgICAgICAgICAgbWFyZ2luWDogMTUsXG4gICAgICAgICAgICBtYXJnaW5ZOiA1LFxuICAgICAgICAgICAgbGVmdFg6IDE1LFxuICAgICAgICAgICAgdG9wWTogMTAsXG4gICAgICAgICAgICBub2RlTWFyZ2luWTogMTAsXG4gICAgICAgICAgICBub2RlQ29sdW1uV2l0aDogMzAwLFxuICAgICAgICAgICAgZGVmYXVsdE5vZGVDb2xvcjogXCJncmF5XCIsXG4gICAgICAgICAgICByZW5kZXJLaW5kQXNDb2x1bXM6IHRydWUsXG4gICAgICAgICAgICB0cmFmZmljTG9nMTBGYWN0b3I6IDEyLFxuICAgICAgICAgICAgcmVsYXRpb25EZWZhdWx0V2lkdGg6IDE1LFxuICAgICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZE9wYWNpdHk6IDAuMixcbiAgICAgICAgICAgICAgICBhbmFseXRpY3NPcGFjaXR5OiAwLjIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC4yLFxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIG5vblBST0Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNhbWVLaW5kSW5kZW50YXRpb246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlOiB7XG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmYxMDEwJyxcbiAgICAgICAgICAgICAgICBob3Zlck9wYWNpdHk6IDAuMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydW5jYXRlVGV4dDoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRGb250U2l6ZUFuZEZhbWlseTogJzE2cHggQXJpYWwnLFxuICAgICAgICAgICAgICAgIGVsbGlwc2VDaGFyYWN0ZXI6ICfigKYnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm9vdENoYXJhY3RlcjogJ+KMgidcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucyhjdXN0b21PcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQgPSBzdmdFbGVtZW50O1xuICAgICAgICB0aGlzLm5vZGVQb3NpdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIE5PREVfVFlQRV9USVRMRTogXCJub2RlLWtpbmQtdGl0bGVcIixcbiAgICAgICAgICAgIE5PREVfVElUTEU6IFwibm9kZS10aXRsZVwiLFxuICAgICAgICAgICAgUkVMQVRJT046IFwicmVsYXRpb25cIixcbiAgICAgICAgICAgIENBUkRJTkFMSVRZOiBcImNhcmRpbmFsaXR5XCIsXG4gICAgICAgICAgICBTRUxFQ1RFRDogJ3NlbGVjdGVkJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgICAgICB0aGlzLnRydW5jYXRlVGV4dCA9IHRoaXMuY3JlYXRlVHJ1bmNhdGVUZXh0KCk7XG4gICAgfVxuICAgIHNldE9wdGlvbnMoY3VzdG9tT3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZXBNZXJnZSh0aGlzLm9wdGlvbnMsIGN1c3RvbU9wdGlvbnMpO1xuICAgIH1cbiAgICBzZXREYXRhKGNoYXJ0RGF0YSkge1xuICAgICAgICBpZiAodGhpcy5jaGFydERhdGEgIT09IGNoYXJ0RGF0YSkge1xuICAgICAgICAgICAgdGhpcy5jaGFydERhdGEgPSBjaGFydERhdGE7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuZGlzcGF0Y2hFdmVudCgnc2VsZWN0aW9uQ2hhbmdlZCcsIHsgbm9kZTogdGhpcy5jaGFydERhdGEuZ2V0U2VsZWN0ZWROb2RlKCksIHBvc2l0aW9uOiB7IHk6IDAgfSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXREYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFydERhdGE7XG4gICAgfVxuICAgIGFkZFNlbGVjdGlvbkNoYW5nZWRMaXN0ZW5lcnMoY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIuc3Vic2NyaWJlKCdzZWxlY3Rpb25DaGFuZ2VkJywgY2FsbGJhY2tGdW5jdGlvbik7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmN0aW9uKHsgbm9kZTogKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRTZWxlY3RlZE5vZGUoKSwgcG9zaXRpb246IHsgeTogMCB9IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZENvbnRleHRNZW51TGlzdGVuZXJzKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbiA9IGNhbGxiYWNrRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkRmV0Y2hEYXRhTGlzdGVuZXJzKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5zdWJzY3JpYmUoJ2ZldGNoRGF0YScsIGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNyZWF0ZVRydW5jYXRlVGV4dCgpIHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBlbGxpcHNlQ2hhciA9IHRoaXMub3B0aW9ucy50cnVuY2F0ZVRleHQuZWxsaXBzZUNoYXJhY3RlcjtcbiAgICAgICAgY29uc3QgZm9udFNpemVBbmRGYW1pbHkgPSB0aGlzLm9wdGlvbnMudHJ1bmNhdGVUZXh0LmRlZmF1bHRGb250U2l6ZUFuZEZhbWlseTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHRydW5jYXRlVGV4dCh0ZXh0LCBtYXhXaWR0aCwgZm9udCA9IGZvbnRTaXplQW5kRmFtaWx5KSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZUtleSA9IGAke3RleHR9LSR7bWF4V2lkdGh9LSR7Zm9udH1gO1xuICAgICAgICAgICAgaWYgKGNhY2hlLmhhcyhjYWNoZUtleSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGV4dC5mb250ID0gZm9udDtcbiAgICAgICAgICAgIGlmIChjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoIDw9IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgY2FjaGUuc2V0KGNhY2hlS2V5LCB0ZXh0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB0cnVuY2F0ZWRUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIHdoaWxlIChjb250ZXh0Lm1lYXN1cmVUZXh0KHRydW5jYXRlZFRleHQgKyBlbGxpcHNlQ2hhcikud2lkdGggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRydW5jYXRlZFRleHQgPSB0cnVuY2F0ZWRUZXh0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRydW5jYXRlZFRleHQgKyBlbGxpcHNlQ2hhcjtcbiAgICAgICAgICAgIGNhY2hlLnNldChjYWNoZUtleSwgcmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJlc2V0U3ZnKCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuaW5uZXJIVE1MID0gYFxuICAgICAgPGRlZnM+XG4gICAgICAgIDxmaWx0ZXIgaWQ9XCJkcm9wc2hhZG93XCI+XG4gICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj1cIjAuNFwiIC8+XG4gICAgICAgIDwvZmlsdGVyPlxuICAgICAgPC9kZWZzPlxuICAgIGA7XG4gICAgfVxuICAgIHVwZGF0ZUhlaWdodCgpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gKCgoX2EgPSB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpdGgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApICsgKChfYiA9IHRoaXMub3B0aW9ucy5ub2RlV2lkdGgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApKSAqIE1hdGgubWF4KDEsICgoX2MgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmdldEtpbmRzKCkubGVuZ3RoKSB8fCAwKSArICh0aGlzLm9wdGlvbnMubWFyZ2luWCAqIDIpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmNhbGN1bGF0ZWRIZWlnaHQudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHJlbmRlckVsaXBzaXNNZW51KHgsIHksIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICBjb25zdCBtZW51R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCAnZWxsaXBzaXNNZW51Jyk7XG4gICAgICAgIG1lbnVHcm91cC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2N1cnNvcjogcG9pbnRlcjsnKTtcbiAgICAgICAgbWVudUdyb3VwLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3ggKyAyLjV9LCAke3l9KWApO1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jcmVhdGVSZWN0KC0yLjUsIDAsIHRoaXMub3B0aW9ucy5ub2RlV2lkdGgsIDIyLCAnYmxhY2snLCAnMC4yJyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeCcsICc1Jyk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeScsICc1Jyk7XG4gICAgICAgIG1lbnVHcm91cC5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgZm9yIChsZXQgaXkgPSA1OyBpeSA8PSAxNTsgaXkgKz0gNSkge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVDaXJjbGUoMi41LCBpeSwgMiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgIG1lbnVHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICB9XG4gICAgICAgIG1lbnVHcm91cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVDYWxsYmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudUNhbGxiYWNrRnVuY3Rpb24oZXZlbnQsIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVudUdyb3VwO1xuICAgIH1cbiAgICBkZWVwTWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnIHx8IHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0JyB8fCBzb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc291cmNlKSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XS5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNvdXJjZVtrZXldID09PSAnb2JqZWN0JyAmJiBzb3VyY2Vba2V5XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kZWVwTWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgcmVuZGVyTm9kZXMobm9kZXMsIHBvc2l0aW9uWCwgc2VsZWN0ZWROb2RlLCBraW5kKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgY29uc3Qgc3ZnR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgbGV0IG92ZXJhbGxZID0gdGhpcy5vcHRpb25zLnRvcFk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVuZGVyS2luZEFzQ29sdW1zKSB7XG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IChraW5kID09PSBudWxsIHx8IGtpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGtpbmQudGl0bGUpIHx8ICgoX2IgPSAoX2EgPSB0aGlzLmNoYXJ0RGF0YSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFRpdGxlKCkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKGtpbmQgPT09IG51bGwgfHwga2luZCA9PT0gdm9pZCAwID8gdm9pZCAwIDoga2luZC5jb2xvcikgfHwgKChfZCA9IChfYyA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZ2V0VGl0bGUoKSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmNvbG9yKSB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IHggPSBwb3NpdGlvblggKyAodGhpcy5vcHRpb25zLm5vZGVXaWR0aCAvIDIpO1xuICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMub3B0aW9ucy50b3BZICsgdGhpcy5vcHRpb25zLm1hcmdpblkgKyAodGhpcy5vcHRpb25zLm5vZGVXaWR0aCAvIDIpO1xuICAgICAgICAgICAgbGV0IHgyID0gcG9zaXRpb25YICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIHRoaXMub3B0aW9ucy5ub2RlTWFyZ2luWSAvIDI7XG4gICAgICAgICAgICBjb25zdCB5MiA9IHRoaXMub3B0aW9ucy50b3BZICsgdGhpcy5vcHRpb25zLm1hcmdpblkgKyAodGhpcy5vcHRpb25zLm5vZGVXaWR0aCk7XG4gICAgICAgICAgICBsZXQgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICBpZiAoa2luZCA9PT0gbnVsbCB8fCBraW5kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBraW5kLmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVDaXJjbGUoeCwgeSwgNSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKGNpcmNsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnfCAnO1xuICAgICAgICAgICAgICAgIHgyIC09IDEzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgbm9kZUtpbmRUaXRsZSA9IHRoaXMuY3JlYXRlU3ZnVGV4dChwcmVmaXggKyB0aXRsZSwgW3RoaXMuY2xhc3NOYW1lLk5PREVfVFlQRV9USVRMRV0pO1xuICAgICAgICAgICAgbm9kZUtpbmRUaXRsZS5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgbm9kZUtpbmRUaXRsZS5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgc3ZnR3JvdXAuYXBwZW5kQ2hpbGQobm9kZUtpbmRUaXRsZSk7XG4gICAgICAgICAgICBvdmVyYWxsWSArPSAyNTtcbiAgICAgICAgfVxuICAgICAgICBub2Rlcy5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlUmVsYXRpb25zID0gbm9kZS5zb3VyY2VSZWxhdGlvbnMgfHwgeyBoZWlnaHQ6IDAsIGNvdW50OiAwIH07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRSZWxhdGlvbnMgPSBub2RlLnRhcmdldFJlbGF0aW9ucyB8fCB7IGhlaWdodDogMCwgY291bnQ6IDAgfTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzQ291bnQgPSAxICsgKG5vZGUuc3VidGl0bGUgPyAxIDogMCkgKyAoKChfYSA9IG5vZGUudGFncykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPyAxIDogMCkgKyAodGhpcy5vcHRpb25zLnJlbmRlcktpbmRBc0NvbHVtcyA/IDAgOiAxKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzSGVpZ2h0ID0gbGluZXNDb3VudCAqIHRoaXMub3B0aW9ucy5ub2RlTGluZUhlaWdodCArIHRoaXMub3B0aW9ucy5tYXJnaW5ZO1xuICAgICAgICAgICAgbm9kZS50ZXh0TGluZXNIZWlnaHQgPSBsaW5lc0hlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBzZWxlY3RlZE5vZGUgJiYgc2VsZWN0ZWROb2RlLm5hbWUgPT09IG5vZGUubmFtZSAmJiBzZWxlY3RlZE5vZGUua2luZCA9PT0gbm9kZS5raW5kID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcmVjdEhlaWdodCA9IDIgKiB0aGlzLm9wdGlvbnMubWFyZ2luWSArIE1hdGgubWF4KGxpbmVzSGVpZ2h0LCBsaW5lc0hlaWdodCArIChzb3VyY2VSZWxhdGlvbnMuaGVpZ2h0ID4gMCA/IHNvdXJjZVJlbGF0aW9ucy5oZWlnaHQgKyAxMiA6IDApLCAodGFyZ2V0UmVsYXRpb25zLmhlaWdodCA+IDAgPyB0YXJnZXRSZWxhdGlvbnMuaGVpZ2h0ICsgMTIgOiAwKSk7XG4gICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5vcHRpb25zLm1hcmdpblkgKyBvdmVyYWxsWTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbm9kZS5jb2xvciB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcjtcbiAgICAgICAgICAgIGxldCBwb3NYID0gcG9zaXRpb25YO1xuICAgICAgICAgICAgbGV0IHJlY3RQb3NpdGlvbldpZHRoID0gdGhpcy5vcHRpb25zLm5vZGVDb2x1bW5XaXRoO1xuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5oYXNSZWxhdGVkU291cmNlT2ZTYW1lS2luZCkge1xuICAgICAgICAgICAgICAgIHBvc1ggKz0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNhbWVLaW5kSW5kZW50YXRpb247XG4gICAgICAgICAgICAgICAgcmVjdFBvc2l0aW9uV2lkdGggLT0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNhbWVLaW5kSW5kZW50YXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCAnZycpO1xuICAgICAgICAgICAgY29uc3QgcmVjdEhvdmVyID0gdGhpcy5jcmVhdGVSZWN0KHBvc1gsIHksIHJlY3RQb3NpdGlvbldpZHRoLCByZWN0SGVpZ2h0LCBjb2xvciwgJzAnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNyZWF0ZVJlY3QocG9zWCwgeSwgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCwgcmVjdEhlaWdodCwgY29sb3IpO1xuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0U2hhZG93ID0gdGhpcy5jcmVhdGVSZWN0KHBvc1ggLSAyLCB5IC0gMiwgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIDQsIHJlY3RIZWlnaHQgKyA0LCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdyeCcsIFwiNlwiKTtcbiAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgncnknLCBcIjZcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWxlY3RlZE5vZGUuZHJvcFNoYWRvdykge1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsbCcsICdibGFjaycpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZSgnZmlsdGVyJywgJ3VybCgjZHJvcHNoYWRvdyknKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIFwiMC4yXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBcIjJcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlY3RTaGFkb3cuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWROb2RlLmJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdFNoYWRvdy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICByZWN0U2hhZG93LnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgXCIxXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RTaGFkb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgICAgIHJlY3RIb3Zlci5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKHJlY3RIb3Zlcik7XG4gICAgICAgICAgICBpZiAobm9kZS5jYXJkaW5hbGl0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2FyZGluYWxpdHlUZXh0KGcsIG5vZGUuY2FyZGluYWxpdHksIHBvc1gsIHksIHJlY3RIZWlnaHQsIGNvbG9yLCBpc1NlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJycsIFt0aGlzLmNsYXNzTmFtZS5OT0RFX1RJVExFLCBpc1NlbGVjdGVkID8gdGhpcy5jbGFzc05hbWUuU0VMRUNURUQgOiAnJ10pO1xuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblgpKTtcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCB5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc3QgbGluZXMgPSB0aGlzLmNyZWF0ZVRleHRMaW5lcyhub2RlLCB0aGlzLm9wdGlvbnMubm9kZUNvbHVtbldpdGggLSB0aGlzLm9wdGlvbnMubm9kZVdpZHRoKTtcbiAgICAgICAgICAgIGxpbmVzLmZvckVhY2goKGxpbmUsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhwb3NYICsgdGhpcy5vcHRpb25zLm1hcmdpblgpKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJkeVwiLCBcIjEuMmVtXCIpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnRleHRDb250ZW50ID0gbGluZS50ZXh0O1xuICAgICAgICAgICAgICAgIHRzcGFuLmNsYXNzTGlzdC5hZGQobGluZS5jbGFzcyk7XG4gICAgICAgICAgICAgICAgdGV4dC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBpZiAoIShub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGxhY2VIb2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRIb3ZlckFuZENsaWNrRXZlbnRzKGcsIHJlY3RIb3Zlciwgbm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdHcm91cC5hcHBlbmRDaGlsZChnKTtcbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkICYmICEobm9kZSA9PT0gbnVsbCB8fCBub2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBub2RlLnBsYWNlSG9sZGVyKSAmJiB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHN2Z0dyb3VwLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyRWxpcHNpc01lbnUocG9zWCwgeSwgbm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub2RlUG9zaXRpb25zW25vZGUua2luZCArICc6OicgKyBub2RlLm5hbWVdID0ge1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgeDogcG9zWCxcbiAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIHNvdXJjZVk6IHkgKyB0aGlzLm9wdGlvbnMubWFyZ2luWSxcbiAgICAgICAgICAgICAgICB0YXJnZXRZOiB5LFxuICAgICAgICAgICAgICAgIGhlaWdodDogcmVjdEhlaWdodCxcbiAgICAgICAgICAgICAgICB0ZXh0TGluZXNIZWlnaHQ6IG5vZGUudGV4dExpbmVzSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4OiAwLFxuICAgICAgICAgICAgICAgIHRhcmdldEluZGV4OiAwLFxuICAgICAgICAgICAgICAgIGFjY3VtdWxhdGVkU291cmNlWTogMCxcbiAgICAgICAgICAgICAgICBhY2N1bXVsYXRlZFRhcmdldFk6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBvdmVyYWxsWSArPSByZWN0SGVpZ2h0ICsgdGhpcy5vcHRpb25zLm5vZGVNYXJnaW5ZO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVkSGVpZ2h0ID0gTWF0aC5tYXgodGhpcy5jYWxjdWxhdGVkSGVpZ2h0LCBvdmVyYWxsWSArIHRoaXMub3B0aW9ucy5ub2RlTWFyZ2luWSAqIDIpO1xuICAgICAgICByZXR1cm4gc3ZnR3JvdXA7XG4gICAgfVxuICAgIGNyZWF0ZUNpcmNsZShjeCwgY3ksIHIsIGZpbGwpIHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdjaXJjbGUnKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3gnLCBjeC50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3knLCBjeS50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgncicsIHIudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBmaWxsKTtcbiAgICAgICAgcmV0dXJuIGNpcmNsZTtcbiAgICB9XG4gICAgY3JlYXRlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBmaWxsLCBvcGFjaXR5ID0gXCIxXCIpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgJ3JlY3QnKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCB4LnRvU3RyaW5nKCkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgneScsIHkudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0LnRvU3RyaW5nKCkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZSgncngnLCBcIjVcIik7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKCdyeScsIFwiNVwiKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBmaWxsKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsIG9wYWNpdHkpO1xuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICB9XG4gICAgYXBwZW5kQ2FyZGluYWxpdHlUZXh0KGcsIGNhcmRpbmFsaXR5LCBwb3NYLCB5LCByZWN0SGVpZ2h0LCBjb2xvciwgaXNTZWxlY3RlZCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAoKF9hID0gY2FyZGluYWxpdHkuc291cmNlQ291bnQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDAgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VUZXh0ID0gdGhpcy5jcmVhdGVTdmdUZXh0KCctICcgKyBjYXJkaW5hbGl0eS5zb3VyY2VDb3VudCArIChjYXJkaW5hbGl0eS5yZWZzID4gMCA/ICcrJyArIGNhcmRpbmFsaXR5LnJlZnMgOiAnJyksIFt0aGlzLmNsYXNzTmFtZS5DQVJESU5BTElUWSwgaXNTZWxlY3RlZCA/IHRoaXMuY2xhc3NOYW1lLlNFTEVDVEVEIDogJyddKTtcbiAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcocG9zWCArIHRoaXMub3B0aW9ucy5tYXJnaW5YIC0gNikpO1xuICAgICAgICAgICAgc291cmNlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5ICsgcmVjdEhlaWdodCAtIDIpKTtcbiAgICAgICAgICAgIHNvdXJjZVRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBjb2xvcik7XG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKHNvdXJjZVRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoX2IgPSBjYXJkaW5hbGl0eS50YXJnZXRDb3VudCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoY2FyZGluYWxpdHkudGFyZ2V0Q291bnQgKyAnIC0nLCBbdGhpcy5jbGFzc05hbWUuQ0FSRElOQUxJVFksIGlzU2VsZWN0ZWQgPyB0aGlzLmNsYXNzTmFtZS5TRUxFQ1RFRCA6ICcnXSk7XG4gICAgICAgICAgICB0YXJnZXRUZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHBvc1ggKyB0aGlzLm9wdGlvbnMubWFyZ2luWCAtIDE0KSk7XG4gICAgICAgICAgICB0YXJnZXRUZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyByZWN0SGVpZ2h0IC0gMikpO1xuICAgICAgICAgICAgdGFyZ2V0VGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgICAgICAgICAgIHRhcmdldFRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKHRhcmdldFRleHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNyZWF0ZVRleHRMaW5lcyhub2RlLCBtYXhUZXh0V2lkdGgpIHtcbiAgICAgICAgY29uc3QgdHJ1bmNhdGVkVGl0bGUgPSB0aGlzLnRydW5jYXRlVGV4dCA/IHRoaXMudHJ1bmNhdGVUZXh0KG5vZGUudGl0bGUgPyBub2RlLnRpdGxlIDogbm9kZS5uYW1lLCBtYXhUZXh0V2lkdGgpIDogKG5vZGUudGl0bGUgPyBub2RlLnRpdGxlIDogbm9kZS5uYW1lKTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBbeyB0ZXh0OiB0cnVuY2F0ZWRUaXRsZSwgY2xhc3M6IFwiaGVhZGxpbmVcIiB9XTtcbiAgICAgICAgaWYgKG5vZGUuc3VidGl0bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRydW5jYXRlZFN1YnRpdGxlID0gdGhpcy50cnVuY2F0ZVRleHQgPyB0aGlzLnRydW5jYXRlVGV4dChub2RlLnN1YnRpdGxlLCBtYXhUZXh0V2lkdGgpIDogbm9kZS5zdWJ0aXRsZTtcbiAgICAgICAgICAgIGxpbmVzLnNwbGljZSgxLCAwLCB7IHRleHQ6IHRydW5jYXRlZFN1YnRpdGxlLCBjbGFzczogXCJzdWJ0aXRsZVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnRhZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHRydW5jYXRlVGFncyA9IHRoaXMudHJ1bmNhdGVUZXh0ID8gdGhpcy50cnVuY2F0ZVRleHQobm9kZS50YWdzLmpvaW4oJywgJyksIG1heFRleHRXaWR0aCkgOiBub2RlLnRhZ3Muam9pbignLCAnKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goeyB0ZXh0OiB0cnVuY2F0ZVRhZ3MsIGNsYXNzOiBcImRlc2NyaXB0aW9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVuZGVyS2luZEFzQ29sdW1zKSB7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKHsgdGV4dDogbm9kZS5raW5kLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbm9kZS5raW5kLnNsaWNlKDEpLCBjbGFzczogXCJkZXNjcmlwdGlvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9XG4gICAgYWRkSG92ZXJBbmRDbGlja0V2ZW50cyhncm91cCwgcmVjdEhvdmVyLCBub2RlKSB7XG4gICAgICAgIGdyb3VwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZWxlY3ROb2RlKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgIGlmICgoX2IgPSBub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUuY2FyZGluYWxpdHkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5mZXRjaE1vcmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5kaXNwYXRjaEV2ZW50KCdmZXRjaERhdGEnLCB7IG5vZGUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5kaXNwYXRjaEV2ZW50KCdzZWxlY3Rpb25DaGFuZ2VkJywgeyBub2RlLCBwb3NpdGlvbjogeyB5OiB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSB9IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3JvdXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgcmVjdEhvdmVyLnNldEF0dHJpYnV0ZShcIm9wYWNpdHlcIiwgdGhpcy5vcHRpb25zLnNlbGVjdGVkTm9kZS5ob3Zlck9wYWNpdHkudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBncm91cC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZWN0SG92ZXIuc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjBcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVTdmdUZXh0KHRleHRDb250ZW50LCBjbGFzc05hbWVzKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidGV4dFwiKTtcbiAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiBjbGFzc05hbWUpKTtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmVuZGVyUmVsYXRpb25zKHJlbGF0aW9ucywgc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwga2luZCwgY29sb3IgfSA9IHNlbGVjdGVkTm9kZSB8fCB7fTtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbG9yID0gY29sb3IgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgIGNvbnN0IGxvY2FsTm9kZVBvc2l0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlUG9zaXRpb25zKSk7XG4gICAgICAgIGNvbnN0IGdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIGNvbnN0IGdQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuU1ZHX05TLCBcImdcIik7XG4gICAgICAgIHJlbGF0aW9ucyA9PT0gbnVsbCB8fCByZWxhdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlbGF0aW9ucy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwiZ1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVBvc2l0aW9uID0gbG9jYWxOb2RlUG9zaXRpb25zW2xpbmsuc291cmNlLmtpbmQgKyAnOjonICsgbGluay5zb3VyY2UubmFtZV07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGxvY2FsTm9kZVBvc2l0aW9uc1tsaW5rLnRhcmdldC5raW5kICsgJzo6JyArIGxpbmsudGFyZ2V0Lm5hbWVdO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRQb3NpdGlvbiB8fCAhc291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsaW5rQ29sb3IgPSBzb3VyY2VQb3NpdGlvbi5ub2RlLmNvbG9yIHx8IGRlZmF1bHRDb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IHNhbWVLaW5kID0gbGluay5zb3VyY2Uua2luZCA9PT0gbGluay50YXJnZXQua2luZDtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU291cmNlID0gc2FtZUtpbmQgPyAwIDogdGhpcy5jYWxjdWxhdGVHYXAoc291cmNlUG9zaXRpb24uc291cmNlSW5kZXgrKyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdFRleHRMaW5lc0hlaWd0aCA9IChfYSA9IHNvdXJjZVBvc2l0aW9uLnRleHRMaW5lc0hlaWdodCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICAgICAgICAgIGlmIChmaXJzdFRleHRMaW5lc0hlaWd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VQb3NpdGlvbi50ZXh0TGluZXNIZWlnaHQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc291cmNlUG9zaXRpb24uYWNjdW11bGF0ZWRTb3VyY2VZID0gZmlyc3RUZXh0TGluZXNIZWlndGggKyBzb3VyY2VQb3NpdGlvbi5hY2N1bXVsYXRlZFNvdXJjZVkgKyBzZWxlY3RlZFNvdXJjZTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVGFyZ2V0ID0gc2FtZUtpbmQgPyAwIDogdGhpcy5jYWxjdWxhdGVHYXAodGFyZ2V0UG9zaXRpb24udGFyZ2V0SW5kZXgrKyk7XG4gICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFkgPSAoKF9iID0gdGFyZ2V0UG9zaXRpb24uYWNjdW11bGF0ZWRUYXJnZXRZKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKSArIHNlbGVjdGVkVGFyZ2V0O1xuICAgICAgICAgICAgY29uc3QgeyBzb3VyY2UsIHRhcmdldCwgaGVpZ2h0IH0gPSBsaW5rO1xuICAgICAgICAgICAgY29uc3QgY29udHJvbFBvaW50MVggPSBzb3VyY2VQb3NpdGlvbi54ICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQb2ludDFZID0gc291cmNlUG9zaXRpb24uc291cmNlWSArICgoaGVpZ2h0IHx8IDApIC8gMikgKyBzb3VyY2VQb3NpdGlvbi5hY2N1bXVsYXRlZFNvdXJjZVk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQyWSA9IHRoaXMub3B0aW9ucy5tYXJnaW5ZICsgdGFyZ2V0UG9zaXRpb24udGFyZ2V0WSArICgoaGVpZ2h0IHx8IDApIC8gMikgKyB0YXJnZXRQb3NpdGlvbi5hY2N1bXVsYXRlZFRhcmdldFk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sUG9pbnQyWCA9IChzb3VyY2VQb3NpdGlvbi54ICsgdGhpcy5vcHRpb25zLm5vZGVXaWR0aCArIHRhcmdldFBvc2l0aW9uLngpIC8gMjtcbiAgICAgICAgICAgIGxldCBwYXRoRDtcbiAgICAgICAgICAgIGxldCBvcGFjaXR5ID0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLm9wYWNpdHk7XG4gICAgICAgICAgICBsZXQgc3Ryb2tlV2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgICB2YXIgb3BhY2l0eUVtcGhhc2l6ZVNlbGVjdGVkID0gMDtcbiAgICAgICAgICAgIGlmICgobGluay5zb3VyY2Uua2luZCA9PT0ga2luZCAmJiBsaW5rLnNvdXJjZS5uYW1lID09PSBuYW1lKSB8fCAobGluay50YXJnZXQua2luZCA9PT0ga2luZCAmJiBsaW5rLnRhcmdldC5uYW1lID09PSBuYW1lKSkge1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgKz0gdGhpcy5vcHRpb25zLnJlbGF0aW9uLnNlbGVjdGVkT3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlUG9zaXRpb24uaW5kZXggPCB0YXJnZXRQb3NpdGlvbi5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDFYID0gc291cmNlUG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSBzb3VyY2VQb3NpdGlvbi55ICsgc291cmNlUG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDJYID0gdGFyZ2V0UG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSB0YXJnZXRQb3NpdGlvbi55ICsgKHRhcmdldFBvc2l0aW9uLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtwb2ludDFYfSwke3BvaW50MVl9IEMke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDFYfSwke3BvaW50Mll9ICR7cG9pbnQyWH0sJHtwb2ludDJZfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDJYID0gc291cmNlUG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MlkgPSBzb3VyY2VQb3NpdGlvbi55ICsgKHNvdXJjZVBvc2l0aW9uLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludDFYID0gdGFyZ2V0UG9zaXRpb24ueCArICh0aGlzLm9wdGlvbnMubm9kZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50MVkgPSB0YXJnZXRQb3NpdGlvbi55ICsgdGFyZ2V0UG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBwYXRoRCA9IGBNJHtwb2ludDFYfSwke3BvaW50MVl9IEMke3BvaW50MVh9LCR7cG9pbnQyWX0gJHtwb2ludDFYfSwke3BvaW50Mll9ICR7cG9pbnQyWH0sJHtwb2ludDJZfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGggPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0aEQgPSBgTSR7Y29udHJvbFBvaW50MVh9LCR7Y29udHJvbFBvaW50MVl9IEMke2NvbnRyb2xQb2ludDJYfSwke2NvbnRyb2xQb2ludDFZfSAke2NvbnRyb2xQb2ludDJYfSwke2NvbnRyb2xQb2ludDJZfSAke3RhcmdldFBvc2l0aW9uLnh9LCR7Y29udHJvbFBvaW50Mll9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgcGF0aEQpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIFN0cmluZyhzdHJva2VXaWR0aCB8fCAwKSk7XG4gICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgbGlua0NvbG9yKTtcbiAgICAgICAgICAgIGdQYXRoLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgbGV0IGFuYWx5dGljcztcbiAgICAgICAgICAgIGlmIChhbmFseXRpY3MpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuYWx5dGljcyA9IGxpbmsuYW5hbHl0aWNzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWRLaW5kID0gbGluay50YXJnZXQua2luZCA9PT0gKHNlbGVjdGVkTm9kZSA9PT0gbnVsbCB8fCBzZWxlY3RlZE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkTm9kZS5raW5kKSB8fCBsaW5rLnNvdXJjZS5raW5kID09PSAoc2VsZWN0ZWROb2RlID09PSBudWxsIHx8IHNlbGVjdGVkTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0ZWROb2RlLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChfYyA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy50cmFmZmljKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAwID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmNyZWF0ZVN2Z1RleHQoJycsIFt0aGlzLmNsYXNzTmFtZS5SRUxBVElPTl0pO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcodGFyZ2V0UG9zaXRpb24ueCAtIHRoaXMub3B0aW9ucy5tYXJnaW5ZKSk7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh0YXJnZXRQb3NpdGlvbi50YXJnZXRZICsgKGhlaWdodCB8fCAwIC8gMikgKyBzZWxlY3RlZFRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FbnYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgdHNwYW5FbnYudGV4dENvbnRlbnQgPSAoYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVudmlyb25tZW50KSB8fCAnJztcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuRW52KTtcbiAgICAgICAgICAgICAgICBpZiAoKGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudCkgJiYgdGhpcy5vcHRpb25zLnJlbGF0aW9uLmVudmlyb25tZW50W2FuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lbnZpcm9ubWVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNoYXJyYXknLCB0aGlzLm9wdGlvbnMucmVsYXRpb24uZW52aXJvbm1lbnRbYW5hbHl0aWNzLmVudmlyb25tZW50XS5kYXNoQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKF9kID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLmVycm9ycykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogMCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JSYXRpbyA9ICgxMDAgLyAoKF9lID0gYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLnRyYWZmaWMpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IDApICogKChfZiA9IGFuYWx5dGljcyA9PT0gbnVsbCB8fCBhbmFseXRpY3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFuYWx5dGljcy5lcnJvcnMpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IDApKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNwYW5FcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5TVkdfTlMsIFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRzcGFuRXJyLnRleHRDb250ZW50ID0gJyAnICsgKGVycm9yUmF0aW8gPT0gMCA/IFwiKDwwLjAxJSlcIiA6ICcoJyArIGVycm9yUmF0aW8udG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyUpJyk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQodHNwYW5FcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi50ZXh0Q29udGVudCA9ICcgJyArIChhbmFseXRpY3MgPT09IG51bGwgfHwgYW5hbHl0aWNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmFseXRpY3MudHJhZmZpYy50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgICAgICBnVGV4dC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gb3BhY2l0eSArIHRoaXMub3B0aW9ucy5yZWxhdGlvbi5hbmFseXRpY3NPcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc291cmNlLmtpbmQgIT0gdGFyZ2V0LmtpbmQpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZVBvc2l0aW9uLnNvdXJjZVkgKz0gaGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCAhPT0gdm9pZCAwID8gaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uLnRhcmdldFkgKz0gaGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCAhPT0gdm9pZCAwID8gaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnUGF0aCk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChnVGV4dCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IChfYSA9IHRoaXMuY2hhcnREYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0U2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIHRoaXMucmVzZXRTdmcoKTtcbiAgICAgICAgdGhpcy51cGRhdGVSZWxhdGlvbldlaWdodHMoKF9jID0gKF9iID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXROb2RlcygpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBbXSwgKF9lID0gKF9kID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5nZXRSZWxhdGlvbnMoKSkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogW10sIHNlbGVjdGVkTm9kZSk7XG4gICAgICAgIGxldCBjb2x1bW4gPSAwO1xuICAgICAgICBjb25zdCBjb2x1bW5XaWR0aCA9IHRoaXMub3B0aW9ucy5ub2RlQ29sdW1uV2l0aCArIHRoaXMub3B0aW9ucy5ub2RlV2lkdGg7XG4gICAgICAgIGNvbnN0IGtpbmRzID0gKF9mID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5nZXRLaW5kcygpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZVBvc2l0aW9uWSA9IC0xO1xuICAgICAgICBjb25zdCBzdmdOb2RlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLlNWR19OUywgXCJnXCIpO1xuICAgICAgICBpZiAoa2luZHMgJiYga2luZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAga2luZHMuZm9yRWFjaChraW5kID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHN2Z05vZGVzLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyTm9kZXMoKF9iID0gKF9hID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXROb2Rlc0J5S2luZChraW5kLm5hbWUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSwgdGhpcy5vcHRpb25zLmxlZnRYICsgY29sdW1uV2lkdGggKiBjb2x1bW4rKywgc2VsZWN0ZWROb2RlLCBraW5kKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN2Z05vZGVzLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyTm9kZXMoKF9oID0gKF9nID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5nZXROb2RlcygpKSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiBbXSwgdGhpcy5vcHRpb25zLmxlZnRYICsgMCkpO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgdGhpcy5yZW5kZXJSZWxhdGlvbnMoKF9qID0gdGhpcy5jaGFydERhdGEpID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai5nZXRSZWxhdGlvbnMoKSwgc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50LmFwcGVuZENoaWxkKHN2Z05vZGVzKTtcbiAgICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKTtcbiAgICB9XG4gICAgdXBkYXRlUmVsYXRpb25XZWlnaHRzKG5vZGVzLCByZWxhdGlvbnMsIHNlbGVjdGVkTm9kZSkge1xuICAgICAgICBpZiAoIXJlbGF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uV2VpZ2h0cyA9IHJlbGF0aW9ucy5yZWR1Y2UoKGFjYywgcmVsYXRpb24pID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBjb25zdCB7IHNvdXJjZSwgdGFyZ2V0LCBhbmFseXRpY3MgfSA9IHJlbGF0aW9uO1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5raW5kID09PSB0YXJnZXQua2luZCkge1xuICAgICAgICAgICAgICAgIHJlbGF0aW9uLmhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUtleSA9IGBzJHtzb3VyY2Uua2luZH06JHtzb3VyY2UubmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0S2V5ID0gYHQke3RhcmdldC5raW5kfToke3RhcmdldC5uYW1lfWA7XG4gICAgICAgICAgICBjb25zdCB3ZWlnaHQgPSAoYW5hbHl0aWNzID09PSBudWxsIHx8IGFuYWx5dGljcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYW5hbHl0aWNzLnRyYWZmaWMpICYmIGFuYWx5dGljcy50cmFmZmljID4gMFxuICAgICAgICAgICAgICAgID8gTWF0aC5yb3VuZChNYXRoLmxvZzEwKE1hdGgubWF4KGFuYWx5dGljcy50cmFmZmljLCAyKSkgKiAoKF9hID0gdGhpcy5vcHRpb25zLnRyYWZmaWNMb2cxMEZhY3RvcikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMTIpKVxuICAgICAgICAgICAgICAgIDogKChfYiA9IHRoaXMub3B0aW9ucy5yZWxhdGlvbkRlZmF1bHRXaWR0aCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMTApO1xuICAgICAgICAgICAgcmVsYXRpb24uaGVpZ2h0ID0gd2VpZ2h0O1xuICAgICAgICAgICAgaWYgKCFhY2Nbc291cmNlS2V5XSkge1xuICAgICAgICAgICAgICAgIGFjY1tzb3VyY2VLZXldID0geyBoZWlnaHQ6IDAsIGNvdW50OiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWFjY1t0YXJnZXRLZXldKSB7XG4gICAgICAgICAgICAgICAgYWNjW3RhcmdldEtleV0gPSB7IGhlaWdodDogMCwgY291bnQ6IDAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjY1tzb3VyY2VLZXldLmhlaWdodCArPSB3ZWlnaHQgKyB0aGlzLmNhbGN1bGF0ZUdhcChhY2Nbc291cmNlS2V5XS5jb3VudCk7XG4gICAgICAgICAgICBhY2Nbc291cmNlS2V5XS5jb3VudCArPSAxO1xuICAgICAgICAgICAgYWNjW3RhcmdldEtleV0uaGVpZ2h0ICs9IHdlaWdodCArIHRoaXMuY2FsY3VsYXRlR2FwKGFjY1t0YXJnZXRLZXldLmNvdW50KTtcbiAgICAgICAgICAgIGFjY1t0YXJnZXRLZXldLmNvdW50ICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICBub2RlLnNvdXJjZVJlbGF0aW9ucyA9IHJlbGF0aW9uV2VpZ2h0c1tgcyR7bm9kZS5raW5kfToke25vZGUubmFtZX1gXTtcbiAgICAgICAgICAgIG5vZGUudGFyZ2V0UmVsYXRpb25zID0gcmVsYXRpb25XZWlnaHRzW2B0JHtub2RlLmtpbmR9OiR7bm9kZS5uYW1lfWBdO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2FsY3VsYXRlR2FwKGl0ZXJhdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKDgwLCBpdGVyYXRpb25zICogMyk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2Fua2V5Q2hhcnQ7XG5leHBvcnQgeyBTYW5rZXlDaGFydCB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBTYW5rZXlDaGFydERhdGEgfSBmcm9tICcuL3NhbmtleS1jaGFydC1kYXRhJztcbmltcG9ydCBTYW5rZXlDaGFydCBmcm9tICcuL3NhbmtleS1jaGFydCc7XG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgfSBmcm9tICcuL2V2ZW50LWhhbmRsZXInO1xuaW1wb3J0IHsgTWluaW1hcCB9IGZyb20gJy4vbWluaW1hcCc7XG5leHBvcnQgeyBTYW5rZXlDaGFydERhdGEsIEluY2x1ZGVLaW5kIH0gZnJvbSAnLi9zYW5rZXktY2hhcnQtZGF0YSc7XG5leHBvcnQgeyBFdmVudEhhbmRsZXIgfTtcbmV4cG9ydCB7IFNhbmtleUNoYXJ0IH07XG5leHBvcnQgeyBNaW5pbWFwIH07XG53aW5kb3cuU2Fua2V5Q2hhcnQgPSBTYW5rZXlDaGFydDtcbndpbmRvdy5TYW5rZXlDaGFydERhdGEgPSBTYW5rZXlDaGFydERhdGE7XG53aW5kb3cuRXZlbnRIYW5kbGVyID0gRXZlbnRIYW5kbGVyO1xud2luZG93Lk1pbmlNYXAgPSBNaW5pbWFwO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9