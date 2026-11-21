import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ApiService } from '../../core/services/api.service';
import { from, Subject } from 'rxjs';
import { BreadcrumbProps, ContentLayout, CustomTabComponent } from '../../shared';
import { inquiryBreadcrumb, reportBreadcrumb } from '../../shared/breadcrumb';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';
import { setWatermark } from '../../core/helpers/watermark.util';
@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss",
    "../../shared/styles/index.scss"
  ],
  standalone: true,
  imports: [
      ContentLayout,CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgbModule, BsDatepickerModule],
  providers: [DatePipe] // <-- Provide DatePipe here
})
export class ReportComponent implements OnInit {
  lastDownloadParams: any = null;
  canDownload: boolean = false;
  breadcrumb: BreadcrumbProps[] = reportBreadcrumb;

  isDropdownOpen = true;
  // TODO: MAKE ACCESS FOR EVERY OPTION IN SELECT
  isSubmitted: boolean = false;
  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
  reportForm: FormGroup;

  dateRange: Date[] | undefined;

  errorMsg: string = '';
  filterByActionOut: string = '';
  filterByUserOut: string = '';
  filterByTotalElements: any;
  filterByFromDate: NgbDate | undefined;
  filterByToDate: NgbDate | undefined;
  userList: any[] = [];
  dataList: any[] = [];
  actionList: any[] = [
    // {label: 'Create Rule', value: 'Create_Rule'},
    // {label: 'View Rule', value: 'View_Rule'},
    // {label: 'Edit Rule', value: 'Edit_Rule'},
    // {label: 'Delete Rule', value: 'Delete_Rule'},
    // {label: 'Approve Rule', value: 'Approve_Rule'},
    // {label: 'Reject Rule', value: 'Reject_Rule'},
    // {label: 'Create Draft Data Group', value: 'Create_Draft_Data_Group'},
    // {label: 'Create Data Group', value: 'Create_Data_Group'},
    // {label: 'View Data Group', value: 'View_Data_Group'},
    // {label: 'Edit Data Group', value: 'Edit_Data_Group'},
    // {label: 'Delete Data Group', value: 'Delete_Data_Group'},
    // {label: 'Approve Data Group', value: 'Approve_Data_Group'},
    // {label: 'Reject Data Group', value: 'Reject_Data_Group'},
    // {label: 'Edit Threshold', value: 'Edit_Threshold'},
    // {label: 'Delete Threshold', value: 'Delete_Threshold'},
    {label: 'Create Role', value: 'Create_Role'},
    {label: 'View Role', value: 'View_Role'},
    {label: 'Edit Role', value: 'Edit_Role'},
    {label: 'Delete Role', value: 'Delete_Role'},
    {label: 'Approve Role', value: 'Approve_Role'},
    {label: 'Reject Role', value: 'Reject_Role'},
    {label: 'Download Report', value: 'Download_Report'},
    {label: 'View Report', value: 'View_Report'},
    {label: 'Download Alert Detail', value: 'Download_Alert_Detail'},
    {label: 'Login', value: 'Login'},
    {label: 'Logout', value: 'Logout'},
    {label: 'Create BIN', value: 'Create_BIN'},
    {label: 'Edit BIN', value: 'Edit_BIN'},
    {label: 'Delete BIN', value: 'Delete_BIN'},
    {label: 'View BIN', value: 'View_BIN'},
    {label: 'Approve BIN', value: 'Approve_BIN'},
    {label: 'Reject BIN', value: 'Reject_BIN'},
    {label: 'Create Email Template', value: 'Create_Email_Template'},
    {label: 'Edit Email Template', value: 'Edit_Email_Template'},
    {label: 'Delete Email Template', value: 'Delete_Email_Template'},
    {label: 'View Email Template', value: 'View_Email_Template'},
    {label: 'Approve Email Template', value: 'Approve_Email_Template'},
    {label: 'Reject Email Template', value: 'Reject_Email_Template'},
    {label: 'Create Fraud Type', value: 'Create_Fraud_Type'},
    {label: 'Edit Fraud Type', value: 'Edit_Fraud_Type'},
    {label: 'Delete Fraud Type', value: 'Delete_Fraud_Type'},
    {label: 'View Fraud Type', value: 'View_Fraud_Type'},
    {label: 'Approve Fraud Type', value: 'Approve_Fraud_Type'},
    {label: 'Reject Fraud Type', value: 'Reject_Fraud_Type'},
    {label: 'Create Threshold', value: 'Create_Threshold'},
    {label: 'Edit Threshold', value: 'Edit_Threshold'},
    {label: 'Delete Threshold', value: 'Delete_Threshold'},
    {label: 'View Threshold', value: 'View_Threshold'},
    {label: 'Approve Threshold - Reviewer 1', value: 'Approve_Threshold_R1'},
    {label: 'Approve Threshold - Reviewer 2', value: 'Approve_Threshold_R2'},
    {label: 'Reject Threshold', value: 'Reject_Threshold'},
    {label: 'Create Notes', value: 'Create_Notes'},
    {label: 'Edit Notes', value: 'Edit_Notes'},
    {label: 'Delete Notes', value: 'Delete_Notes'},
    {label: 'View Notes', value: 'View Notes'},
    {label: 'Approve Notes', value: 'Approve Notes'},
    {label: 'Reject Notes', value: 'Reject Notes'},
    {label: 'Create Rule', value: 'Create_Rule'},
    {label: 'Create Draft New Rule', value: 'Create_Draft_New_Rule'},
    {label: 'Create Draft Edit Rule', value: 'Create_Draft_Edit_Rule'},
    {label: 'View Rule', value: 'View_Rule'},
    {label: 'Edit Rule', value: 'Edit_Rule'},
    {label: 'Delete Rule', value: 'Delete_Rule'},
    {label: 'Approve Rule - Reviewer 1', value: 'Approve_Rule_R1'},
    {label: 'Approve Rule - Reviewer 2', value: 'Approve_Rule_R2'},
    {label: 'Reject Rule', value: 'Reject_Rule'},
    {label: 'Create Draft Data Group', value: 'Create_Draft_Data_Group'},
    {label: 'Create Data Group', value: 'Create_Data_Group'},
    {label: 'View Data Group', value: 'View_Data_Group'},
    {label: 'Edit Data Group', value: 'Edit_Data_Group'},
    {label: 'Delete Data Group', value: 'Delete_Data_Group'},
//     {label: 'Approve Data Group', value: 'Approve_Data_Group'},
    {label: 'Reject Data Group', value: 'Reject_Data_Group'},
    {label: 'Approve Data Group - Reviewer 1', value: 'Approve_Data_Group_R1'},
    {label: 'Approve Data Group - Reviewer 2', value: 'Approve_Data_Group_R2'},
    {label: 'View Alert Queue', value: 'View_Alert_Queue'},
    {label: 'Create Alert Queue', value: 'Create_Alert_Queue'},
    {label: 'Edit Alert Queue', value: 'Edit_Alert_Queue'},
    {label: 'Delete Alert Queue', value: 'Delete_Alert_Queue'},
    {label: 'Approve Alert Queue - Reviewer 1', value: 'Approve_Alert_Queue_R1'},
    {label: 'Approve Alert Queue - Reviewer 2', value: 'Approve_Alert_Queue_R2'},
    {label: 'Reject Alert Queue', value: 'Reject_Alert_Queue'},





  ];
  reportTypeList = [
    { value: 'user_activity', label: 'Report User Activity' },
    // Add more types if needed
  ];

