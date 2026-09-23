import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Bias } from './bias';

describe('Bias', () => {
  let component: Bias;
  let fixture: ComponentFixture<Bias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bias],
    }).compileComponents();

    fixture = TestBed.createComponent(Bias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
