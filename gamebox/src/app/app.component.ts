import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Box, Color } from './box.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ],
})
export class AppComponent implements OnInit {
  round: number = 1;
  previouslySelectedBox: Box = null;
  boxes: Box[] = []

  whiteSelectionCount: number = 0;
  redSelectionCount: number = 0;

  constructor(private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.reset();
  }

  clicked(box: Box): void {
    if (this.hasReachedSentinel()) {
      this.evaluateGame(box);
      return;
    }

    switch (box.color) {
      case Color.WHITE:
          this.handleWhiteBoxClicked();
        break;
      case Color.RED:
          this.handleRedBoxClicked();
        break;
      case Color.BLACK:
          this.handleBlackBoxClicked();
        break;
      case Color.ORANGE:
          this.handleOrangeBoxClicked();
        break;
      case Color.GREEN:
          this.handleGreenBoxClicked();
        break;
    }

    this.previouslySelectedBox = box;
    this.round += 1;
  }

  private evaluateGame(box: Box): void {
    if (this.previouslySelectedBox.color === box.color) {
      this.win();
    } else {
      this.lose();
    }
  }

  private lose(): void {
    this.snackbar.open('You lose!', 'Again.').onAction().subscribe(() => this.reset());
  }

  private win(): void {
    this.snackbar.open('You win!', 'Again.').onAction().subscribe(() => this.reset());
  }

  private handleWhiteBoxClicked(): void {
    if (this.whiteSelectionCount === 0) {
      this.boxes = [new Box(Color.WHITE), new Box(Color.ORANGE)];
    } else {
      this.redSelectionCount++;
      this.boxes = [new Box(Color.BLACK), new Box(Color.RED)];
    }

    this.whiteSelectionCount++;
  }

  private handleRedBoxClicked(): void {
    this.redSelectionCount = ++this.redSelectionCount;
    if (this.redSelectionCount > 1) {
      this.lose();
    } else {
      this.boxes = [new Box(Color.BLACK), new Box(Color.RED)];
    }
  }

  private handleBlackBoxClicked(): void {1
    this.boxes = [new Box(Color.GREEN), new Box(Color.ORANGE), new Box(Color.BLACK)];
  }

  private handleOrangeBoxClicked(): void {
    if (this.shouldRemoveBlackBox()) {
      this.removeBlackBox();
    } else {
      this.boxes = [new Box(Color.GREEN), new Box(Color.ORANGE), new Box(Color.BLACK)];
    } 
  }

  private handleGreenBoxClicked(): void {
    if (this.shouldRemoveBlackBox()) {
      this.removeBlackBox();
    }
  }

  private shouldRemoveBlackBox(): boolean {
    return this.hasGreenBox() &&  this.hasOrangeBox() && this.hasBlackBox();
  }

  // The sentinel case is when the orange and green boxes 
  // are only the ones remaining option.
  private hasReachedSentinel(): boolean {
    return this.boxes.length === 2 && this.hasGreenBox() && this.hasOrangeBox();
  }
  
  private removeBlackBox(): void {
    this.boxes =  this.boxes.filter((box: Box) => {
      return box.color !== Color.BLACK;
    });
  }

  private hasGreenBox(): boolean {
    return this.boxes.findIndex((box: Box) => {
      return Color.GREEN === box.color;
    }) > -1;
  }

  private hasOrangeBox(): boolean {
    return this.boxes.findIndex((box: Box) => {
      return Color.ORANGE === box.color;
    }) > -1;
  }

  private hasBlackBox(): boolean {
    return this.boxes.findIndex((box: Box) => {
      return Color.BLACK === box.color;
    }) > -1;
  }

  private reset(): void {
    this.boxes = [new Box(Color.WHITE),new Box(Color.RED)];
    this.previouslySelectedBox = null;
    this.redSelectionCount = 0;
    this.whiteSelectionCount = 0;
    this.round = 1;
  }
}
