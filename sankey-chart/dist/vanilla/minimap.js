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
