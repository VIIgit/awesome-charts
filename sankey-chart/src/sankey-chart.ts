import { EventHandler } from './event-handler';
import { SankeyChartData as ChartData, Kind, Relation, Node, Analytics } from './sankey-chart-data';

interface CustomOptions {
  nodeWidth?: number;
  nodeMinHeight?: number;
  marginX?: number;
  marginY?: number;
  leftX?: number;
  topY?: number;
  nodeMarginY?: number;
  nameMaxLength?: number;
  nodeColumnWith?: number;
  defaultNodeColor?: string;
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
  };
  ellipseCharacter?: string;
  rootCharacter?: string;
}

class SankeyChart {
  private options: {
    nodeWidth: number;
    nodeMinHeight: number;
    marginX: number;
    marginY: number;
    leftX: number;
    topY: number;
    nodeMarginY: number;
    nameMaxLength: number;
    nodeColumnWith: number;
    defaultNodeColor: string;
    renderKindAsColums: boolean;
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
      scale: number;
      dropShadow: boolean;
      borderColor: string;
      hoverOpacity: number;
      hoverColor: string;
    };
    ellipseCharacter: string;
    rootCharacter: string;
  };
  private calculatedHeight: number;
  private svgElement: SVGSVGElement;
  private nodePositions: Record<string, any>;
  private eventHandler: EventHandler;
  private contextMenuElement?: HTMLElement;
  private contextMenuDynamicLinks?: (context: any) => { label: string; url: string; target?: string }[];
  private className: {
    NODE_TYPE_TITLE: string;
    NODE_TITLE: string;
    RELATION: string;
    CARDINALITY: string;
    SELECTED: string;
  };
  private chartData?: ChartData;
  private selectedNodePositionY: number;
  private SVG_NS = "http://www.w3.org/2000/svg";

  constructor(svgElement: any, customOptions?: CustomOptions) {
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

  private setOptions(customOptions: CustomOptions): void {
    this.options = this._deepMerge(this.options, customOptions);
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

  public addSelectionChangedListeners(callbackFunction: (data: any) => void): void {
    if (typeof callbackFunction === 'function') {
      this.eventHandler.subscribe('selectionChanged', callbackFunction);
      callbackFunction({ node: this.chartData?.getSelectedNode(), position: { y: 0 } });
    }
  }

  public addContextMenuListeners(contextMenuElement: HTMLElement, callbackFunction: (context: any) => { label: string; url: string; target?: string }[]): void {
    if (typeof callbackFunction === 'function') {
      this.contextMenuElement = contextMenuElement;
      this.contextMenuDynamicLinks = callbackFunction;
    }
  }

  public addFetchDataListeners(callbackFunction: (data: any) => void): void {
    if (typeof callbackFunction === 'function') {
      this.eventHandler.subscribe('fetchData', callbackFunction);
    }
  }

  private truncateName(name: string | undefined, maxLength: number): string {
    if (name && name?.length > maxLength) {
      return name.substring(0, maxLength - 3) + this.options.ellipseCharacter;
    }
    return name || '';
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
    const width = (this.options.nodeColumnWith + this.options.nodeWidth) * Math.max(1, this.chartData?.getKinds().length || 0) + (this.options.marginX * 2);
    this.svgElement.setAttribute('height', this.calculatedHeight.toString());
    this.svgElement.setAttribute('width', width.toString());
  }

  private renderElipsisMenu(x: number, y: number): SVGGElement {
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

  private showContextMenu = (event: MouseEvent): void => {
    const contextMenu = this.contextMenuElement;
    const context = { node: this.chartData?.getSelectedNode() }; // Get your dynamic context here

    // Generate menu items dynamically based on the context
    const menuItems = this.contextMenuDynamicLinks?.(context) || [];
    if (menuItems.length > 0) {
      contextMenu!.innerHTML = '';
      menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'context-item';
        div.textContent = item.label;
        div.setAttribute('data-url', item.url);
        div.setAttribute('data-target', item.target || '');
        div.addEventListener('click', this.openPage);

        contextMenu!.appendChild(div);
      });

      document.addEventListener('click', this.closeContextMenu);
      event.preventDefault();

      contextMenu!.style.left = `${event.clientX}px; contextMenu!.style.top = ${event.clientY}px`;
      contextMenu!.style.display = 'block';
    }
  };

  private openPage = (event: MouseEvent): void => {
    const target = event.currentTarget as HTMLElement;
    const url = target.getAttribute('data - url');
    const targetAttr = target.getAttribute('data - target') || '_self';
    if (url) {
      window.open(url, targetAttr);
    }
  };

  private closeContextMenu = (): void => {
    const contextMenu = this.contextMenuElement;
    if (contextMenu) {
      contextMenu.style.display = 'none';
      document.removeEventListener('click', this.closeContextMenu);
    }
  };

  private createCircle(cx: number, cy: number, r: number, fill: string): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', r.toString());
    circle.setAttribute('fill', fill);
    return circle;
  }

  private _deepMerge(target: any, source: any): any {
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
        this._deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  renderNodes = (nodes: Node[], positionX: number, selectedNode?: Node, kind?: Kind) => {

    const svgGroup = document.createElementNS(this.SVG_NS, "g");

    let overallY = this.options.topY;
    this.chartData?.getKinds
    const x: number = positionX + (this.options.nodeWidth / 2);
    const y: number = this.options.topY + this.options.marginY + (this.options.nodeWidth / 2);
    let x2: number = positionX + this.options.nodeWidth + this.options.nodeMarginY / 2;
    const y2: number = this.options.topY + this.options.marginY + (this.options.nodeWidth);
    if (this.options.renderKindAsColums) {
      if (kind?.title) {

        let prefix = '';
        if (kind.color) {
          const circle = this.createCircle(x, y, 5, kind.color || this.options.defaultNodeColor);
          svgGroup.appendChild(circle);
        } else {
          prefix = '| ';
          x2 = (x2 - 13);
        }

        const nodeKindTitle = this.createSvgText(prefix + kind.title, [this.className.NODE_TYPE_TITLE]);
        nodeKindTitle.setAttribute("x", x2.toString());
        nodeKindTitle.setAttribute("y", y2.toString());
        svgGroup.appendChild(nodeKindTitle);
        overallY += 25;
      } else if (this.chartData?.getTitle()) {
        const title = this.chartData.getTitle();
        const circle = this.createCircle(x, y, 5, title?.color || this.options.defaultNodeColor);
        svgGroup.appendChild(circle);

        const nodeKindTitle = this.createSvgText((title?.name || ''), [this.className.NODE_TYPE_TITLE]);
        nodeKindTitle.setAttribute("x", x2.toString());
        nodeKindTitle.setAttribute("y", y2.toString());
        svgGroup.appendChild(nodeKindTitle);
        overallY += 25;
      }
    }

    nodes.forEach((node, index) => {
      const linksHeight = node.height ?? 0;

      const height = node.cardinality ? 10 : -20;

      const isSelected = selectedNode && selectedNode.name === node.name && selectedNode.kind === node.kind;
      const rectHeight = height + Math.max(linksHeight + 2 * this.options.marginY, this.options.nodeMinHeight + (this.options.renderKindAsColums ? 0 : 10) + (node.subtitle ? 10 : 0));
      const y = this.options.marginY + overallY;
      const color = node.color || this.options.defaultNodeColor;
      let posX = positionX;

      let rectPositionWidth = this.options.nodeColumnWith;
      if (isSelected) {
        this.selectedNodePositionY = y;
        /*rectPositionX = positionX * 0.8;*/
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
      //rectHover.setAttribute('stroke-width', "1");
      //rectHover.setAttribute('stroke', this.options.selectedNode.borderColor);

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
        } else if (this.options.selectedNode.borderColor) {
          rectShadow.setAttribute('stroke-width', "2");
          rectShadow.setAttribute('stroke', this.options.selectedNode.borderColor);
          rectShadow.setAttribute('fill', 'none');
          rectShadow.setAttribute("opacity", "1");
        }

        g.appendChild(rectShadow);
        /*        g.style.transform = 'scale(1.2)';
                g.classList.add('selectedSvg');
                */
      } else {

      };


      g.appendChild(rect);

      rectHover.style.cursor = 'pointer';
      g.appendChild(rectHover);

      const cardinality = node.cardinality;
      if (cardinality) {
        if (cardinality.sourceCount ?? 0 > 0) {
          const sourceText = this.createSvgText('- ' + cardinality.sourceCount + (cardinality.refs > 0 ? '+' : ''), [this.className.CARDINALITY, isSelected ? this.className.SELECTED : '']);
          sourceText.setAttribute("x", String(posX + this.options.marginX - 6));
          sourceText.setAttribute("y", String(y + rectHeight - 2));
          sourceText.setAttribute("fill", color);
          g.appendChild(sourceText);
        }
        if (cardinality.targetCount ?? 0 > 0) {
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

      //text.style.cursor = 'pointer';

      // Create tspan elements for each line of text
      const truncatedTitle = this.truncateName(node.title ? node.title : node.name, this.options.nameMaxLength);
      const lines = [truncatedTitle];
      if (node.tags) {
        lines.push(node.tags.join(', '))
      }
      if (!this.options.renderKindAsColums) {
        lines.push(node.kind.charAt(0).toUpperCase() + node.kind.slice(1))
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
        } else if (i === subtitleLineIndex) {
          tspan.classList.add("subtitle");
        } else {
          tspan.classList.add("description");
        }
        text.appendChild(tspan);
      }
      g.appendChild(text);
      if (!node?.placeHolder) {
        //g.addEventListener('click', (event) => {
        rectHover.addEventListener('click', (event) => {
          this.chartData?.selectNode(node);
          this.render();
          if (node?.cardinality?.fetchMore) {
            this.eventHandler.dispatchEvent('fetchData', { node });
          } else {
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

      if (isSelected && !node?.placeHolder && this.contextMenuElement) {
        svgGroup.appendChild(this.renderElipsisMenu(posX, y));
      }
      this.nodePositions[node.kind + '::' + node.name] = { x: posX, y, index, sourceY: y + this.options.marginY, targetY: y, h: rectHeight, color: node.color };

      overallY = overallY + rectHeight + this.options.nodeMarginY;
    });
    this.calculatedHeight = Math.max(this.calculatedHeight, overallY + this.options.nodeMarginY * 2);
    return svgGroup;
  }
  createSvgText = (textContent: string, classNames: string[]) => {
    const text = document.createElementNS(this.SVG_NS, "text");
    text.classList.add(...classNames.filter(className => className));
    text.textContent = textContent;
    return text;
  }

  renderRelations = (relations: Relation[] | undefined, selectedNode: Node | undefined) => {

    const { name, kind, color } = selectedNode || {};
    const defaultColor = color || this.options.defaultNodeColor;
    const localNodePositions = JSON.parse(JSON.stringify(this.nodePositions));

    const gText = document.createElementNS(this.SVG_NS, "g");
    const gPath = document.createElementNS(this.SVG_NS, "g");


    relations?.forEach((link) => {
      const g = document.createElementNS(this.SVG_NS, "g");

      const sourcePosition = localNodePositions[link.source.kind + '::' + link.source.name];
      const targetPosition = localNodePositions[link.target.kind + '::' + link.target.name];
      if (!targetPosition || !sourcePosition) {
        return; // node is not rendered
      }

      const linkColor = sourcePosition.color || defaultColor;



      /*
      let linkColor = sourcePosition.color || defaultColor;
      if (color && (link.source.kind === selectedNode.kind && link.source.name === name || link.target.kind === kind && link.target.name === name)) {
        linkColor = color;
        linkColor = sourcePosition.color;
        linkColor = targetPosition.color;
      }*/

      const { source, target, height } = link;
      const controlPoint1X = sourcePosition.x + this.options.nodeWidth;
      const controlPoint1Y = sourcePosition.sourceY + ((height || 0) / 2);
      const controlPoint2Y = targetPosition.targetY + ((height || 0) / 2) + 5;
      const controlPoint2X = (sourcePosition.x + this.options.nodeWidth + targetPosition.x) / 2;

      let pathD;
      let opacity = this.options.relation.opacity;
      let strokeWidth = height;

      /*
            selectedOpacity: 0.2,
            analyticsOpacity: 0.2,
      
            opacity +=  this.options.relation.analyticsOpacity;
            opacity: 0.2,
      */

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

        } else {
          const point2X = sourcePosition.x + (this.options.nodeWidth / 2);
          const point2Y = sourcePosition.y + (sourcePosition.h / 2);
          const point1X = targetPosition.x + (this.options.nodeWidth / 2);
          const point1Y = targetPosition.y + targetPosition.h;

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
      if (link.analytics?.drillDown && link.source.kind != selectedNode?.kind) {
        // not working yet
        //analytics = link.analytics?.drillDown.find(item => item.kind === selectedNode?.kind && item.name === selectedNode?.name);
      }
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
        text.setAttribute("y", String(targetPosition.targetY + (height || 0 / 2) + 8));
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
      sourcePosition.sourceY += height;
      targetPosition.targetY += height;

      path.setAttribute('opacity', String(opacity));
    });

    //    console.log(gPath); // Check if this outputs a valid node
    //console.log(gPath instanceof Node); // Should return true


    //const gPathx = document.createElementNS(this.SVG_NS, "g");
    //    this.svgElement.appendChild(gPathx);

    this.svgElement.appendChild(gPath);
    this.svgElement.appendChild(gText);
  }
  private render(): void {
    const selectedNode = this.chartData?.getSelectedNode();

    this.resetSvg();

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
}
export default SankeyChart;
export {SankeyChart, CustomOptions};