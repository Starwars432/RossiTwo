declare module 'grapesjs' {
  export interface Editor {
    BlockManager: BlockManager;
    DomComponents: DomComponents;
    Pages: {
      getSelected(): Page;
      getAll(): Page[];
      add(options: PageOptions): Page;
      remove(page: Page | string): void;
    };
    Canvas: {
      getDocument(): Document;
      getWindow(): Window;
      getFrame(): HTMLIFrameElement & {
        contentDocument: Document;
        contentWindow: Window;
        getBody(): HTMLElement;
      };
    };
    Panels: {
      getPanel(id: string): Panel;
    };
    getHtml(): string;
    getCss(): string;
    setComponents(components: string | Component[]): void;
    setStyle(style: string | object): void;
    on(event: string, callback: Function): void;
    destroy(): void;
  }

  interface Page {
    id: string;
    name: string;
    component: string;
    get(property: string): any;
    set(property: string, value: any): void;
  }

  interface PageOptions {
    id: string;
    name: string;
    component: string;
    styles?: string;
  }

  interface Panel {
    get(property: string): {
      each(callback: (btn: any) => void): void;
    };
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
      plugins?: any[];
      pageManager?: {
        pages?: PageOptions[];
      };
      deviceManager?: {
        devices?: Array<{
          name: string;
          width: string;
          widthMedia?: string;
        }>;
      };
      styleManager?: {
        sectors?: Array<{
          name: string;
          open?: boolean;
          buildProps?: string[];
        }>;
      };
      canvas?: {
        styles?: string[];
      };
      storageManager?: boolean | object;
    }): Editor;
  };

  export default grapesjs;
}