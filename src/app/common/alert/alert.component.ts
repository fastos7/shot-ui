import { AlertService } from '../../core/services/alert.service';
import { Component, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * This alert component has now a fade-out feature. When message is received 
 * and it contains the attribute `fade` equal to true then the alert will fade 
 * out automatically in 4 seconds.
 * 
 * It also has optional `id` input parameter which control if a message is intended 
 * to it or not. If `id` is empty then this alert component will receive all alert
 * messages.
 */
@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html',
    animations: [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1, display: 'block' })),
            state('hidden', style({ opacity: 0, display: 'none' })),
            transition('shown => hidden', animate('2s')),
            transition('hidden => shown', animate('0s'))
        ])
    ]
})
export class AlertComponent implements OnDestroy {

    private subscription: Subscription;
    message: any;

    /*
     * Optional id that uniquely identifies this alert. If id is provided this 
     * alert will only receive message intended to it.
     */
    @Input() id?: string;

    private isVisible: string;

    constructor(private alertService: AlertService) {

        // subscribe to alert messages
        this.subscription = alertService.getMessage().subscribe(
            message => {

                /*
                 * If this alert has an id, it will only receive the message 
                 * intended to it. If id is not provided then it will be able to
                 * receive all alert broadcasted.
                 */
                if (this.id && this.id != '') {
                    if (message && message.id) {
                        if (message.id == this.id) {
                            this.message = message;
                        } else {
                            this.message = null;
                        }
                    } else {
                        this.message = null;
                    }
                } else {
                    if (message != null && message.text != null) {
                        this.message = message;
                    } else {
                        this.message = null;
                    }
                }


                /**
                 * If the `fade` is provided and is equal to true the fade out 
                 * animation will be triggered.
                 */
                this.isVisible = 'shown';
                if (this.message && this.message.fade) {
                    setTimeout(() => {
                        this.isVisible = 'hidden';
                    }, 2000);
                }

                /**
                 * Dont show this alert if the message is empty string.
                 */
                if (this.message && this.message.text == "") {
                    this.isVisible = 'hidden';
                }
            }
        );
    }

    ngOnDestroy(): void {
        // unsubscribe on destroy to prevent memory leaks
        this.subscription.unsubscribe();
    }
}