import { StrictKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export const StrictDirectiveChildNames: ReadonlyArray<keyof StrictDirective> = [
    'strictKeyword',
];

export class StrictDirective extends Declaration {
    readonly kind = NodeKind.StrictDirective;

    strictKeyword: StrictKeywordToken = undefined!;
}
