import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { applyDataPatch, setData } from '../store/slice.ts';

export const useSocketIO = (url: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(url);

    socket.on('data', data => dispatch(setData(data)));
    socket.on('patch', patch => dispatch(applyDataPatch(patch)));

    return () => {
      socket.off('data').off('patch').disconnect();
    };
  }, [dispatch, url]);
};
