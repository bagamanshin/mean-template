import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterPageComponent } from './register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  let service: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // create `register` spy on an object representing the Auth Service
    const authServiceSpy =
      jasmine.createSpyObj('AuthService', ['register']);


    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }

      ],
      declarations: [ RegisterPageComponent ]
    })
    .compileComponents();

    service = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should hanlde success registration', done => {
    const navigateSpy = spyOn(router, 'navigate');

    // set the value to return when the `getValue` spy is called.
    const stubValue = of(true).pipe(delay(400));
    service.register.and.returnValue(stubValue);
    component.onSubmit();
    expect(component.form.disabled).toBe(true);
    setTimeout(() => {
      expect(component.form.disabled).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/login'], {queryParams: {
        registered: true
      }});
      done();
    }, 400)
  });
  it('should hanlde failed registration', done => {
    const navigateSpy = spyOn(router, 'navigate');

    // set the value to return when the `getValue` spy is called.
    const stubValue = of(false).pipe(delay(400));
    service.register.and.returnValue(stubValue);
    component.onSubmit();
    expect(component.form.disabled).toBe(true);
    setTimeout(() => {
      expect(component.form.disabled).toBe(false);
      expect(navigateSpy).not.toHaveBeenCalledWith(['/login'], {queryParams: {
        registered: true
      }});
      done();
    }, 400)
  });
});
