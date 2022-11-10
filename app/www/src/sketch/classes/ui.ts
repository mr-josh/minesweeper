import processing from "p5";

class UI {}

class UIRect extends UI {
  private width: number;
  private height: number;
  private position: { x: number; y: number };

  constructor(x: number, y: number, w: number, h: number) {
    super();
    this.width = w;
    this.height = h;
    this.position = { x, y };
  }

  move(pos: {x?: number, y?: number}) {
    this.position = {
      x: pos.x ?? this.position.x,
      y: pos.y ?? this.position.y
    };
  }

  resize(size: {w?: number, h?: number}) {
    this.width = size.w ?? this.width;
    this.height = size.h ?? this.height;
  }

  handleClick(p5: processing, handler: () => void | Promise<void>) {
    if (
      p5.mouseX > this.position.x &&
      p5.mouseX < this.position.x + this.width &&
      p5.mouseY > this.position.y &&
      p5.mouseY < this.position.y + this.height
    ) {
      handler();
      return true;
    }

    return false;
  }

  draw(p5: processing) {
    p5.rect(this.position.x, this.position.y, this.width, this.height);
  }
}

export { UIRect };
