import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListStateService {

  constructor() { }
  private state: {
    currentPage: number;
    itemsPerPage: number;
  
  } = {
    currentPage: 1,
    itemsPerPage: 10
  };
  saveState(state: {
    currentPage: number;
    itemsPerPage: number;
  
  }) {
    this.state = { ...state };
    //  save to localStorage for persistence across page refreshes
    localStorage.setItem('recordListState', JSON.stringify(this.state));
  }
  getState() {
    // Try to get from localStorage first
    const savedState = localStorage.getItem('recordListState');
    if (savedState) {
      this.state = JSON.parse(savedState);
    }
    return this.state;
  }

  clearState() {
    this.state = {
      currentPage: 1,
      itemsPerPage: 10
    };
    localStorage.removeItem('recordListState');
  }
}
