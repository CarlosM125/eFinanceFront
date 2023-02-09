/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { AuthData } from '../models/auth-data';

const BACKEND_URL =  environment.apiUrl + '/accounts';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accounts: Account [] = [];
  private accountsUpdated= new Subject<{accounts: Account[]; maxAccounts: number}>();
  /**
   * Constructor
   */
  constructor(private httpClient: HttpClient, private router: Router) {}

  /**
   * Gets account list
   *
   * @param itemsPerPage items per page
   * @param currentPage current page
   */
  getAccounts(itemsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${itemsPerPage}&page=${currentPage}`;
    this.httpClient.get<{data: Account[]; maxAccounts: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(accountsData => ({
        data: accountsData.data.map(account => ({
          _id: account._id,
          name: account.name,
          color: account.color,
          amount: account.amount,
          category: account.category,
        })),
        maxAccounts: accountsData.maxAccounts
      }))
    ).subscribe((transformedAccountData) => {
      this.accounts = transformedAccountData.data;
      this.accountsUpdated.next({
        accounts: [...this.accounts],
        maxAccounts: transformedAccountData.maxAccounts,
      });
    });
  }

  /**
   * Gets observable for fetching accounts
   *
   * @returns observable
   */
  getAccountsUpdatedListener() {
    return this.accountsUpdated.asObservable();
  }

  addAccount(name: string, color: string, amount: number, category: string) {
    const accountData: any = {
      name,
      amount,
      color,
      category
    };
    console.log('***** AccountData *****', name, color, amount, category);
    this.httpClient.post<{token: string; expiresIn: number}>(BACKEND_URL, accountData)
      .subscribe(response => {
        console.log(response);
        window.location.reload();
      });
  }
  delete(id:string){
    const options:any= {
      body:{
        id:id
      },
    };
    return this.httpClient.delete(BACKEND_URL+'/remove',options);
  }
}
