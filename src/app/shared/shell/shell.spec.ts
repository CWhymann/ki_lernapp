import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Shell } from './shell';

describe('Shell', () => {
  let fixture: ComponentFixture<Shell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
  });

  it('should render navigation and content area', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
    expect(compiled.querySelector('main')).toBeTruthy();
  });
});
