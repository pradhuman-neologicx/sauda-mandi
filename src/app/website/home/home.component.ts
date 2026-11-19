import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';
import { FooterComponent } from '../components/footer/footer.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    TestimonialsComponent,
    FooterComponent,
  ],
})
export class HomeComponent{


}
