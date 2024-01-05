import { useState, useEffect } from 'react';
import { setLoading } from '../ReduxStore/UISlice';
import { useDispatch } from 'react-redux';

type HttpError = {
  message: string;
  status?: number;
};

function useHttp<T>(
  url: string,
  options?: RequestInit
): [T | null, HttpError | null] {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<HttpError | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      // dispatch(setLoading(true));
      try {
        const headers: HeadersInit = {};
        if (options?.headers) {
          for (const [key, value] of Object.entries(options.headers)) {
            if (value !== null) {
              headers[key] = value.toString();
            }
          }
        }
        const fetchOptions: RequestInit = {
          ...options,
          headers,
        };

        const fetchResponse = await fetch(url, fetchOptions);
        if (!fetchResponse.ok) {
          // dispatch(setLoading(false));
          throw new Error(`Request failed with status: ${fetchResponse.status}`);
        }

        const responseData: T = await fetchResponse.json();
        setResponse(responseData);
        // dispatch(setLoading(false));
      } catch (error: unknown) {
        setError({
          message: (error as Error).message,
          status: (error as HttpError).status,
        });
        // dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [url, options, dispatch]);

  return [response, error];
}

export default useHttp;
