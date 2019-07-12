import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, MethodKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';

export class InterfaceMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceMethodDeclaration)[] = [
        'methodKeyword',
        'identifier',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;

    get firstToken() {
        return this.methodKeyword;
    }

    get lastToken() {
        return this.closingParenthesis;
    }
}
