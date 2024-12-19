import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        react(),
        svgr({
            include: /\.svg$/
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://localhost:8080/ws',
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
