declare module '@editorjs/editorjs' {
  export interface OutputData {
    time: number;
    blocks: OutputBlockData[];
    version: string;
  }

  export interface OutputBlockData {
    id?: string;
    type: string;
    data: Record<string, any>;
  }

  export interface EditorConfig {
    holder: string | HTMLElement;
    tools?: Record<string, any>;
    data?: OutputData;
    placeholder?: string;
    onChange?: (api: API, event: CustomEvent) => void;
  }

  export interface API {
    blocks: {
      render(data: OutputBlockData): Promise<void>;
      delete(id: string): void;
      clear(): void;
    };
    save(): Promise<OutputData>;
    destroy(): void;
  }

  export default class EditorJS {
    constructor(config: EditorConfig);
    save(): Promise<OutputData>;
    destroy(): void;
  }
}

declare module '@editorjs/header';
declare module '@editorjs/list';