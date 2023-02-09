import { Component, OnInit } from '@angular/core';
import { type } from 'os';
import { Subscription } from 'rxjs';
import { Estimation } from 'src/app/models/estimation';
import { EstimationsService } from 'src/app/services/estimations.service';

@Component({
  selector: 'app-estimations',
  templateUrl: './estimations.page.html',
  styleUrls: ['./estimations.page.scss'],
})
export class EstimationsPage implements OnInit {

  type: string;
  estimations: Estimation[] = [];
  itemsPerPage = 20;
  currentPage = 1;
  estimationAmountArray = [];
  estimationTotalAmount = 0;
  estimationCount = 0;
  isEstimationModalOpen = false;
  isLoading: boolean;
  private estimationsSubcription: Subscription;

  constructor(
    private estimationsService: EstimationsService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.estimationsService.getEstimations(this.itemsPerPage, this.currentPage);
    this.estimationsSubcription = this.estimationsService.getEstimationsUpdatedListener()
    .subscribe(
      (estimationsData: {estimations: Estimation[]; maxEstimations: number}) => {
        this.estimations = estimationsData.estimations;
        this.estimationAmountArray = estimationsData.estimations.map(estimation => estimation.amount);
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        this.estimationTotalAmount = this.estimationAmountArray.reduce<number>(function(a, b) {return a + b;},0);
        this.estimationCount = estimationsData.maxEstimations;
        this.isLoading = false;
        this.type = "Estimaciones";
      }
    );
  }

  toogleEstimationModal() {
    this.isEstimationModalOpen = !this.isEstimationModalOpen;
  }
}
