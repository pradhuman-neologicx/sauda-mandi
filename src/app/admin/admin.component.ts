
import {
  Component,
  Inject,
  Renderer2,
  DOCUMENT,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDrawerMode, MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SidenavHeaderComponent } from './sidenav-header/sidenav-header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SidenavHeaderComponent, MatSidenavContainer, MatSidenav, SidenavComponent, MatSidenavContent, SpinnerComponent, RouterOutlet],
    host: {
      '(window:resize)': 'onResize()',
      '(document:click)': 'onClick($event)'
    }
})
export class AdminComponent implements OnInit {
  title = 'mat_admin';
  themeSectionOpen: boolean = false;
  isMobile: boolean = false;
  sidenavOpened: boolean = false;

  @ViewChild(MatSidenavContent) sidenavContent?: MatSidenavContent;
  @ViewChild('adminScrollContent', { read: ElementRef })
  adminScrollContent?: ElementRef<HTMLElement>;

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

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

    // Scroll to top automatically whenever router navigation ends
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.scrollToTop();
        setTimeout(() => this.scrollToTop(), 0);
      });
  }

  scrollToTop(): void {
    // 1. Sidenav content via ViewChild
    if (this.sidenavContent) {
      const el = this.sidenavContent.getElementRef()?.nativeElement;
      if (el) {
        el.scrollTop = 0;
        if (typeof el.scrollTo === 'function') {
          el.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }
    }
    // 2. Sidenav content via template ref
    if (this.adminScrollContent?.nativeElement) {
      const el = this.adminScrollContent.nativeElement;
      el.scrollTop = 0;
      if (typeof el.scrollTo === 'function') {
        el.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
    // 3. Fallback querySelector in case ViewChild hasn't bound yet
    const contentEl = this.document.querySelector('mat-sidenav-content');
    if (contentEl) {
      contentEl.scrollTop = 0;
      if (typeof contentEl.scrollTo === 'function') {
        contentEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
    // 4. Window and document root scroll
    window.scrollTo({ top: 0, left: 0 });
    this.document.documentElement.scrollTop = 0;
    this.document.body.scrollTop = 0;
  }

  // sidenav properties
  sidenavMode: MatDrawerMode = 'side';
  contentMargin: string = '0'; // Initially, no margin
  collapsed = false;

  onResize() {
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
