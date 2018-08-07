import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

/**
 * Common Alert Service which fires Success or Error events. Components/Services that 
 * wish to use this service to fire event messages can call the service's success() or error() method.
 * Other components/services can subscribe to these events by calling the getMessage().
 */
@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private retainAfterNavigation = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(
            event => {
            if (event instanceof NavigationStart) {
                if (this.retainAfterNavigation) {
                    // only keep for a single location change
                    this.retainAfterNavigation = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    /**
     * Method to broadcast `success` message to any `Alert` component.
     * The optional parameter `fade` will control if the receiving alert
     * component will have automatically fade-out.
     * 
     * The parameter `messageId` if provided will route the message to 
     * its intended recipient.
     * 
     * @param message 
     * @param fade 
     * @param messageId 
     * @param keepAfterNavigationChange 
     */
    success(message: string, fade?:boolean,messageId?:string, keepAfterNavigationChange = false) {
        this.retainAfterNavigation = keepAfterNavigationChange;
        var msg:any = {            
                        type : 'success',                
                        text : message            
                    }

        if (fade && fade == true) {
            msg.fade = true;
        }

        if (messageId) {
            msg.id = messageId;
        }
        this.subject.next(msg);
    }

    /**
     * Method to broadcast `error` message to any `Alert` component.
     * The optional parameter `fade` will control if the receiving alert
     * component will have automatically fade-out.
     * 
     * The parameter `messageId` if provided will route the message to 
     * its intended recipient.
     * 
     * @param message 
     * @param messageId 
     * @param keepAfterNavigationChange 
     */
    error(message: string,messageId?:string,fade?:boolean,keepAfterNavigationChange = false) {
        this.retainAfterNavigation = keepAfterNavigationChange;

        var msg:any = {            
            type : 'error',                
            text : message        
        }

        if (messageId) {
            msg.id = messageId;
        }

        this.subject.next(msg);
    }

    reset() {
        this.subject.next({ type: null, text: null});
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}