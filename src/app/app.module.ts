import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './commom/components/header/header.component';
import { InfoComponent } from './commom/components/info/info.component';
import { HomeComponent } from './home/home.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { SampleChartComponent } from './commom/components/sample-chart/sample-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        InfoComponent,
        HomeComponent,
        HeatMapComponent,
        SampleChartComponent,
        BarChartComponent,
        PieChartComponent,
        LineChartComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ModalModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
