import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/models/account';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit, OnDestroy {
  accounts: Account[] = [];
  totalAccounts = 0;
  postPerPage = 100;
  currentPage = 1;
  isLoading: boolean;

  private accountSubscription: Subscription;

  constructor(private accountsService: AccountsService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.accountsService.getAccounts(this.postPerPage, this.currentPage);
    this.accountSubscription = this.accountsService.getAccountsUpdatedListener().subscribe(
      (accountsData: {accounts: Account[]; maxAccounts: number}) => {
        this.accounts = accountsData.accounts;
        //console.log(this.accounts);
        this.totalAccounts = accountsData.maxAccounts;
        this.isLoading = false;
      }
    );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  displayDetailsPage(selectedAccount: Account): void {
    const navigationExtras: NavigationExtras = {
      state: {
        account: selectedAccount
      }
    };
    this.router.navigate(['/app/account-detail'], navigationExtras).catch(reason => {
      console.log(reason);
    });
  }
  
}
