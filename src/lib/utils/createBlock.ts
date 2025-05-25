import { v5 as uuidv5 } from 'uuid';
import { Block, BlockType } from '../types/editor';

const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export const createBlock = (type: BlockType, instanceNumber: number): Block => {
  const seed = `${type}-${instanceNumber}`;
  const id = uuidv5(seed, NAMESPACE);

  return {
    id,
    type,
    order: 0,
    metadata: {
      type,
      instance: instanceNumber,
      createdAt: new Date().toISOString()
    }
  };
};