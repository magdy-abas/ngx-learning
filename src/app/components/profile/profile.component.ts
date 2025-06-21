import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MyCoursesComponent } from '../courses-components/my-courses/my-courses.component';
import AOS from 'aos';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../core/service/profile.service';
import { PhoneInputComponent } from './../../shared/ui/phone-input/phone-input.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MyCoursesComponent,
    NgIf,
    NgClass,
    TranslateModule,
    ReactiveFormsModule,
    PhoneInputComponent,
    TooltipModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  activeSection: 'profile' | 'courses' = 'profile';
  isEditingName = false;
  isEditingPhone = false;
  isPhoneDisabled: boolean = true;
  userData: any = { name: '', phone: '', image: '' };
  imageFile!: File | null | string;
  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private _AuthService = inject(AuthService);
  private _ProfileService = inject(ProfileService);
  private _fb = inject(FormBuilder);

  ngOnInit(): void {
    AOS.init({ duration: 1000, once: true });

    this.profileForm = this._fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      phone: [{ value: '', disabled: true }, Validators.required],
    });

    this.loadUserData();
  }

  loadUserData() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const user = JSON.parse(userDataString);

      this.profileForm.patchValue({
        name: user.name || '',
        phone: user.phone || '',
      });

      this.userData = user;
      this.imagePreview = user.image
        ? user.image
        : 'assets/img/profile_img.png';
    } else {
      this.profileForm.patchValue({
        name: '',
        phone: '',
      });
      this.userData = { name: '', phone: '', image: '' };
      this.imagePreview = 'assets/img/profile_img.png';
    }
  }

  switchSection(section: 'profile' | 'courses') {
    this.activeSection = section;
    setTimeout(() => AOS.refresh(), 50);
  }

  toggleEdit(field: 'name' | 'phone') {
    if (field === 'phone') {
      this.isPhoneDisabled = !this.isPhoneDisabled;
      const phoneControl = this.profileForm.get('phone');
      if (this.isPhoneDisabled) {
        phoneControl?.disable();
      } else {
        phoneControl?.enable();
      }
    } else if (field === 'name') {
      this.isEditingName = !this.isEditingName;
      const nameControl = this.profileForm.get('name');
      if (this.isEditingName) {
        nameControl?.enable();
      } else {
        nameControl?.disable();
      }
    }
  }

  logout() {
    this._AuthService.logout();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const originalFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.imageFile = reader.result as string;
      };
      reader.readAsDataURL(originalFile);
    }
  }

  updateUserInfor() {
    const nameValue = this.profileForm.get('name')?.value;
    const phoneObject = this.profileForm.get('phone')?.value;

    let phoneValue = '';
    if (typeof phoneObject === 'string') {
      phoneValue = phoneObject;
    } else if (typeof phoneObject === 'object' && phoneObject !== null) {
      phoneValue = phoneObject.number || '';
    }

    let hasChanges = false;

    const updateBody: any = {};

    if (nameValue !== this.userData.name) {
      updateBody.name = nameValue;
      hasChanges = true;
    }

    if (phoneValue !== this.userData.phone) {
      updateBody.phone = phoneValue;
      hasChanges = true;
    }

    if (this.imageFile) {
      updateBody.photo = this.imageFile;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    console.log('Sending update payload: ', updateBody);

    this._ProfileService.updateInfo(updateBody).subscribe({
      next: (res) => {
        localStorage.setItem('userData', JSON.stringify(res.data));
        this.loadUserData();
        this.imageFile = null;
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
