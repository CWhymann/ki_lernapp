import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modelle } from './modelle';

describe('Modelle', () => {
  let component: Modelle;
  let fixture: ComponentFixture<Modelle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modelle],
    }).compileComponents();

    fixture = TestBed.createComponent(Modelle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
