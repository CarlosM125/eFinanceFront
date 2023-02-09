/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Estimation } from '../models/estimation';

const BACKEND_URL =  environment.apiUrl + '/estimations';

@Injectable({
  providedIn: 'root'
})
export class EstimationsService {

  private estimations: Estimation [] = [];
  private estimationsUpdated = new Subject<{estimations: Estimation[]; maxEstimations: number}>();

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Adds a new estimation
   * @param title
   * @param amount
   * @param category
   */
  addEstimation(title: string, amount: number, category: string) {
    console.log('mmmmm', amount);

    const estimationData: any = {
      title,
      amount,
      category
    };
    this.http.post<{token: string; expiresIn: number}>(BACKEND_URL, estimationData)
      .subscribe(response => {
        console.log(response);
        window.location.reload();
      });
  }

  getEstimations(itemsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${itemsPerPage}&page=${currentPage}`;
    this.http.get<{estimations: any; maxEstimations: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(estimationsData => ({
          estimations: estimationsData.estimations.map(estimation => ({
              id: estimation._id,
              title: estimation.title,
              amount: estimation.amount,
              date: estimation.date,
            })),
            maxEstimations: estimationsData.maxEstimations
        }))
    ).subscribe((transformedEstimationsData) => {
      this.estimations = transformedEstimationsData.estimations;
      this.estimationsUpdated.next({
        estimations: [...this.estimations],
        maxEstimations: transformedEstimationsData.maxEstimations,
      });
    });
  }

  getEstimationsUpdatedListener() {
    return this.estimationsUpdated.asObservable();
  }

  delete(id:string){
    const options:any={
      body:{
        id:id
      },
    };
    return this.http.delete(BACKEND_URL+'/remove',options)
  }
}
