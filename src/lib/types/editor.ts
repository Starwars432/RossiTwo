import { CSSProperties } from 'react';
import { MotionStyle } from 'framer-motion';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type Display = 'flex' | 'block' | 'inline' | 'inline-block' | 'none';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface BlockStyles extends Omit<CSSProperties, 'flexDirection'> {
  flexDirection?: FlexDirection;
  display?: Display;
  mobile?: {
    width?: string;
    display?: Display;
    flexDirection?: FlexDirection;
    padding?: string;
    margin?: string;
    fontSize?: string;
    textAlign?: TextAlign;
  };
  tablet?: {
    width?: string;
    display?: Display;
    flexDirection?: FlexDirection;
    padding?: string;
    margin?: string;
    fontSize?: string;
    textAlign?: TextAlign;
  };
}

export interface Block {
  id: string;
  type: 'text' | 'image' | 'container' | 'row' | 'column' | 'section' | 'component';
  content?: string;
  src?: string;
  alt?: string;
  children?: Block[];
  componentId?: string;
  styles?: BlockStyles;
}

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