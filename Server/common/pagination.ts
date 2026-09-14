export type SeekArgs<I, R> = {
  field: keyof I;
  lastRecord?: R;
  limit?: number;
  asc?: boolean;
}

export type OffsetFindArgs<I> = {
  field: keyof I;
  skip?: number;
  limit?: number;
  asc?: boolean;
}