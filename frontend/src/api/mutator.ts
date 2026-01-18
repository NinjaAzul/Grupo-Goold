import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { TOKEN_KEY, LOGIN_ROUTES, ROLES } from '@/constants';
import toast from 'react-hot-toast';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});


AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  
  config.headers = config.headers || {};
  if (!(config.headers as Record<string, string>)['Content-Type']) {
    (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  
  return config;
});

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

    const errorData = error.response?.data as
      | {
          error?: { message?: string; statusCode?: number };
          message?: string;
        }
      | undefined;

    const errorMessage =
      errorData?.error?.message ||
      errorData?.message ||
      'Erro ao processar requisição';

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): CancellablePromise<T> => {
  const source = Axios.CancelToken.source();
  
  const mergedHeaders = {
    ...config.headers,
    ...options?.headers,
  };
  
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    headers: mergedHeaders,
    cancelToken: source.token,
  }).then(({ data }) => data) as CancellablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;

