// scrap this, run 'tsc --declaration --emitDeclarationOnly' instead
declare module "palette-from-image" {
    type RgbPixel = [number, number, number];
    type RgbaPixel = [number, number, number, number];

    type Palette = {};

    export function paletteFromImage(
        image: HTMLImageElement,
        colorCount: number,
    ): Palette;

    export function paletteFromPixels(
        pixels: RgbPixel[] | RgbaPixel[],
        colorCount: number,
    ): Palette;
}
