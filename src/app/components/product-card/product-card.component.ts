import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SimpleOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() name: string;
  @Input() amount: string;
  @Input() color: string;

  constructor(public alertController: AlertController, private accountService: AccountsService) {}

  ngOnInit() {}

  async alertDelete(){
    const alert = await this.alertController.create({
      header:'Eliminar cuenta',
      message:'¿Seguro quieres eliminar esta cuenta?',
      buttons:[{
        text:'Si',
        role:'yes',
        handler:() =>{
          this.delete();
        },
        },
        {
          text:'No',
          role:'no',
          handler:() =>{
            console.log('cancelado');
          },
        },
        ]
    });
    await alert.present();
  }

  delete(){
  }
}
