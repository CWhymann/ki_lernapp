import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KiEinrichten } from './ki-einrichten';

describe('KiEinrichten', () => {
  let component: KiEinrichten;
  let fixture: ComponentFixture<KiEinrichten>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KiEinrichten],
    }).compileComponents();

    fixture = TestBed.createComponent(KiEinrichten);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
