import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        deps: {
            inline: ["vitest-canvas-mock"],
        },
        threads: false,
        environment: "jsdom",
        environmentOptions: {
            resources: "usable",
        },
    },
});
