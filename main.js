const glassBox = document.getElementById("glass-box");

if (glassBox) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const dragState = {
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
  };

  const backgroundImage = new Image();
  backgroundImage.src = "moon_surface.jpg";

  const backgroundMetrics = {
    width: window.innerWidth,
    height: window.innerHeight,
    offsetX: 0,
    offsetY: 0,
  };

  const syncLensBackground = () => {
    const naturalWidth = backgroundImage.naturalWidth || window.innerWidth;
    const naturalHeight = backgroundImage.naturalHeight || window.innerHeight;
    const viewportRatio = window.innerWidth / window.innerHeight;
    const imageRatio = naturalWidth / naturalHeight;

    if (viewportRatio > imageRatio) {
      backgroundMetrics.width = window.innerWidth;
      backgroundMetrics.height = window.innerWidth / imageRatio;
      backgroundMetrics.offsetX = 0;
      backgroundMetrics.offsetY = (window.innerHeight - backgroundMetrics.height) / 2;
    } else {
      backgroundMetrics.height = window.innerHeight;
      backgroundMetrics.width = window.innerHeight * imageRatio;
      backgroundMetrics.offsetX = (window.innerWidth - backgroundMetrics.width) / 2;
      backgroundMetrics.offsetY = 0;
    }

    const bounds = glassBox.getBoundingClientRect();
    glassBox.style.setProperty("--bg-width", `${backgroundMetrics.width}px`);
    glassBox.style.setProperty("--bg-height", `${backgroundMetrics.height}px`);
    glassBox.style.setProperty("--bg-offset-x", `${backgroundMetrics.offsetX}px`);
    glassBox.style.setProperty("--bg-offset-y", `${backgroundMetrics.offsetY}px`);
    glassBox.style.setProperty("--lens-left", `${bounds.left}px`);
    glassBox.style.setProperty("--lens-top", `${bounds.top}px`);
  };

  const positionGlassBox = (clientX, clientY) => {
    const maxLeft = window.innerWidth - glassBox.offsetWidth;
    const maxTop = window.innerHeight - glassBox.offsetHeight;
    const nextLeft = clamp(clientX - dragState.offsetX, 0, Math.max(0, maxLeft));
    const nextTop = clamp(clientY - dragState.offsetY, 0, Math.max(0, maxTop));

    glassBox.style.left = `${nextLeft}px`;
    glassBox.style.top = `${nextTop}px`;
    glassBox.style.setProperty("--lens-left", `${nextLeft}px`);
    glassBox.style.setProperty("--lens-top", `${nextTop}px`);
  };

  glassBox.addEventListener("pointerdown", (event) => {
    dragState.pointerId = event.pointerId;
    const bounds = glassBox.getBoundingClientRect();

    dragState.offsetX = event.clientX - bounds.left;
    dragState.offsetY = event.clientY - bounds.top;

    glassBox.classList.add("dragging");
    glassBox.setPointerCapture(event.pointerId);
  });

  glassBox.addEventListener("pointermove", (event) => {
    if (event.pointerId !== dragState.pointerId) {
      return;
    }

    positionGlassBox(event.clientX, event.clientY);
  });

  const stopDragging = (event) => {
    if (event.pointerId !== dragState.pointerId) {
      return;
    }

    glassBox.classList.remove("dragging");
    if (glassBox.hasPointerCapture(event.pointerId)) {
      glassBox.releasePointerCapture(event.pointerId);
    }
    dragState.pointerId = null;
  };

  glassBox.addEventListener("pointerup", stopDragging);
  glassBox.addEventListener("pointercancel", stopDragging);

  window.addEventListener("resize", () => {
    const bounds = glassBox.getBoundingClientRect();
    positionGlassBox(
      clamp(bounds.left + dragState.offsetX, 0, window.innerWidth),
      clamp(bounds.top + dragState.offsetY, 0, window.innerHeight),
    );
    syncLensBackground();
  });

  backgroundImage.addEventListener("load", syncLensBackground);
  syncLensBackground();
}
