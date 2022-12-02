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
  startCount: number;
  currentCount: number = 0;

  private ctx: CanvasRenderingContext2D;
  private rects: Square[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.initRects();
    this.drawScore();
    this.startGame();
  }

  initRects() {
    let numOfRects = Math.floor(Math.random() * 15 + 7);
    this.startCount = numOfRects;

    for (let i = 0; i < numOfRects; i++) {
      let x = Math.floor(Math.random() * (this.height - blockSize));
      let y = Math.floor(Math.random() * (this.width - blockSize));
      let speed = Math.floor(Math.random() * 5 + 1);
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

  targetRectangle(e: any) {
    let domRect = this.canvas.nativeElement.getBoundingClientRect();

    let mx = e.clientX - domRect.left;
    let my = e.clientY - domRect.top;

    let toRemove: Square[] = [];
    let missed: boolean = false;

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
        alert('clicked in rect');
      } else {
        //missed
        missed = true;
      }
    });

    if (missed) {
      //speed up
      this.rects.forEach((rect) => {
        rect.speed += 1;
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
    this.drawSquares();
  }

  drawSquares() {
    //squares style
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = 'black';
    this.ctx.fillStyle = 'red';

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
