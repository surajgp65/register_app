import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpRequestService } from 'src/app/common-services/http-request.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileData: any;
  modalRef?: BsModalRef;
  @ViewChild('register_pop') register_pop: TemplateRef<any>;

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
  imageUrl: any;
  imageFile: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private http: HttpRequestService,
    private modal: BsModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('working profile');
    this.route.params.subscribe((params: Params) => {
      const profileId = params['id'];
      this.getProfile(profileId);
    });
  }

  getProfile(id: any) {
    this.http.request('get', 'users/' + id, null).subscribe((res: any) => {
      console.log(res);
      this.profileData = res;
      this.profileForm.patchValue({
        first_name: this.profileData.first_name || '', // You can set a default value if this.profileData.first_name is undefined
        last_name: this.profileData.last_name || '',
        email: this.profileData.email || '',
        phone: this.profileData.phone || '',
        age: this.profileData.age || '',
        state: this.profileData.state || 'Maharashtra',
        country: this.profileData.country || 'India',
        address: this.profileData.address || '',
        address1: this.profileData.address1 || '',
        address2: this.profileData.address2 || '',
        ComAddress1: this.profileData.ComAddress1 || '',
        ComAddress2: this.profileData.ComAddress2 || '',
        tags: this.profileData.tags || [],
        image: this.profileData.image || '',
      });
    });
  }

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
          this.profileData.image = this.profileForm.get('image').value;
        };
      };
    }
  }
  directOnFileChange(event: any) {
    const reader = new FileReader();

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
          this.profileData.image = this.profileForm.get('image').value;
          this.http
            .request('patch', 'users/' + this.profileData.id, {
              image: this.profileForm.get('image').value,
            })
            .subscribe((res: any) => {
              console.log('Response', res);
              this.getProfile(res.id);
            });
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

    this.http
      .request('put', 'users/' + this.profileData.id, userData)
      .subscribe((res: any) => {
        console.log('Response', res);
        this.profileForm.reset();
        this.getProfile(res.id);
        this.modalRef.hide();
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
