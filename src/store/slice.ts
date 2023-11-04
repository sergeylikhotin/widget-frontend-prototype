import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as jsonpatch from 'fast-json-patch';
import { WidgetState } from '../types/widget.ts';
import { SetSchemaAction } from './actions.ts';
import { reducers } from './reducers.ts';

const initialState: WidgetState = {
  schema: {
    name: 'Initial',
    id: ''
  },
  data: {}
};

export const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers
});

export const { setSchema, setData, applyDataPatch } = widgetSlice.actions;
