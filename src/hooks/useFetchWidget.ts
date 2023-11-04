import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import urlJoin from 'url-join';
import { AppDispatch, setSchema } from '@store';

export const useFetchWidget = (apiUrl: string) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const abortCtrl = new AbortController();

    axios
      .get(urlJoin(apiUrl, '/widgets/widget/render'), {
        signal: abortCtrl.signal
      })
      .then(res => dispatch(setSchema(res.data)))
      .catch(err => console.error('Failed to fetch schema:', err));

    return () => abortCtrl.abort();
  }, [dispatch, apiUrl]);
};
