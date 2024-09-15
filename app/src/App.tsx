import React, { useState } from 'react';
import { ChakraProvider, Grid, GridItem, Button } from '@chakra-ui/react';
import './App.css';
import CatanStage from './stage';
import { Board } from './model/catan';
import { GridPosition } from './model/position';

function App() {
  const [board, setBoard] = useState(Board.generateRandomBoard());
  const tileSize = 60;

  const rotateBoard = (board: Board, pivot: GridPosition, rotations: number) => {
    const newBoard = board.copy();
    newBoard.rotateBoard(pivot, rotations);
    setBoard(newBoard);
  };

  return (  
    <ChakraProvider>
      <Grid
        templateAreas={`"left main right"
                        "left bottom right"`}
        gridTemplateRows={'1fr auto'}
        gridTemplateColumns={'1fr 3fr 1fr'}
        h='100vh'
        gap='1'
        fontWeight='bold'
        backgroundColor="#0077be"
      >
        <GridItem pl='2' area={'left'} bg='blue.500'>
          {/* Left menu content */}
        </GridItem>
        <GridItem pl='2' area={'main'} bg="#0077be">
          {/* Top-center content */}
          <CatanStage board={board} tileSize={tileSize} />
        </GridItem>
        <GridItem pl='2' area={'right'} bg='blue.500'>
          {/* Right menu content */}
        </GridItem>
        <GridItem pl='2' area={'bottom'} bg='blue.500'>
          {/* Bottom-center content */}
          <Button onClick={() => setBoard(Board.generateRandomBoard())}>Generate Random Board</Button>
          <Button onClick={() => rotateBoard(board, new GridPosition(0, 0), 1)}>Rotate Left</Button>
          <Button onClick={() => rotateBoard(board, new GridPosition(0, 0), -1)}>Rotate Right</Button>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
