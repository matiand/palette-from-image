import { RgbPixel } from "./paletteFromPixels";

export function resizePixelArray(pixels: RgbPixel[], ratio = 1) {
    if (ratio >= 1 || ratio <= 0) return pixels;

    const iterations = Math.ceil(pixels.length * ratio);
    const resized: RgbPixel[] = [];
    for (let i = 0; i < iterations; i++) {
        const sourceIdx = Math.floor(i / ratio);
        resized.push(pixels[sourceIdx]);
    }

    return resized;
}
