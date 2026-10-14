import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Prompting } from './prompting';

describe('Prompting', () => {
  let component: Prompting;
  let fixture: ComponentFixture<Prompting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prompting],
    }).compileComponents();

    fixture = TestBed.createComponent(Prompting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
