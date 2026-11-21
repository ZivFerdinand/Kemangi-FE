import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDate, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { inquiryBreadcrumb } from '../../../shared/breadcrumb';
import { BreadcrumbProps, ContentLayout } from '../../../shared';
import { User } from '../../../core/models/user';
import { Rule } from '../../../core/models/rule';
import { setWatermark } from '../../../core/helpers/watermark.util';
import { ModelAlert } from '../../../core/models/model-alert';
function combineDateTime(date: Date | undefined, time: string | undefined): Date | null {
  if (!date || !time || !isValidTimeFormat(time)) return null;
  const [h, m, s] = time.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, s, 0);
  return d;
}

export function occuredOnValidator(): ValidatorFn {
  return (group: AbstractControl): { [key: string]: any } | null => {
    const dateRange = group.get('dateRange')?.value as [Date | null, Date | null];
    const timeFrom: string | undefined = group.get('formOccuredOnTimeFrom')?.value;
    const timeTo: string | undefined = group.get('formOccuredOnTimeTo')?.value;

    if (!dateRange || !dateRange[0] || !timeFrom || !timeTo) {
      return { occuredOnIncomplete: true };
    }

    if (!isValidTimeFormat(timeFrom) || !isValidTimeFormat(timeTo)) {
      return { occuredOnTimeFormatInvalid: true };
    }

    const dtFrom = combineDateTime(dateRange[0], timeFrom);

    if (!dtFrom) {
      return { occuredOnInvalid: true };
    }

    if (dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays > 2) {
        return { occuredOnMaxDaysInvalid: true };
      }
      if (combineDateTime(dateRange[1], timeTo)) {
        const dtTo = combineDateTime(dateRange[1], timeTo);
        if (dtTo) {
          if (dtTo < dtFrom)
            return { occuredOnOrderInvalid: true };
        }
      }
    }
    return null;
  };
}
function isValidTimeFormat(time: string): boolean {
  // Regex for HH:mm:ss (24h), allowing 00:00:00 to 23:59:59
  return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);
}

function timeToSeconds(time: string): number {
  if (!isValidTimeFormat(time)) return NaN;
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

export function dateTimeRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const filterGroup = control as FormGroup;
    const selectionFilter = filterGroup.get('selectionFilter')?.value;

    if (selectionFilter === 'Date') {
      const dateRangeValue = filterGroup.get('filterValue')?.value;
      const timeFromValue = filterGroup.get('timeFrom')?.value;
      const timeToValue = filterGroup.get('timeTo')?.value;

      const isDateValid = dateRangeValue && dateRangeValue[0] && dateRangeValue[1];

      // Both times must be filled or both empty
      const isTimeValidPair = (timeFromValue && timeToValue);

      if (!isDateValid || !isTimeValidPair) {
        return { dateTimeRangeIncomplete: true };
      }

      // If both times are filled, check format and order
      if (!isValidTimeFormat(timeFromValue) || !isValidTimeFormat(timeToValue)) {
        return { timeFormatInvalid: true };
      }
      if ((dateRangeValue[1].getTime() == dateRangeValue[0].getTime()) && timeToSeconds(timeToValue) <= timeToSeconds(timeFromValue)) {
        return { timeOrderInvalid: true };
      }
    }
    return null;
  };
}
export function rangeNumericValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const filterGroup = control as FormGroup;
    const selectionFilter = filterGroup.get('selectionFilter')?.value;

    if (selectionFilter === 'Range') {
      const timeFrom = filterGroup.get('timeFrom')?.value;
      const timeTo = filterGroup.get('timeTo')?.value;

      if (timeFrom === null || timeFrom === undefined || timeTo === null || timeTo === undefined || timeFrom === '' || timeTo === '') {
        return { rangeIncomplete: true };
      }
      if (isNaN(+timeFrom) || isNaN(+timeTo)) {
        return { rangeNotNumeric: true };
      }
      if (timeFrom > timeTo) {
        return { rangeInvalidOrder: true }
      }
    }
    return null;
  };
}




@Component({
  selector: "app-inquiry",
  templateUrl: "./inquiry.component.html",
  styleUrls: ["./inquiry.component.scss",
    "../../../shared/styles/index.scss"
  ],
  standalone: true,
  imports: [ContentLayout, CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgbModule, BsDatepickerModule],
  providers: [DatePipe] // <-- Provide DatePipe here
})
export class InquiryComponent implements OnInit {
  productTypeTouched: boolean = false;
  ruleIdTouched: boolean = false;
  modelIdTouched: boolean = false;


