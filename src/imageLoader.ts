const canvas = document.createElement("canvas");
const context = canvas.getContext("2d", { willReadFrequently: true })!;

export async function loadRawImage(
  url: string
): Promise<{ image: HTMLImageElement; pixels: Uint8ClampedArray }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      resolve({ image, pixels });
    };
    image.onerror = (err) => {
      reject(err);
    };
  });
}
