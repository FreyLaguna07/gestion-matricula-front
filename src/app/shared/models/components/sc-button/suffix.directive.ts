import { Directive, InjectionToken } from '@angular/core';

export const SC_SUFFIX = new InjectionToken<ScSuffix>('ScSuffix');

@Directive({
	selector: '[scSuffix]',
	providers: [{ provide: SC_SUFFIX, useExisting: ScSuffix }],
})
export class ScSuffix {}