  lastDownloadParams: any = null;
  canDownload: boolean = false;

  breadcrumb: BreadcrumbProps[] = inquiryBreadcrumb;
  fromDate: NgbDate | null | any;
  toDate: NgbDate | null | any;
  occuredOnOut: string = '';
  // For dynamic filters: use index as key
  dynamicFromDate: { [key: number]: NgbDate | null | any } = {};
  dynamicToDate: { [key: number]: NgbDate | null | any } = {};
  maxDate: NgbDate | null | any;
  minDate: NgbDate | null | any;

  isDropdownOpen = true;
  isSubmitted: boolean = false;
  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
  inquiryForm: FormGroup;

  dateRange: Date[] | undefined;

  postData: any = '';

  errorMsg: string = '';
  filterByActionOut: string = '';
  filterByUserOut: string = '';
  filterByTotalElements: any;
  dataList: any[] = [];
  columnKeys: string[] = [];

  searchText: string = '';
  selectedAllFieldList: string[] = [];
  selectedSelFieldList: string[] = [];

  oriAllFieldList: { value: string; selectionFilter: string; key: string; dataType: string; }[] = [];
  oriSelectedFieldList: { value: string; selectionFilter: string; key: string; dataType: string; }[] = [];

  allFieldList: string[] = [];
  selectedFieldList: string[] = [];

  apiAlertMasterData: any;
  userId: string = '';
  apiProductList: string[] = [];

