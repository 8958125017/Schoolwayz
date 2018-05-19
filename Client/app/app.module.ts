import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { CommonAppModule } from './commonapp/commonapp.module';
//import { CoreModule } from './core/core.module';
//import { HomeModule } from './home/home.module';
import { OrderListModule } from 'primeng/primeng';
//import { ApiTranslationLoader } from './shared/services/api-translation-loader.service';

import { routing } from './app.routes';
import { AppService } from './app.service';
//import { appReducer } from './app-store';
import { AppComponent } from './app.component';
import { AuthGuard } from './util/auth.guard';

// Components
import { ComponentsModule } from './components/components.module';
import { FilterPipe } from './services/filter.pipe';

@NgModule({
    declarations: [
        AppComponent,
        FilterPipe       
    ],
    imports: [       
        BrowserAnimationsModule,
        BrowserModule,
        routing,
        OrderListModule,
        // FormsModule,
        HttpModule,
        // Only module that app module loads
        //CoreModule.forRoot(),
        //CommonAppModule.forRoot(),
        //HomeModule,
        ComponentsModule.forRoot(),
        //StoreModule.provideStore(appReducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension()
        //TranslateModule.forRoot({ loader: { provide: TranslateLoader } })
    ],
    providers: [
        AppService,AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
