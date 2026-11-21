import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss'],
})
export class Breadcrumb {
  @Input() items: { label: string; url?: string }[] = [];
}
