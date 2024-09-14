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
