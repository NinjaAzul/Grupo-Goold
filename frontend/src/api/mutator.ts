import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Interceptor para adicionar token de autenticação se necessário
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // Adiciona o token de autenticação se estiver disponível
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
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
    // Se receber 401 (Unauthorized), limpar token e redirecionar
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Redirecionar apenas se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
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

