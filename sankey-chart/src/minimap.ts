/**
 * Class representing a minimap for a large SVG chart.
 */
class Minimap {
  private mainView: HTMLElement;
  private container: HTMLElement;
  private visibleSection: SVGRectElement;
  private minimapPane: HTMLDivElement;
  private miniMapSVG: SVGSVGElement;
  private mainViewHeight: number = 0;
  private mainViewWidth: number = 0;
  private mainViewScrollWidth: number = 0;
  private mainViewScrollHeight: number = 0;
  private scaleUnitY: number = 1;
  private scaleUnitX: number = 1;

  /**
   * Create a Minimap.
   * @param {SVGSVGElement} chartElement - The SVG element of the chart.
   * @param {HTMLElement} containerElement - The minimap-container element for the minimap.
   * @param {HTMLElement} mainViewElement - The main viewport element.
   * @example 
    <div class="minimap-container" id="container">
      <!-- Main Viewport -->
      <div class="minimap-viewport" id="mainViewport">
        <svg id="sankey-chart-svg" width="900" height="6000">
          <!-- Add your SVG content here -->
        </svg>
      </div>
    </div>
    <style>
      .minimap-container {
        display: flex;
        position: relative;
        width: 400px;
        height: 300px;
        border: 1px solid #ccc;
      }

      .minimap-viewport {
        overflow: auto;
      }

      .minimap-viewport::-webkit-scrollbar {
        display: none;
      }

      .minimap-pane {
        width: 80px;
        box-shadow: -3px 0 5px -4px black;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(3px);
      }

      .minimap-visible-section {
        fill: rgba(0, 0, 0, 0.2);
      }
    </style>
    
    const chartElement = document.getElementById('sankey-chart-svg') as SVGSVGElement;
    const containerElement = document.getElementById('container') as HTMLElement;
    const mainViewElement = document.getElementById('mainViewport') as HTMLElement;
    const minimap = new Minimap(chartElement, minimap-containerElement, mainViewElement);  
   */
  constructor(chartElement: SVGSVGElement, containerElement: HTMLElement, mainViewElement: HTMLElement) {
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

  /**
    * Reinitialize the Minimap.
    */
  public initialize() {

    this.mainViewHeight = this.mainView.clientHeight;
    this.mainViewWidth = this.mainView.clientWidth;
    this.mainViewScrollWidth = this.mainView.scrollWidth;
    this.mainViewScrollHeight = this.mainView.scrollHeight;

    this.visibleSection.setAttribute('width', this.mainViewWidth.toString());
    this.visibleSection.setAttribute('height', this.mainViewHeight.toString());  
    this.miniMapSVG.setAttribute('viewBox', `0 0 ${this.mainViewScrollWidth} ${this.mainViewScrollHeight}`);

    this.mainView.scrollTop = 0
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

  /**
   * Create the SVG element for the minimap.
   * @param {string} svgHref - The href of the SVG element.
   * @returns {SVGSVGElement} The created SVG element.
   */
  private createMiniMapSVG(svgHref: string): SVGSVGElement {
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

  /**
   * Create the minimap pane element.
   * @returns {HTMLDivElement} The created minimap pane element.
   */
  private createMinimapPane(): HTMLDivElement {
    const minimapPane = document.createElement('div');
    minimapPane.className = 'minimap-pane';
    minimapPane.style.overflow = 'hidden';
    minimapPane.style.position = 'absolute';
    minimapPane.style.right = '0';
    minimapPane.style.top = '0';
    return minimapPane;
  }

  /**
   * Create the lense element.
   * @returns {SVGRectElement} The created lense element.
   */
  private createVisibleSection(): SVGRectElement {
    const visibleSection = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    visibleSection.setAttribute('class', 'minimap-visible-section');
    visibleSection.setAttribute('x', '0');
    visibleSection.setAttribute('y', '0');
    return visibleSection;
  }

  /**
   * Synchronize the scroll position of the main view and the minimap.
   */
  private syncScroll() {
    const scrollPosYInPercentage = this.scaleUnitY * this.mainView.scrollTop;
    const scrollPosXInPercentage = this.scaleUnitX * this.mainView.scrollLeft;

    this.minimapPane.scrollTop = (this.minimapPane.scrollHeight - this.minimapPane.clientHeight) * scrollPosYInPercentage;
    this.minimapPane.scrollLeft = (this.minimapPane.scrollWidth - this.minimapPane.clientWidth) * scrollPosXInPercentage;

    const overlayY = (this.mainViewScrollHeight - this.mainViewHeight) * scrollPosYInPercentage;
    const overlayX = (this.mainViewScrollWidth - this.mainViewWidth) * scrollPosXInPercentage;

    this.visibleSection.setAttribute('y', overlayY.toString());
    this.visibleSection.setAttribute('x', overlayX.toString());
  }

  /**
   * Start dragging the lense element.
   * @param {MouseEvent} event - The mousedown event.
   */
  private startDrag(event: MouseEvent) {
    event.preventDefault();
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.endDrag);
  }

  /**
   * Drag the lense element.
   * @param {MouseEvent} event - The mousemove event.
   */
  private drag = (event: MouseEvent) => {
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
  }

  /**
   * End dragging the lense element.
   */
  private endDrag = () => {
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.endDrag);
  }


}

export { Minimap };