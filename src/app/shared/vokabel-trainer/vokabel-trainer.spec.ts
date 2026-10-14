import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VokabelTrainer } from './vokabel-trainer';

describe('VokabelTrainer', () => {
  let component: VokabelTrainer;
  let fixture: ComponentFixture<VokabelTrainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VokabelTrainer],
    }).compileComponents();

    fixture = TestBed.createComponent(VokabelTrainer);
    fixture.componentRef.setInput('karten', [{ begriff: 'Token', erklaerung: 'Textbaustein' }]);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ist nach dem Bewerten der letzten Karte fertig', () => {
    component.start();
    component.umdrehen();
    component.bewerten(true);
    expect(component.fertig()).toBe(true);
  });
});
