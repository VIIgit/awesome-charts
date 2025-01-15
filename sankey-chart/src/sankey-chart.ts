import { EventHandler } from './event-handler';
import { SankeyChartData as ChartData, Kind, Relation, Node, Analytics, Cardinality } from './sankey-chart-data';

interface Relations {
  height: number;
  count: number;
}
interface ChartNode extends Node {
  textLinesHeight?: number;
  sourceRelations?: Relations;
  targetRelations?: Relations;
}

interface ChartRelation extends Relation {
  height?: number;
}
interface NodePosition {
  node: ChartNode;
  x: number;
  y: number;
  height: number;
  index: number;
  sourceY: number;
  targetY: number;
  textLinesHeight?: number;
  sourceIndex: number;
  targetIndex: number;
  accumulatedSourceY: number;
  accumulatedTargetY: number;
}

interface CustomOptions {
  nodeWidth?: number;
  nodeLineHeight?: number;
  marginX?: number;
  marginY?: number;
  leftX?: number;
  topY?: number;
  nodeMarginY?: number;
  nameMaxLength?: number;
  nodeColumnWith?: number;
  defaultNodeColor?: string;
  trafficLog10Factor?: number;
  relationDefaultWidth?: number;
  renderKindAsColums?: boolean;
  relation?: {
    selectedOpacity?: number;
    analyticsOpacity?: number;
    opacity?: number;
    environment?: {
      nonPROD?: {
        dashArray?: string;
      };
    };
    sameKindIndentation: number;
  },
  truncateText?: {
    defaultFontSizeAndFamily: string;
    ellipseCharacter: string;
  },
  rootCharacter?: string;
}

class SankeyChart {

  private options:
    {
      nodeWidth: number;
      nodeLineHeight: number;
      marginX: number;
      marginY: number;
      leftX: number;
      topY: number;
      nodeMarginY: number;
      nodeColumnWith: number;
      defaultNodeColor: string;
      renderKindAsColums: boolean;
      trafficLog10Factor: number,
      relationDefaultWidth: number,
      relation: {
        selectedOpacity: number;
        analyticsOpacity: number;
        opacity: number;
        environment: {
          [key: string]: {
            dashArray: string;
          };
        };
        sameKindIndentation: number;
      };
      selectedNode: {
        dropShadow: boolean;
        borderColor: string;
        hoverOpacity: number;
      };
      truncateText: {
        defaultFontSizeAndFamily: string;
        ellipseCharacter: string;
      },
      rootCharacter: string;
    };
  private calculatedHeight: number;
  private svgElement: SVGSVGElement;
  private nodePositions: Record<string, NodePosition>;
  private eventHandler: EventHandler;
  private contextMenuCallbackFunction?: (event: MouseEvent, node: ChartNode) => void;
  private className: {
    NODE_TYPE_TITLE: string;
    NODE_TITLE: string;
    RELATION: string;
    CARDINALITY: string;
    SELECTED: string;
  };
  private chartData?: ChartData;
  private selectedNodePositionY: number;
  private truncateText?: Function;
  private SVG_NS = "http://www.w3.org/2000/svg";

