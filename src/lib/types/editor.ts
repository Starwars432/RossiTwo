import { CSSProperties } from 'react';

export type BlockType = 'text' | 'image' | 'container' | 'section' | 'row' | 'column';

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
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}