import { makeAutoObservable } from 'mobx';
import { PdaMeterBookDtoHolder } from './holders';

class MeterStaet {
  books: PdaMeterBookDtoHolder[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}
