import processing from "p5";
import { Board } from "./classes/board";

const Sketch = (p5: processing) => {
  let board: Board;

  // This is the same as our `function setup() { ... }`
  p5.setup = () => {
    p5.createCanvas(600, 600);
    board = new Board(p5);
  };

  // This is the same as our `function draw() { ... }`
  p5.draw = () => {
    p5.background(200);
    board.draw(p5);
  };

  // This is the same as our `function mousePressed() { ... }`
  p5.mousePressed = (ev: MouseEvent) => {
    board.clickCell(
      p5,
      p5.mouseX,
      p5.mouseY,
      ev.button == 0 ? "left" : "right"
    );
  };

  p5.keyPressed = (ev: KeyboardEvent) => {
    if (ev.key == "r") board.reset();
  }
};

export default Sketch;
