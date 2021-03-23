import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthorizedUser } from '../shared/interfaces';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.sass']
})
export class AdminStatisticsComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
}
