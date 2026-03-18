import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { UserTableItem } from './user-table-item';

describe('UserTableItem', () => {
  let component: UserTableItem;
  let componentRef: ComponentRef<UserTableItem>;
  let fixture: ComponentFixture<UserTableItem>;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    title: { title: 'Mr' },
    barcode: '12345',
    image_path: null,
    location: null,
    active_withdrawals: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableItem],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableItem);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('user', mockUser);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user first and last name', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('John');
    expect(text).toContain('Doe');
  });

  it('should display user title', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Mr');
  });

  it('should not show tag when active_withdrawals is 0', () => {
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).toBeNull();
  });

  it('should show tag when active_withdrawals > 0', () => {
    componentRef.setInput('user', { ...mockUser, active_withdrawals: 3 });
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).not.toBeNull();
  });
});
