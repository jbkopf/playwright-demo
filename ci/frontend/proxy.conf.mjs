// CI override: forward /api from the Angular dev server to the Django backend.
export default {
  '/api': {
    target: process.env.API_URL ?? 'http://localhost:8000',
    changeOrigin: true,
  },
};
