import { Directive, EmbeddedViewRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
	selector: '[scSubscribe]',
})
export class ScSubscribeDirective<T> implements OnInit, OnDestroy {
	@Input('scSubscribe') source$: Observable<T> = new Observable<T>();
	private readonly onDestroy$ = new Subject();

	constructor(private _vcRef: ViewContainerRef, private _templateRef: TemplateRef<RxSubscribeContext<T>>) {}

	ngOnInit(): void {
		let viewRef: EmbeddedViewRef<RxSubscribeContext<T>>;
		this.source$.pipe(takeUntil(this.onDestroy$)).subscribe((source) => {
			if (!viewRef) {
				viewRef = this._vcRef.createEmbeddedView(this._templateRef, {
					$implicit: source,
				});
			} else {
				viewRef.context.$implicit = source;
				viewRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		//this.onDestroy$.next();
	}
}

interface RxSubscribeContext<T> {
	$implicit: T;
}
