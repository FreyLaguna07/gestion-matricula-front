/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';


import { ScPrefixDirective } from './prefix.directive';
import { ScSuffix } from './suffix.directive';
import { NgSelectSimpleComponent } from '../ng-select-simple/ng-select-simple.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';

let nextId = 0;

export type ScButtonColor =
	| 'transparent'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info'
	| 'light'
	| 'dark'
	| 'link'
	| 'outline-primary'
	| 'outline-secondary'
	| 'outline-success'
	| 'outline-danger'
	| 'outline-warning'
	| 'outline-info'
	| 'outline-light'
	| 'outline-dark'
	| 'outline-link';

export enum ScButtonTextAlign {
	Center = 'center',
	Left = 'left',
	Right = 'right',
}

export type ScButtonSize = 'sm' | 'lg' | 'none';
export type ScButtonType = 'button' | 'submit' | 'reset';

type ComponentType =
	| NgSelectSimpleComponent
	//| NgSelectMultipleComponent
	| InputTextComponent
	| InputNumberComponent
	//| TextAreaComponent
	| DatePickerComponent
	//| //DateTimePickerComponent
	| ScButton;

@Directive({
	selector: 'sc-icon,scIcon,[scIcon]',
})
export class ScIconDirective {
	@HostBinding('class') scIconClass = 'sc-button-icon';
}

@Component({
	selector: 'sc-button',
	templateUrl: './sc-button.component.html',
	styleUrls: ['./sc-button.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScButton implements OnInit {
	_idUnique: number = ++nextId;

	@HostBinding('id')
	idButton = `sc-button-${this._idUnique}`;

	@ContentChildren(ScPrefixDirective, { descendants: true })
	_prefixChildren!: QueryList<ScPrefixDirective>;
	@ContentChildren(ScSuffix, { descendants: true }) _suffixChildren!: QueryList<ScSuffix>;

	@ViewChild('button') button?: ElementRef<HTMLButtonElement>;

	@Input() textAlign: ScButtonTextAlign | string = ScButtonTextAlign.Center;
	@Input() color: ScButtonColor = 'primary';
	@Input() size: ScButtonSize = 'none';
	@Input() type: ScButtonType = 'button';

	@Input() rounded = false;
	@Input() fill = false;
	@Input() disabled: boolean | number = false;
	@Input() active = false;
	@Input() autofocus = false;

	@HostBinding('class') get scButtonClass(): { [key: string]: boolean } {
		return {
			'sc-button-rounded': this.rounded,
			'sc-button': true,
			'd-block': this.fill,
			'w-100': this.fill,
		};
	}

	@HostBinding('style') get scButtonStyle(): { [key: string]: number | string } {
		return {
			height: this._height,
		};
	}

	@Input()
	id = `sc-button-id-${this._idUnique}`;

	/**Etiqueta Aria del button */
	@Input('aria-label') ariaLabel: string = this.idButton;

	@Input()
	get width(): number | string {
		return this._width;
	}
	set width(value: number | string) {
		if (typeof value === 'number') {
			this._width = `${value}px`;
			return;
		}
		this._width = value;
	}
	private _width: number | string = 'auto';

	@Input()
	get height(): number | string {
		return this._height;
	}
	set height(value: number | string) {
		if (typeof value === 'number') {
			this._height = `${value}px`;
			return;
		}
		this._height = value;
	}
	private _height: number | string = 'auto';

	@Input() next: ComponentType | null = null;
	@Input() back: ComponentType | null = null;

	@Input() nextIsDisable: ComponentType | null = null;
	@Input() backIsDisable: ComponentType | null = null;

	@Output() onNext = new EventEmitter();
	@Output() onBack = new EventEmitter();

	@Output() onClick = new EventEmitter();

	get ngClassButton(): { [key: string]: boolean } {
		return {
			btn: true,
			'w-100': this.fill,
			'btn-sm': this.size === 'sm',
			'btn-lg': this.size === 'lg',
			active: this.active,
		};
	}

	get ngStyleButton(): { [key: string]: string | number } {
		return {
			width: this._width,
			height: this._height,
		};
	}

	get ngClassLabel(): { [key: string]: boolean | number } {
		return {
			'sc-button-label-suffix': this._suffixChildren.length,
			'sc-button-label-center': this.textAlign === ScButtonTextAlign.Center,
			'sc-button-label-left': this.textAlign === ScButtonTextAlign.Left,
			'sc-button-label-right': this.textAlign === ScButtonTextAlign.Right,
		};
	}

	ngOnInit(): void {
		if (this.autofocus) {
			setTimeout(() => {
				this.focus();
			}, 300);
		}
	}

	focus(): void {
		this.button?.nativeElement?.focus();
	}

	click(): void {
		this.onClick.emit();
	}

	arrowLeft(): void {
		if (this.back) {
			const b = this.back as InputTextComponent;

			if (b?.disabled || b?.readonly) {
				//this.backIsDisable?.focus();
				return;
			}

			//this.back.focus();

			return;
		}
		//this.backIsDisable ? this.backIsDisable.focus() : this.onBack.emit();
	}

	arrowRight(): void {
		if (this.next) {
			const n = this.next as InputTextComponent;

			if (n?.disabled || n?.readonly) {
				//this.nextIsDisable?.focus();
				return;
			}

			//this.next.focus();

			return;
		}

		//this.nextIsDisable ? this.nextIsDisable.focus() : this.onNext.emit();
	}
}
