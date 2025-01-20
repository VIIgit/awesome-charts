class Preview {
    constructor(largeSVG, overlay, previewSVG, previewPane, mainViewport) {
        this.maxPreviewWidth = 100;
        this.largeSVG = largeSVG;
        this.overlay = overlay;
        this.previewSVG = previewSVG;
        this.previewPane = previewPane;
        this.mainViewport = mainViewport;
        this.initialize();
    }
    initialize() {
        const svgWidth = this.largeSVG.width.baseVal.value;
        const svgHeight = this.largeSVG.height.baseVal.value;
        const viewportWidth = this.mainViewport.offsetWidth;
        const viewportHeight = this.mainViewport.offsetHeight;
        const svgFitsInViewport = svgWidth <= viewportWidth && svgHeight <= viewportHeight;
        if (svgFitsInViewport) {
            this.previewPane.style.display = "none";
        }
        else {
            const scaleX = viewportWidth / svgWidth;
            const scaleY = viewportHeight / svgHeight;
            const scale = Math.min(this.maxPreviewWidth / svgWidth, scaleX, scaleY);
            const previewWidth = svgWidth * scale;
            const previewHeight = svgHeight * scale;
            this.previewPane.style.width = `${previewWidth}px`;
            this.previewPane.style.height = `${previewHeight}px`;
            this.previewSVG.setAttribute("width", previewWidth.toString());
            this.previewSVG.setAttribute("height", previewHeight.toString());
            const useElement = this.previewSVG.querySelector("use");
            useElement.setAttribute("transform", `scale(${scale})`);
            const overlayBorderWidth = 2;
            this.overlay.setAttribute("width", (viewportWidth * scale - overlayBorderWidth).toString());
            this.overlay.setAttribute("height", (viewportHeight * scale - overlayBorderWidth).toString());
            this.enableOverlayDrag(scale, overlayBorderWidth);
        }
    }
    enableOverlayDrag(scale, overlayBorderWidth) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        this.overlay.addEventListener("mousedown", (e) => {
            isDragging = true;
            const rect = this.overlay.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            this.overlay.style.cursor = "grabbing";
        });
        document.addEventListener("mousemove", (e) => {
            if (!isDragging)
                return;
            const rect = this.previewSVG.getBoundingClientRect();
            const newX = overlayBorderWidth + e.clientX - rect.left - offsetX;
            const newY = e.clientY - rect.top - offsetY;
            const maxX = this.previewSVG.width.baseVal.value - this.overlay.width.baseVal.value;
            const maxY = this.previewSVG.height.baseVal.value - this.overlay.height.baseVal.value;
            const clampedX = Math.max(0, Math.min(newX, maxX));
            const clampedY = Math.max(0, Math.min(newY, maxY));
            this.overlay.setAttribute("x", clampedX.toString());
            this.overlay.setAttribute("y", clampedY.toString());
            this.largeSVG.style.transform = `translate(${-clampedX / scale}px, ${-clampedY / scale}px)`;
        });
        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                this.overlay.style.cursor = "grab";
            }
        });
        this.overlay.style.cursor = "grab";
    }
}
