import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isLoggedIn: boolean = false;
  userName: string = '';

constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.userName = user?.username || '';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}