import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private sidebarValueSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  sidebarValue$ = this.sidebarValueSubject.asObservable();

  updateSidebarValue(): void {
    const currentValue = this.sidebarValueSubject.getValue();
    const newValue = !currentValue;
    this.sidebarValueSubject.next(newValue);
  }
}
