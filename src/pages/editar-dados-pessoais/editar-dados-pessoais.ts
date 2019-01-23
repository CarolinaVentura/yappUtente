import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth/auth";
import {AngularFireDatabase} from "angularfire2/database/database";
import {Utente} from "../../modelos/utente";
import {FirebaseObjectObservable} from "angularfire2/database/firebase_object_observable";
import {ContactPage} from "../contact/contact";
import {File} from '@ionic-native/file';
import {FileChooser} from "@ionic-native/file-chooser";
import * as firebase from 'firebase/app';

/**
 * Generated class for the EditarDadosPessoaisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-editar-dados-pessoais',
    templateUrl: 'editar-dados-pessoais.html',
})
export class EditarDadosPessoaisPage {


    utente = {} as Utente;
    perfilDados: FirebaseObjectObservable<Utente>;


    constructor(public navCtrl: NavController, public navParams: NavParams,
                private afAuth: AngularFireAuth, private afData: AngularFireDatabase,
                private alertCtrl: AlertController, private toast: ToastController,
                private file: File, private fileChooser: FileChooser) {
    }

    ionViewWillLoad() {

        var id = this.afAuth.auth.currentUser.uid;
        this.perfilDados = this.afData.object(`utente/${id}`);


    }


    guardarAlteracoes(utente: Utente) {


        let alert = this.alertCtrl.create({
            title: 'Tem a certeza que pretende alterar os dados?',
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

                        var id = this.afAuth.auth.currentUser.uid;


                        if (utente.nome != '') {

                            this.afData.app.database().ref(`utente/${id}`).update({nome: utente.nome});
                        }

                        if (utente.apelido != '') {

                            this.afData.app.database().ref(`utente/${id}`).update({apelido: utente.apelido});
                        }

                        if (utente.telemovel != '') {

                            this.afData.app.database().ref(`utente/${id}`).update({telemovel: utente.telemovel});
                        }

                        if (utente.email != '') {

                            this.afData.app.database().ref(`utente/${id}`).update({email: utente.email});

                            var user = this.afAuth.auth.currentUser;
                            user.updateEmail(utente.email);
                        }


                        this.navCtrl.push(ContactPage);

                        this.toast.create({
                            message: 'Alteração de dados realizada com sucesso.',
                            duration: 5000,
                            cssClass: 'erro',
                        }).present();


                    }
                }
            ]
        });
        alert.present();

    }

    uploadFoto() {

        this.fileChooser.open().then((uri)=> {

            console.log('ola');


            this.file.resolveLocalFilesystemUrl(uri).then((newUrl)=> {
                let dirPath = newUrl.nativeURL;
                let dirPathSegments = dirPath.split('/');
                dirPathSegments.pop();
                dirPath = dirPathSegments.join('/');

                this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async(buffer) => {
                        await this.uploadFinal(buffer, newUrl.name);
                    }
                )
            })
        });
    }

    async uploadFinal(buffer, name) {

        let blob = new Blob([buffer], {type: 'image/jpeg'});
        let storage = firebase.storage();
        storage.ref('images/' + name).put(blob).then((data)=> {
            alert('Upload concluído!');
        }).catch((error)=> {
            alert(JSON.stringify(error));
        })

    }
}
