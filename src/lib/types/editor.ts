import { CSSProperties } from 'react';

export type BlockType = 'text' | 'image' | 'container' | 'section' | 'row' | 'column';
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface BlockStyle extends CSSProperties {
  mobile?: Partial<CSSProperties>;
  tablet?: Partial<CSSProperties>;
  desktop?: Partial<CSSProperties>;
}

export interface Block {
  id: string;
  type: BlockType;
  content?: string;
  src?: string;
  alt?: string;
  style?: BlockStyle;
  children?: Block[];
  parentId?: string;
  order: number;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  metadata: {
    type: string;
    instance: number;
    createdAt: string;
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  metadata: Record<string, unknown>;
  updatedAt: string;
  is_draft?: boolean;
  content?: string;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  category: string;
  blocks: Block[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}