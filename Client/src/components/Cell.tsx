import React, { FC } from "react";
import styled from "styled-components";
import Tile from "./Tile";
import DragDrop from "./DragDrop";
import { IGameStatus, ICellType, ICell } from "../interfaces";

interface ICellProps {
  cell: ICell;
  gameStatus?: IGameStatus;
  onSourceClick: (cellId: string) => void;
  onCellDrop: (e: DragEvent, cellId: string) => void;
}

const Empty = styled.div`
  display: inline-block;
  width: 28px;
  height: 28px;
  background-color: transparent;
`;

const Cell: FC<ICellProps> = (props) => {
  switch (props.cell.type) {
    case ICellType.Tile:
      return <Tile cell={props.cell} />;
    case ICellType.Source:
      return (
        <DragDrop
          cell={props.cell}
          gameStatus={props.gameStatus}
          onSourceClick={props.onSourceClick}
          onCellDrop={props.onCellDrop}
        />
      );
    default:
      return <Empty />;
  }
};

export default Cell;
