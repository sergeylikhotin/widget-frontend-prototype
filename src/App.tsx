import React, { useEffect } from 'react';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import { Provider, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import * as jsonpatch from 'fast-json-patch';
import * as jsonpointer from 'jsonpointer';

// Определение типов состояния
interface WidgetState {
  schema: any;
  data: any;
}

const initialState: WidgetState = {
  schema: null,
  data: {}
};

// Создание слайса с помощью RTK
const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    setSchema: (state, action: PayloadAction<any>) => {
      state.schema = action.payload;
    },
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    applyDataPatch: (state, action: PayloadAction<jsonpatch.Operation[]>) => {
      state.data = jsonpatch.applyPatch(state.data, action.payload).newDocument;
    }
  }
});

// Экшены, генерируемые RTK
export const { setSchema, setData, applyDataPatch } = widgetSlice.actions;

// Настройка хранилища
const store = configureStore({
  reducer: {
    widget: widgetSlice.reducer
  }
});

// Типизация для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Пример базовых компонентов
const Text: React.FC<{
  value: string;
}> = ({ value }) => <p>{value.toString()}</p>;
const Container: React.FC<{
  children: React.ReactNode[];
}> = ({ children }) => <div>{children}</div>;
const Image: React.FC<{
  url: string;
}> = ({ url }) => <img src={url} alt="" />;

// Хук для WebSocket
const useWebSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io('localhost:8181');

    socket.on('data', data => dispatch(setData(data)));
    socket.on('patch', patch => dispatch(applyDataPatch(patch)));

    return () => {
      socket.off('data').off('patch').disconnect();
    };
  }, [dispatch]);
};

// Хук для связывания данных
const useBindings = (bindings: any) => {
  const selector = createStructuredSelector<any, any>(
    Object.keys(bindings ?? {}).reduce(
      (selector, key) => ({
        ...selector,
        [key]: (state: any) => jsonpointer.get(state.widget.data, bindings[key])
      }),
      {}
    )
  );

  return useSelector(selector);
};

const components = {
  RootContainer: Container,

  Text: Text,
  Image: Image,
  Container: Container
};

// Функция для рекурсивного рендеринга компонентов
const RenderWidgetComponent = ({ widgetComponent }: any) => {
  const bindings = useBindings(widgetComponent.bindings);
  const props = { ...widgetComponent.props, ...bindings };

  const Component = components[widgetComponent.name as keyof typeof components];
  if (Component == null) {
    return <div>No {widgetComponent.name} component found.</div>;
  }

  return (
    <Component {...props}>
      {widgetComponent.children?.map((child: any) => (
        <RenderWidgetComponent key={child.id} widgetComponent={child} />
      ))}
    </Component>
  );
};

// Основной компонент приложения
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const widget = useSelector((state: RootState) => state.widget.schema);

  useWebSocket();

  useEffect(() => {
    const abortCtrl = new AbortController();

    axios
      .get('http://localhost:3001/widgets/widget/render', {
        signal: abortCtrl.signal
      })
      .then(res => dispatch(setSchema(res.data)))
      .catch(err => console.error('Failed to fetch schema:', err));

    return () => abortCtrl.abort();
  }, [dispatch]);

  return (
    <div>
      {widget != null ? (
        <RenderWidgetComponent widgetComponent={widget} />
      ) : null}
    </div>
  );
};

// Оборачиваем наше приложение в Provider
const Root: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
