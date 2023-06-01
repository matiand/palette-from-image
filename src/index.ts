import skmeans from "skmeans";
import quantize from "quantize";
import { resizePixelArray } from "./resizePixelArray";
import { Colord, colord, extend } from "colord";
import a11y from "colord/plugins/a11y";

export type RgbPixel = [number, number, number];
export type Palette = Colord[];

extend([a11y]);

type FromPixelsOptions = {
    colorCount: number;
    strategy: "kmeans" | "quantize";
    pixelRatio?: number;
};

type FromImageOptions = FromPixelsOptions & {
    // [x, y, width, height]
    coordinates?: [number, number, number, number];
};

export function paletteFromImage(image: HTMLImageElement, options: FromImageOptions) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const [x, y, width, height] = options.coordinates ?? [
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    ];
    canvas.width = width;
    canvas.height = height;

    // First 4 coordinates are for source image, last 4 are for our canvas
    context!.drawImage(image, x, y, width, height, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);

    const pixels = getPixels(imageData.data);

    return paletteFromPixels(pixels, options);
}

export function paletteFromPixels(
    pixels: RgbPixel[],
    options: FromPixelsOptions,
): Palette | null {
    if (pixels.length === 0) return null;

    const resizedPixels = resizePixelArray(pixels, options.pixelRatio ?? 0.5);

    if (options.strategy === "kmeans") {
        // todo: refactor this
        const initialCentroids = new Array(options.colorCount).fill(0).map((_, idx) => {
            const channel = (255 / (options.colorCount + 1)) * (idx + 1);
            return [channel, channel, channel];
        });

        const clusters = skmeans(resizedPixels, options.colorCount, initialCentroids);

        return clusters.centroids
            .map(([r, g, b]) => colord({ r, g, b }))
            .sort(orderBySaturationPlusValue);
    } else {
        const qResult = quantize(resizedPixels, options.colorCount);
        const palette = qResult.palette();

        console.log("qResult", qResult);
        console.log("qResult.size", qResult.size());

        return palette
            ? palette
                  .map(([r, g, b]) => colord({ r, g, b }))
                  .sort(orderBySaturationPlusValue)
            : null;
    }
}

function getPixels(data: Uint8ClampedArray) {
    const pixels: RgbPixel[] = [];
    for (let i = 0; i < data.length; i += 4) {
        pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    return pixels;
}

function orderBySaturationPlusValue(a: Colord, b: Colord) {
    const { s: satA, v: valA } = a.toHsv();
    const { s: satB, v: valB } = b.toHsv();

    return satB + valB - (satA + valA);
}
