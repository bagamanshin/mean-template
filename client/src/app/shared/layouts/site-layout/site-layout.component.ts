import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { roles } from '../../interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.sass']
})
export class SiteLayoutComponent implements OnInit {



  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }
  get isLoggedIn(): boolean {
    return this.auth.getUserRole() !== roles.GUEST
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login'])
  }
}
