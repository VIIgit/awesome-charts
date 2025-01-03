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
            var _a, _b, _c, _d, _e;
            const svgGroup = document.createElementNS(this.SVG_NS, "g");
            let overallY = this.options.topY;
            (_a = this.chartData) === null || _a === void 0 ? void 0 : _a.getKinds;
            const x = positionX + (this.options.nodeWidth / 2);
            const y = this.options.topY + this.options.marginY + (this.options.nodeWidth / 2);
            let x2 = positionX + this.options.nodeWidth + this.options.nodeMarginY / 2;
            const y2 = this.options.topY + this.options.marginY + (this.options.nodeWidth);
            if (this.options.renderKindAsColums) {
                const title = (kind === null || kind === void 0 ? void 0 : kind.title) || ((_c = (_b = this.chartData) === null || _b === void 0 ? void 0 : _b.getTitle()) === null || _c === void 0 ? void 0 : _c.name);
                const color = (kind === null || kind === void 0 ? void 0 : kind.color) || ((_e = (_d = this.chartData) === null || _d === void 0 ? void 0 : _d.getTitle()) === null || _e === void 0 ? void 0 : _e.color) || this.options.defaultNodeColor;
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
                var _a, _b;
                const sourceRelations = node.sourceRelations || { height: 0, count: 0 };
                const targetRelations = node.targetRelations || { height: 0, count: 0 };
                const linesCount = 1 + (node.subtitle != null ? 1 : 0) + (node.tags != null ? node.tags.length > 0 ? 1 : 0 : 0) + (this.options.renderKindAsColums ? 0 : 1);
                const linesHeight = linesCount * this.options.nodeLineHeight + this.options.marginY;
                node.textLinesHeigth = linesHeight;
                const isSelected = selectedNode && selectedNode.name === node.name && selectedNode.kind === node.kind;
                const rectHeight = 2 * this.options.marginY + (node.cardinality ? this.options.nodeLineHeight : 0) + Math.max(linesHeight, linesHeight + sourceRelations.height, targetRelations.height);
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
                g.appendChild(rect);
                rectHover.style.cursor = 'pointer';
                g.appendChild(rectHover);
                const cardinality = node.cardinality;
                if (cardinality) {
                    if ((_a = cardinality.sourceCount) !== null && _a !== void 0 ? _a : 0 > 0) {
                        const sourceText = this.createSvgText('- ' + cardinality.sourceCount + (cardinality.refs > 0 ? '+' + cardinality.refs : ''), [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
                        sourceText.setAttribute("x", String(posX + this.options.marginX - 6));
                        sourceText.setAttribute("y", String(y + rectHeight - 2));
                        sourceText.setAttribute("fill", color);
                        g.appendChild(sourceText);
                    }
                    if ((_b = cardinality.targetCount) !== null && _b !== void 0 ? _b : 0 > 0) {
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
                this.nodePositions[node.kind + '::' + node.name] = {
                    node,
                    x: posX,
                    y,
                    index,
                    sourceY: y + this.options.marginY,
                    targetY: y,
                    h: rectHeight,
                    textLinesHeigth: node.textLinesHeigth,
                    sourceIndex: 0,
                    targetIndex: 0,
                    accSourceY: 0,
                    accTargetY: 0
                };
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
                const firstTextLinesHeigth = (_a = sourcePosition.textLinesHeigth) !== null && _a !== void 0 ? _a : 0;
                if (firstTextLinesHeigth > 0) {
                    sourcePosition.textLinesHeigth = 0;
                }
                sourcePosition.accSourceY = firstTextLinesHeigth + sourcePosition.accSourceY + selectedSource;
                const selectedTarget = sameKind ? 0 : this.calculateGap(targetPosition.targetIndex++);
                targetPosition['accTargetY'] = ((_b = targetPosition['accTargetY']) !== null && _b !== void 0 ? _b : 0) + selectedTarget;
                const { source, target, height } = link;
                const controlPoint1X = sourcePosition.x + this.options.nodeWidth;
                const controlPoint1Y = sourcePosition.sourceY + ((height || 0) / 2) + sourcePosition.accSourceY;
                const controlPoint2Y = this.options.marginY + targetPosition.targetY + ((height || 0) / 2) + targetPosition.accTargetY;
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
                if ((_c = analytics === null || analytics === void 0 ? void 0 : analytics.traffic) !== null && _c !== void 0 ? _c : 0 > 0) {
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
        };
        this.options = {
            nodeWidth: 10,
            nodeLineHeight: 18,
            marginX: 15,
            marginY: 5,
            leftX: 15,
            topY: 10,
            nodeMarginY: 10,
            nameMaxLength: 50,
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
                scale: 1.2,
                borderColor: '#ff1010',
                hoverOpacity: 0.2,
                hoverColor: '#141414'
            },
            ellipseCharacter: '…',
            rootCharacter: '⌂'
        };
        if (customOptions) {
            this.setOptions(customOptions);
        }
        this.calculatedHeight = 0;
        this.svgElement = svgElement;
        this.nodePositions = {};
        this.eventHandler = new EventHandler();
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
        var _a, _b, _c;
        const width = (((_a = this.options.nodeColumnWith) !== null && _a !== void 0 ? _a : 0) + ((_b = this.options.nodeWidth) !== null && _b !== void 0 ? _b : 0)) * Math.max(1, ((_c = this.chartData) === null || _c === void 0 ? void 0 : _c.getKinds().length) || 0) + (this.options.marginX * 2);
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
        return iterations * 5;
    }
}
