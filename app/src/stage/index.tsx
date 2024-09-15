import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

import { Board } from '../model/catan';
import { CatanTile, generateTilePosition } from './tile';

interface BoardComponentProps {
  board: Board;
  tileSize: number;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * BoardComponent renders the Catan board to the canvas.
 * 
 * @param props - The properties passed to the component.
 * @returns The rendered BoardComponent.
 */
const BoardComponent: React.FC<BoardComponentProps> = (props: BoardComponentProps) => {
  return (
    <>
      {Array.from(props.board.getTiles().entries()).map(([key, tile]) => {
        const position = tile.getPosition();
        const { x, y } = generateTilePosition(position.getQ(), position.getR(), props.tileSize);
        return (
          <CatanTile
            key={key}
            tile={tile}
            size={props.tileSize}
            x={x + props.canvasWidth / 2}
            y={y + props.canvasHeight / 2}
          />
        );
      })}
    </>
  );
};

interface CatanStageProps {
  board: Board;
  tileSize: number;
}

/**
 * CatanStage component renders the Catan board to the canvas, 
 * as well as other components such as players, roads, etc.
 * 
 * @param props - The properties passed to the component.
 * @returns The rendered CatanStage component.
 */
const CatanStage: React.FC<CatanStageProps> = (props: CatanStageProps) => {
  const width = 700;
  const height = 600;


  return (
    <Stage width={width} height={height}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#0077be"  // Ocean blue color
        />
      </Layer>
      <Layer>
        <BoardComponent board={props.board} tileSize={props.tileSize} canvasWidth={width} canvasHeight={height} />
      </Layer>
    </Stage>
  );
};

export default CatanStage;
