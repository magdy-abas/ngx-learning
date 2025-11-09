import {
  Component,
  OnInit,
  inject,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FooterService } from '../../core/service/footer.service';
import { PageItem } from '../../core/interfaces/footer.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlobalTranslateService } from '../../core/service/global-translate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.scss'],
})
export class ContentPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private footerService = inject(FooterService);
  private sanitizer = inject(DomSanitizer);
  private globalTranslate = inject(GlobalTranslateService);

  private langSubs?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  page: PageItem | null = null;
  safeDesc: SafeHtml | string | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    this.loadPage(slug);

    this.langSubs = this.globalTranslate.language$.subscribe(() => {
      this.loadPage(slug);
    });
  }

  private loadPage(slug: string): void {
    this.footerService.getPage(slug).subscribe((res) => {
      this.page = res.data;

      if (!isPlatformBrowser(this.platformId)) {
        this.safeDesc = this.page?.description ?? '';
        return;
      }

      this.safeDesc = this.sanitizer.bypassSecurityTrustHtml(
        this.page?.description ?? ''
      );

      document.title = this.page?.title ?? 'Page';
    });
  }

  ngOnDestroy(): void {
    this.langSubs?.unsubscribe();
  }
}
