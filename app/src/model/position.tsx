/**
 * GridPosition class represents a position on the board using an axial coordinate system for a hexagonal grid.
 * It contains the q and r coordinates.
 * 
 * In this system:
 * - q represents the column (increases from left to right)
 * - r represents the diagonal (increases from top-left to bottom-right)
 * 
 * For example, in a small hexagonal grid:
 * (0,0) would be the center,
 * (1,0) would be one hex to the right,
 * (0,1) would be one hex down and to the left.
 */
export class GridPosition {
  private q: number;
  private r: number;

  constructor(q: number, r: number) {
      this.q = q;
      this.r = r;
  }

  public getQ(): number {
      return this.q;
  }

  public getR(): number {
      return this.r;
  }

  public getS(): number {
      return -this.q - this.r;
  }

  /**
   * Checks if this GridPosition is equal to another GridPosition.
   * Two GridPositions are considered equal if they have the same q and r coordinates.
   * 
   * @param other - The other GridPosition to compare with.
   * @returns True if the positions are equal, false otherwise.
   */
  public equals(other: GridPosition): boolean {
    return this.q === other.getQ() && this.r === other.getR();
  }

  /**
   * Returns an array of GridPositions representing the six neighboring tiles.
   * The neighbors are returned in clockwise order starting from the top-right.
   * 
   * @returns An array of six GridPosition objects representing the neighboring tiles.
   */
  public getNeighbors(): GridPosition[] {
    const directions = [
      [1, 0], [1, -1], [0, -1],
      [-1, 0], [-1, 1], [0, 1]
    ];
    
    return directions.map(([dq, dr]) => 
      new GridPosition(this.q + dq, this.r + dr)
    );
  }

  /**
   * Rotates this GridPosition around a pivot point by a specified number of rotations.
   * A positive rotation is clockwise, and a negative rotation is counterclockwise.
   * One rotation is equivalent to 60 degrees.
   * 
   * @param pivot - The GridPosition to rotate around.
   * @param rotations - The number of 60-degree rotations to perform.
   * @returns A new GridPosition after the rotation.
   */
  public rotate(pivot: GridPosition, rotations: number): GridPosition {
    // Normalize rotations to be between 0 and 5
    const normalizedRotations = ((rotations % 6) + 6) % 6;

    // If no rotation, return a copy of this position
    if (normalizedRotations === 0) {
      return new GridPosition(this.q, this.r);
    }

    // Translate to origin
    let q = this.q - pivot.getQ();
    let r = this.r - pivot.getR();
    let s = this.getS() - pivot.getS();

    // Perform rotation
    for (let i = 0; i < normalizedRotations; i++) {
      const temp = -s;
      s = -r;
      r = -q;
      q = temp;
    }

    // Translate back and return new position
    return new GridPosition(q + pivot.getQ(), r + pivot.getR());
  }
}

/**
 * EdgePosition class represents a position on the edge of a tile.
 * It contains the q, r, and e coordinates.
 * 
 * Edge positions are relative to a tile, 
 * and each tile has 3 edges (top left 0, top right 1, center right 2).
 */
export class EdgePosition extends GridPosition {
  private e: number;

  constructor(q: number, r: number, e: number) {
      super(q, r);
      this.e = e;
  }

  public getE(): number {
      return this.e;
  }
}

/**
 * VertexPosition class represents a position on the vertex of a tile.
 * It contains the q, r, and v coordinates.
 * 
 * Vertex positions are relative to a tile, 
 * and each tile has 3 vertices (top center 0, top right 1, center right 2).
 */
export class VertexPosition extends GridPosition {
  private v: number;

  constructor(q: number, r: number, v: number) {
      super(q, r);
      this.v = v;
  }

  public getV(): number {
      return this.v;
  }
}