  isOwnUserReportType: boolean = true;
  userId: string = '';

  constructor(
    private datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly authService: AuthService,
    private readonly ngbDateParserFormatter: NgbDateParserFormatter,
    private readonly ngbCalendar: NgbCalendar
  ) {
    this.maxDate = new Date();
    this.reportForm = this.formBuilder.group({
      formReportType: [null, Validators.required],
      formReportDate: [''],
      formReportUserSelect: [''],
      formReportActionSelect: [''],
    });



  }
  reportTypeTouched: boolean = false;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeDropdown() {
    this.isDropdownOpen = false;
  }
  get formControls() {
    return this.reportForm.controls;
  }
  getFormControl(control: string) {
    return this.reportForm.get(control);
  }
  resetReport() {
    this.dateRange = [];
    this.fromDate = this.toDate = null;

    this.reportForm.reset({
      formReportType: this.getFormControl('formReportType')?.value,
      formReportDate: '',
      formReportUserSelect: '',
      formReportActionSelect: ''
    });
    this.errorMsg='';
    this.reportTypeTouched = false;
  }
  formatDateForApi(myDate: NgbDate | undefined): string | null {
    if (myDate) {
      return myDate.year + '-' + myDate.month + '-' + myDate.day;
    }
    return '';
  }
  applyReport() {
    if (this.reportForm.invalid || !this.fromDate) {
      this.errorMsg = 'Date is required!';
      this.isSubmitted=false;
      return;
    }
    this.errorMsg = '';
    this.isSubmitted=true;
    this.canDownload = true;
    this.isDropdownOpen = false;


    this.filterByFromDate = this.fromDate;
    this.filterByToDate = this.toDate;


    if(this.isOwnUserReportType === true) {
      this.getFormControl('formReportUserSelect')?.setValue([this.userId])
    }


    const data = {
      dateFrom: this.formatDateForApi(this.fromDate),
      dateTo: this.toDate ? this.formatDateForApi(this.toDate) : null,
      userId: this.getFormControl('formReportUserSelect')?.value,
      action: this.getFormControl('formReportActionSelect')?.value
    }


    const actions = this.getFormControl('formReportActionSelect')?.value;
    if(!actions || !Array.isArray(actions)) this.filterByActionOut = ''
    else this.filterByActionOut = actions.join(', ')

    const selectedIds = this.getFormControl('formReportUserSelect')?.value;
    if (!selectedIds || !Array.isArray(selectedIds)) this.filterByUserOut = '';
    else this.filterByUserOut = this.userList
      .filter(user => selectedIds.includes(user.userId))
      .map(user => user.label)
      .join(', ');



    this.ngxLoader.start();
    this.apiService.getUserActivityReportData(data).subscribe(
      (res: any) => {
        this.dataList = res['data']['content']
        this.filterByTotalElements = res['data']['totalElements']

        this.lastDownloadParams = { ...data };

        if(this.dataList.length > 0)
          setWatermark(this.userId);
        else{
          const container = document.querySelector('.watermark-container');
          if (container) container.innerHTML = '';
        }

      },
      (error: any) => {
        this.ngxLoader.stop();
      },
      () => {
        this.ngxLoader.stop();
      }
    )
  }
  downloadReport() {
    this.ngxLoader.start();
    if (!this.lastDownloadParams) return; // Safety check
    this.apiService.getUserActivityReportZip(this.lastDownloadParams).subscribe({
      next: (resp: any) => {
        // Get filename from header, fallback to default
        const contentDisposition = resp.headers.get('Content-Disposition');
        let filename = 'User_Activity_Files.zip';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match) filename = match[1];
        }
        // Create blob and trigger download
        const blob = new Blob([resp.body!], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        this.ngxLoader.stop();
      },
      error: (err: any) => {
        alert('Download failed!');
        this.ngxLoader.stop();
      }
    });
  }

  fromDateCreated: NgbDate | null | any;
  toDateCreated: NgbDate | null | any;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null | any;
  toDate: NgbDate | null | any;
  approvalHoveredDate: NgbDate | null = null;
  approvalFromDate: NgbDate | null | any;
  approvalToDate: NgbDate | null | any;
  maxDate: NgbDate | null | any;
  minDate: NgbDate | null | any;

  formattedDate(date: NgbDate) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, this.DEFAULT_DATE_FORMAT);
  }
  private diffInDays(date1: NgbDate, date2: NgbDate): number {
    const d1 = new Date(date1.year, date1.month - 1, date1.day);
    const d2 = new Date(date2.year, date2.month - 1, date2.day);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
  onDateSelection(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
        const fromDateFormatted = this.formattedDate(this.fromDate);

        // this.filterBy.update((prevValue) => ({
        //   ...prevValue,
        //   request_date_from: fromDateFormatted,
        // }));
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        const days = this.diffInDays(this.fromDate, date);
        if (days > 6) { // 0-based, jadi 6 = 7 hari
          this.errorMsg = 'Maximum date range is 7 days!';
          // Set otomatis ke 7 hari maksimal
          const maxToDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
          maxToDate.setDate(maxToDate.getDate() + 6);
          this.toDate = new NgbDate(maxToDate.getFullYear(), maxToDate.getMonth() + 1, maxToDate.getDate());
        } else {
          this.toDate = date;
          this.errorMsg = '';
        }

        // this.filterBy.update((prevValue) => ({
        //   ...prevValue,
        //   request_date_to: toDateFormatted,
        // }));
      } else {
        this.toDate = null;
        this.fromDate = date;
        const fromDateFormatted = this.formattedDate(this.fromDate);

        // this.filterBy.update((prevValue) => ({
        //   ...prevValue,
        //   request_date_from: fromDateFormatted,
        // }));
      }
      return;
    }
  }
  isHovered(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return (
        this.fromDate &&
        !this.toDate &&
        this.hoveredDate &&
        date.after(this.fromDate) &&
        date.before(this.hoveredDate)
      );
    }

    return (
      this.approvalFromDate &&
      !this.approvalToDate &&
      this.approvalHoveredDate &&
      date.after(this.approvalFromDate) &&
      date.before(this.approvalHoveredDate)
    );
  }

  outsideDay(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return date.after(this.maxDate) || date.before(this.minDate);
    }

    return date.after(this.maxDate) || date.before(this.minDate);
  }

  isInside(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return (
        this.toDate && date.after(this.fromDate) && date.before(this.toDate)
      );
    }
    return (
      this.approvalToDate &&
      date.after(this.approvalFromDate) &&
      date.before(this.approvalToDate)
    );
  }

  isRange(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return (
        date.equals(this.fromDate) ||
        (this.toDate && date.equals(this.toDate)) ||
        this.isInside(date, 'requestDate') ||
        this.isHovered(date, 'requestDate')
      );
    }

    return (
      date.equals(this.approvalFromDate) ||
      (this.toDate && date.equals(this.approvalToDate)) ||
      this.isInside(date, 'approvalDate') ||
      this.isHovered(date, 'approvalDate')
    );
  }
  formatDate(myDate: NgbDate | undefined, isToDate: boolean = false): string {
    if (myDate) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const day = myDate.day.toString().padStart(2, '0');
      const month = months[myDate.month - 1];
      const year = myDate.year;
      return ((isToDate) ? ' to ' : '') + `${day}-${month}-${year}`;
    }
    return '';
  }
  displayRequestedDate(): string {
    if (this.fromDate && this.toDate) {
      return `${this.formatDate(this.fromDate)} - ${this.formatDate(this.toDate)}`;
    } else if (this.fromDate) {
      return this.formatDate(this.fromDate);
    }
    return '';
  }


  ngOnInit(): void {


    this.ngxLoader.start();

    const currentUser = this.authService.currentUserValue;
    let profileUser: User | null = null;
    const localStorageItem = localStorage.getItem(btoa('profileUser'));
    if (localStorageItem) {
      try {
        profileUser = JSON.parse(atob(localStorageItem));
      } catch (e) {
        profileUser = null;
      }
    }
    if (currentUser) {
      if (profileUser) {
        this.userId = profileUser.userId;

        console.log("USERINFO", profileUser)
        if (profileUser.menuCode.indexOf('REPORT-REPORTUSERACTIVITY-OWNUSER') !== -1) {
          this.isOwnUserReportType = true;
        }
        else if(profileUser.menuCode.indexOf('REPORT-REPORTUSERACTIVITY-ALLUSERS') !== -1) {

          this.isOwnUserReportType = false;
        }
      }
    }







    const today = new Date();
    this.maxDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setDate(today.getDate() - 180);
    this.minDate = new NgbDate(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth() + 1, threeMonthsAgo.getDate());

    this.apiService.getUserReport().subscribe(
      (res: any) => {
        this.userList = res['data'].map((user: any) => ({
          ...user,
          label: `${user.userId} - ${user.fullName}`
        }));
      },
      (error: any) => {
        this.ngxLoader.stop();
      },
      () => {

        this.ngxLoader.stop();
      }
    );
  }

  searchInput$ = new Subject<string>();
  onUserSearch(term: string) {
    this.searchInput$.next(term);
  }
}
