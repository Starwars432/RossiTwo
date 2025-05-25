// Declare module for grapesjs-preset-webpage
declare module 'grapesjs-preset-webpage' {
  const preset: any;
  export default preset;
}

// Declare module for uuid v5
declare module 'uuid' {
  export function v5(name: string, namespace: string): string;
}

// Extend Page interface
import { Database } from './database.types';

export interface Page extends Database['public']['Tables']['pages']['Row'] {
  blocks: Block[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}