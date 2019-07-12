import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, EndKeywordToken, MethodKeywordToken, NewKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class ClassMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassMethodDeclaration)[] = [
        'methodKeyword',
        'identifier',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'attributes',
        'statements',
        'endKeyword',
        'endMethodKeyword',
    ];

    readonly kind = NodeKind.ClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: NewKeywordToken | MissableIdentifier = undefined!;
    returnType?: TypeDeclaration = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: ParseContextElementSequence<ParseContextKind.ClassMethodAttributes> = undefined!;
    statements?: ParseContextElementArray<ClassMethodDeclaration['kind']> = undefined;
    endKeyword?: MissableToken<EndKeywordToken> = undefined;
    endMethodKeyword?: MethodKeywordToken = undefined;

    get firstToken() {
        return this.methodKeyword;
    }

    get lastToken() {
        if (this.endMethodKeyword) {
            return this.endMethodKeyword;
        }

        if (this.endKeyword) {
            return this.endKeyword;
        }

        return this.attributes[this.attributes.length - 1];
    }
}
