import React from 'react';
import { Circle, RegularPolygon, Text } from 'react-konva';
import { Tile, Resource } from '../model/catan';

interface NumberTokenProps {
  number: number;
  size: number;
  x: number;
  y: number;
}

/**
 * NumberToken component renders the number token on the tile.
 * 
 * @param props - The properties passed to the component.
 * @returns The rendered NumberToken component.
 */
const NumberToken: React.FC<NumberTokenProps> = (props: NumberTokenProps) => {
  return (
    <>
      <Circle
        x={props.x}
        y={props.y}
        radius={props.size / 3}
        fill="#F5F5DC"
        stroke="black"
        strokeWidth={1}
        shadowColor="rgba(0,0,0,0.5)"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
      />
      <Text
        x={props.x}
        y={props.y}
        text={props.number.toString()}
        fontSize={props.size / 3}
        fontStyle="bold"
        fontFamily="serif"
        align="center"
        verticalAlign="middle"
        width={props.size / 2}
        height={props.size / 2}
        offsetX={props.size / 4}
        offsetY={props.size / 4}
        fill={props.number === 6 || props.number === 8 ? 'red' : 'black'}
        shadowColor="rgba(0,0,0,0.5)"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
      />
    {Array.from({ length: 6 - Math.abs(7 - props.number) }).map((_, index) => (
      <Circle
        key={index}
        x={props.x + (index - (5 - Math.abs(7 - props.number)) / 2) * (props.size / 15)}
        y={props.y + props.size / 5}
        radius={props.size / 40}
        fill={props.number === 6 || props.number === 8 ? 'red' : 'black'}
      />
    ))}
    </>
  );
};

interface CatanTileProps {
  tile: Tile;
  size: number;
  x: number;
  y: number;
}

/**
 * CatanTile component renders the tile on the canvas.
 * 
 * @param props - The properties passed to the component.
 * @returns The rendered CatanTile component.
 */
export const CatanTile: React.FC<CatanTileProps> = (props: CatanTileProps) => {
  const resourceColors: Record<Resource, string> = {
    forest: '#228B22',
    hills: '#8B4513',
    field: '#FFD700',
    pasture: '#32CD32',
    mountain: '#A9A9A9',
    desert: '#F4A460',
    none: '#FFFFFF'
  };

  return (
    <>
      <RegularPolygon
        x={props.x}
        y={props.y}
        sides={6}
        radius={props.size}
        fill={resourceColors[props.tile.getResource()]}
        stroke="black"
        strokeWidth={2}
      />
      {props.tile.getResource() !== "desert" && (
        <NumberToken
          number={props.tile.getNumber()}
          size={props.size}
          x={props.x}
          y={props.y}
        />
      )}
    </>
  );
};

/**
 * generateTilePosition function generates the position of a tile to draw to the canvas 
 * based on its q and r coordinates.
 * 
 * @param q - The q coordinate of the tile.
 * @param r - The r coordinate of the tile.
 * @param size - The size of the tile.
 * @returns The position of the tile.
 */
export const generateTilePosition = (q: number, r: number, size: number): { x: number, y: number } => {
  const width = Math.sqrt(3) * size;
  const height = 2 * size;
  const x = width * (q + r/2);
  const y = height * (3/4) * r;
  return { x, y };
};