import { UserAuthorities } from './user-authorities.model';

export class User {
    id: number;
    userId: number;
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    jwt_token: string;
    defaultSite : string;
    defaultOrderView: string;
    isActive: boolean;
    //defaultSite: string;
    //currentSiteName: string;    
    //currentSiteRoles: string[];
    selectedUserAuthority : UserAuthorities;
    userAuthorities: UserAuthorities[] = [];
    userSiteKeys: string[] = [];
    isShotAdmin: boolean = false;
    loginUserId: number;
    loginRole: string;
    

    constructor(userName: string, password: string, 
                email: string = null ,id: number = 0, firstName: string = null, lastName: string = null,
                jwt_token: string = null, isActive: boolean = true) {
        this.userId = id;
        this.id = id;
        this.userName = userName;
        if (email) {
            this.email = email;
        } else {
            this.email = userName;
        }
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jwt_token = jwt_token;
        this.isActive = isActive;
    }
}