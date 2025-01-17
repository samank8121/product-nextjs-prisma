type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchUtilOptions {
  method?: HttpMethod;
  data?: any;
  authToken?: string;
  locale?: string;
}

export const fetchUtil = async (url: string, options: FetchUtilOptions = {}) => {
  const { method = 'GET', data, authToken, locale } = options;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  if (locale) {
    headers['Accept-Language'] = locale;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };
  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  return await fetch(url, fetchOptions);
};
