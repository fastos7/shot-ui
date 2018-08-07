import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
 import { ChangeDetectorRef } from '@angular/core';
 
@Component ({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    
    constructor(
        private userService: UserService, 
    ) {} 

    
    isuserLoggedIn(): boolean {
        return this.userService.isLoggedIn() != null; 
    }

}