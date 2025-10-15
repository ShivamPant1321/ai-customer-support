import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5002',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 30000,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('🔴 Vite proxy error:', err.message);
            console.error('   Target:', req.url);
            console.error('   Make sure the server is running on port 5002');

            if (res && !res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
              });
              res.end(
                JSON.stringify({
                  error: 'Backend server unavailable',
                  message: 'Please make sure the server is running on port 5002',
                  code: 'PROXY_ERROR',
                }),
              );
            }
          });

          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`🔄 Proxying ${req.method} ${req.url} to http://127.0.0.1:5002`);
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`✅ Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          icons: ['lucide-react'],
          toast: ['react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    // Define global constants
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'react-hot-toast'],
  },
});
