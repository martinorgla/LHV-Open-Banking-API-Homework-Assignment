import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from './interfaces/account.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private token: string = null;
  public title = 'LHV Open Banking API';
  public accounts: Account[] = null;
  public loading = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['token']?.length) {
        this.token = params['token'];
        this.router.navigate(['/'], {replaceUrl: true});
        this.getAccounts();
      }
    });
  }

  getAccounts(): void {
    if (!this.token) {
      return this.login();
    }

    this.loading = true;

    this.http
      .get<{ accounts: Account[] }>(`http://localhost:3000/api/accounts?token=${this.token}`)
      .subscribe((data) => {
        this.accounts = data.accounts;
        this.loading = false;
      });
  }

  login(): void {
    this.http
      .get<{ url: string }>('http://localhost:3000/api/auth/url')
      .subscribe((data) => {
        this.document.location.href = data.url;
      });
  }

  clear(): void {
    this.accounts = null;
    this.token = null;

    this.router.navigate(['']);
  }
}
