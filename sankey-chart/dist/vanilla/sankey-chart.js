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
        this.eventHandler = new EventHandler();
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
