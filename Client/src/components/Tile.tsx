import React, { FC } from "react";
import styled from "styled-components";
import { ITileProps } from "../interfaces";

interface ITile {
    $color?: number[];
    $borderColor?: number[];
    $isDraggable?: boolean;
}

const TileBody = styled.div`Body
  display: inline-block;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  margin: 1px;
  ${(props: ITile): string => {
        return `
      background-color: rgb(${props.$color?.[0] || 0}, ${props.$color?.[1] || 0
            }, ${props.$color?.[2] || 0});
    `;
    }};
  border-style: solid;
  border-width: 2px;
  ${(props: ITile): string => {
        return `
      border-color: rgb(${props.$borderColor?.[0] || 0}, ${props.$borderColor?.[1] || 0
            }, ${props.$borderColor?.[2] || 0});
    `;
    }};
  ${(props: ITile): string => {
        return props.$isDraggable ? "cursor: pointer;" : "";
    }};
`;

const Tile: FC<ITileProps> = (props) => {
    const handleDragStart = (e: DragEvent) => {
        e.dataTransfer?.setData("id", props.cell.id);
    };

    let additionalProps = {};
    if (props.cell.isDnDEnabled) {
        additionalProps = {
            onDragStart: handleDragStart,
        };
    }

    return (
        <>
            <TileBody
                data-tip={props.cell.color.map((colorComponent) =>
                    colorComponent.toFixed(0)
                )}
                {...additionalProps}
                draggable={props.cell.isDnDEnabled}
                $isDraggable={props.cell.isDnDEnabled}
                $color={props.cell.color}
                $borderColor={props.cell.borderColor}
            />
        </>
    );
};

export default Tile;