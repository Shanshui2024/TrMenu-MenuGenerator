export interface Menu {
  title: string[];
  titleUpdate: number;
  options: MenuOptions;
  layout: string[][];
  playerInventory: string[][];
  buttons: Record<string, Button>;
  bindings: Bindings;
  events?: MenuEvents;
  tasks?: Task[];
  scripts?: Record<string, string>;
}

export interface MenuOptions {
  arguments: boolean;
  defaultArguments: string[];
  defaultLayout: number;
  hidePlayerInv: boolean;
  minClickDelay: number;
  dependExpansions: string[];
}

export interface Button {
  update?: number | number[];
  display: Display;
  actions?: Record<string, string[]>;
  icons?: ConditionalIcon[];
}

export interface Display {
  material: string | string[];
  name?: string | string[];
  lore?: string[] | string[][];
  amount?: number | number[];
  shiny?: boolean;
  slots?: string | string[];
}

export interface ConditionalIcon {
  condition: string;
  priority?: number;
  inherit?: boolean;
  display?: Partial<Display>;
  actions?: Record<string, string[]>;
}

export interface Bindings {
  commands: string[];
  items?: string[];
}

export interface MenuEvents {
  open?: string[];
  close?: string[];
}

export interface Task {
  period: number;
  actions: string[];
}

export type ClickType = 
  | 'left' | 'right' | 'middle' | 'shift_left' | 'shift_right'
  | 'drop' | 'control_drop' | 'double_click' | 'offhand'
  | 'number_key' | 'number_key_1' | 'number_key_2' | 'number_key_3'
  | 'number_key_4' | 'number_key_5' | 'number_key_6' | 'number_key_7'
  | 'number_key_8' | 'number_key_9' | 'all';
