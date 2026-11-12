import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, NgOptimizedImage],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  forceScrolled = false;
  aboutDropdown = false;
  fertilityDropdown = false;
  gynaecologyDropdown = false;
  mobileAboutOpen = false;
  mobileFertilityOpen = false;
  mobileGynaecologyOpen = false;

  aboutLinks: { label: string; route: string; fragment?: string }[] = [
    { label: 'Centre for Reproductive Medicine', route: '/about' },
    // { label: 'Our Team', route: '/about', fragment: 'team' },
    // { label: 'Our Locations', route: '/locations' },
    { label: 'Ms. Jyotsna Pundir', route: '/jyotsna-pundir' },
    { label: 'Dr. Sheetal Barhate', route: '/sheetal' }
  ];

  treatmentCategories = [
    {
      title: 'Fertility',
      links: [
        { label: 'OI', route: '/treatments/oi' },
        { label: 'Embryo freezing', route: '/treatments/embryo-freezing' },
        { label: 'Female fertility assessment', route: '/treatments/female-fertility-assessment' },
        { label: 'Male fertility assessment', route: '/treatments/male-fertility-assessment' },
        { label: 'Early pregnancy scans', route: '/treatments/early-pregnancy-scans' },
      ],
    },
    {
      title: 'Gynaecology',
      links: [
        { label: 'Conditions', route: '/treatments/gynaecology-conditions' },
        { label: 'Procedures', route: '/treatments/gynaecology-procedures' },
      ],
    },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string) {
    const doctorRoutes = [
      '/jyotsna-pundir',
      '/sheetal'
    ];
    this.forceScrolled = doctorRoutes.some((route) => url.includes(route));
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.mobileAboutOpen = false;
      this.mobileFertilityOpen = false;
      this.mobileGynaecologyOpen = false;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.mobileAboutOpen = false;
    this.mobileFertilityOpen = false;
    this.mobileGynaecologyOpen = false;
  }
}
