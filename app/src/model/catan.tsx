import { GridPosition, EdgePosition, VertexPosition } from './position';

/**
 * Board class represents the board of the game.
 * It contains the tiles, settlements, and roads.
 */
export class Board {
  private tiles: Map<string, Tile>;
  private settlements: Map<string, Settlement>;
  private roads: Map<string, Road>;
  private players: Player[];
  private robberPosition: GridPosition | undefined;

  private static readonly RESOURCE_TILE_AMOUNTS = {
    'forest': 4,
    'hills': 3,
    'field': 4,
    'pasture': 4,
    'mountain': 3,
    'desert': 1,
  };
  private static readonly NUMBER_TOKEN_AMOUNTS = {
    2: 1,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 2,
    12: 1,
  };
  private static readonly SPIRAL_ORDER = [
    5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11
  ];

  constructor() {
    this.tiles = new Map();
    this.settlements = new Map();
    this.roads = new Map();
    this.players = [];
    this.robberPosition = undefined;
  }

  /**
   * generateRandomBoard function generates a random board based on a standard 4 player Catan board.
   */
  public static generateRandomBoard(method: 'spiral' | 'random' = 'spiral'): Board {
    const board = new Board();

    let tileBank = { ...Board.RESOURCE_TILE_AMOUNTS };

    // Generate tiles
    for (let q = -2; q <= 2; q++) {
      for (let r = -2; r <= 2; r++) {
        if (Math.abs(new GridPosition(q, r).getS()) > 2) continue;

        let availableResources = Object.entries(tileBank).filter(([_, count]) => count > 0);
        let resource: Resource = 'none';
        if (availableResources.length > 0) {
          const [selectedResource, selectedResourceCount] = availableResources[Math.floor(Math.random() * availableResources.length)];
          tileBank[selectedResource as keyof typeof tileBank] = selectedResourceCount - 1;
          resource = selectedResource as Resource;
        }

        const tile = new Tile(resource, 0, q, r);
        board.addTile(tile);
      }
    }

    // Generate number tokens using spiral algorithm
    board.generateNumberTokens(method);
    return board;
  }

  public generateNumberTokens(method: 'spiral' | 'random' = 'spiral'): Board {
    if (method === 'spiral') {
      let numberIndex = 0;
      const spiralPositions = [
        [0, -2], [1, -2], [2, -2], [2, -1], [2, 0], [1, 1], [0, 2], [-1, 2], [-2, 2], [-2, 1], [-2, 0], [-1, -1], 
        [0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, 0]
      ];

      for (const [q, r] of spiralPositions) {
        const tile = this.getTile(new GridPosition(q, r));
        if (tile && tile.getResource() !== 'desert') {
          tile.setNumber(Board.SPIRAL_ORDER[numberIndex]);
          numberIndex++;
        }
      }
    } else {
      let numberBank = { ...Board.NUMBER_TOKEN_AMOUNTS };

      for (const tile of Array.from(this.tiles.values())) {
        if (tile.getResource() === 'desert') continue;
        
        let availableNumberEntries = Object.entries(numberBank).filter(([_, count]) => count > 0);
        
        if (availableNumberEntries.length > 0) {
          const [selectedNumber, selectedNumberCount] = availableNumberEntries[Math.floor(Math.random() * availableNumberEntries.length)];
          
          // Assign the number to the tile
          tile.setNumber(parseInt(selectedNumber));
          
          // Decrease the count for the assigned number
          numberBank[parseInt(selectedNumber) as keyof typeof numberBank] = selectedNumberCount - 1;
        }
      }
    }
    return this;
  }

  /**
   * rotateBoard function rotates the board around a pivot point by a specified number of rotations.
   * 
   * @param pivot - The pivot point around which to rotate.
   * @param rotations - The number of 60-degree rotations to perform.
   * @returns The rotated board.
   */
  public rotateBoard(pivot: GridPosition, rotations: number): Board {
    for (const tile of Array.from(this.tiles.values())) {
      const newPosition = tile.getPosition().rotate(pivot, rotations);
      tile.setPosition(newPosition);
      this.tiles.set(this.getKey(newPosition), tile);
    }
    return this;
  }

  /**
   * getKey function returns a string key for the given position.
   * It checks the type of the position and returns the appropriate key.
   * 
   * @param position - The position to get the key for.
   * @returns The key for the given position.
   */
  private getKey(position: GridPosition | EdgePosition | VertexPosition): string {
    if ('getE' in position) {
      // EdgePosition
      return `${position.getQ()},${position.getR()},${position.getE()}`;
    } else if ('getV' in position) {
      // VertexPosition
      return `${position.getQ()},${position.getR()},${position.getV()}`;
    } else {
      // GridPosition
      return `${position.getQ()},${position.getR()}`;
    }
  }

