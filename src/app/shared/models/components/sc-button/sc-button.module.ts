import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScPrefixDirective } from './prefix.directive';
import { ScButton, ScIconDirective } from './sc-button.component';
import { ScSuffix } from './suffix.directive';

@NgModule({
	declarations: [ScSuffix, ScPrefixDirective, ScButton, ScIconDirective],
	imports: [CommonModule],
	exports: [ScSuffix, ScPrefixDirective, ScButton, ScIconDirective],
})
export class ScButtonModule {}
