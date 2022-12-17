import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import Header from "../components/Header";
import GridField from "../components/GridField";
import {
  CLOSEST_COLOR_BORDER,
  DEFAULT_BORDER_COLOR,
  DEFAULT_CELL_ID_WITH_CLOSEST_COLOR,
  DEFAULT_DELTA,
  DELTA_WIN_CONDITION,
  INITIAL_STEPS_NUMBER,
  INIT_URL,
  IFetchedData, 
  ICellType, 
  ICell,
  IGameStatus,
  IData,
  IGameData,
} from "../interfaces";
import {
  generateInitialField,
  getCellColorById,
  getFieldCopy,
  getFieldWithUpdatedTilesLine,
  getXFromCellId,
  getYFromCellId,
} from "../helpers";

const Game: FC = () => {
  const [data, setData] = useState<IData>({});
  const [field, setField] = useState<ICell[][]>([]);
  const [delta, setDelta] = useState<number>(DEFAULT_DELTA);
  const [cellIdWithClosestColor, setCellIdWithClosestColor] = useState(
    DEFAULT_CELL_ID_WITH_CLOSEST_COLOR
  );

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    setClosestColorAndDelta();
    ReactTooltip.rebuild();
  }, [field]);

  useEffect(() => {
    resetCellBorders();
    setClosestColorCellBorder(cellIdWithClosestColor);
  }, [cellIdWithClosestColor]);

  useEffect(() => {
    checkWinConditions();
  }, [delta]);

  const checkGameOverConditions = (stepCount: number) => {
    if ((data.initial?.maxMoves as number) - stepCount === 0) {
      setData((prevState) => ({
        ...prevState,
        game: {
          ...(prevState.game as IGameData),
          status: IGameStatus.Finished,
        },
      }));

      if (window.confirm("You lose. Do you want to play again?")) {
        restart();
      }
    }
  };

  const checkWinConditions = () => {
    if (delta < DELTA_WIN_CONDITION) {
      setData((prevState) => ({
        ...prevState,
        game: {
          ...(prevState.game as IGameData),
          status: IGameStatus.Finished,
        },
      }));

      if (window.confirm("You win. Do you want to play again?")) {
        restart();
      }
    }
  };

  const restart = () => {
    initGame(data.initial?.userId);
  };

  const setClosestColorAndDelta = () => {
    const { leastDelta, closestColor } = getClosestColorAndDelta();

    setData((prevState) => ({
      ...prevState,
      game: {
        ...(prevState.game as IGameData),
        closestColor,
      },
    }));

    setDelta(leastDelta);
  };

  const resetCellBorders = () => {
    setField((prevState) => {
      const updatedField = getFieldCopy(prevState);

      for (let y = 1; y <= (data.initial?.height as number); y++) {
        for (let x = 1; x <= (data.initial?.width as number); x++) {
          updatedField[y][x] = {
            ...updatedField[y][x],
            borderColor: DEFAULT_BORDER_COLOR,
          };
        }
      }

      return updatedField;
    });
  };

  const setClosestColorCellBorder = (cellId: string) => {
    setField((prevState) => {
      const x = getXFromCellId(cellId);
      const y = getYFromCellId(cellId);
      const updatedField = getFieldCopy(prevState);

      if (typeof updatedField[y]?.[x] !== "undefined") {
        updatedField[y][x] = {
          ...updatedField[y][x],
          borderColor: CLOSEST_COLOR_BORDER,
        };
      }

      return updatedField;
    });
  };

  const getClosestColorAndDelta = () => {
    let leastDelta = DEFAULT_DELTA;
    let closestColor = [0, 0, 0];
    const targetColor = data.initial?.target as number[];
    let cellColor;
    let currentDelta;

    for (let y = 1; y <= (data.initial?.height as number); y++) {
      for (let x = 1; x <= (data.initial?.width as number); x++) {
        cellColor = field[y][x].color;

        // Skip a cell if it is black
        if (cellColor[0] === 0 && cellColor[1] === 0 && cellColor[2] === 0) {
          continue;
        }

        currentDelta =
          (1 / 255 / Math.sqrt(3)) *
          Math.sqrt(
            Math.pow(targetColor[0] - cellColor[0], 2) +
              Math.pow(targetColor[1] - cellColor[1], 2) +
              Math.pow(targetColor[2] - cellColor[2], 2)
          ) *
          100;
        if (currentDelta < leastDelta) {
          setCellIdWithClosestColor(x + "," + y);

          leastDelta = currentDelta;
          closestColor = cellColor;
        }
      }
    }

    return { leastDelta, closestColor };
  };

  const initGame = (userId?: string) => {
    let url = INIT_URL;
    if (userId) {
      url = INIT_URL + "/user/" + userId;
    }

    axios.get<IFetchedData>(url).then(({ data }) => {
      setInitialGame(data);
      setInitialField(data);
      setClosestColorCellBorder(DEFAULT_CELL_ID_WITH_CLOSEST_COLOR);
    });
  };

  const setInitialGame = (initialData: IFetchedData) => {
    setData((prevState) => ({
      ...prevState,
      initial: initialData,
      game: {
        closestColor: [0, 0, 0],
        status: IGameStatus.Initial,
        stepCount: 0,
        nextColor: [255, 0, 0], //  red color to paint 1st Source
        isDnDEnabled: false,
      },
    }));
  };

  const setInitialField = (data: IFetchedData) => {
    setField(generateInitialField(data));
  };

  const handleSourceClick = (cellId: string) => {
    if (data.game?.status == IGameStatus.Initial) {
      initialGameProc(cellId);
    }
  };

  const handleCellDrop = (e: DragEvent, sourceCellId: string) => {
    const tileCellId = e.dataTransfer?.getData("id") as string;

    if (data.game?.status == IGameStatus.InGame) {
      draggingGameProc(tileCellId, sourceCellId);
    }
  };

  const setDnD = (isDnDEnabled: boolean) => {
    // Enable Drag & Drop
    setField((prevState) => {
      const updatedField = getFieldCopy(prevState);

      for (let y = 0; y <= (data.initial?.height as number) + 1; y++) {
        for (let x = 0; x <= (data.initial?.width as number) + 1; x++) {
          if (updatedField[y][x].type !== ICellType.Empty) {
            updatedField[y][x] = {
              ...updatedField[y][x],
              isDnDEnabled: isDnDEnabled,
            };
          }
        }
      }

      return updatedField;
    });
  };

  const disableDnD = () => {};

  const initialGameProc = (cellId: string) => {
    if (typeof data.game?.stepCount !== "undefined") {
      const stepCount = data.game.stepCount;

      paintSourceAndTilesLine(cellId, data.game?.nextColor);

      // Set a color for next step to paint a next Source by clicking to it
      switch (stepCount) {
        case 0:
          setData(
            (prevState): IData => ({
              ...prevState,
              game: {
                ...(prevState.game as IGameData),
                nextColor: [0, 255, 0], // green to 2nd Source
              },
            })
          );
          break;
        case 2:
        default:
          setData(
            (prevState): IData => ({
              ...prevState,
              game: {
                ...(prevState.game as IGameData),
                nextColor: [0, 0, 255], // blue to 3rd Source
              },
            })
          );
      }

      // Check whether a game status need to be changed
      if (stepCount === INITIAL_STEPS_NUMBER - 1) {
        setData((prevState) => ({
          ...prevState,
          game: {
            ...(prevState.game as IGameData),
            status: IGameStatus.InGame,
          },
        }));

        setDnD(true);
      }
      increaseStepCount(stepCount);
    }
  };

  const increaseStepCount = (stepCount: number) => {
    setData((prevState) => ({
      ...prevState,
      game: {
        ...(prevState.game as IGameData),
        stepCount: stepCount + 1,
      },
    }));
  };

  const paintSourceAndTilesLine = (cellId: string, cellColor: number[]) => {
    setField((prevState) => {
      const x = getXFromCellId(cellId);
      const y = getYFromCellId(cellId);
      const updatedField = getFieldCopy(prevState);

      updatedField[y][x] = {
        ...updatedField[y][x],
        color: cellColor,
      };

      return getFieldWithUpdatedTilesLine(data, cellId, updatedField);
    });
  };

  const draggingGameProc = (tileCellId: string, sourceCellId: string) => {
    if (typeof data.game?.stepCount !== "undefined") {
      const stepCount = data.game.stepCount;
      const tileColor = getCellColorById(field, tileCellId);

      paintSourceAndTilesLine(sourceCellId, tileColor);

      increaseStepCount(stepCount);

      checkGameOverConditions(stepCount + 1);
    }
  };

  return (
    <>
      <Header data={data} delta={delta} />
      <GridField
        data={data}
        field={field}
        onSourceClick={handleSourceClick}
        onCellDrop={handleCellDrop}
      />
      <ReactTooltip
        backgroundColor="#858585"
        textColor="#fff"
        place="bottom"
        type="light"
        effect="solid"
      />
    </>
  );
};

export default Game;