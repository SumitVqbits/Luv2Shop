import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginStatusComponent } from './login-status.component';


describe('LoginStatusComponent', () => {
  let component: LoginStatusComponent;
  let fixture: ComponentFixture<LoginStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ LoginStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be unauthenticated by default', () => {
    expect(component.isAuthenticated).toBeFalse();
  });
});