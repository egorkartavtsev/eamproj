import { Injectable }       from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../library/user-model';

@Injectable()
export class UserService{
    public user = new BehaviorSubject<UserModel>(new UserModel);
}