  constructor(svgElement: any, customOptions?: CustomOptions) {
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

  private setOptions(customOptions: CustomOptions): void {
    this.options = this.deepMerge(this.options, customOptions);
  }

  public setData(chartData: ChartData): void {
    if (this.chartData !== chartData) {
      this.chartData = chartData;
      this.render();
      this.eventHandler.dispatchEvent('selectionChanged', { node: this.chartData.getSelectedNode(), position: { y: 0 } });
    }
  }

  public getData(): ChartData | undefined {
    return this.chartData;
  }

  public addSelectionChangedListeners(callbackFunction: (data: { node?: Node, position: { y: number } }) => void): void {
    if (typeof callbackFunction === 'function') {
      this.eventHandler.subscribe('selectionChanged', callbackFunction);
      callbackFunction({ node: this.chartData?.getSelectedNode(), position: { y: 0 } });
    }
  }

  public addContextMenuListeners(callbackFunction: (event: MouseEvent, node: ChartNode) => void): void {
    if (typeof callbackFunction === 'function') {
      this.contextMenuCallbackFunction = callbackFunction;
    }
  }

  public addFetchDataListeners(callbackFunction: (data: any) => void): void {
    if (typeof callbackFunction === 'function') {
      this.eventHandler.subscribe('fetchData', callbackFunction);
    }
  }

  private createTruncateText() {
    // Create a shared canvas and context
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const cache = new Map();
    const ellipseChar = this.options.truncateText.ellipseCharacter;
    const fontSizeAndFamily = this.options.truncateText.defaultFontSizeAndFamily;

    return function truncateText(text: string, maxWidth: number, font = fontSizeAndFamily): string {
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

  private resetSvg(): void {
    this.calculatedHeight = 0;
    this.svgElement.innerHTML = `
      <defs>
        <filter id="dropshadow">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
    `;
  }

  private updateHeight(): void {
    const width = ((this.options.nodeColumnWith ?? 0) + (this.options.nodeWidth ?? 0)) * Math.max(1, this.chartData?.getKinds().length || 0) + (this.options.marginX * 2);
    this.svgElement.setAttribute('height', this.calculatedHeight.toString());
    this.svgElement.setAttribute('width', width.toString());
  }

  private renderElipsisMenu(x: number, y: number, selectedNode: ChartNode): SVGGElement {
    const menuGroup = document.createElementNS(this.SVG_NS, "g") as SVGGElement;
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

    menuGroup.addEventListener('click', (event: MouseEvent): void => {
      if (this.contextMenuCallbackFunction) {
        this.contextMenuCallbackFunction(event, selectedNode);
        event.stopPropagation();
      }
    });

    return menuGroup;
  }

  private deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
      return source;
    }

    for (const key of Object.keys(source)) {
      if (Array.isArray(source[key])) {
        target[key] = source[key].slice();
      } else if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key]) {
          target[key] = {};
        }
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  private renderNodes(nodes: ChartNode[], positionX: number, selectedNode?: Node, kind?: Kind) {
    const svgGroup = document.createElementNS(this.SVG_NS, "g");
    let overallY = this.options.topY;

    if (this.options.renderKindAsColums) {
      const title = kind?.title || this.chartData?.getTitle()?.name;
      const color = kind?.color || this.chartData?.getTitle()?.color || this.options.defaultNodeColor;
      const x = positionX + (this.options.nodeWidth / 2);
      const y = this.options.topY + this.options.marginY + (this.options.nodeWidth / 2);
      let x2 = positionX + this.options.nodeWidth + this.options.nodeMarginY / 2;
      const y2 = this.options.topY + this.options.marginY + (this.options.nodeWidth);

      let prefix = '';
      if (kind?.color) {
        const circle = this.createCircle(x, y, 5, color);
        svgGroup.appendChild(circle);
      } else {
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
      const sourceRelations = node.sourceRelations || { height: 0, count: 0 };
      const targetRelations = node.targetRelations || { height: 0, count: 0 };
      const linesCount = 1 + (node.subtitle ? 1 : 0) + (node.tags?.length ? 1 : 0) + (this.options.renderKindAsColums ? 0 : 1);
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

      const g = document.createElementNS(this.SVG_NS, 'g') as SVGGElement;
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
        } else if (this.options.selectedNode.borderColor) {
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

      if (!node?.placeHolder) {
        this.addHoverAndClickEvents(g, rectHover, node);
      }

      svgGroup.appendChild(g);

      if (isSelected && !node?.placeHolder && this.contextMenuCallbackFunction) {
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
      } as NodePosition;

      overallY += rectHeight + this.options.nodeMarginY;
    });

    this.calculatedHeight = Math.max(this.calculatedHeight, overallY + this.options.nodeMarginY * 2);
    return svgGroup;
  }

  private createCircle(cx: number, cy: number, r: number, fill: string): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', r.toString());
    circle.setAttribute('fill', fill);
    return circle;
  }

