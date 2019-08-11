import { StrictKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Declaration } from './Declarations';

export const StrictDirectiveChildNames: ReadonlyArray<keyof StrictDirective> = [
    'strictKeyword',
];

export class StrictDirective extends Declaration {
    readonly kind = NodeKind.StrictDirective;

    strictKeyword: StrictKeywordToken = undefined!;
}
