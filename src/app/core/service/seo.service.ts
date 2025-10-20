import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private meta: Meta, private title: Title) {}

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
}
