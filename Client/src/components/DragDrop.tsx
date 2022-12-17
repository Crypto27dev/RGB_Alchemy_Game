import React, { FC } from "react";
import styled from "styled-components";
import { IGameStatus, ICell } from "../interfaces";

interface IDragDropProps {
  cell: ICell;
  gameStatus?: IGameStatus;
  onSourceClick: (cellId: string) => void;
  onCellDrop: (e: DragEvent, cellId: string) => void;
}

interface IDragDrop {
  $color?: number[];
  $clickable?: boolean;
}

const DragContainer = styled.div`
  display: inline-block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid rgb(200, 200, 200);
  margin: 1px;
  ${(props: IDragDrop): string => {
    return `
      background-color: rgb(${props.$color?.[0] || 0}, ${
      props.$color?.[1] || 0
    }, ${props.$color?.[2] || 0});
    `;
  }};
  ${(props: IDragDrop): string => {
    return props.$clickable ? "cursor: pointer;" : "";
  }}
`;

const DragDrop: FC<IDragDropProps> = (props) => {
  const handleSourceClick = () => {
    props.onSourceClick(props.cell.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    props.onCellDrop(e, props.cell.id);
  };

  let additionalProps = {};
  if (props.cell.isDnDEnabled) {
    additionalProps = {
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    };
  }

  return (
    <DragContainer
      {...additionalProps}
      $color={props.cell.color}
      $clickable={props.gameStatus === IGameStatus.Initial}
      onClick={handleSourceClick}
    />
  );
};

export default DragDrop;