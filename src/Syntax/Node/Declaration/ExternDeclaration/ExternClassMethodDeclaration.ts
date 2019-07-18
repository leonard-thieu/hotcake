import { ParseContextElementSequence, ParseContextKind } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { ClosingParenthesisToken, MethodKeywordToken, OpeningParenthesisToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { TypeAnnotation } from '../../TypeAnnotation';
import { DataDeclarationSequence } from '../DataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternClassMethodDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: ParseContextElementSequence<ParseContextKind.ClassMethodAttributes> = undefined!;
}
