import { Directive, InjectionToken } from '@angular/core';

export const SC_AG_GRID_BUTTON_HEADER = new InjectionToken<ScAgGridButtonHeader>('ScAgGridButtonHeader');

@Directive({
	selector: 'scAgridButtonHeader,[scAgridButtonHeader]',
	providers: [{ provide: SC_AG_GRID_BUTTON_HEADER, useExisting: ScAgGridButtonHeader }],
})
export class ScAgGridButtonHeader {}
