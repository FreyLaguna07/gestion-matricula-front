import { Directive, InjectionToken } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SC_PREFIX = new InjectionToken<ScPrefixDirective>('ScPrefix');

@Directive({
	selector: 'scPrefix,[scPrefix]',
	providers: [{ provide: SC_PREFIX, useExisting: ScPrefixDirective }],
})
export class ScPrefixDirective {}
