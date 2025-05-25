import { v5 as uuidv5 } from 'uuid';
import { Block, BlockType } from '../types/editor';

const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export interface BlockMetadata {
  type: string;
  instance: number;
  createdAt: string;
}

export const generateBlockId = (type: BlockType, instanceNumber: number): { id: string; metadata: BlockMetadata } => {
  const seed = `${type}-${instanceNumber}`;
  const id = uuidv5(seed, NAMESPACE);
  
  const metadata: BlockMetadata = {
    type,
    instance: instanceNumber,
    createdAt: new Date().toISOString()
  };

  return { id, metadata };
};

export const createBlock = (type: BlockType, blockData: Partial<Block> = {}): Block => {
  const instanceNumber = Math.floor(Math.random() * 1000000);
  const { id, metadata } = generateBlockId(type, instanceNumber);
  
  return {
    id,
    type,
    metadata,
    order: 0,
    ...blockData
  };
};