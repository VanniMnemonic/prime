import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { UserSummary } from './user-summary';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserSummary', () => {
  let component: UserSummary;
  let componentRef: ComponentRef<UserSummary>;
  let fixture: ComponentFixture<UserSummary>;

  const mockUser = {
    id: 2,
    first_name: 'Bob',
    last_name: 'Smith',
    email: 'bob.smith@example.com',
    role: 'Technician',
    image_path: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSummary, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSummary);
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
    expect(text).toContain('Bob');
    expect(text).toContain('Smith');
  });

  it('should default size to md', () => {
    expect(component.size()).toBe('md');
  });

  it('should accept sm size input', () => {
    componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component.size()).toBe('sm');
  });

  it('should emit onEdit when edit button is clicked', () => {
    fixture.detectChanges();
    let emitted = false;
    component.onEdit.subscribe(() => (emitted = true));
    const btn = fixture.nativeElement.querySelector('p-button');
    btn.click();
    expect(emitted).toBeTrue();
  });
});
