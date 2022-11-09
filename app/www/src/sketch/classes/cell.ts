import processing from "p5";

class Cell {
  private state: "hidden" | "flagged" | "revealed";
  private position: { x: number; y: number };

  constructor(x: number, y: number) {
    this.state = "hidden";
    this.position = { x, y };
  }

  reveal() {
    this.state = "revealed";
  }

  toggleFlag() {
    // You can't toggle if already revealed
    if (this.state == "revealed") return;

    if (this.state == "hidden") {
      this.state = "flagged";
      return;
    }

    if (this.state == "flagged") {
      this.state = "hidden";
      return;
    }
  }

  getState() {
    return this.state;
  }

  getPosition() {
    return this.position;
  }

  draw(p5: processing, s: number) {
    if (this.state == "hidden") p5.fill("white");
    if (this.state == "revealed") p5.fill("grey");
    if (this.state == "flagged") p5.fill("orange");
    p5.rect(0, 0, s);
  }
}

class Indicator extends Cell {
  private nearbyMineCount: number;

  constructor(x: number, y: number, nmc: number) {
    super(x, y);
    this.nearbyMineCount = nmc;
  }

  getNearbyMineCount() {
    return this.nearbyMineCount;
  }

  draw(p5: processing, s: number) {
    super.draw(p5, s);

    if (this.getState() == "revealed") {
      p5.fill("white");
      p5.textAlign("center");
      if (this.nearbyMineCount > 0)
        p5.text(`${this.nearbyMineCount}`, s / 2, (s / 3) * 2);
    }
  }
}

class Mine extends Cell {
  draw(p5: processing, s: number) {
    super.draw(p5, s);

    if (this.getState() == "revealed") {
      p5.fill("red");
      p5.circle(s / 2, s / 2, (s / 4) * 3);
    }
  }
}

export { Cell, Indicator, Mine };
