import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { TOKEN_KEY, LOGIN_ROUTES, ROLES } from '@/constants';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Interceptor para adicionar token de autenticação se necessário
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // Adiciona o token de autenticação se estiver disponível
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  
  // Definir Content-Type se não estiver definido
  config.headers = config.headers || {};
  if (!(config.headers as Record<string, string>)['Content-Type']) {
    (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Interceptor para tratamento de erros
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);

      const currentPath = window.location.pathname;
      const loginRoute: string = currentPath.startsWith('/admin')
        ? LOGIN_ROUTES[ROLES.ADMIN]
        : LOGIN_ROUTES[ROLES.USER];

      if (!currentPath.includes('/auth/login') && !currentPath.includes('/admin/login')) {
        window.location.href = loginRoute;
      }
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  
  // Mesclar headers corretamente
  const mergedHeaders = {
    ...config.headers,
    ...options?.headers,
  };
  
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    headers: mergedHeaders,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;

