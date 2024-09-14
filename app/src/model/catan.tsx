import { GridPosition, EdgePosition, VertexPosition } from './position';

/**
 * Board class represents the board of the game.
 * It contains the tiles, settlements, and roads.
 */
class Board {
  private tiles: Map<string, Tile>;
  private settlements: Map<string, Settlement>;
  private roads: Map<string, Road>;
  private players: Player[];

  constructor() {
    this.tiles = new Map();
    this.settlements = new Map();
    this.roads = new Map();
    this.players = [];
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
}

/**
 * Tile class represents a tile on the board.
 * It contains the resource, number, and position of the tile.
 * 
 * Tiles are hexagonal pointed upwards, 
 * and each tile "owns" 3 edges (top left 0, top right 1, center right 2) 
 * and 2 vertices (top center 0, top right 1).
 */
class Tile {
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
}

/**
 * Resource enum represents the resources that can be found on the tiles.
 */
type Resource = 'forest' | 'hills' | 'field' | 'pasture' | 'mountain' | 'desert' | 'none';

/**
 * Settlement class represents a settlement on the board.
 * It contains the position and type of the settlement.
 */
class Settlement {
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
class Road {
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
class Player {
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