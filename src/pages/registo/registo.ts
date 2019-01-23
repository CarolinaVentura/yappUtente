import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth/auth";
import {AngularFireDatabase} from "angularfire2/database/database";
import {Utente} from "../../modelos/utente";
import {User} from "../../modelos/user";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-registo',
  templateUrl: 'registo.html',
})
export class RegistoPage {

  user = {} as User;
  utente = {} as Utente;

  PasswordShow:boolean = false;
  PasswordType: string= 'password';



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private afAuth: AngularFireAuth,
              private afData: AngularFireDatabase,
              private toast: ToastController) {
  }


  verPass () {
    if(this.PasswordShow){
      this.PasswordShow=false;
      this.PasswordType='password';
    }else{
      this.PasswordShow=true;
      this.PasswordType='text';
    }
  }

  criarConta(user: User, utente: Utente) {
    if (utente.nome != '' && utente.apelido !='' && utente.telemovel != '' && user.email != '' && user.password != '') {
       utente.email = user.email;


      // criado a conta
      const infoUser =  this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(user => {
        var uid = user.uid;
        this.afData.object(`utente/${uid}`).set(this.utente);
        this.navCtrl.setRoot(TabsPage);

      }).catch((error)=>{
        this.toast.create({
          message: 'Ocorreu um erro e não foi possível registar os dados.',
          duration: 4000,
          cssClass: 'erro',
        }).present();
      })
    }
  }
}