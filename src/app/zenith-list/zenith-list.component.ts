import { Component, OnInit } from '@angular/core';
import { ZenithService } from '../zenith.service';

@Component({
  selector: 'zenith-list',
  templateUrl: './zenith-list.component.html',
  styleUrls: ['./zenith-list.component.css']
})
export class ZenithListComponent implements OnInit {

  events: any[];

  constructor(private zenithService: ZenithService) { }

  ngOnInit() {
    this.zenithService.getZenith()
      .then((e:any[]) => {
        this.events = e.map((s) => {
          return s;
        });
      });
  }
}