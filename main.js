const glassBox = document.getElementById("glass-box");

if (glassBox) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const dragState = {
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    lastClientX: 0,
    lastClientY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: 0,
  };

  const motionState = {
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    targetScaleX: 1,
    targetScaleY: 1,
    targetRotate: 0,
    targetSkewX: 0,
    targetSkewY: 0,
    rafId: null,
  };

  const animateJelly = () => {
    const ease = 0.16;

    motionState.scaleX += (motionState.targetScaleX - motionState.scaleX) * ease;
    motionState.scaleY += (motionState.targetScaleY - motionState.scaleY) * ease;
    motionState.rotate += (motionState.targetRotate - motionState.rotate) * ease;
    motionState.skewX += (motionState.targetSkewX - motionState.skewX) * ease;
    motionState.skewY += (motionState.targetSkewY - motionState.skewY) * ease;

    glassBox.style.setProperty("--drag-scale-x", motionState.scaleX.toFixed(4));
    glassBox.style.setProperty("--drag-scale-y", motionState.scaleY.toFixed(4));
    glassBox.style.setProperty("--drag-rotate", `${motionState.rotate.toFixed(3)}deg`);
    glassBox.style.setProperty("--drag-skew-x", `${motionState.skewX.toFixed(3)}deg`);
    glassBox.style.setProperty("--drag-skew-y", `${motionState.skewY.toFixed(3)}deg`);

    const movement =
      Math.abs(motionState.targetScaleX - motionState.scaleX) +
      Math.abs(motionState.targetScaleY - motionState.scaleY) +
      Math.abs(motionState.targetRotate - motionState.rotate) +
      Math.abs(motionState.targetSkewX - motionState.skewX) +
      Math.abs(motionState.targetSkewY - motionState.skewY);

    if (movement > 0.002) {
      motionState.rafId = window.requestAnimationFrame(animateJelly);
    } else {
      motionState.rafId = null;
    }
  };

  const ensureJellyAnimation = () => {
    if (motionState.rafId === null) {
      motionState.rafId = window.requestAnimationFrame(animateJelly);
    }
  };

  const setJellyTargetsFromVelocity = (velocityX, velocityY, isDragging) => {
    const speedX = clamp(velocityX / 900, -1, 1);
    const speedY = clamp(velocityY / 900, -1, 1);
    const stretchX = Math.abs(speedX) * 0.09;
    const stretchY = Math.abs(speedY) * 0.09;

    motionState.targetScaleX = isDragging ? 1 + stretchX - stretchY * 0.35 : 1;
    motionState.targetScaleY = isDragging ? 1 + stretchY - stretchX * 0.35 : 1;
    motionState.targetRotate = isDragging ? speedX * 4.2 : 0;
    motionState.targetSkewX = isDragging ? speedX * 5.8 : 0;
    motionState.targetSkewY = isDragging ? speedY * 3.8 : 0;
    ensureJellyAnimation();
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
    dragState.lastClientX = event.clientX;
    dragState.lastClientY = event.clientY;
    dragState.lastTime = performance.now();
    dragState.velocityX = 0;
    dragState.velocityY = 0;

    glassBox.classList.add("dragging");
    glassBox.setPointerCapture(event.pointerId);
    setJellyTargetsFromVelocity(0, 0, true);
  });

  glassBox.addEventListener("pointermove", (event) => {
    if (event.pointerId !== dragState.pointerId) {
      return;
    }

    const now = performance.now();
    const deltaTime = Math.max(16, now - dragState.lastTime);
    dragState.velocityX = ((event.clientX - dragState.lastClientX) / deltaTime) * 1000;
    dragState.velocityY = ((event.clientY - dragState.lastClientY) / deltaTime) * 1000;
    dragState.lastClientX = event.clientX;
    dragState.lastClientY = event.clientY;
    dragState.lastTime = now;

    positionGlassBox(event.clientX, event.clientY);
    setJellyTargetsFromVelocity(dragState.velocityX, dragState.velocityY, true);
  });

  const stopDragging = (event) => {
    if (event.pointerId !== dragState.pointerId) {
      return;
    }

    glassBox.classList.remove("dragging");
    if (glassBox.hasPointerCapture(event.pointerId)) {
      glassBox.releasePointerCapture(event.pointerId);
    }
    setJellyTargetsFromVelocity(
      dragState.velocityX * 0.35,
      dragState.velocityY * 0.35,
      false,
    );
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
  ensureJellyAnimation();
}
