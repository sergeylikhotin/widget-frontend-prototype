export interface WidgetComponent {
  id: string;
  name: string;

  props?: Record<string, any>;
  bindings?: Record<string, string>;

  children?: WidgetComponent[];
}

export interface WidgetSchema extends WidgetComponent {}

export interface WidgetData {}

export interface WidgetState {
  schema: WidgetSchema;
  data: WidgetData;
}
