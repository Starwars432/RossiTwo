export interface Page {
  id: string;
  slug: string;
  title: string;
  blocks: Block[];
  metadata: {
    description?: string;
    keywords?: string[];
    [key: string]: any;
  };
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Block {
  id: string;
  type: 'text' | 'image' | 'container' | 'row' | 'column' | 'section' | 'component';
  content?: string;
  src?: string;
  alt?: string;
  children?: Block[];
  componentId?: string;
  styles?: {
    font?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    mobile?: {
      width?: string;
      display?: string;
      flexDirection?: string;
      padding?: string;
      margin?: string;
      fontSize?: string;
      textAlign?: string;
    };
    tablet?: {
      width?: string;
      display?: string;
      flexDirection?: string;
      padding?: string;
      margin?: string;
      fontSize?: string;
      textAlign?: string;
    };
  };
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  category: string;
  blocks: Block[];
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';