import { PayloadAction, PayloadActionCreator } from '@reduxjs/toolkit';
import { WidgetData, WidgetSchema } from '../types/widget.ts';
import { Operation } from 'fast-json-patch';

export type SetSchemaAction = PayloadAction<WidgetSchema>;
export type SetDataAction = PayloadAction<WidgetData>;
export type ApplyDataPatchAction = PayloadAction<Operation[]>;
