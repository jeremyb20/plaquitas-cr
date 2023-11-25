import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class CounterService{

  private _counterTickets = new BehaviorSubject<any>(null);
  _Counter = this._counterTickets.asObservable();

  private _counterPendingTickets = new BehaviorSubject<any>(null);
  _CounterPendingTickets = this._counterPendingTickets.asObservable();   

  private _counterHelpNotifications = new BehaviorSubject<any>(null);
  _CounterHelpNotifications = this._counterHelpNotifications.asObservable();  

  private _counterInternalNotifications = new BehaviorSubject<any>(null);
  _CounterInternalNotifications = this._counterInternalNotifications.asObservable(); 

  private _counterPartnerNotifications = new BehaviorSubject<any>(null);
  _CounterPartnerNotifications = this._counterPartnerNotifications.asObservable(); 
  
  private _counterDirectNotifications = new BehaviorSubject<any>(null);
  _CounterDirectNotifications = this._counterDirectNotifications.asObservable();

  private _actualRouteNotification = new BehaviorSubject<any>(null);
  _CounterActualRoute = this._actualRouteNotification.asObservable();
 
  constructor() {  }

  CounterTickets(pCounter: number) {
    this._counterTickets.next(pCounter)
  }

  CounterPendingTickets(pCounter: number) {
    this._counterPendingTickets.next(pCounter)
  }

  CounterHelpNotifications(pCounter: number) {
    this._counterHelpNotifications.next(pCounter)
  }

  CounterInternalNotifications(pCounter: number) {
    this._counterInternalNotifications.next(pCounter)
  }
 
  CounterPartnerNotifications(pCounter: number) {
    this._counterPartnerNotifications.next(pCounter)
  }

  CounterDirectNotifications(pCounter: number) {
    this._counterDirectNotifications.next(pCounter)
  }

  ActualRoute(pRoute: string) {
    this._actualRouteNotification.next(pRoute)
  }
}
