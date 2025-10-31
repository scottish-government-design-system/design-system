import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/all.ts'),
            fileName: () => 'scripts/design-system.js',
            formats: ['es'],
            name: 'DesignSystem',
        },
        minify: 'esbuild'
    }
});
