import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { UserFullDetail } from './user-full-detail';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserFullDetail', () => {
  let component: UserFullDetail;
  let componentRef: ComponentRef<UserFullDetail>;
  let fixture: ComponentFixture<UserFullDetail>;

  const mockUser = {
    id: 1,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    title: { title: 'Dr' },
    image_path: null,
    location: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFullDetail, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFullDetail);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('user', mockUser);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user full name', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Jane');
    expect(text).toContain('Smith');
  });

  it('should display user title', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Dr');
  });

  it('should display user email', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('jane.smith@example.com');
  });

  it('should emit copyEmail when copy button is clicked', () => {
    fixture.detectChanges();
    let emitted: string | undefined;
    component.copyEmail.subscribe((val: string) => (emitted = val));
    const btn = fixture.nativeElement.querySelector('p-button');
    btn.click();
    expect(emitted).toBe('jane.smith@example.com');
  });
});
