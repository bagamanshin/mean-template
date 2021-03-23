import { Component, DebugElement } from "@angular/core"
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { TogglePasswordDirective } from "./toggle-password.directive";

@Component({
  template: `
    <div>
      <input type="password" [appTogglePassword] value="some text"/>
    </div>
  `
})
class TestComponent { }

describe('TogglePasswordDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divDe: DebugElement;
  let divEl: HTMLElement;
  let span: HTMLSpanElement;
  let input: HTMLInputElement;

  beforeEach(async () => {
    fixture = await TestBed.configureTestingModule({
      declarations: [ TogglePasswordDirective, TestComponent ]
    })
    .createComponent(TestComponent);
    component = fixture.componentInstance;
    divDe = fixture.debugElement;
    divEl = divDe.nativeElement;
    span = divEl.querySelector('span');
    input = divEl.querySelector('input');
  });
  it('should change input\'s type to text',
    fakeAsync(
      () => {
        span.click();
        tick();
        expect(input.type).toBe('text');
        expect(span.innerText).toBe('Hide password');
      }
    )
  );
  it('shouldn\'t change input\'s type',
    fakeAsync(
      () => {
        span.click();
        span.click();
        tick();
        expect(input.type).toBe('password');
        expect(span.innerText).toBe('Show password');
      }
    )
  );
})
