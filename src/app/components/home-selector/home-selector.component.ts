import {
  Component,
  EnvironmentInjector,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { SharedService } from '../../core/service/shared.service';

@Component({
  selector: 'app-home-selector',
  standalone: true,
  imports: [],
  templateUrl: './home-selector.component.html',
  styleUrl: './home-selector.component.scss',
})
export class HomeSelectorComponent implements OnInit {
  private vcr = inject(ViewContainerRef);
  private env = inject(EnvironmentInjector);
  private shared = inject(SharedService);

  async ngOnInit() {
    const version = this.shared.getHomeVersion();

    document.body.classList.remove('home-v1', 'home-v2');
    document.body.classList.add(version === 'v1' ? 'home-v1' : 'home-v2');

    if (version === 'v1') {
      const { HomeComponent } = await import('../home/home.component');
      this.vcr.createComponent(HomeComponent, {
        environmentInjector: this.env,
      });
    } else {
      const { HomeTwoComponent } = await import(
        '../home-two/home-two.component'
      );
      this.vcr.createComponent(HomeTwoComponent, {
        environmentInjector: this.env,
      });
    }
  }
}
