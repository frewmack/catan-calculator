import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import './App.css';
import CatanStage from './stage';
import { Board } from './model/catan';

function App() {
  const board = Board.generateRandomBoard();
  const tileSize = 72;

  return (  
    <ChakraProvider>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CatanStage board={board} tileSize={tileSize} />
      </Box>
    </ChakraProvider>
  );
}

export default App;
