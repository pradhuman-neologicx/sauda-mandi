import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';import { TestimonialsComponent } from '../components/testimonials/testimonials.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    RouterLink,
    TestimonialsComponent,
    FooterComponent,
    NgOptimizedImage,
  ],
})
export class HomeComponent{


}
