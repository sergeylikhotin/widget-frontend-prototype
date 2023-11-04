export type {
  ApplyDataPatchAction,
  SetDataAction,
  SetSchemaAction
} from './actions.ts';
export type { RootState, AppDispatch } from './store.ts';

export { reducers } from './reducers.ts';
export { setData, applyDataPatch, setSchema, widgetSlice } from './slice.ts';
export { store } from './store.ts';
