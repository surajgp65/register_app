import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpRequestService } from 'src/app/common-services/http-request.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('register_pop') register_pop: TemplateRef<any>;
  imageUrl: string;
  isImg: boolean = false;
  imageFile: any = 'assets/images/user.svg';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private modal: BsModalService,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private router: Router
  ) {}

  validateFirstName(control: AbstractControl) {
    const regex = /^[a-zA-Z]+$/;
    const valid = regex.test(control.value);
    return valid ? null : { invalidFirstName: true };
  }

  profileForm = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z]*$/),
    ]),
    last_name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    age: new FormControl(''),
    state: new FormControl('Maharashtra'),
    country: new FormControl('India'),
    address: new FormControl(''),
    address1: new FormControl(''),
    address2: new FormControl(''),
    ComAddress1: new FormControl(''),
    ComAddress2: new FormControl(''),
    tags: new FormControl([]),
    image: new FormControl(''),
  });

  ngOnInit(): void {}

  fileClick() {
    let el = document.getElementById('profile_upload');
    el.click();
  }

  openRegisterPop() {
    this.modalRef = this.modal.show(this.register_pop, {
      backdrop: 'static',
      ignoreBackdropClick: false,
      class: 'modal-lg modal-dialog-centered',
    });
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    this.isImg = true;

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // Validate file size
      const maxSizeInBytes = 500000; // 500 KB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds the limit.');
        console.error('File size exceeds the limit.');
        return; // Do not proceed with the upload
      }

      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (img.width > 310 || img.height > 325) {
            alert('Image dimensions must be 310x325 pixels.');
            console.error('Image dimensions must be 310x325 pixels.');
            return; // Do not proceed with the upload
          }

          this.profileForm.patchValue({
            image: reader.result,
          });

          this.imageUrl = reader.result as string;

          // Move the assignment inside the onload callback
          this.imageFile = this.profileForm.get('image').value;
          console.log(this.imageFile);
        };
      };
    }
  }

  onSubmit(event: any) {
    event.stopPropagation();
    event.preventDefault();

    const addressType = this.profileForm.get('address')?.value;

    if (addressType === 'Home') {
      this.profileForm.get('ComAddress1')?.setValue('');
      this.profileForm.get('ComAddress2')?.setValue('');
    } else if (addressType === 'Company') {
      this.profileForm.get('address1')?.setValue('');
      this.profileForm.get('address2')?.setValue('');
    }

    let userData = this.profileForm.value;
    console.log('userData -->', userData);

    this.http.request('post', 'users', userData).subscribe((res: any) => {
      console.log('Response', res);
      this.profileForm.reset();
      this.modalRef.hide();
      this.router.navigate(['/dashboard/profile/' + res.id]);
    });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    // Add tag
    if (value) {
      const tags = this.profileForm.get('tags') as FormControl;
      const currentTags = tags.value || [];
      currentTags.push(value);
      tags.setValue(currentTags);

      // Clear the input
      if (input) {
        input.value = '';
      }
    }
  }

  removeTag(tag: string): void {
    const tags = this.profileForm.get('tags') as FormControl;
    const currentTags = tags.value || [];
    const index = currentTags.indexOf(tag);

    if (index >= 0) {
      currentTags.splice(index, 1);
      tags.setValue(currentTags);
    }
  }
}
