import {Component, OnInit} from '@angular/core';
import {Doable} from './interfaces/doable';
import {FormControl} from '@angular/forms';

const ItemStorageKey = 'items';
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
  public dense = false;

  public ngOnInit(): void {
    const savedItems = localStorage.getItem(ItemStorageKey);
    if (savedItems) {
      this.items = JSON.parse(savedItems);
    }
    this.scrollToBottom();
  }

  public onCommand(): void {
    switch (this.doableTextForm.value) {
      case Commands.clean:
        this.deleteDoneItems();
        break;
      case Commands.dense:
        this.dense = !this.dense;
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
    this.scrollToBottom();
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

  private deleteDoneItems(): void {
    this.items = this.items.filter((item) => !item.done);
    this.updateStorage();
    this.doableTextForm.setValue('');
  }

  private sort(): void {
    this.items.sort((x, y) => (x === y) ? 0 : x ? -1 : 1);
  }

  private scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  private updateStorage(): void {
    localStorage.setItem(ItemStorageKey, JSON.stringify(this.items));
  }
}
