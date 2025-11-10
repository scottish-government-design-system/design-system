import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    coverage: {
        include: ['src/**/*.js'],
        provider: 'v8'
    },
    plugins: [],
    test: {
        browser: {
            enabled: true,
            headless: true,
            // at least one instance is required
            instances: [
                {
                    browser: 'chromium'
                }
            ],
            provider: playwright()
        },
        clearMocks: true,
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.js'],
        reporters: [
            ['default', { summary: false }]
        ]
    }
});
