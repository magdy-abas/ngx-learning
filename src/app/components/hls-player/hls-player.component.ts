import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import Hls from 'hls.js';
import Plyr from 'plyr';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-hls-player',
  standalone: true,
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.scss'],
  imports: [NgIf, NgFor],
})
export class HlsPlayerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;
  @Input() src: string = '';
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;
  @Input() muted: boolean = false;
  @Input() preload: 'none' | 'metadata' | 'auto' = 'metadata';

  @Input() qualities: string[] = ['360', '480', '720'];

  @Output() playerReady = new EventEmitter<void>();
  @Output() error = new EventEmitter<any>();

  private hls: Hls | null = null;
  private player: Plyr | null = null;
  public showInitialLoader: boolean = true;
  public currentQuality: string = '720';
  public isQualityChanging: boolean = false;
  public isQualitySwitching: boolean = false;

  public showQualityMenu = false;
  public availableQualities: string[] = [];
  public qualityUrls: any = {};

  constructor() {}

  ngAfterViewInit(): void {
    if (this.src) {
      this.generateQualityUrls(this.src);
      this.initializePlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].firstChange) {
      this.destroyPlayer();
      if (this.src) {
        this.generateQualityUrls(this.src);
        this.initializePlayer();
      }
    }
  }

  private generateQualityUrls(baseUrl: string) {
    const match = baseUrl.match(/(.*\/)(\d+)(\/index\.m3u8)/);
    if (match) {
      const prefix = match[1];
      const suffix = match[3];
      this.availableQualities = this.qualities;
      this.qualityUrls = {};
      for (let q of this.qualities) {
        this.qualityUrls[q] = `${prefix}${q}${suffix}`;
      }
    } else {
      console.warn('Failed to parse source URL format.');
    }
  }

  toggleQualityMenu() {
    this.showQualityMenu = !this.showQualityMenu;
  }

  selectQuality(quality: string) {
    this.showQualityMenu = false;
    this.changeQuality(quality);
  }

  private initializePlayer(): void {
    const video = this.videoElement.nativeElement;
    video.poster = this.poster;
    video.muted = this.muted;
    video.preload = this.preload;

    if (Hls.isSupported()) {
      this.initializeHls();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.initializeSafariHls();
    } else {
      this.handleError('HLS not supported in this browser');
    }
  }

  private initializeHls(): void {
    const video = this.videoElement.nativeElement;

    this.hls = new Hls();
    this.hls.loadSource(this.src);
    this.hls.attachMedia(video);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.initializePlyr();
    });

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      this.handleHlsError(data);
    });
  }

  private initializeSafariHls(): void {
    const video = this.videoElement.nativeElement;
    video.src = this.src;

    video.addEventListener('loadedmetadata', () => {
      this.initializePlyr();
    });

    video.addEventListener('error', (e) => {
      this.handleError('Safari HLS error', e);
    });
  }

  private initializePlyr(): void {
    const video = this.videoElement.nativeElement;
    if (this.player) {
      this.player.destroy();
    }

    this.player = new Plyr(video, {
      controls: [
        'play-large',
        'rewind',
        'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'fullscreen',
      ],
    });

    this.player.once('ready', () => {
      this.showInitialLoader = false;
      video.style.visibility = 'visible';
      this.playerReady.emit();
    });
  }

  private async changeQuality(quality: string): Promise<void> {
    if (this.isQualityChanging || !this.qualityUrls[quality]) return;

    this.isQualityChanging = true;
    this.isQualitySwitching = true;

    const video = this.videoElement.nativeElement;
    const savedTime = video.currentTime;
    const wasPaused = video.paused;

    try {
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
        await new Promise((res) => setTimeout(res, 300));

        this.hls = new Hls();
        this.hls.loadSource(this.qualityUrls[quality]);
        this.hls.attachMedia(video);

        await new Promise<void>((resolve) => {
          this.hls?.on(Hls.Events.MANIFEST_PARSED, () => resolve());
        });

        video.currentTime = savedTime;
        if (!wasPaused) await video.play();

        this.currentQuality = quality;
        console.log(`Switched to: ${quality}p`);
      }
    } catch (err) {
      console.error('Error switching quality', err);
    } finally {
      this.isQualityChanging = false;
      this.isQualitySwitching = false;
    }
  }

  private handleHlsError(data: any): void {
    console.error('HLS Error:', data);
  }

  private handleError(message: string, details?: any): void {
    console.error(message, details);
    this.error.emit({ message, details });
  }

  private destroyPlayer(): void {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }

  ngOnDestroy(): void {
    this.destroyPlayer();
  }
}
