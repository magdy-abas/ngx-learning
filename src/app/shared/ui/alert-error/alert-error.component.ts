import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-error',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './alert-error.component.html',
  styleUrl: './alert-error.component.scss',
})
export class AlertErrorComponent {
  @Input() formName!: FormGroup;
  @Input() controlName!: string;
}
