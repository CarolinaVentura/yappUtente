import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, ToastController, AlertController, Platform} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {TabsPage} from "./../tabs/tabs";
import {User} from "../../modelos/user";
import {AngularFireAuth} from "angularfire2/auth";
import {SaberMaisPage} from "../saber-mais/saber-mais";
import {RegistoPage} from "../registo/registo";
import {
    BackgroundGeolocation,
    BackgroundGeolocationResponse,
    BackgroundGeolocationConfig
} from "@ionic-native/background-geolocation";
import {AngularFireDatabase} from "angularfire2/database/database";
import {BackgroundMode} from "@ionic-native/background-mode";
import {DeviceMotion} from "@ionic-native/device-motion";
import {Alerta} from '../../modelos/alerta';
import {Coords} from "../../modelos/coords";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user = {} as User;
    coords = {} as Coords;
    alerta = {} as Alerta;


    PasswordShow: boolean = false;
    PasswordType: string = 'password';

    private lastX:number;
    private lastY:number;
    private lastZ:number;
    private moveCounter:number = 0;



    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private baseDados: AngularFireAuth,
                private toast: ToastController,
                private alertCtrl: AlertController,
                private modal: ModalController,
                private bg: BackgroundGeolocation,
                private afData: AngularFireDatabase,
                private afAuth: AngularFireAuth,
                private backgMode: BackgroundMode,
                private DeviceMotion: DeviceMotion,
                private platform: Platform) {


        this.alerta.mensagem = 'Movimento brusco detetado.';
        this.alerta.data = '03:00';
        this.alerta.relevancia = 'Importante';
    }


    async login(user: User) {

        try {
            const infoUser = await this.baseDados.auth.signInWithEmailAndPassword(user.email, user.password);


            if (infoUser) {

                //incializr sessao



                //inicializar o sensor de queda

                this.backgMode.on("activate").subscribe(()=>{
                    this.platform.ready().then(() => {
                        var subscription = this.DeviceMotion.watchAcceleration({frequency:1000}).subscribe(acc => {
                            //console.log(acc);

                            if(!this.lastX) {
                                this.lastX = acc.x;
                                this.lastY = acc.y;
                                this.lastZ = acc.z;
                                return;
                            }

                            let deltaX:number, deltaY:number, deltaZ:number;
                            deltaX = Math.abs(acc.x-this.lastX);
                            deltaY = Math.abs(acc.y-this.lastY);
                            deltaZ = Math.abs(acc.z-this.lastZ);

                            if(deltaX + deltaY + deltaZ > 7) {
                                this.moveCounter++;
                            } else {
                                this.moveCounter = Math.max(0, --this.moveCounter);
                            }

                            if(this.moveCounter > 2) {

                                var id = this.afAuth.auth.currentUser.uid;
                                this.afData.app.database().ref(`alertas/${id}`).push(this.alerta);
                                this.moveCounter=0;
                            }

                            this.lastX = acc.x;
                            this.lastY = acc.y;
                            this.lastZ = acc.z;

                        });
                    });

                });
                this.backgMode.enable();


                //inicializar o tracking
                this.bg.isLocationEnabled()
                    .then((rta) => {
                        if (rta) {

                            const config: BackgroundGeolocationConfig = {
                                desiredAccuracy: 10,
                                stationaryRadius: 1,
                                distanceFilter: 1,
                                debug: false,
                                stopOnTerminate: false,
                                activitiesInterval: 5000,
                                // Android only section
                                locationProvider: 1,
                                startForeground: true,
                                interval: 30000,
                                fastestInterval: 50000,


                            };


                            this.bg
                                .configure(config)
                                .subscribe((location: BackgroundGeolocationResponse) => {

                                    this.coords.data = location.timestamp;
                                    this.coords.latitude = location.latitude;
                                    this.coords.longitude = location.longitude;

                                    var id = this.afAuth.auth.currentUser.uid;
                                    this.afData.app.database().ref(`tracking/${id}`).push(this.coords);


                                });

                            // start recording location
                            this.bg.start();


                        } else {
                            this.bg.showLocationSettings();
                        }
                    });

                this.navCtrl.setRoot(TabsPage);

            }
        } catch (e) {
            this.toast.create({
                    message: "email ou password inválido", duration: 5000, cssClass: "erro",
                }
            ).present();
        }
    }

    forgotPassword() {
        let alert = this.alertCtrl.create({
            title: 'Esqueceu-se da palavra-passe?',
            message: 'Insira o email para o qual será enviada a reposição da sua palavra-passe',
            inputs: [{
                name: 'email',
                placeholder: 'e-mail'
            }
            ],
            buttons: [{
                text: 'Cancelar',
                role: 'Cancele',
                handler: data => {

                }
            },
                {
                    text: 'Enviar',
                    handler: data => {
                        //código p enviar email de redef da pass


                        //an error happened
                    }
                }]
        });
        alert.present();
    }

    saberMais() {

        const saberMais = this.modal.create(SaberMaisPage);
        saberMais.present();
    }

    verPass() {
        if (this.PasswordShow) {
            this.PasswordShow = false;
            this.PasswordType = 'password';
        } else {
            this.PasswordShow = true;
            this.PasswordType = 'text';
        }
    }

    registo() {


        this.navCtrl.push(RegistoPage);

    }
}
