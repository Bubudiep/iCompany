const zoomAndCrop = (canvas, context) => {
  const scale = 2; // Phóng to ảnh x2
  const croppedWidth = canvas.width * 0.8; // Cắt 20% viền
  const croppedHeight = canvas.height * 0.8;
  const startX = (canvas.width - croppedWidth) / 2;
  const startY = (canvas.height - croppedHeight) / 2;
  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");
  tempCanvas.width = croppedWidth * scale;
  tempCanvas.height = croppedHeight * scale;
  tempContext.drawImage(
    canvas,
    startX,
    startY,
    croppedWidth,
    croppedHeight,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );
  return tempCanvas;
};
function resizeImage(img, maxSize, outputFormat = "image/jpeg", quality = 0.8) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  console.log(img);
  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL(outputFormat, quality);
}
export default { resizeImage, zoomAndCrop };
