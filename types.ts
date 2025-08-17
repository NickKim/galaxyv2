
export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  id: number;
}

export interface Enemy extends GameObject {
  type: 'default';
}
