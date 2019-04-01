import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ZenithListComponent } from './zenith-list/zenith-list.component';
import { ZenithService } from './zenith.service';

@NgModule({
  declarations: [
    AppComponent,
    ZenithListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ ZenithService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
