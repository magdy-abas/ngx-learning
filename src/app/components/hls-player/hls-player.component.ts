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
import { TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-hls-player',
  standalone: true,
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.scss'],
  imports: [NgIf],
})
export class HlsPlayerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;
  @Input() src: string = '';
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;
  @Input() muted: boolean = false;
  @Input() preload: 'none' | 'metadata' | 'auto' = 'metadata';

  @Output() playerReady = new EventEmitter<void>();
  @Output() error = new EventEmitter<any>();

  private hls: Hls | null = null;
  private player: Plyr | null = null;
  public showInitialLoader: boolean = true;

  constructor(private translate: TranslateService) {}

  ngAfterViewInit(): void {
    if (this.src) {
      this.initializePlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].firstChange) {
      this.destroyPlayer();
      if (this.src) {
        this.initializePlayer();
      }
    }
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
    this.hls = new Hls({ debug: false });
    this.hls.loadSource(this.src);
    this.hls.attachMedia(video);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.initializePlyr();
    });

    this.hls.on(Hls.Events.ERROR, (_, data) => {
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

  private async initializePlyr(): Promise<void> {
    const video = this.videoElement.nativeElement;
    if (this.player) {
      this.player.destroy();
    }

    const translations = await this.translate.get('PLAYER').toPromise();
    const i18nTexts: any = {
      play: translations.play,
      pause: translations.pause,
      rewind: translations.rewind,
      fastForward: translations.fastForward,
      mute: translations.mute,
      unmute: translations.unmute,
      volume: translations.volume,
      enterFullscreen: translations.enterFullscreen,
      exitFullscreen: translations.exitFullscreen,
      settings: translations.settings,
      speed: translations.speed,
      normal: translations.normal,
      seek: translations.seek,
      seekLabel: translations.seekLabel,
      currentTime: translations.currentTime,
      duration: translations.duration,
    };

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
      settings: ['captions', 'speed'],
      autoplay: this.autoplay,
      muted: this.muted,
      hideControls: false,
      clickToPlay: true,
      keyboard: { focused: true, global: false },
      speed: {
        selected: 1,
        options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      },
      fullscreen: { enabled: true },
      ratio: '16:9',
      tooltips: { controls: true, seek: true },
      captions: { active: false },
      i18n: i18nTexts,
    });

    this.player.on('ready', () => {
      this.showInitialLoader = false;
      video.style.visibility = 'visible';
      this.playerReady.emit();
    });
  }

  private handleHlsError(data: any): void {
    console.error('HLS Error:', data);
    if (data.fatal) {
      this.handleError('Fatal HLS error', data);
    }
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
