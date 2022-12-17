export const INITIAL_STEPS_NUMBER = 3;
export const DEFAULT_BORDER_COLOR = [200, 200, 200];
export const CLOSEST_COLOR_BORDER = [255, 0, 0];
export const DEFAULT_CELL_ID_WITH_CLOSEST_COLOR = "1,1";
export const DEFAULT_DELTA = 100;
export const DELTA_WIN_CONDITION = 10;
export const INIT_URL = "http://localhost:9876/init";

export const enum IGameStatus {
  Initial,
  InGame,
  Finished,
}

export interface IFetchedData {
  userId: string;
  width: number;
  height: number;
  maxMoves: number;
  target: number[];
}

export const enum ICellType {
  Empty,
  Tile,
  Source,
}

export interface ICell {
  id: string;
  color: number[];
  borderColor: number[];
  type: ICellType;
  isDnDEnabled: boolean;
}

export interface ITileProps {
  cell: ICell;
}

export interface IGameData {
  closestColor: number[];
  status: IGameStatus;
  stepCount: number;
  nextColor: number[];
  isDnDEnabled: boolean;
}

export interface IData {
  initial?: IFetchedData;
  game?: IGameData;
}
