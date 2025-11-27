import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/ds.js'),
            fileName: () => 'scripts/design-system.js',
            formats: ['es'],
            name: 'DesignSystem',
        },
        minify: 'esbuild'
    }
});
