import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';


import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';


//plugins base dados
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from "@angular/http";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "../../node_modules/angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import * as firebase from 'firebase/app';

//paginas

import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';


import {LoginPage} from "../pages/login/login";
import {SaberMaisPage} from "../pages/saber-mais/saber-mais";
import {DefinirContatosPage} from "../pages/definir-contatos/definir-contatos";
import {EditarDadosPessoaisPage} from "../pages/editar-dados-pessoais/editar-dados-pessoais";
import {FirebaseProvider} from '../providers/firebase/firebase';
import {RegistoPage} from "../pages/registo/registo";


//plugins chamada
import {CallNumber} from '@ionic-native/call-number';
import {LongPressModule} from "ionic-long-press";


//plugin geolcalizçao
import {BackgroundGeolocation} from '@ionic-native/background-geolocation'


//Plugin carregar foto
import {FileChooser} from "@ionic-native/file-chooser";
import {File} from '@ionic-native/file';


//plugin background
import {BackgroundMode} from '@ionic-native/background-mode'

//plugin sensor
import {DeviceMotion} from '@ionic-native/device-motion'


const firebaseConfig = {
    apiKey: "AIzaSyBJh98wEsKjcvJqbPgQXScPmg6-5E006GY",
    authDomain: "yappofficial.firebaseapp.com",
    databaseURL: "https://yappofficial.firebaseio.com",
    projectId: "yappofficial",
    storageBucket: "yappofficial.appspot.com",
    messagingSenderId: "820804375872"
};

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        LoginPage,
        SaberMaisPage,
        DefinirContatosPage,
        EditarDadosPessoaisPage,
        RegistoPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        HttpModule,
        HttpClientModule,
        LongPressModule,

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        LoginPage,
        SaberMaisPage,
        DefinirContatosPage,
        RegistoPage,
        EditarDadosPessoaisPage,
    ],
    providers: [
        StatusBar,
        SplashScreen, CallNumber, BackgroundGeolocation,
        FileChooser,File, BackgroundMode,DeviceMotion,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        FirebaseProvider
    ]
})
export class AppModule {
}
