import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [PdfViewerModule, CommonModule],
  template: `
    <div class="pdf-viewer-wrapper" *ngIf="showPdfViewer">
      <div class="pdf-viewer-header">
        <button (click)="closePdfViewer()" class="close-btn">&times;</button>
        <h4>{{ resourceTitle || 'PDF Viewer' }}</h4>
      </div>
      <div class="pdf-viewer-container">
        <ng-container *ngIf="pdfSrc; else errorTemplate">
          <pdf-viewer
            [src]="pdfSrc"
            [render-text]="false"
            [original-size]="true"
            [show-all]="true"
            [zoom]="zoom"
            (after-load)="onPdfLoaded($event)"
            (error)="onError($event)"
            class="pdf-viewer"
          ></pdf-viewer>
        </ng-container>

        <ng-template #errorTemplate>
          <div class="error-message">
            Unable to load PDF. Please check the URL.
          </div>
        </ng-template>
      </div>
      <div class="pdf-summary" *ngIf="totalPages > 0">
        Total Pages: {{ totalPages }}
      </div>
    </div>
  `,
  styles: [``],
})
export class PdfViewerComponent implements OnChanges, OnDestroy {
  @Input() pdfUrl: string = '';
  @Input() showPdfViewer: boolean = false;
  @Input() resourceTitle: string = '';

  @Output() closePdfEvent = new EventEmitter<void>();
  private resizeHandler = () => this.setInitialZoom();
  pdfSrc: string | null = null;
  totalPages: number = 0;
  errorMessage: string = '';
  zoom: number = 1;

  constructor(private sanitizer: DomSanitizer) {
    this.setInitialZoom();
    window.addEventListener('resize', () => this.setInitialZoom());
  }

  private setInitialZoom(): void {
    if (window.innerWidth <= 875) {
      this.zoom = window.innerWidth / 1000; // Adjust this ratio as needed
    } else {
      this.zoom = 1;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && this.pdfUrl) {
      this.resetPdfViewer();
      this.preparePdfSource();
    }
  }

  private preparePdfSource(): void {
    try {
      const trimmedUrl = (this.pdfUrl || '').trim();

      if (!trimmedUrl) {
        this.errorMessage = 'Empty PDF URL';
        return;
      }

      this.pdfSrc = trimmedUrl;
    } catch (error) {
      console.error('PDF Loading Error:', error);
      this.errorMessage = 'Invalid PDF URL';
    }
  }

  onPdfLoaded(pdf: any): void {
    this.totalPages = pdf.numPages;
    this.errorMessage = '';
  }

  onError(error: any): void {
    console.error('PDF Loading Error:', error);
    this.errorMessage = 'Failed to load PDF. Please check the URL.';
  }

  closePdfViewer(): void {
    this.closePdfEvent.emit();
  }

  private resetPdfViewer(): void {
    this.totalPages = 0;
    this.errorMessage = '';
    this.pdfSrc = null;
    this.setInitialZoom();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }
}
