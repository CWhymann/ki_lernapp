import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Halluzinationen } from './halluzinationen';

describe('Halluzinationen', () => {
  let component: Halluzinationen;
  let fixture: ComponentFixture<Halluzinationen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Halluzinationen],
    }).compileComponents();

    fixture = TestBed.createComponent(Halluzinationen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
