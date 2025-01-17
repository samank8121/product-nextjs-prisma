type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchUtilOptions {
  method?: HttpMethod;
  data?: any;
  authToken?: string;
}

export const fetchUtil = async (url: string, options: FetchUtilOptions = {}) => {
  const { method = 'GET', data, authToken } = options;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };
  console.log('fetchOptions', fetchOptions);
  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  return await fetch(url, fetchOptions);
};
