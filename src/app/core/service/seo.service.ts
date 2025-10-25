import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformServer, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setTitle(titleText: string): void {
    if (!titleText) return;
    this.title.setTitle(titleText);
  }

  setMeta(description?: string, keywords?: string): void {
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }
  }

  setSeoData(data: {
    title?: string;
    description?: string;
    keywords?: string;
  }): void {
    if (data.title) this.setTitle(data.title);
    this.setMeta(data.description, data.keywords);
  }

  // ========== meta==========
  injectRawHeadMeta(rawHtml: string): void {
    if (!rawHtml?.trim()) return;
    const head = this.document.head;
    if (!head) return;

    if (isPlatformServer(this.platformId)) {
      head.insertAdjacentHTML('beforeend', rawHtml);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      head.insertAdjacentHTML('beforeend', rawHtml);
    }
  }
}
