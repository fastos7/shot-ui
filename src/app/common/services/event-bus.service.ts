import { Injectable } 	from '@angular/core';
import * as Rx 			from 'rxjs/Rx';

/**
 * This `EventBusService` can be used to send messages to components with deep 
 * relationships for example a grandchild component to grandparent component and
 * vice versa to avoid creating so many `Output` objects.
 * 
 * This can also be used to send messages to non-related components for example
 * a component can broadcast event(s) to one or many components.
 * 
 * ### Example
 * 
 * ```ts
 * // Inject the service in the constructor in both consumer (a.k.a listener) 
 * // and publisher of events
 * constructor(private eventBusService:EventBusService) { }
 * 
 * // Register Event Listener on consumer (a.k.a listener) 
 *   this.eventBusService.on(Constants.REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT,() => {
 *			this.doSomething();
 *	  });
 *
 * // Fire an event from within publisher
 * this.eventBusService.broadcast(Constants.REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT);
 * 
 * ```
 * 
 * 
 * @author Marlon Cenita
 */
@Injectable()
export class EventBusService {

	private listeners;
	private eventsSubject;
	private events;

	/**
	 * Default constructor. 
	 */
  	constructor() { 

		  this.listeners = {};

		  this.eventsSubject = new Rx.Subject();

		  this.events = Rx.Observable.from(this.eventsSubject);

		  this.events.subscribe(
            ({name, args}) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
  	}
	
	/**
	 * Register an event listener.
	 * @param {string} 	- The name of the event the listener parameter will
	 * 					  be called.
	 * @param {any} 	- The function that will be invoked once the name event 
	 *                    will be broadcasted. 
	 */
	public on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

	/**
	 * Broadcast an event
	 */
	public broadcast(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
	
	/**
	 * Returns all listeners.
	 * @return {any} - Return all listeners with any types.
	 */
	public getListeners() : any {
		return this.listeners;
	}

}
