/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Expenses } from '../models/expenses';

const BACKEND_URL =  environment.apiUrl + '/expenses';

@Injectable({
  providedIn: 'root'
})

export class ExpensesService {
  private expenses: Expenses[] = [];
  private expensesUpdated = new Subject<{expenses: Expenses[] ; expensesCount: number}>();

  /**
   * Constructor
   *
   * @param httpClient Http client
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Gets expenses
   *
   * @param itemsPerPage Items per page
   * @param currentPage current page
   */
  getExpenses(itemsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${itemsPerPage}&page=${currentPage}`;
    this.httpClient.get<{expenses: any; maxExpenses: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(expensesData => ({
          expenses: expensesData.expenses.map(expense => ({
              id: expense._id,
              title: expense.title,
              description: expense.description,
              amount: expense.amount,
              date: expense.date,
            })),
            maxExpenses: expensesData.maxExpenses
        }))
    ).subscribe((transformedExpensesData) => {
      this.expenses = transformedExpensesData.expenses;
      this.expensesUpdated.next({
        expenses: [...this.expenses],
        expensesCount: transformedExpensesData.maxExpenses
      });
    });
  }

  /**
   * Gets observable for fetching expenses
   *
   * @returns observable
   */
   getExpenseUpdatedListener() {
    return this.expensesUpdated.asObservable();
  }

  addExpense(title: string, amount: number, category: string) {
    const expenseData: any = {
      title,
      amount,
      category
    };
    this.httpClient.post<{token: string; expiresIn: number}>(BACKEND_URL, expenseData)
      .subscribe(response => {
        console.log(response);
        window.location.reload();
      });
  }

  delete(id:string){
    const options:any={
      body:{
        id:id
      },
    };
    return this.httpClient.delete(BACKEND_URL+'/remove',options)
  }
}
