import processing from "p5";
import { Board } from "./classes/board";
import { UIRect } from "./classes/ui";

import { window as tw } from "@tauri-apps/api";

const Sketch = (p5: processing) => {
  let board: Board;
  let titleBar: UIRect;
  let closeButton: UIRect;

  // This is the same as our `function setup() { ... }`
  p5.setup = () => {
    p5.createCanvas(
      document.querySelector("#sketch")!.clientWidth,
      document.querySelector("#sketch")!.clientHeight
    );
    board = new Board(p5, {titleBarSize: 30});
    titleBar = new UIRect(0, 0, p5.width, 30);
    closeButton = new UIRect(p5.width - 20 - 5, 5, 20, 20);
  };

  // This is the same as our `function draw() { ... }`
  p5.draw = () => {
    p5.background(200);
    board.draw(p5);

    // UI
    p5.fill("white");
    titleBar.draw(p5);
    p5.textAlign("center");
    p5.fill("black");
    p5.text("Minesweeper", p5.width / 2, 20);
    p5.fill("red");
    closeButton.draw(p5);
  };

  p5.windowResized = () => {
    p5.resizeCanvas(
      document.querySelector("#sketch")!.clientWidth,
      document.querySelector("#sketch")!.clientHeight
    );
    board.resize(p5);
    titleBar.resize({ w: p5.width });
    closeButton.move({ x: p5.width - 20 - 5 });
  };

  // This is the same as our `function mousePressed() { ... }`
  p5.mousePressed = (ev: MouseEvent) => {
    // UI
    if (
      closeButton.handleClick(p5, async () => {
        await tw.appWindow.close();
      })
    )
      return;

    if (
      titleBar.handleClick(p5, async () => {
        await tw.appWindow.startDragging();
      })
    )
      return;

    // Game
    board.clickCell(
      p5,
      p5.mouseX,
      p5.mouseY,
      ev.button == 0 ? "left" : "right"
    );
  };

  p5.keyPressed = (ev: KeyboardEvent) => {
    if (ev.key == "r") board.reset();
  };
};

export default Sketch;
