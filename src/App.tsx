import React, { useEffect } from 'react';
import {
  configureStore,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
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
  schema: {},
  data: {}
};

// Создание слайса с помощью RTK
const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    setSchema: (state, action: PayloadAction) => {
      state.schema = action.payload;
    },
    setData: (state, action: PayloadAction) => {
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
}> = React.memo(({ value }) => <p>{value.toString()}</p>);
const Container: React.FC<{
  children: React.ReactNode[];
}> = ({ children }) => <div>{children}</div>;
const Image: React.FC<{
  url: string;
}> = ({ url }) => <img src={url} alt="" />;

// Хук для связывания данных
const useBindings = (bindings: any = {}) =>
  useSelector(
    createSelector(
      Object.keys(bindings).map(key => (state: any) => ({
        [key]: jsonpointer.get(state.widget.data, bindings[key])
      })),
      (...bindings: any) => Object.assign({}, ...bindings)
    )
  );

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

const components = {
  RootContainer: Container,

  Text: Text,
  Image: Image,
  Container: Container
};

// Функция для рекурсивного рендеринга компонентов
const RenderSchemaComponent = ({ widget }: any) => {
  const bindings = useBindings(widget.bindings);
  const props = { ...widget.props, ...bindings };

  const Component = components[widget.name as keyof typeof components];

  return (
    <Component {...props}>
      {widget.children?.map((child: any) => (
        <RenderSchemaComponent key={child.id} widget={child} />
      ))}
    </Component>
  );
};

// Основной компонент приложения
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const widgets = useSelector((state: RootState) => state.widget.schema);

  useWebSocket();

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/widgets/widget/render'
        );
        dispatch(setSchema(response.data));
      } catch (error) {
        console.error('Failed to fetch schema:', error);
      }
    };
    fetchSchema();
  }, [dispatch]);

  return (
    <div>
      {widgets.children?.map((widget: any) => (
        <RenderSchemaComponent key={widget.id} widget={widget} />
      ))}
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
