type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchUtilOptions {
  method?: HttpMethod;
  data?: any;
}

export const fetchUtil = async (url: string, options: FetchUtilOptions = {}) => {
  const { method = 'GET', data } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  return await fetch(url, fetchOptions);  
};