  filteredAllFieldList(): string[] {
    if (!this.searchText) return this.allFieldList;
    return this.allFieldList.filter(u =>
      u.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  toggleAllFieldList(data: string) {
    const idx = this.selectedAllFieldList.indexOf(data);
    if (idx > -1) {
      this.selectedAllFieldList.splice(idx, 1);
    } else {
      this.selectedAllFieldList.push(data);
    }
  }

  toggleSelFieldList(data: string) {
    const idx = this.selectedSelFieldList.indexOf(data);
    if (idx > -1) {
      this.selectedSelFieldList.splice(idx, 1);
    } else {
      this.selectedSelFieldList.push(data);
    }
  }

  addFieldToSelected() {
    this.selectedAllFieldList.forEach(field => {
      if (!this.selectedFieldList.includes(field)) {
        this.selectedFieldList.push(field);
      }
      this.allFieldList = this.allFieldList.filter(f => f !== field);
    });
    this.selectedAllFieldList = [];
  }

  removeFieldFromSelected() {
    this.selectedSelFieldList.forEach(field => {
      if (!this.allFieldList.includes(field)) {
        this.allFieldList.push(field);
      }
      this.selectedFieldList = this.selectedFieldList.filter(f => f !== field);
    });
    this.selectedSelFieldList = [];
  }

  moveUp() {
    for (let i = 1; i < this.selectedFieldList.length; i++) {
      const current = this.selectedFieldList[i];
      const prev = this.selectedFieldList[i - 1];
      if (this.selectedSelFieldList.includes(current) && !this.selectedSelFieldList.includes(prev)) {
        [this.selectedFieldList[i - 1], this.selectedFieldList[i]] = [current, prev];
      }
    }
  }
  moveDown() {
    for (let i = this.selectedFieldList.length - 2; i >= 0; i--) {
      const current = this.selectedFieldList[i];
      const next = this.selectedFieldList[i + 1];
      if (this.selectedSelFieldList.includes(current) && !this.selectedSelFieldList.includes(next)) {
        [this.selectedFieldList[i], this.selectedFieldList[i + 1]] = [next, current];
      }
    }
  }

  resetFieldList() {
    this.selectedFieldList = this.oriSelectedFieldList.map(item => item.value);
    this.allFieldList = this.oriAllFieldList.map(item => item.value);

    this.selectedAllFieldList = [];
    this.selectedSelFieldList = [];
  }


  constructor(
    private datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly ngxLoader: NgxUiLoaderService,
    private modalService: NgbModal,
  ) {

    const today = new Date();
    this.maxDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setDate(today.getDate() - 90);
    this.minDate = new NgbDate(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth() + 1, threeMonthsAgo.getDate());
    this.inquiryForm = this.formBuilder.group({
      formInquiryType: [null, Validators.required],
      formAllFieldsSearchControl: [''],
      formOccuredOnTimeFrom: [null],
      formOccuredOnTimeTo: [null],
      dateRange: [[today, undefined]],
      formAdditionalFilters: this.formBuilder.array([])
    }, { validators: occuredOnValidator() });
    this.fromDate = this.maxDate;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeDropdown() {
    this.isDropdownOpen = false;
  }
  get formControls() {
    return this.inquiryForm.controls;
  }
  getFormControl(control: string) {
    return this.inquiryForm.get(control);
  }
  get filterSummaryRows(): Array<Array<{ label: string, value: string }>> {
    // Prepare all label/value pairs: static + dynamic
    const pairs: { label: string, value: string }[] = [
      { label: 'OCCURREDON', value: this.occuredOnOut },
      { label: 'RULEID', value: this.selectedIds.join(', ') }
    ];

    if (this.selectedModelIds.length !== 0) {
      pairs.push({ label: 'MODEL_ID', value: this.selectedModelIds.join(', ') });
    }
    pairs.push({ label: 'TOTAL DATA', value: (this.filterByTotalElements ?? 0).toLocaleString('id-ID') });

    // Add dynamic filters
    this.filters.controls.forEach(filter => {
      const show = filter.get('selectionFilter')?.value === 'Freetext'
        ? filter.get('filterValue')?.value
        : (
          filter.get('filterValue')?.value?.[0] ||
          filter.get('filterValue')?.value?.[1] ||
          filter.get('timeFrom')?.value ||
          filter.get('timeTo')?.value
        );
      if (show) {
        let value = '';
        if (filter.get('selectionFilter')?.value === 'Freetext') {
          value = filter.get('filterValue')?.value;
        } else if (filter.get('selectionFilter')?.value === 'Date') {
          value =
            (filter.get('filterValue')?.value?.[0] ? this.formatDateForApi(filter.get('filterValue')?.value[0], 'dd-MMM-yyyy') : '') +
            (filter.get('timeFrom')?.value ? ' ' + filter.get('timeFrom')?.value : '') +
            ' to ' +
            (filter.get('filterValue')?.value?.[1] ? this.formatDateForApi(filter.get('filterValue')?.value[1], 'dd-MMM-yyyy') : '') +
            (filter.get('timeTo')?.value ? ' ' + filter.get('timeTo')?.value : '');
        } else if (filter.get('selectionFilter')?.value === 'Range') {
          value = filter.get('timeFrom')?.value + ' to ' + filter.get('timeTo')?.value;
        }
        pairs.push({ label: filter.get('value')?.value, value });
      }
    });

    // Chunk into rows of 3 pairs (6 tds per row)
    const rows: Array<Array<{ label: string, value: string }>> = [];
    for (let i = 0; i < pairs.length; i += 3) {
      rows.push(pairs.slice(i, i + 3));
    }
    return rows;
  }
  formatDateForApi(myDate: Date | undefined | null, type: string): string | null {
    if (myDate) {
      return this.datePipe.transform(myDate, type);
    }
    return null;
  }

  resetInquiry() {

    const today = new Date();
    this.fromDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.toDate = null;
    this.dateRange = undefined;
    this.inquiryForm.reset({
      formInquiryType: this.getFormControl('formInquiryType')?.value,
      formAllFieldsSearchControl: '',
      formOccuredOnTimeFrom: [null],
      formOccuredOnTimeTo: [null],
      dateRange: [today, null]
    });
    this.errorMsg = '';
    this.resetFieldList();
    this.filters.clear();

    this.dynamicFromDate = {};
    this.dynamicToDate = {};
    this.dynamicHoveredDate = {};
    this.availableFieldsPerIndex = [];

    this.selectedIds = [];
    this.selectedModelIds = [];
    this.canDownload = false;
    this.lastDownloadParams = null;
    this.productTypeTouched = false;
    this.ruleIdTouched = false;
    this.modelIdTouched = false;
  }
  get occuredOnTouched() {
    return (
      this.inquiryForm.get('dateRange')?.touched ||
      this.inquiryForm.get('formOccuredOnTimeFrom')?.touched ||
      this.inquiryForm.get('formOccuredOnTimeTo')?.touched
    );
  }
  applyInquiry() {
    this.errorMsg = '';
    this.inquiryForm.markAllAsTouched();
    this.inquiryForm.markAsDirty();
    this.ruleIdTouched = true;
    this.modelIdTouched = true;

    this.filters.controls.forEach(control => {
      control.markAllAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    this.filters.controls.forEach(control => {
      control.get('value')?.markAsTouched();
      control.get('value')?.markAsDirty();
      control.get('filterValue')?.markAsTouched();
      control.get('filterValue')?.markAsDirty();
      control.get('timeFrom')?.markAsTouched();
      control.get('timeFrom')?.markAsDirty();
      control.get('timeTo')?.markAsTouched();
      control.get('timeTo')?.markAsDirty();
      control.updateValueAndValidity();
    });

    this.inquiryForm.updateValueAndValidity();
    const dateRange = this.inquiryForm.get('dateRange')?.value as [Date | null, Date | null];
    const occDateFrom = dateRange?.[0];
    const occDateTo = dateRange?.[1] || occDateFrom;
    const occTimeFrom = this.getFormControl('formOccuredOnTimeFrom')?.value;
    const occTimeTo = this.getFormControl('formOccuredOnTimeTo')?.value;

    if (this.selectedFieldList.length === 0) {
      this.errorMsg = 'SelectedField is required'
      this.isSubmitted = false;
      return;
    }
    if (this.inquiryForm.errors?.['occuredOnIncomplete']) {
      this.errorMsg = 'OCCURREDON: Both dates and both times must be filled!';
      this.isSubmitted = false;
      return;
    }
    if (this.inquiryForm.errors?.['occuredOnTimeFormatInvalid']) {
      this.errorMsg = 'OCCURREDON: Time must be in HH:mm:ss format!';
      this.isSubmitted = false;
      return;
    }
    if (this.inquiryForm.errors?.['occuredOnOrderInvalid']) {
      this.errorMsg = 'OCCURREDON: End date/time must be after start date/time!';
      this.isSubmitted = false;
      return;
    }
    if (this.selectedIds.length === 0 && this.selectedModelIds.length === 0) {
      this.errorMsg = 'RULEID, MODEL_ID, or both are required';
      this.isSubmitted = false;
      return;
    }
    if (this.inquiryForm.get('formInquiryType')?.invalid) {
      this.errorMsg = 'Product is required';
      this.isSubmitted = false;
      return;
    }

    if (this.filters.invalid) {
      this.errorMsg = 'Some additional filters are incomplete or invalid!';
      this.isSubmitted = false;
      return;
    }
    this.ngxLoader.start();
    this.isSubmitted = true;
    this.isDropdownOpen = false;


    this.occuredOnOut = (this.inquiryForm.get('dateRange')?.value[0] ? this.formatDateForApi(this.inquiryForm.get('dateRange')?.value[0], 'dd-MMM-yyyy') : '') +
      (this.formControls['formOccuredOnTimeFrom'].value ? ' ' + this.formControls['formOccuredOnTimeFrom'].value : '') +
      ' to ' +
      (this.inquiryForm.get('dateRange')?.value[1] ? this.formatDateForApi(this.inquiryForm.get('dateRange')?.value[1], 'dd-MMM-yyyy') : '') +
      (this.formControls['formOccuredOnTimeTo'].value ? ' ' + this.formControls['formOccuredOnTimeTo'].value : '')
      ;
    const filteredField: { [key: string]: string | null } = {
      '': ''
    };
    this.filters.value.forEach((filter: any) => {
      if (filter.value) {
        if (filter.selectionFilter === 'Freetext' && filter.filterValue) {
          filteredField[filter.value] = filter.filterValue;
        } else if (filter.selectionFilter === 'Date' && filter.filterValue?.[0] && filter.filterValue?.[1]) {
          const dateFrom = this.formatDateForApi(filter.filterValue[0], 'yyyy-MM-dd');
          const dateTo = this.formatDateForApi(filter.filterValue[1], 'yyyy-MM-dd');
          const timeFrom = filter.timeFrom || '00:00:00';
          const timeTo = filter.timeTo || '23:59:59';

          if (dateFrom && dateTo) {
            filteredField[filter.value] = `${dateFrom} ${timeFrom} to ${dateTo} ${timeTo}`;
          }
        } else if (filter.selectionFilter === 'Range' && filter.timeFrom !== '' && filter.timeTo !== '') {
          filteredField[filter.value] = `${filter.timeFrom} to ${filter.timeTo}`;
        }
      }
    });

    const mandatoryDateFrom = this.formatDateForApi(occDateFrom, 'yyyy-MM-dd');
    const mandatoryDateTo = this.formatDateForApi(occDateTo, 'yyyy-MM-dd');

    this.postData = {
      product: this.getFormControl('formInquiryType')?.value,
      selectedField: this.selectedFieldList,
      filteredField: filteredField,

      dateFrom: mandatoryDateFrom,
      dateTo: mandatoryDateTo,
      timeFrom: occTimeFrom,
      timeTo: occTimeTo,

      ruleId: this.selectedIds,
      modelId: this.selectedModelIds
    };


    this.apiService.getAlertInquiry(this.postData).subscribe(
      (res: any) => {
        this.dataList = res['data']['content'];
        this.filterByTotalElements = res['data']['totalElements']
        if (this.dataList.length > 0) {
          this.columnKeys = Object.keys(this.dataList[0]);
          setWatermark(this.userId);
        } else {
          this.columnKeys = ['OCCUREDON', 'RULEID'];
          const container = document.querySelector('.watermark-container');
          if (container) container.innerHTML = '';
        }

        this.lastDownloadParams = { ...this.postData };
        this.canDownload = true;
      },
      (error: any) => {
        this.ngxLoader.stop();
        console.error("API Error:", error);
        this.canDownload = false;
      },
      () => {
        this.ngxLoader.stop();
      }
    );
  }

  downloadInquiry() {
    this.ngxLoader.start();
    this.apiService.getAlertInquiryZip(this.lastDownloadParams).subscribe({ // <-- Gunakan postDataForDownload
      next: (resp: HttpResponse<Blob>) => {
        const contentDisposition = resp.headers.get('Content-Disposition');
        let filename = `Alert_${this.postData.product}.zip`; // <-- Gunakan template literal
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match) filename = match[1];
        }
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
      error: (err) => {
        alert('Download failed!');
        this.ngxLoader.stop();
        console.error("Download Error:", err);
      }
    });
  }


  ngOnInit(): void {
    this.ngxLoader.start();

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

      this.userId = parsedUser?.userId || 'unknown';
    }
    const dr = this.inquiryForm.get('dateRange')?.value;
    if (dr && dr[0]) this.fromDate = this.jsDateToNgbDate(dr[0]);
    if (dr && dr[1]) this.toDate = this.jsDateToNgbDate(dr[1]);
    this.inquiryForm.get("formInquiryType")?.valueChanges.subscribe((val) => {
      if (val) {
        this.filters.clear();
        this.selectedIds = [];
        this.selectedModelIds = [];
        this.fetchMasterAlertData(val);

        this.apiService.getRuleAlertDetail(this.inquiryForm.get("formInquiryType")?.value).subscribe(
          (res: any) => {
            this.ruleList = res.data.content.map((rule: any) => ({
              id: rule.ruleId,
              ruleDesc: rule.ruleDescShort,
              selected: false
            }));
          },
          (error: any) => {
            this.ngxLoader.stop();
          },
          () => {
            this.ngxLoader.stop();
          }
        );

        if (val === 'KBB (Fin)' || val === 'myBCA') {
          this.apiService.getModelAlertDetail(this.inquiryForm.get("formInquiryType")?.value).subscribe(
            (res: any) => {
              this.modelAlertList = res.data.content.flatMap((modelAlert: any) => {
                const modelIdParts = modelAlert.modelId.split('~|~');

                const commonModelDesc = modelAlert.modelDescription;

                return modelIdParts.map((part: string) => ({
                  id: part,
                  modelDesc: commonModelDesc,
                  selected: false
                }));
              });
            },
            (error: any) => {
              this.ngxLoader.stop();
            },
            () => {
              this.ngxLoader.stop();
            }
          );
        }
      } else {
        this.oriSelectedFieldList = [];
        this.oriAllFieldList = [];
        this.selectedFieldList = [];
        this.allFieldList = [];
        this.filters.clear();
        this.selectedIds = [];
        this.selectedModelIds = [];
      }
    });

    if (this.inquiryForm.get("formInquiryType")?.value) {
      this.fetchMasterAlertData(this.inquiryForm.get("formInquiryType")?.value);
    }

    this.inquiryForm.get("formAllFieldsSearchControl")?.valueChanges.subscribe((val) => {
      this.searchText = val;
    });

    this.apiService.getMasterProductList().subscribe(
      (res: any) => {
        this.apiProductList = (res.data || []).map((v: string) => ({ label: v, value: v }));
      },
      (error: any) => {
        this.ngxLoader.stop();
        console.error("Error fetching master product list data:", error);
      },
      () => {
        this.ngxLoader.stop();
      }
    );


    this.ngxLoader.stop();
  }

  fetchMasterAlertData(productType: string) {
    const data = {
      product_type: productType,
    };

    this.ngxLoader.start();
    this.apiService.getMasterAlert(data).subscribe(
      (res: any) => {
        this.apiAlertMasterData = res.data;

        this.allSelected = false;
        this.allSelectedModelAlert = false;
        this.ruleIdTouched = false;
        this.modelIdTouched = false;
        this.selectedAllFieldList = [];
        this.selectedSelFieldList = [];

        this.oriSelectedFieldList = this.apiAlertMasterData
          .filter((item: { selectedField: any; }) => item.selectedField)
          .map((item: any) => ({
            value: item.value,
            selectionFilter: item.selectionFilter,
            key: item.key,
            dataType: item.dataType
          }));

        this.oriAllFieldList = this.apiAlertMasterData
          .filter((item: { selectedField: any; }) => !item.selectedField)
          .map((item: any) => ({
            value: item.value,
            selectionFilter: item.selectionFilter,
            key: item.key,
            dataType: item.dataType
          }));

        this.selectedFieldList = this.oriSelectedFieldList.map(item => item.value);
        this.allFieldList = this.oriAllFieldList.map(item => item.value);

      },
      (error: any) => {
        this.ngxLoader.stop();
        console.error("Error fetching master alert data:", error);
      },
      () => {
        this.ngxLoader.stop();
      }
    );
  }


  isModalOpen = false;

  openModal(event: Event, content: any): void {
    event.preventDefault();
    this.modalService.open(content, {
      scrollable: true,
      size: "lg",
      centered: true,
      windowClass: "modal-holder",
    });
  }


  ruleList: Rule[] = [];
  modelAlertList: ModelAlert[] = [];
  allSelected: boolean = false;
  allSelectedModelAlert: boolean = false;
  selectAllRules() {
    this.ruleList.forEach(r => r.selected = this.allSelected);
  }
  selectedIds: string[] = [];
  selectAllModels() {
    this.modelAlertList.forEach(r => r.selected = this.allSelectedModelAlert);
  }
  selectedModelIds: string[] = [];


  onSelectRuleIds(close: Function) {
    this.selectedIds = this.ruleList
      .filter(rule => rule.selected)
      .map(rule => rule.id);
    close(this.selectedIds);
  }

  onSelectModelIds(close: Function) {
    this.selectedModelIds = this.modelAlertList
      .filter(rule => rule.selected)
      .map(rule => rule.id);
    close(this.selectedModelIds);
  }

  removeItem(item: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectedIds = this.selectedIds.filter(i => i !== item);
    const rule = this.ruleList.find(r => r.id === item);
    if (rule) {
      rule.selected = false;
    }
  }
  removeModelItem(item: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectedModelIds = this.selectedModelIds.filter(i => i !== item);
    const model = this.modelAlertList.find(r => r.id === item);
    if (model) {
      model.selected = false;
    }
  }


  get filters(): FormArray {
    return this.inquiryForm.get('formAdditionalFilters') as FormArray;
  }

  addEmptyFilter() {
    const availableFields = this.getAvailableFields();
    if (availableFields.length > 0) {
      this.filters.push(this.formBuilder.group({
        value: [null, Validators.required],
        key: [null],
        selectionFilter: [null],
        filterValue: [null],
        timeFrom: [null],
        timeTo: [null]
      }, {
        validators: [
          dateTimeRangeValidator(), // untuk Date
          rangeNumericValidator()   // untuk Range
        ]
      }));
      this.updateAvailableFields();

    } else {
      console.warn("Tidak ada lagi field yang bisa ditambahkan!");
    }
    this.updateAvailableFields();
  }

  availableFieldsPerIndex: Array<{ value: string; selectionFilter: string; key: string; dataType: string; }[]> = [];
  updateAvailableFields() {
    this.availableFieldsPerIndex = this.filters.controls.map((ctrl, i) => this.getAvailableFields(i));
  }
  getAvailableFields(editingIndex?: number): { value: string; selectionFilter: string; key: string; dataType: string; }[] {
    const allMasterFields = [...this.oriAllFieldList, ...this.oriSelectedFieldList]
      .sort((a, b) => a.value.localeCompare(b.value));

    const excludedFields = ['OCCURREDON', 'RULEID'];

    const filteredMasterFields = allMasterFields.filter(field => !excludedFields.includes(field.value));

    const usedValues = this.filters.controls
      .map((f, i) => i === editingIndex ? null : f.get('value')?.value)
      .filter(v => v);

    return filteredMasterFields.filter(f => !usedValues.includes(f.value));
  }
  onFieldSelected(index: number) {
    const filterGroup = this.filters.at(index) as FormGroup;
    const selectedValue = filterGroup.get('value')?.value;

    const allMasterFields = [...this.oriAllFieldList, ...this.oriSelectedFieldList].sort();
    const fieldObj = allMasterFields.find(f => f.value === selectedValue);

    if (fieldObj) {
      filterGroup.patchValue({
        key: fieldObj.key,
        selectionFilter: fieldObj.selectionFilter,
        filterValue: fieldObj.selectionFilter === 'Date' ? [null, null] : '',
        timeFrom: fieldObj.selectionFilter === 'Range' ? '' : '',
        timeTo: fieldObj.selectionFilter === 'Range' ? '' : ''
      });

      // Set validators for filterValue
      if (fieldObj.selectionFilter === 'Freetext') {
        filterGroup.get('filterValue')?.setValidators([Validators.required]);
      } else {
        filterGroup.get('filterValue')?.clearValidators();
      }
      filterGroup.get('filterValue')?.updateValueAndValidity();
      filterGroup.updateValueAndValidity();
      this.updateAvailableFields();

    }
  }
  private reindexDynamicState(obj: { [key: number]: any }, removedIndex: number): { [key: number]: any } {
    const newObj: { [key: number]: any } = {};

    Object.keys(obj).forEach(key => {
      const oldIndex = +key;

      if (oldIndex < removedIndex) {
        newObj[oldIndex] = obj[oldIndex];
      } else if (oldIndex > removedIndex) {
        newObj[oldIndex - 1] = obj[oldIndex];
      }
    });

    return newObj;
  }
  removeFilterAt(index: number) {
    this.filters.removeAt(index);


    this.dynamicFromDate = this.reindexDynamicState(this.dynamicFromDate, index);
    this.dynamicToDate = this.reindexDynamicState(this.dynamicToDate, index);
    this.dynamicHoveredDate = this.reindexDynamicState(this.dynamicHoveredDate, index);
    this.updateAvailableFields();
  }
  ngbToDate(ngbDate: NgbDate | null): Date | null {
    return ngbDate ? new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day) : null;
  }
  jsDateToNgbDate(date: Date | null | undefined): NgbDate | undefined {
    return date ? new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) : undefined;
  }

  // OCCURREDON display
  displayOccuredOnDate(): string {
    if (this.fromDate && this.toDate) {
      return `${this.formatDateForApi(this.ngbToDate(this.fromDate), 'dd-MMM-yyyy')} - ${this.formatDateForApi(this.ngbToDate(this.toDate), 'dd-MMM-yyyy')}`;
    } else if (this.fromDate) {
      return this.formatDateForApi(this.ngbToDate(this.fromDate), 'dd-MMM-yyyy') || '';
    }
    return '';
  }

  // Dynamic filter display
  displayDynamicDate(idx: number): string {
    const from = this.dynamicFromDate[idx];
    const to = this.dynamicToDate[idx];
    if (from && to) {
      return `${this.formatDateForApi(this.ngbToDate(from), 'dd-MMM-yyyy')} - ${this.formatDateForApi(this.ngbToDate(to), 'dd-MMM-yyyy')}`;
    } else if (from) {
      return this.formatDateForApi(this.ngbToDate(from), 'dd-MMM-yyyy') || '';
    }
    return '';
  }
  onOccuredOnDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.inquiryForm.get('dateRange')?.setValue([this.ngbToDate(this.fromDate), null]);
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.inquiryForm.get('dateRange')?.setValue([this.ngbToDate(this.fromDate), this.ngbToDate(this.toDate)]);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.inquiryForm.get('dateRange')?.setValue([this.ngbToDate(this.fromDate), null]);
    }
  }
  setInputFormTouched(ctrl: string) {
    if (ctrl === 'ruleId') {
      this.ruleIdTouched = true;
      return;
    }
    if (ctrl === 'modelId') {
      this.modelIdTouched = true;
      return;
    }

    this.inquiryForm.get(ctrl)?.markAsTouched();
    this.inquiryForm.get(ctrl)?.markAsDirty();
  }
  setInputFormTouchedDynamic(idx: number) {
    this.filters.at(idx).get('filterValue')?.markAsTouched();
    this.filters.at(idx).get('filterValue')?.markAsDirty();
    return;
  }
  // Dynamic filter
  onDynamicDateSelection(date: NgbDate, idx: number) {
    if (!this.dynamicFromDate[idx] && !this.dynamicToDate[idx]) {
      this.dynamicFromDate[idx] = date;
      this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(date), this.ngbToDate(date)]);
    } else if (this.dynamicFromDate[idx] && !this.dynamicToDate[idx] && date.after(this.dynamicFromDate[idx]!)) {
      this.dynamicToDate[idx] = date;
      this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(this.dynamicFromDate[idx]!), this.ngbToDate(date)]);
    } else {
      this.dynamicToDate[idx] = null;
      this.dynamicFromDate[idx] = date;
      this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(date), this.ngbToDate(date)]);
    }

    // if (!this.dynamicFromDate[idx] && !this.dynamicToDate[idx]) {
    //     this.dynamicFromDate[idx] = date;
    //     this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(date), null]);
    // } else if (this.dynamicFromDate[idx] && !this.dynamicToDate[idx]) {
    //     this.dynamicFromDate[idx] = date;
    //     this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(date), this.ngbToDate(date)]);
    // } else if (this.dynamicFromDate[idx] && !this.dynamicToDate[idx] && date.after(this.dynamicFromDate[idx]!)) {
    //   this.dynamicToDate[idx] = date;
    //   this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(this.dynamicFromDate[idx]!), this.ngbToDate(date)]);
    // } else {
    //     this.dynamicToDate[idx] = null;
    //     this.dynamicFromDate[idx] = date;
    //     this.filters.at(idx).get('filterValue')?.setValue([this.ngbToDate(date), null]);
    // }
  }
  hoveredDate: NgbDate | null | any;
  dynamicHoveredDate: { [key: number]: NgbDate | null | any } = {};

  setHoveredDate(date: NgbDate | null, type: string, idx?: number) {
    if (type === 'occuredon') {
      this.hoveredDate = date || undefined;
    } else if (type === 'dynamic' && idx !== undefined) {
      this.dynamicHoveredDate[idx] = date || undefined;
    }
  }

  isHovered(date: NgbDate, type: string, idx?: number): boolean {
    if (type === 'occuredon') {
      return (
        this.fromDate &&
        !this.toDate &&
        this.hoveredDate &&
        date.after(this.fromDate) &&
        date.before(this.hoveredDate)
      );
    } else if (type === 'dynamic' && idx !== undefined) {
      return (
        this.dynamicFromDate[idx] &&
        !this.dynamicToDate[idx] &&
        this.dynamicHoveredDate[idx] &&
        date.after(this.dynamicFromDate[idx]!) &&
        date.before(this.dynamicHoveredDate[idx]!)
      );
    }
    return false;
  }

  isInside(date: NgbDate, type: string, idx?: number): boolean {
    if (type === 'occuredon') {
      return (
        this.toDate &&
        date.after(this.fromDate!) &&
        date.before(this.toDate)
      );
    } else if (type === 'dynamic' && idx !== undefined) {
      return (
        this.dynamicToDate[idx] &&
        date.after(this.dynamicFromDate[idx]!) &&
        date.before(this.dynamicToDate[idx]!)
      );
    }
    return false;
  }

  isRange(date: NgbDate, type: string, idx?: number): boolean {
    if (type === 'occuredon') {
      return (
        (this.fromDate && date.equals(this.fromDate)) ||
        (this.toDate && date.equals(this.toDate)) ||
        this.isInside(date, 'occuredon') ||
        this.isHovered(date, 'occuredon')
      );
    } else if (type === 'dynamic' && idx !== undefined) {
      return (
        (this.dynamicFromDate[idx] && date.equals(this.dynamicFromDate[idx]!)) ||
        (this.dynamicToDate[idx] && date.equals(this.dynamicToDate[idx]!)) ||
        this.isInside(date, 'dynamic', idx) ||
        this.isHovered(date, 'dynamic', idx)
      );
    }
    return false;
  }

  outsideDay(date: NgbDate, type: string, idx?: number): boolean {
    if (type === 'dynamic')
      return this.maxDate && date.after(this.maxDate)

    return (this.maxDate && date.after(this.maxDate)) || (this.minDate && date.before(this.minDate));
  }
  currentDatepickerType: 'occuredon' | 'dynamic' = 'occuredon';
  currentDynamicIndex: number | undefined = undefined;



  setCurrentDatepicker(type: 'occuredon' | 'dynamic', idx?: number) {
    this.currentDatepickerType = type;
    this.currentDynamicIndex = typeof idx === 'number' ? idx : undefined;
  }
}