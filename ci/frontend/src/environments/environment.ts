// CI override: call the API on the same origin; ng serve proxies /api to the backend (see proxy.conf.mjs).
export const environment = {
  apiUrl: '/api',
};
