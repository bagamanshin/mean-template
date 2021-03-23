import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthorizedUser } from '../shared/interfaces';

import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-inner-page',
  templateUrl: './inner-page.component.html',
  styleUrls: ['./inner-page.component.sass']
})
export class InnerPageComponent {

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private title: Title) {
                this.title.setTitle('Inner page title!!');
  }

  // sendSecureRequest() {
  //   return this.http.get<AuthorizedUser[]>(environment.apiUrl + '/users')
  //     .subscribe(
  //       users => {
  //         console.log('%c%s', 'color: #0ebc00', 'The secret user list is ', users)
  //       }
  //     )
  // }

}