  /**
   * addTile function adds a tile to the board.
   * It first gets the key for the tile's position and then adds the tile to the tiles map.
   * 
   * This overrides any tile that was already at that position.
   * 
   * @param tile - The tile to add to the board.
   */
  public addTile(tile: Tile): void {
    const key = this.getKey(tile.getPosition());
    this.tiles.set(key, tile);
  }

  /**
   * getTile function returns the tile at the given position.
   * It first gets the key for the position and then returns the tile from the tiles map.
   * 
   * @param position - The position to get the tile for.
   * @returns The tile at the given position, or undefined if not found.
   */
  public getTile(position: GridPosition): Tile | undefined {
    const key = this.getKey(position);
    return this.tiles.get(key);
  }

  /**
   * getTiles function returns all tiles on the board.
   * 
   * @returns The tiles on the board.
   */
  public getTiles(): Map<string, Tile> {
    return this.tiles;
  }

  /**
   * addPlayer function adds a player to the game.
   * It simply adds the player to the players array.
   * 
   * @param player - The player to add to the game.
   */
  public addPlayer(player: Player): void {
    this.players.push(player);
  } 

  /**
   * getPlayers function returns the players in the game.
   * 
   * @returns The players in the game.
   */
  public getPlayers(): Player[] {
    return this.players;
  }

  /**
   * copy function returns a deep copy of the board.
   * 
   * @returns A deep copy of the board.
   */
  public copy(): Board {
    const newBoard = new Board();
    for (const tile of Array.from(this.tiles.values())) {
      newBoard.addTile(tile.copy());
    }
    return newBoard;
  }
}

/**
 * Tile class represents a tile on the board.
 * It contains the resource, number, and position of the tile.
 * 
 * Tiles are hexagonal pointed upwards, 
 * and each tile "owns" 3 edges (top left 0, top right 1, center right 2) 
 * and 2 vertices (top center 0, top right 1).
 */
export class Tile {
    private resource: Resource;
    private number: number;
    private position: GridPosition;

    constructor(resource: Resource, number: number, q: number, r: number) {
        this.resource = resource;
        this.number = number;
        this.position = new GridPosition(q, r);
    }

    /**
     * getResource function returns the resource of the tile.
     * 
     * @returns The resource of the tile.
     */
    public getResource(): Resource {
        return this.resource;
    }

    /**
     * getNumber function returns the number of the tile.
     * 
     * @returns The number of the tile.
     */
    public getNumber(): number {
        return this.number;
    }

    /**
     * getPosition function returns the position of the tile.
     * 
     * @returns The position of the tile.
     */
    public getPosition(): GridPosition {
        return this.position;
    }

    /**
     * setNumber function sets the number of the tile.
     * 
     * @param number - The number to set for the tile.
     */
    public setNumber(number: number): void {
        this.number = number;
    }

    public setPosition(position: GridPosition): void {
        this.position = position;
    }

    public copy(): Tile {
        return new Tile(this.resource, this.number, this.position.getQ(), this.position.getR());
    }
}

/**
 * Resource enum represents the resources that can be found on the tiles.
 */
export type Resource = 'forest' | 'hills' | 'field' | 'pasture' | 'mountain' | 'desert' | 'none';

/**
 * Settlement class represents a settlement on the board.
 * It contains the position and type of the settlement.
 */
export class Settlement {
    private position: VertexPosition;
    private type: 'city' | 'settlement';

    constructor(position: VertexPosition, type: 'city' | 'settlement') {
        this.position = position;
        this.type = type;
    }

    /**
     * getType function returns the type of the settlement.
     * 
     * @returns The type of the settlement.
     */
    public getType(): 'city' | 'settlement' {
        return this.type;
    }

    /**
     * upgrade function upgrades the settlement to a city.
     * It changes the type of the settlement to 'city'.
     */
    public upgrade(): void {
        if (this.type === 'settlement') {
            this.type = 'city';
        }
    }
}

/**
 * Road class represents a road on the board.
 * It contains the position and type of the road.
 */
export class Road {
    private position: EdgePosition;
    private owner: Player;

    constructor(position: EdgePosition, owner: Player) {
        this.position = position;
        this.owner = owner;
    }

    /**
     * getPosition function returns the position of the road.
     * 
     * @returns The position of the road.
     */
    public getPosition(): EdgePosition {    
        return this.position;
    }

    /**
     * getOwner function returns the owner of the road.
     * 
     * @returns The owner of the road.
     */
    public getOwner(): Player {
        return this.owner;
    }
}

/**
 * Player class represents a player in the game.
 * It contains the name of the player.
 */
export class Player {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * getName function returns the name of the player.
     * 
     * @returns The name of the player.
     */
    public getName(): string {  
        return this.name;
    }
}