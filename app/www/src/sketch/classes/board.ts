import processing from "p5";
import { Cell, Indicator, Mine } from "./cell";

class Board {
  private width: number;
  private height: number;
  private widthSideLonger: boolean;
  private padding: number;

  private cellSize: number = -1;
  private cells: Array<Array<Cell>> = [];
  private mines: number;
  private state: "waiting" | "playing" | "lost" | "won";

  constructor(
    p5: processing,
    settings?: {
      startingMines?: number;
      width?: number;
      height?: number;
      padding?: number;
    }
  ) {
    // Setup attributes
    this.width = settings?.width ?? 20;
    this.height = settings?.height ?? 15;
    this.padding = settings?.padding ?? 20;
    this.widthSideLonger = this.width >= this.height ? true : false;

    this.cellSize =
      ((this.widthSideLonger ? p5.width : p5.height) - this.padding) /
      (this.widthSideLonger ? this.width : this.height);

    this.cells = [];
    this.reset();

    this.mines = settings?.startingMines ?? (this.width * this.height) / 10;
    this.state = "waiting";
  }

  setup(initialX: number, initialY: number) {
    // Create an array of possible places you could place a mine
    let mineOptions = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        mineOptions.push([x, y]);
      }
    }

    // Make sure we can't start by clicking on a mine
    mineOptions = mineOptions.filter(
      ([x, y]) =>
        (x < initialX - 1 || x > initialX + 1) &&
        (y < initialY - 1 || y > initialY + 1)
    );

    // Place Mines
    for (let m = 0; m < this.mines; m++) {
      let choiceIndex = Math.floor(Math.random() * mineOptions.length);
      let [x, y] = mineOptions[choiceIndex];

      this.cells[x][y] = new Mine(x, y);

      mineOptions.splice(choiceIndex, 1);
    }

    // Place Indicators
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let cell = this.cells[x][y];
        if (cell instanceof Mine) continue;

        let nearbyMines = 0;
        for (const neighbour of this.getNeighbours(
          cell.getPosition().x,
          cell.getPosition().y
        )) {
          if (neighbour instanceof Mine) nearbyMines++;
        }

        this.cells[x][y] = new Indicator(x, y, nearbyMines);
      }
    }
  }

  reset() {
    this.state = "waiting";
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y] = new Cell(x, y);
      }
    }
  }

  win() {
    this.state = "won";
    setTimeout(() => alert("You won!"), 10);
  }

  lose() {
    this.state = "lost";
    this.revealAll();
    setTimeout(() => alert("You lost!"), 10);
  }

  clickCell(p5: processing, x: number, y: number, b: "left" | "right") {
    if (this.state == "lost" || this.state == "won") return;

    let relativeX = p5.width / 2 - (this.cellSize * this.width) / 2;
    let relativeY = p5.height / 2 - (this.cellSize * this.height) / 2;
    let boardX = Math.floor((x - relativeX) / this.cellSize);
    let boardY = Math.floor((y - relativeY) / this.cellSize);

    if (
      boardX < 0 ||
      boardX >= this.width ||
      boardY < 0 ||
      boardY >= this.height
    ) {
      return;
    }

    {
      let cell = this.cells[boardX][boardY];

      if (b == "left") {
        if (this.state == "waiting") {
          this.setup(boardX, boardY);
          this.state = "playing";
          cell = this.cells[boardX][boardY];
        }

        if (cell.getState() == "flagged" || cell.getState() == "revealed")
          return;

        this.reveal(boardX, boardY);
      }

      if (b == "right") {
        if (this.state == "waiting") return;

        cell.toggleFlag();
      }
    }

    for (const row of this.cells) {
      for (const cell of row) {
        // If an indicator is incorrectly flagged or not revealed, guard win
        if (cell instanceof Indicator && cell.getState() == "flagged") return;
        if (cell instanceof Indicator && cell.getState() == "hidden") return;

        // If a mine is not flagged, guard win
        if (cell instanceof Mine && cell.getState() == "hidden") return;

        // If a mine is revealed, guard win and set board to lose state
        if (cell instanceof Mine && cell.getState() == "revealed") {
          this.lose();
          return;
        }
      }
    }
    // If all checks passed successfully, then set board to win state
    this.win();
  }

  getNeighbours(x: number, y: number) {
    let neighbours: Array<Cell> = [];

    for (let rX = -1; rX <= 1; rX++) {
      for (let rY = -1; rY <= 1; rY++) {
        let cell = this.cells[x + rX]?.[y + rY];
        if (cell) neighbours.push(cell);
      }
    }

    return neighbours;
  }

  reveal(x: number, y: number) {
    let cell = this.cells[x][y];
    cell.reveal();
    if (cell instanceof Indicator && cell.getNearbyMineCount() == 0) {
      for (const neighbour of this.getNeighbours(x, y)) {
        if (
          neighbour instanceof Indicator &&
          neighbour.getNearbyMineCount() == 0 &&
          neighbour.getState() == "hidden"
        ) {
          let pos = neighbour.getPosition();
          setTimeout(() => {
            this.reveal(pos.x, pos.y);
          }, 10);
        }
        if (!(neighbour instanceof Mine)) neighbour.reveal();
      }
    }
  }

  revealAll() {
    for (const row of this.cells) {
      for (const cell of row) {
        cell.reveal();
      }
    }
  }

  draw(p5: processing) {
    p5.push();
    p5.translate(
      p5.width / 2 - (this.cellSize * this.width) / 2,
      p5.height / 2 - (this.cellSize * this.height) / 2
    );

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let cell = this.cells[x][y];

        p5.push();
        p5.translate(this.cellSize * x, this.cellSize * y);
        cell.draw(p5, this.cellSize);
        p5.pop();
      }
    }
    p5.pop();
  }
}

export { Board };
