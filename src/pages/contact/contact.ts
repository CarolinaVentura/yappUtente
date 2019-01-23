import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {LoginPage} from "../login/login";
import {DefinirContatosPage} from "../definir-contatos/definir-contatos";
import {EditarDadosPessoaisPage} from "../editar-dados-pessoais/editar-dados-pessoais";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation";

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage {

    constructor(public navCtrl: NavController,
                private alertCtrl: AlertController,
                private afAuth: AngularFireAuth,
                private bg: BackgroundGeolocation,) {

    }

    redifine() {
        const email = this.afAuth.auth.currentUser.email;

        var currentUser = this.afAuth.auth.currentUser;

        this.afAuth.auth.signOut();

        let alert = this.alertCtrl.create({
            title: 'Alterar palavra-passe',
            inputs: [
                {
                    name: 'oldPass',
                    placeholder: 'Password',
                    type: 'password',

                },
                {
                    name: 'NewPass',
                    placeholder: 'Nova Password',
                    type: 'password',

                },

                {
                    name: 'RepNewPass',
                    placeholder: 'Repetir a nova Password',
                    type: 'password',

                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Enviar',
                    handler: data => {
                        if (data.NewPass == data.RepNewPass) {

                            const signIn = this.afAuth.auth.signInWithEmailAndPassword(email, data.oldPass).then(function () {
                                currentUser.updatePassword(data.NewPass);
                            })

                        }

                    }
                }
            ]
        });
        alert.present();

    }

    edit() {
        console.log('push');
        this.navCtrl.push(EditarDadosPessoaisPage);

    }


    emergencyContact() {
        console.log('ola');
        this.navCtrl.push(DefinirContatosPage);
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

