import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Geschichte } from './geschichte';

describe('Geschichte', () => {
  let component: Geschichte;
  let fixture: ComponentFixture<Geschichte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Geschichte],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Geschichte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move between scenes within bounds', () => {
    component.zurueck();
    expect(component.index()).toBe(0);
    component.weiter();
    expect(component.index()).toBe(1);
    for (let i = 0; i < component.szenen.length; i++) {
      component.weiter();
    }
    expect(component.istLetzte()).toBe(true);
  });
});
