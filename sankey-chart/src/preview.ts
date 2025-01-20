class Preview {
  private largeSVG: SVGSVGElement;
  private overlay: SVGRectElement;
  private previewSVG: SVGSVGElement;
  private previewPane: HTMLElement;
  private mainViewport: HTMLElement;
  private maxPreviewWidth: number = 100;

  /**
   * Preview class for handling SVG previews.
   * 
   * @param largeSVG - The large SVG element.
   * @param overlay - The overlay element.
   * @param previewSVG - The preview SVG element.
   * @param previewPane - The preview pane element.
   * @param mainViewport - The main viewport element.
   * 
   * @example
   * <div class="container">
   *   <!-- Main Viewport -->
   *   <div class="main-viewport">
   *     <svg id="largeSVG" width="1500" height="800">
   *       <!-- Sample SVG content -->
   *     </svg>
   *   </div>
   *   <!-- Preview Pane -->
   *   <div class="preview-pane">
   *     <svg id="previewSVG">
   *       <!-- Scaled SVG -->
   *       <use href="#largeSVG" pointer-events="none" />
   *       <!-- Movable overlay -->
   *       <rect id="overlay" x="0" y="0" fill="rgba(255, 255, 255, 0.5)" stroke="black" />
   *     </svg>
   *   </div>
   * </div>
   * 
   * <script>
   * const largeSVG = document.getElementById("largeSVG") as SVGSVGElement;
   * const overlay = document.getElementById("overlay") as SVGRectElement;
   * const previewSVG = document.getElementById("previewSVG") as SVGSVGElement;
   * const previewPane = document.querySelector(".preview-pane") as HTMLElement;
   * const mainViewport = document.querySelector(".main-viewport") as HTMLElement;
   * 
   * const preview = new Preview(largeSVG, overlay, previewSVG, previewPane, mainViewport);
   * </script>
   */
  constructor(
    largeSVG: SVGSVGElement,
    overlay: SVGRectElement,
    previewSVG: SVGSVGElement,
    previewPane: HTMLElement,
    mainViewport: HTMLElement
  ) {
    this.largeSVG = largeSVG;
    this.overlay = overlay;
    this.previewSVG = previewSVG;
    this.previewPane = previewPane;
    this.mainViewport = mainViewport;

    this.initialize();
    this.setupScrollSync();
  }

  public initialize(): void {
    const svgWidth = this.largeSVG.width.baseVal.value;
    const svgHeight = this.largeSVG.height.baseVal.value;
    const viewportWidth = this.mainViewport.offsetWidth;
    const viewportHeight = this.mainViewport.offsetHeight;

    // Check if the SVG fits entirely within the viewport
    const svgFitsInViewport = svgWidth <= viewportWidth && svgHeight <= viewportHeight;

    // If the entire SVG fits within the viewport, hide the preview pane
    if (svgFitsInViewport) {
      this.previewPane.style.display = "none";
    } else {
      this.previewPane.style.display = "unset";
      // Otherwise, calculate the scale for the preview pane
      const scaleX = viewportWidth / svgWidth;
      const scaleY = viewportHeight / svgHeight;
      const scale = Math.min(this.maxPreviewWidth / svgWidth, scaleX, scaleY);

      // Set preview pane dimensions based on the scale
      const previewWidth = svgWidth * scale;
      const previewHeight = svgHeight * scale;
      this.previewPane.style.width = `${previewWidth}px`;
      this.previewPane.style.height = `${previewHeight}px`;

      // Set preview SVG dimensions
      this.previewSVG.setAttribute("width", previewWidth.toString());
      this.previewSVG.setAttribute("height", previewHeight.toString());

      // Adjust the <use> element to scale the referenced SVG
      const useElement = this.previewSVG.querySelector("use") as SVGUseElement;
      useElement.setAttribute("transform", `scale(${scale})`);

      // Border width of the overlay in pixels
      const overlayBorderWidth = 2;

      this.overlay.setAttribute("width", (viewportWidth * scale - overlayBorderWidth).toString());
      this.overlay.setAttribute("height", (viewportHeight * scale - overlayBorderWidth).toString());

      this.enableOverlayDrag(scale, overlayBorderWidth);
    }
  }

  private enableOverlayDrag(scale: number, overlayBorderWidth: number): void {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    this.overlay.addEventListener("mousedown", (e: MouseEvent) => {
      isDragging = true;

      // Calculate offset between mouse position and overlay's top-left corner
      const rect = this.overlay.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Change cursor to grabbing
      this.overlay.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate new overlay position based on cursor movement
      const rect = this.previewSVG.getBoundingClientRect();
      const newX = overlayBorderWidth + e.clientX - rect.left - offsetX;
      const newY = e.clientY - rect.top - offsetY;

      // Clamp the overlay within the preview bounds
      const maxX = this.previewSVG.width.baseVal.value - this.overlay.width.baseVal.value;
      const maxY = this.previewSVG.height.baseVal.value - this.overlay.height.baseVal.value;
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));

      // Move overlay
      this.overlay.setAttribute("x", clampedX.toString());
      this.overlay.setAttribute("y", clampedY.toString());

      // Update the main SVG position
      this.largeSVG.style.transform = `translate(${-clampedX / scale}px, ${-clampedY / scale
        }px)`;
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        this.overlay.style.cursor = "grab"; // Reset cursor to grab
      }
    });

    // Change cursor to grab when hovering over the overlay
    this.overlay.style.cursor = "grab";
  }

  private setupScrollSync(): void {
    const svgWidth = this.largeSVG.width.baseVal.value;
    const svgHeight = this.largeSVG.height.baseVal.value;

    const scale = parseFloat(this.previewSVG.getAttribute("width")!) / svgWidth;

    this.mainViewport.addEventListener("scroll", () => {
      const scrollLeft = this.mainViewport.scrollLeft;
      const scrollTop = this.mainViewport.scrollTop;

      // Scale the scroll position to the preview pane
      const scaledX = scrollLeft * scale;
      const scaledY = scrollTop * scale;

      // Update the overlay position in the preview pane
      this.overlay.setAttribute("x", scaledX.toString());
      this.overlay.setAttribute("y", scaledY.toString());
    });

    this.overlay.addEventListener("mousedown", (e: MouseEvent) => {
      let isDragging = true;
      let offsetX = 0;
      let offsetY = 0;

      const rect = this.overlay.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      const onMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;

        const previewRect = this.previewSVG.getBoundingClientRect();
        const newX = event.clientX - previewRect.left - offsetX;
        const newY = event.clientY - previewRect.top - offsetY;

        const clampedX = Math.max(0, Math.min(newX, svgWidth * scale - this.overlay.width.baseVal.value));
        const clampedY = Math.max(0, Math.min(newY, svgHeight * scale - this.overlay.height.baseVal.value));

        // Update overlay position
        this.overlay.setAttribute("x", clampedX.toString());
        this.overlay.setAttribute("y", clampedY.toString());

        // Sync the main viewport scroll position
        this.mainViewport.scrollLeft = clampedX / scale;
        this.mainViewport.scrollTop = clampedY / scale;
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }
}

export { Preview };