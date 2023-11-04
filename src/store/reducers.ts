import { SliceCaseReducers } from '@reduxjs/toolkit';
import { applyPatch } from 'fast-json-patch';
import { WidgetState } from '../types/widget.ts';
import {
  ApplyDataPatchAction,
  SetDataAction,
  SetSchemaAction
} from './actions.ts';

export const reducers: SliceCaseReducers<WidgetState> = {
  setSchema: (state: WidgetState, action: SetSchemaAction) => {
    state.schema = action.payload;
  },
  setData: (state: WidgetState, action: SetDataAction) => {
    state.data = action.payload;
  },
  applyDataPatch: (state: WidgetState, action: ApplyDataPatchAction) => {
    state.data = applyPatch(state.data, action.payload).newDocument;
  }
};
