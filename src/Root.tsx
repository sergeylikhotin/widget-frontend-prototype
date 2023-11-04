import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@store';
import { useSocketIO } from '@hooks';
import { WidgetComponent } from '@components';
import { useFetchWidget } from '@hooks';
import { WidgetSchema, WidgetState } from './types/widget.ts';

type AppProps = {
  socketUrl: string;
  apiUrl: string;
};
// Основной компонент приложения
const App: React.FC<AppProps> = ({ socketUrl, apiUrl }) => {
  useFetchWidget(apiUrl);
  useSocketIO(socketUrl);

  const schema = useSelector<RootState, WidgetSchema>(
    state => state.widget.schema
  );

  return (
    <div>
      <WidgetComponent widgetComponent={schema} />
    </div>
  );
};

// Оборачиваем наше приложение в Provider
const Root: React.FC = () => (
  <Provider store={store}>
    <App
      socketUrl={import.meta.env.VITE_SOCKET_URL}
      apiUrl={import.meta.env.VITE_API_URL}
    />
  </Provider>
);

export default Root;
