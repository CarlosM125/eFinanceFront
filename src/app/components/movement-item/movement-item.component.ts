import { Component, Input, OnInit } from '@angular/core';
import { EstimationsService } from 'src/app/services/estimations.service';
import { LanguageService } from 'src/app/services/language.service';
import { Incomes } from 'src/app/models/incomes';
import { ExpensesService } from 'src/app/services/expenses.service';
import { IncomesService } from 'src/app/services/incomes.service';

@Component({
  selector: 'app-movement-item',
  templateUrl: './movement-item.component.html',
  styleUrls: ['./movement-item.component.scss'],
})
export class MovementItemComponent implements OnInit {
  @Input() title: string;
  @Input() date: Date;
  @Input() category: string;
  @Input() amount: number;
  @Input() isExpense = false;
  @Input() id:string;
  @Input() type:string;
  lang: string;
  color = 'success';
  constructor(private languageService: LanguageService,private estimationsService: EstimationsService,private expensesService: ExpensesService,private incomesService: IncomesService) { }

  ngOnInit() {
    this.color = this.isExpense ? 'danger' : 'primary';
    this.lang = this.languageService.getSelectedLanguage();
  }
  delete(ced:string, type:string){
   if(type=="Estimaciones"){
    this.estimationsService.delete(ced).subscribe();
   }else if(type=="ingreso"){
    this.incomesService.delete(ced).subscribe();
   }else{
    this.expensesService.delete(ced).subscribe();
   }
   window.location.reload();
  }
}
