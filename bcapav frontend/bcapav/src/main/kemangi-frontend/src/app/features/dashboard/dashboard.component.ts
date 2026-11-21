import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe] // <-- Provide DatePipe here
})
export class DashboardComponent implements OnInit {
  today: Date | undefined;
  formattedToday: string | undefined;
  fullName: string | undefined = '';
  roleName: string | undefined = '';

  constructor(private datePipe: DatePipe, private ngxLoader: NgxUiLoaderService) {}

  ngOnInit(): void {
    this.ngxLoader.start();
    this.today = new Date();
    this.formattedToday = this.datePipe.transform(
      this.today,
      'EEEE, dd MMMM yyyy | HH.mm'
    ) || '';


    if (localStorage.getItem(btoa('profileUser'))) {
          
      const encodedUser = localStorage.getItem(btoa('profileUser'));
      let parsedUser: User | null = null;
      if (encodedUser) {
        try {
          parsedUser = JSON.parse(atob(encodedUser));
        } catch (e) {
          parsedUser = null;
        }
      }

      this.fullName = parsedUser?.fullName;
      this.roleName = parsedUser?.roleName;
    }
    this.ngxLoader.stop();
  }
}