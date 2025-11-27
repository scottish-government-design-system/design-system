import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
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
        coverage: {
            include: ['src/**/*.ts'],
            provider: 'v8'
        },
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.js'],
        reporters: [
            ['default', { summary: false }]
        ]
    }
});
