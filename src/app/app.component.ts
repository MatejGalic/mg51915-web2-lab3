import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

export const blockSize = 20;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  height = 500;
  width = 500;

  private ctx: CanvasRenderingContext2D;
  private rects: Square[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.setupContext();
    this.initRects();
    this.startGame();
  }

  setupContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = 'black';
    this.ctx.fillStyle = 'red';
  }

  initRects() {
    let numOfRects = Math.floor(Math.random() * 10 + 7);

    for (let i = 0; i < numOfRects; i++) {
      let x = Math.floor(Math.random() * (this.height - blockSize));
      let y = Math.floor(Math.random() * (this.width - blockSize));
      let speed = Math.floor(Math.random() * 5 + 1);
      let sqr = new Square(x, y, speed, this.ctx);
      this.rects.push(sqr);
    }
    this.canvas.nativeElement.onmousedown = this.targetRectangle.bind(this);
  }

  targetRectangle(e: any) {
    let domRect = this.canvas.nativeElement.getBoundingClientRect();

    let mx = e.clientX - domRect.left;
    let my = e.clientY - domRect.top;

    let toRemove: Square[] = [];

    this.rects.forEach((rect) => {
      if (
        mx >= rect.x &&
        mx <= rect.x + blockSize &&
        my >= rect.y &&
        my <= rect.y + blockSize
      ) {
        //to remove square
        toRemove.push(rect);
        alert('clicked in rect');
      } else {
        //speed up
      }
    });

    //remove squares from array
    toRemove.forEach((rect) => {
      let index = this.rects.indexOf(rect, 0);
      if (index > -1) {
        this.rects.splice(index, 1);
      }
    });
  }

  startGame() {
    this.rects.forEach((element) => {
      element.draw();
    });
  }
}
export class Square {
  private dx = 1;
  private dy = 1;

  constructor(
    public x: number,
    public y: number,
    public speed: number,
    private ctx: CanvasRenderingContext2D
  ) {}

  draw() {
    this.ctx.fillRect(this.x, this.y, blockSize, blockSize);
  }

  update() {
    this.draw();
    //handle orientation

    this.x += this.speed * this.dx;
    this.x += this.speed * this.dy;
  }
}
