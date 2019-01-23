import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database/database";
import {AngularFireAuth} from "angularfire2/auth/auth";


@Component({
    selector: 'page-definir-contatos',
    templateUrl: 'definir-contatos.html',
})
export class DefinirContatosPage {

    Cuidadores: any;
    Chaves: any;
    id: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private afData: AngularFireDatabase, private afAuth: AngularFireAuth) {

        this.Cuidadores = [];
        this.Chaves = [];
        this.id = this.afAuth.auth.currentUser.uid;

    }

    ionViewDidLoad() {

        this.afData.app.database().ref(`utente/${this.id}/cuidadores`).on('value', data => {
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

    guardarContatoEmerg(i){

        //guardar na bd o nr de contato de emergencia

        var cuidador= this.Chaves[i];

        this.afData.app.database().ref(`perfil/${cuidador}/telemovel`).on('value', data => {
                var contato = data.val();
                this.afData.app.database().ref(`utente/${this.id}`).update({
                    contactoPrioritário: contato,
                })
        });
    }

    ionViewWillLeave(){


    }

}
