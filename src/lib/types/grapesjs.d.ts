declare module 'grapesjs' {
  export interface Editor {
    BlockManager: BlockManager;
    DomComponents: DomComponents;
    getHtml(): string;
    getCss(): string;
    setComponents(components: string | Component[]): void;
    on(event: string, callback: Function): void;
    destroy(): void;
  }

  interface BlockManager {
    add(id: string, options: BlockOptions): void;
    get(id: string): Block;
    getAll(): Block[];
  }

  interface DomComponents {
    addType(type: string, options: ComponentOptions): void;
    getComponents(): Component[];
    getWrapper(): Component;
  }

  interface Block {
    id: string;
    label: string;
    content: string | object;
    category?: string;
    attributes?: Record<string, any>;
  }

  interface BlockOptions {
    label?: string;
    category?: string;
    content: string | {
      type: string;
      content?: string;
      style?: Record<string, any>;
      classes?: string[];
    };
    select?: boolean;
    activate?: boolean;
  }

  interface Component {
    getClasses(): string[];
    getEl(): HTMLElement;
    get(property: string): any;
    set(property: string, value: any): void;
    getId(): string;
    getType(): string;
    getAttributes(): Record<string, any>;
    getStyle(): Record<string, any>;
    remove(): void;
    toHTML(): string;
  }

  interface ComponentOptions {
    isComponent?: (el: HTMLElement) => boolean;
    model?: {
      defaults?: Record<string, any>;
    };
    view?: {
      onRender?: () => void;
    };
  }

  const grapesjs: {
    init(options: {
      container: string | HTMLElement;
      height?: string | number;
      width?: string | number;
      components?: string | Component[];
      style?: string | object[];
      plugins?: string[];
      pluginsOpts?: Record<string, any>;
      storageManager?: boolean | object;
      blockManager?: {
        blocks?: BlockOptions[];
      };
      canvas?: {
        styles?: string[];
      };
    }): Editor;
  };

  export default grapesjs;
}

declare module 'grapesjs-preset-webpage';