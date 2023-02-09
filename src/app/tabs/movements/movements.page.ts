import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Expenses } from 'src/app/models/expenses';
import { Incomes } from 'src/app/models/incomes';
import { ExpensesService } from 'src/app/services/expenses.service';
import { IncomesService } from 'src/app/services/incomes.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit, OnDestroy {

  type: string;
  type2: string;

  incomes: Incomes[] = [];
  expenses: Expenses[] = [];
  weekDays = [];
  postPerPage = 20;
  currentPage = 1;
  totalIncomes = 0;
  totalExpenses = 0;
  isIncomeModalOpen = false;
  isExpenseModalOpen = false;
  incomeAmount = 0;
  expenseAmount = 0;
  canDismiss = false;
  incomeChartData: number[] = [];
  expenseChartData = [];
  isExpense: boolean;
  isLoading: boolean;

  private incomesSubcription: Subscription;
  private expensesSubcription: Subscription;

  constructor(
    public incomesService: IncomesService,
    public expensesService: ExpensesService
  ) { }

  /**
   * On init
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.incomesService.getIncomes(this.postPerPage, this.currentPage);
    this.incomesSubcription = this.incomesService.getIncomesUpdatedListener()
      .subscribe(
          (incomesData: {incomes: Incomes[]; incomesCount: number}) => {
          this.incomes = incomesData.incomes;
          this.incomeChartData = incomesData.incomes.map(income => income.amount);
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          this.incomeAmount = this.incomeChartData.reduce<number>(function(a, b) {return a + b;}, 0);
          this.totalIncomes = incomesData.incomesCount;
          this.type = "Ingreso";
        }
      );

    this.expensesService.getExpenses(this.postPerPage, this.currentPage);
    this.expensesSubcription = this.expensesService.getExpenseUpdatedListener()
      .subscribe(
        (expensesData: {expenses: Expenses[]; expensesCount: number}) => {
          this.expenses = expensesData.expenses;
          this.expenseChartData = expensesData.expenses.map(expense => expense.amount);
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          this.expenseAmount = this.expenseChartData.reduce<number>(function(a, b) {return a + b}, 0);
          this.totalExpenses = expensesData.expensesCount;
          this.isLoading = false;
          this.type2 = "Gasto";
        }
      );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.incomesSubcription.unsubscribe();
    this.expensesSubcription.unsubscribe();
  }

  openIncomeModal() {
    this.isIncomeModalOpen = true;
  }

  closeIncomeModal() {
    this.isIncomeModalOpen = false;
  }

  openExpenseModal() {
    this.isExpenseModalOpen = true;
  }

  closeExpenseModal() {
    this.isExpenseModalOpen = false;
  }

}
