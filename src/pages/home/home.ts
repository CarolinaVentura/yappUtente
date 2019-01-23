import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import {FirebaseObjectObservable} from "angularfire2/database/firebase_object_observable";
import {AngularFireAuth} from "angularfire2/auth/auth";
import {AngularFireDatabase} from "angularfire2/database/database";
import {Utente} from "../../modelos/utente";
import {CallNumber} from '@ionic-native/call-number';
import {LoginPage} from "../login/login";
import {BackgroundGeolocation} from '@ionic-native/background-geolocation';




@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    message: any;
    dados: FirebaseObjectObservable<Utente>;
    coords: string[] = [];
    contato: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public toastCtrl: ToastController,
                private afAuth: AngularFireAuth,
                private afData: AngularFireDatabase,
                private callNumber: CallNumber,
                private bg: BackgroundGeolocation) {

    }

    ionViewWillLoad() {

        var id = this.afAuth.auth.currentUser.uid;
        this.dados = this.afData.object(`utente/${id}`);

    }

    call() {

        ///ver contato com prioridade
        var id = this.afAuth.auth.currentUser.uid;


        const x = this.afData.app.database().ref(`utente/${id}/contactoPrioritário`).on('value', data => {
            this.contato = data.val();
        });

        if(x){
            this.callNumber.callNumber(`${this.contato}`, true);
        } else{
            this.afData.app.database().ref(`utente/${id}/cuidadores`).on ('value', data =>{
                data.forEach((cuidador)=>{
                    this.contato = cuidador.val();
                    return false;
                });
            });

            this.callNumber.callNumber(`${this.contato}`, true);
        }




    }



    terminarSessao() {


        let alert = this.alertCtrl.create({
            title: 'Tem a certeza que pretende terminar sessão?',
            message: '',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    handler: () => {
                        console.log('b');
                    }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        //codigo para terminar sessão

                        this.bg.stop();
                        this.afAuth.auth.signOut();
                        location.reload();
                        this.navCtrl.setRoot(LoginPage);

                    }
                }
            ]
        });
        alert.present();

    }


}