  private createRect(x: number, y: number, width: number, height: number, fill: string, opacity: string = "1"): SVGRectElement {
    const rect = document.createElementNS(this.SVG_NS, 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    rect.setAttribute('rx', "5");
    rect.setAttribute('ry', "5");
    rect.setAttribute('fill', fill);
    rect.setAttribute("opacity", opacity);
    return rect as SVGRectElement;
  }

  private appendCardinalityText(g: SVGGElement, cardinality: Cardinality, posX: number, y: number, rectHeight: number, color: string, isSelected: boolean) {
    if (cardinality.sourceCount ?? 0 > 0) {
      const sourceText = this.createSvgText('- ' + cardinality.sourceCount + (cardinality.refs > 0 ? '+' + cardinality.refs : ''), [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
      sourceText.setAttribute("x", String(posX + this.options.marginX - 6));
      sourceText.setAttribute("y", String(y + rectHeight - 2));
      sourceText.setAttribute("fill", color);
      g.appendChild(sourceText);
    }
    if (cardinality.targetCount ?? 0 > 0) {
      const targetText = this.createSvgText(cardinality.targetCount + ' -', [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
      targetText.setAttribute("x", String(posX + this.options.marginX - 14));
      targetText.setAttribute("y", String(y + rectHeight - 2));
      targetText.setAttribute("fill", color);
      targetText.setAttribute("text-anchor", "end");
      g.appendChild(targetText);
    }
  }

  private createTextLines(node: ChartNode, maxTextWidth: number) {
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

  private addHoverAndClickEvents(group: SVGGElement, rectHover: SVGRectElement, node: ChartNode) {
    group.addEventListener('click', (event) => {
      this.chartData?.selectNode(node);
      this.render();
      if (node?.cardinality?.fetchMore) {
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

  private createSvgText(textContent: string, classNames: string[]) {
    const text = document.createElementNS(this.SVG_NS, "text");
    text.classList.add(...classNames.filter(className => className));
    text.textContent = textContent;
    return text;
  }

  private renderRelations(relations: ChartRelation[] | undefined, selectedNode: ChartNode | undefined) {

    const { name, kind, color } = selectedNode || {};
    const defaultColor = color || this.options.defaultNodeColor;
    const localNodePositions = JSON.parse(JSON.stringify(this.nodePositions));

    const gText = document.createElementNS(this.SVG_NS, "g");
    const gPath = document.createElementNS(this.SVG_NS, "g");

    relations?.forEach((link) => {
      const g = document.createElementNS(this.SVG_NS, "g");

      const sourcePosition = localNodePositions[link.source.kind + '::' + link.source.name] as NodePosition;
      const targetPosition = localNodePositions[link.target.kind + '::' + link.target.name] as NodePosition;
      if (!targetPosition || !sourcePosition) {
        return; // node is not rendered
      }

      const linkColor = sourcePosition.node.color || defaultColor;
      const sameKind = link.source.kind === link.target.kind;
      const selectedSource = sameKind ? 0 : this.calculateGap(sourcePosition.sourceIndex++);
      const firstTextLinesHeigth = sourcePosition.textLinesHeight ?? 0;
      if (firstTextLinesHeigth > 0) {
        sourcePosition.textLinesHeight = 0;
      }
      sourcePosition.accumulatedSourceY = firstTextLinesHeigth + sourcePosition.accumulatedSourceY + selectedSource;

      const selectedTarget = sameKind ? 0 : this.calculateGap(targetPosition.targetIndex++);
      targetPosition.accumulatedTargetY = (targetPosition.accumulatedTargetY ?? 0) + selectedTarget;

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

        } else {
          const point2X = sourcePosition.x + (this.options.nodeWidth / 2);
          const point2Y = sourcePosition.y + (sourcePosition.height / 2);
          const point1X = targetPosition.x + (this.options.nodeWidth / 2);
          const point1Y = targetPosition.y + targetPosition.height;

          pathD = `M${point1X},${point1Y} C${point1X},${point2Y} ${point1X},${point2Y} ${point2X},${point2Y}`;
        }

        opacity = 0.8;
        strokeWidth = 2;
      } else {
        pathD = `M${controlPoint1X},${controlPoint1Y} C${controlPoint2X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetPosition.x},${controlPoint2Y}`;
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', String(strokeWidth || 0));
      path.setAttribute('stroke', linkColor);
      gPath.appendChild(path);

      let analytics: Analytics | undefined;
      if (analytics) {
        /*opacity = opacity + this.options.relation.analyticsOpacity;
        */
      } else {
        analytics = link.analytics;
        const isSelectedKind = link.target.kind === selectedNode?.kind || link.source.kind === selectedNode?.kind;
        /* opacity = opacity + this.options.relation.analyticsOpacity;
 */
      }

      if (analytics?.traffic ?? 0 > 0) {
        const text = this.createSvgText('', [this.className.RELATION]);
        text.setAttribute("x", String(targetPosition.x - this.options.marginY));
        text.setAttribute("y", String(targetPosition.targetY + (height || 0 / 2) + selectedTarget));
        text.setAttribute("text-anchor", "end");
        const tspanEnv = document.createElementNS(this.SVG_NS, "tspan");
        tspanEnv.textContent = analytics?.environment || '';
        text.appendChild(tspanEnv);

        if (analytics?.environment && this.options.relation.environment[analytics?.environment]) {
          path.setAttribute('stroke-dasharray', this.options.relation.environment[analytics.environment].dashArray);
        }

        if (analytics?.errors ?? 0 > 0) {
          const errorRatio = (100 / (analytics?.traffic ?? 0) * (analytics?.errors ?? 0));
          const tspanErr = document.createElementNS(this.SVG_NS, "tspan");
          tspanErr.setAttribute("fill", "red");
          tspanErr.textContent = ' ' + (errorRatio == 0 ? "(<0.01%)" : '(' + errorRatio.toFixed(2).toLocaleString() + '%)');
          text.appendChild(tspanErr);
        }

        const tspan = document.createElementNS(this.SVG_NS, "tspan");
        tspan.textContent = ' ' + analytics?.traffic.toLocaleString();
        text.appendChild(tspan);
        gText.appendChild(text);

        opacity = opacity + this.options.relation.analyticsOpacity;

      } else if (source.kind != target.kind) {
        // path.setAttribute('opacity', 0.1);
      }
      sourcePosition.sourceY += height ?? 0;
      targetPosition.targetY += height ?? 0;

      path.setAttribute('opacity', String(opacity));
    });

    this.svgElement.appendChild(gPath);
    this.svgElement.appendChild(gText);
  }

  private render(): void {
    const selectedNode = this.chartData?.getSelectedNode();

    this.resetSvg();

    this.updateRelationWeights(this.chartData?.getNodes() ?? [], this.chartData?.getRelations() ?? [], selectedNode);

    let column = 0;
    const columnWidth = this.options.nodeColumnWith + this.options.nodeWidth;
    const kinds = this.chartData?.getKinds();
    this.selectedNodePositionY = -1;
    const svgNodes = document.createElementNS(this.SVG_NS, "g");
    if (kinds && kinds.length > 0) {
      kinds.forEach(kind => {
        svgNodes.appendChild(this.renderNodes(this.chartData?.getNodesByKind(kind.name) ?? [], this.options.leftX + columnWidth * column++, selectedNode, kind));
      })
    } else {
      svgNodes.appendChild(this.renderNodes(this.chartData?.getNodes() ?? [], this.options.leftX + 0));
    };
    this.renderRelations(this.chartData?.getRelations(), selectedNode);
    this.svgElement.appendChild(svgNodes);
    this.updateHeight();
  }

  private updateRelationWeights(nodes: ChartNode[], relations: ChartRelation[], selectedNode?: Node) {
    if (!relations) {
      return;
    }
    const relationWeights = relations.reduce((acc: { [key: string]: { height: number, count: number } }, relation: ChartRelation) => {
      const { source, target, analytics } = relation;
      if (source.kind === target.kind) {
        relation.height = 0;
        return acc;
      }
      const sourceKey = `s${source.kind}:${source.name}`;
      const targetKey = `t${target.kind}:${target.name}`;

      const weight = analytics?.traffic && analytics.traffic > 0
        ? Math.round(Math.log10(Math.max(analytics.traffic, 2)) * (this.options.trafficLog10Factor ?? 12))
        : (this.options.relationDefaultWidth ?? 10);
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

  private calculateGap(iterations: number): number {
    return Math.min(80, iterations * 3);
  }
}
export default SankeyChart;
export { SankeyChart, CustomOptions };