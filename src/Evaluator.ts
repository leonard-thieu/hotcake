import { StringLiteralExpression } from './Syntax/Node/Expression/StringLiteralExpression';
import { NodeKind } from './Syntax/Node/Nodes';
import { TokenKind } from './Syntax/Token/Tokens';
import { Tokenizer } from './Syntax/Tokenizer';
import { assertNever } from './util';

export namespace Evaluator {
    export function evalStringLiteral(expression: StringLiteralExpression, document: string, tokenizer?: Tokenizer) {
        let value = '';

        for (const child of expression.children) {
            switch (child.kind) {
                case TokenKind.StringLiteralText: {
                    value += child.getFullText(document);
                    break;
                }
                case TokenKind.EscapeNull: { value += '\0'; break; }
                case TokenKind.EscapeCharacterTabulation: { value += '\t'; break; }
                case TokenKind.EscapeLineFeedLf: { value += '\n'; break; }
                case TokenKind.EscapeCarriageReturnCr: { value += '\r'; break; }
                case TokenKind.EscapeQuotationMark: { value += '"'; break; }
                case TokenKind.EscapeTilde: { value += '~'; break; }
                case TokenKind.EscapeUnicodeHexValue: {
                    const text = child.getText(document);
                    value += JSON.parse(`"\\${text.slice(/*start*/ 1)}"`);
                    break;
                }
                case NodeKind.ConfigurationTag: {
                    if (!tokenizer) {
                        // TODO: Are configuration variables allowed outside the preprocessor?
                        //       If so, when are they evaluated? During preprocessing? During binding? Does it matter?
                        value += child.startToken.getText(document);
                        if (child.name) {
                            value += child.name.getFullText(document);
                        }
                        value += child.endToken.getText(document);
                    } else {
                        if (child.name) {
                            const configurationTagName = child.name.getFullText(document);
                            value += tokenizer.getVar(configurationTagName);
                        }
                    }
                    break;
                }
                case TokenKind.Skipped:
                case TokenKind.InvalidEscapeSequence: {
                    console.log(`Skipped ${JSON.stringify(child.kind)}`);
                    break;
                }
                default: {
                    assertNever(child);
                    break;
                }
            }
        }

        return value;
    }
}
