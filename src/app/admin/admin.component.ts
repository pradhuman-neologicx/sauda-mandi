
import { Component, HostListener, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDrawerMode, MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SidenavHeaderComponent } from './sidenav-header/sidenav-header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SidenavHeaderComponent, MatSidenavContainer, MatSidenav, SidenavComponent, MatSidenavContent, SpinnerComponent, RouterOutlet]
})
export class AdminComponent {
  title = 'mat_admin';
  themeSectionOpen: boolean = false;
  isMobile: boolean = false;
  sidenavOpened: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private render: Renderer2,
    private overlay: OverlayContainer
  ) {}

  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang', selectedLanguage);
  }

  lang: string = '';

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    // Always enforce Light theme regardless of browser/saved mode
    localStorage.setItem('theme', 'light');
    this.applyTheme('light');
    this.checkScreenSize();
  }

  // sidenav properties
  sidenavMode: MatDrawerMode = 'side';
  contentMargin: string = '0'; // Initially, no margin
  collapsed = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.sidenavMode = 'over';
      this.contentMargin = '0';
      this.sidenavOpened = false;
    } else {
      this.sidenavMode = 'side';
      this.contentMargin = this.collapsed ? '95px' : '210px'; // 220px width + ~1rem gap
      this.sidenavOpened = true;
    }
  }

  // sidenav toggle
  toggleCollapsed() {
    if (this.isMobile) {
      this.sidenavOpened = !this.sidenavOpened;
    } else {
      this.collapsed = !this.collapsed;
      this.checkScreenSize();
    }
  }

  get sidenavWidth(): string {
    return this.collapsed ? '73px' : '220px';
  }

  // change theme code start
  changeTheme(themevalue: string) {
    this.applyTheme(themevalue);
    localStorage.setItem('theme', themevalue);
  }

  private applyTheme(themevalue: string) {
    this.render.removeClass(this.document.body, 'lightTheme');
    this.render.removeClass(this.document.body, 'darkTheme');
    if (themevalue === 'light') {
      this.render.addClass(this.document.body, 'lightTheme');
    }
    if (themevalue === 'dark') {
      this.render.addClass(this.document.body, 'darkTheme');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.theme-change-section') &&
      !targetElement.closest('.setting-icon')
    ) {
      this.themeSectionOpen = false;
    }
  }
  // change theme code end

  toggleThemeSection() {
    this.themeSectionOpen = !this.themeSectionOpen;
  }
}
