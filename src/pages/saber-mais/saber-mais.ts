import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-saber-mais',
  templateUrl: 'saber-mais.html',
})
export class SaberMaisPage {

  constructor(private view: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  fecharModal(){
    this.view.dismiss();
  }

}
