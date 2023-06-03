import skmeans from "skmeans";
import quantize from "quantize";
import { resizePixelArray } from "./resizePixelArray";
import { Colord, colord, extend } from "colord";
import a11y from "colord/plugins/a11y";

extend([a11y]);

/**
 * Represents an RGB pixel with three color channels: red, green, and blue.
 */
export type RgbPixel = [number, number, number];
export type Palette = Colord[];

type FromPixelsOptions = {
    /** The size of generated palette. */
    colorCount: number;
    /**
     * The algorithm to use for obtaining the palette: "kmeans" or "quantize".
     *
     * "kmeans" uses k-means clustering, while "quantize" uses median cut color quantization.
     *
     * "quantize" is faster, but "kmeans" is more accurate.
     */
    strategy: "kmeans" | "quantize";
    /**
     * Specifies the percentage of image to use for generating the palette.
     *
     * @default 0.5
     */
    pixelRatio?: number;
};

type FromImageOptions = FromPixelsOptions & {
    /**
     * Represents the area of image that's used for generating the palette.
     * Specifies whole image by default.
     *
     * [x, y, width, height]
     */
    imageRegion?: [number, number, number, number];
};

/**
 * Generates a palette from an image.
 *
 * @param image The image to generate the palette from.
 * @param options The options for generating the palette.
 * @returns Array of Colord instances representing the palette on success. Null on failure.
 */
export function paletteFromImage(image: HTMLImageElement, options: FromImageOptions) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const [x, y, width, height] = options.imageRegion ?? [
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

/**
 * Generates a palette from an array of pixels.
 * @param pixels The pixels to generate the palette from.
 * @param options The options for generating the palette.
 * @returns Array of Colord instances representing the palette on success. Null on failure.
 */
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
        // For some reason, quantize returns a palette with less colors than requested
        // To fix this, we ask for colorCount + 1
        const qResult = quantize(resizedPixels, options.colorCount + 1);
        if (!qResult) return null;
        const palette = qResult.palette();

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
