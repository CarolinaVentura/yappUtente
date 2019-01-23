import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {Utente} from "../../modelos/utente";
import {FirebaseObjectObservable} from "../../../node_modules/angularfire2/database/firebase_object_observable";
import {AngularFireAuth} from '../../../node_modules/angularfire2/auth';
import {AngularFireDatabase} from '../../../node_modules/angularfire2/database';
import {LoginPage} from "../login/login";
import {BackgroundGeolocationConfig, BackgroundGeolocation} from "@ionic-native/background-geolocation";

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    dados: FirebaseObjectObservable<Utente>;
    Cuidadores: any;
    Chaves: any;


    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController,
                private afAuth: AngularFireAuth,
                private afData: AngularFireDatabase,
                private bg: BackgroundGeolocation) {

        this.Cuidadores = [];
        this.Chaves = [];
    }

    ionViewWillLoad() {


        const id = this.afAuth.auth.currentUser.uid;
        this.dados = this.afData.object(`utente/${id}`);


        this.afData.app.database().ref(`utente/${id}/cuidadores`).on('value', data => {
            data.forEach(chave => {
                this.Chaves.push(chave.key);

                this.afData.app.database().ref(`perfil/${chave.key}`).on('value', data => {

                    var dados = (data.val());
                    var nome = dados.nome;
                    var apelido = dados.apelido;
                    var cuidador = nome + ' ' + apelido;
                    this.Cuidadores.push(cuidador);


                });
                return false;
            })

        })

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
