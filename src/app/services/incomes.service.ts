/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Incomes } from '../models/incomes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const BACKEND_URL =  environment.apiUrl + '/incomes';

@Injectable({
  providedIn: 'root'
})
export class IncomesService {
  private incomes: Incomes[] = [];
  private incomesUpdated = new Subject<{incomes: Incomes[] ; incomesCount: number}>();

  constructor(private httpClient: HttpClient) { }

  /**
   * Gets incomes
   *
   * @param postPerPage posts per page
   * @param currentPage page number
   */
  getIncomes(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
    this.httpClient.get<{incomes: any; maxIncomes: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(incomesData => ({
          incomes: incomesData.incomes.map(income => ({
              id: income._id,
              title: income.title,
              description: income.description,
              amount: income.amount,
              date: income.date,
            })),
          maxIncomes: incomesData.maxIncomes
        }))
    )
      .subscribe((transformedIncomesData) => {
        this.incomes = transformedIncomesData.incomes;
        this.incomesUpdated.next({
          incomes: [...this.incomes],
          incomesCount: transformedIncomesData.maxIncomes
        });
      });
  }

  /**
   * Gets observable for fetching incomes
   *
   * @returns observable
   */
  getIncomesUpdatedListener() {
    return this.incomesUpdated.asObservable();
  }

  addIncome(title: string, amount: number, category: string) {
    const incomeData: any = {
      title,
      amount,
      category
    };
    this.httpClient.post<{token: string; expiresIn: number}>(BACKEND_URL, incomeData)
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
