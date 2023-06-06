import { paletteFromPixels, FromPixelsOptions, getPixels } from "./paletteFromPixels";

export type FromImageOptions = FromPixelsOptions & {
    /**
     * Represents the area of image that's used for generating the palette.
     *
     * [x, y, width, height]
     *
     * Uses whole image by default.
     */
    imageRegion?: [number, number, number, number];
};

/**
 * Generates a palette from an image.
 *
 * @param image The image to generate the palette from.
 * @param options The options for generating the palette.
 * @returns PaletteResult on success. Null on failure.
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

    // First 4 values are for source image, last 4 are for our canvas
    context!.drawImage(image, x, y, width, height, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);

    const pixels = getPixels(imageData.data);

    return paletteFromPixels(pixels, options);
}
