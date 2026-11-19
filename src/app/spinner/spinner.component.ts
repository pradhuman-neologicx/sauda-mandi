import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { LoaderService } from '../core/services/loader.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgOptimizedImage]
})
export class SpinnerComponent implements OnInit {
  loader = inject(LoaderService);


  ngOnInit(): void {
  }
}
