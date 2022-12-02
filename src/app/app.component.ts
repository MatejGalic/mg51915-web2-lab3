import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

export const blockSize = 40;
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
  startCount: number;
  currentCount: number = 0;

  private ctx: CanvasRenderingContext2D;
  private rects: Square[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.initRects();
    this.startGame();
  }

  initRects() {
    let numOfRects = Math.floor(Math.random() * 15 + 7);
    this.startCount = numOfRects;

    for (let i = 0; i < numOfRects; i++) {
      let x = Math.floor(Math.random() * (this.height - blockSize));
      let y = Math.floor(Math.random() * (this.width - blockSize));
      let speed = Math.floor(Math.random() * 2 + 1);
      let sqr = new Square(x, y, speed, this.ctx);
      this.rects.push(sqr);
    }
    this.canvas.nativeElement.onmousedown = this.targetRectangle.bind(this);
  }

  drawScore() {
    //scoreboard style
    this.ctx.fillStyle = 'black';
    this.ctx.font = '16px Georgia';
    this.ctx.textAlign = 'end';
    this.ctx.fillText(
      `${this.currentCount}/${this.startCount}`,
      this.width - 5,
      16
    );
  }

  setStylesForSquares() {
    //squares style
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = 'black';
    this.ctx.fillStyle = 'red';
  }

  targetRectangle(e: any) {
    let domRect = this.canvas.nativeElement.getBoundingClientRect();

    let mx = e.clientX - domRect.left;
    let my = e.clientY - domRect.top;

    let toRemove: Square[] = [];
    let missed: boolean = true;

    this.rects.forEach((rect) => {
      if (
        mx >= rect.x &&
        mx <= rect.x + blockSize &&
        my >= rect.y &&
        my <= rect.y + blockSize
      ) {
        //to remove square
        toRemove.push(rect);
        this.currentCount += 1;
        missed = false;
      }
    });

    if (missed) {
      //speed up on miss
      this.rects.forEach((rect) => {
        rect.speed += 0.35;
      });
    } else {
      //remove squares from array
      toRemove.forEach((rect) => {
        let index = this.rects.indexOf(rect, 0);
        if (index > -1) {
          this.rects.splice(index, 1);
        }
      });
    }
  }

  startGame() {
    // this.drawSquares();
    window.requestAnimationFrame(this.nextFrame.bind(this));
  }

  nextFrame() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.setStylesForSquares();
    this.rects.forEach((rect) => {
      //draw squares and update position
      rect.update();
    });
    this.drawScore();
    window.requestAnimationFrame(this.nextFrame.bind(this));
  }
}
export class Square {
  private dx = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
  private dy = Math.floor(Math.random() * 2) == 0 ? -1 : 1;

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
    //change speed on bounce
    if (
      (this.x >= this.ctx.canvas.width - blockSize && this.dx == 1) ||
      (this.x <= 0 && this.dx == -1)
    ) {
      this.dx *= -1;
      this.speed = Math.max(this.speed + Math.random() * 2 - 1, 0.5);
    }
    if (
      (this.y >= this.ctx.canvas.height - blockSize && this.dy == 1) ||
      (this.y <= 0 && this.dy == -1)
    ) {
      this.dy *= -1;
      this.speed = Math.max(this.speed + Math.random() * 2 - 1, 0.5);
    }

    //move
    this.x += this.speed * this.dx;
    this.y += this.speed * this.dy;
  }
}
