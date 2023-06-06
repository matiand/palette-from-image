import { extend } from "colord";
import a11y from "colord/plugins/a11y";

extend([a11y]);

export { paletteFromImage, type FromImageOptions } from "./paletteFromImage";
export {
    paletteFromPixels,
    type FromPixelsOptions,
    type RgbPixel,
    type PaletteResult,
} from "./paletteFromPixels";
