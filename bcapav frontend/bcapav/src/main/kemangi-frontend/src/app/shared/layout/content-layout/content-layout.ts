import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-content-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Breadcrumb],
  templateUrl: './content-layout.html',
  styleUrls: ['./content-layout.scss'],
})
export class ContentLayout {
  @Input() breadcrumb: { label: string; url?: string }[] = [];
  @Input() title: string = '';
}
