import skmeans from "skmeans";
import quantize from "quantize";
import { resizePixelArray } from "./resizePixelArray";
import { Colord, colord } from "colord";

/**
 * Represents an RGB pixel with three color channels: red, green, and blue.
 */
export type RgbPixel = [number, number, number];
export type PaletteColor = Colord;
export type PaletteResult = {
    /** The colors of the palette */
    colors: PaletteColor[];
    /** The pixels used in generating the palette. */
    usedPixels: RgbPixel[];
};

export type FromPixelsOptions = {
    /** The number of colors in the palette. Has to be bigger than 3. */
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

/**
 * Generates a palette from an array of pixels.
 * @param pixels The pixels to generate the palette from.
 * @param options The options for generating the palette.
 * @returns PaletteResult on success. Null on failure.
 */
export function paletteFromPixels(
    pixels: RgbPixel[],
    options: FromPixelsOptions,
): PaletteResult | null {
    if (pixels.length === 0 || options.colorCount <= 3) return null;

    const resizedPixels = resizePixelArray(pixels, options.pixelRatio ?? 0.5);

    if (options.strategy === "kmeans") {
        const initialCentroids = new Array(options.colorCount).fill(0).map((_, idx) => {
            const channel = (255 / (options.colorCount + 1)) * (idx + 1);
            return [channel, channel, channel];
        });

        const clusters = skmeans(resizedPixels, options.colorCount, initialCentroids);

        return {
            colors: clusters.centroids
                .map(([r, g, b]) => colord({ r, g, b }))
                .sort(orderBySaturationPlusValue),
            usedPixels: resizedPixels,
        };
    } else {
        const qResult = quantize(
            resizedPixels,
            // For some reason, quantize returns a palette with less colors than requested when colorCount is >= 7
            // To fix this, we ask for colorCount + 1
            options.colorCount >= 7 ? options.colorCount + 1 : options.colorCount,
        );
        if (!qResult) return null;
        const palette = qResult.palette();

        return palette
            ? {
                  colors: palette
                      .map(([r, g, b]) => colord({ r, g, b }))
                      .sort(orderBySaturationPlusValue),
                  usedPixels: resizedPixels,
              }
            : null;
    }
}

export function getPixels(data: Uint8ClampedArray) {
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
