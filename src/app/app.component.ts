import {Component, OnInit} from '@angular/core';
import {Doable} from './interfaces/doable';
import {FormControl} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

const ItemStorageKey = 'items';
const DenseStorageKey = 'dense';
const Commands = {
  clean: '/clean',
  dense: '/dense'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public readonly commands = Commands;
  public doableTextForm = new FormControl('');
  public items: Doable[] = [];
  public dense: boolean;
  public actionsActive = false;

  public ngOnInit(): void {
    const savedItems = localStorage.getItem(ItemStorageKey);
    const savedDense = localStorage.getItem(DenseStorageKey);
    this.dense = savedDense ? savedDense === 'true' : false;
    if (savedItems) {
      this.items = JSON.parse(savedItems);
      this.items = this.items.filter((item) => item.text.length > 0);
    }
  }

  public onCommand(): void {
    if (this.doableTextForm.value.length === 0) {
      return;
    }
    switch (this.doableTextForm.value) {
      case Commands.clean:
        this.onDeleteDoneItems();
        break;
      case Commands.dense:
        this.toggleDense();
        break;
      default:
        this.addDoable();
    }
  }

  public addDoable(): void {
    this.items.push({
      name: 'New Doable',
      text: this.doableTextForm.value,
      timestamp: Date.now(),
      done: false,
    });
    this.updateStorage();
    this.doableTextForm.setValue('');
  }

  public onDone(doable: Doable): void {
    doable.done = true;
    this.updateStorage();
  }

  public onUndo(doable: Doable): void {
    doable.done = false;
    this.updateStorage();
  }

  public onAllDone(): void {
    this.items.forEach((item) => item.done = true);
  }

  public toggleActions(): void {
    this.actionsActive = !this.actionsActive;
  }

  public toggleDense(): void {
    this.dense = !this.dense;
    localStorage.setItem(DenseStorageKey, this.dense ? 'true' : 'false');
  }

  public onDeleteDoneItems(): void {
    this.items = this.items.filter((item) => !item.done);
    this.updateStorage();
    this.doableTextForm.setValue('');
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  private sort(): void {
    this.items.sort((x, y) => (x === y) ? 0 : x ? -1 : 1);
  }

  private updateStorage(): void {
    localStorage.setItem(ItemStorageKey, JSON.stringify(this.items));
  }
}
