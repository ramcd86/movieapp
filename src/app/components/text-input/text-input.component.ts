import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent {
  @Input() placeholder = '';

  @Output() value: EventEmitter<string> = new EventEmitter<string>();

  public handleKeyEvent($event: Event): void {
    if ($event.target) {
      const inputElement = $event.target as HTMLInputElement;
      this.value.emit(inputElement.value);
    }
  }
}
