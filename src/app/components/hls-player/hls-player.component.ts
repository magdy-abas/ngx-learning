import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import Hls from 'hls.js';
import Plyr from 'plyr';

@Component({
  selector: 'app-hls-player',
  standalone: true,
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.scss'],
})
export class HlsPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;
  @Input() src: string = '';

  private hls: Hls | null = null;
  private player: Plyr | null = null;

  ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.src);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Only initialize Plyr after Hls.js is attached
        if (!this.player) {
          this.player = new Plyr(video, {
            controls: [
              'play',
              'progress',
              'current-time',
              'duration',
              'mute',
              'volume',
              'settings',
              'fullscreen',
            ],
            settings: ['speed', 'loop'],
            autoplay: false,
          });
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = this.src;
      if (!this.player) {
        this.player = new Plyr(video, {
          controls: [
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'fullscreen',
          ],
          settings: ['speed', 'loop'],
          autoplay: false,
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }
}
