import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeuronaleNetze } from './neuronale-netze';

describe('NeuronaleNetze', () => {
  let component: NeuronaleNetze;
  let fixture: ComponentFixture<NeuronaleNetze>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeuronaleNetze],
    }).compileComponents();

    fixture = TestBed.createComponent(NeuronaleNetze);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
