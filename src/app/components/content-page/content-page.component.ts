import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterService } from '../../core/service/footer.service';
import { PageItem } from '../../core/interfaces/footer.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.scss'],
})
export class ContentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private footerService = inject(FooterService);
  private sanitizer = inject(DomSanitizer);

  page: PageItem | null = null;
  safeDesc: SafeHtml | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.footerService.getPage(slug).subscribe((res) => {
        this.page = res.data;

        this.safeDesc = this.sanitizer.bypassSecurityTrustHtml(
          this.page.description
        );

        if (typeof document !== 'undefined') {
          document.title = this.page.title;
        }
      });
    }
  }
}
