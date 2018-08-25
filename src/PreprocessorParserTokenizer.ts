import { MissingToken } from "./MissingToken";
import { AssignmentDirective } from "./Node/Directive/AssignmentDirective";
import { Directive } from "./Node/Directive/Directive";
import { ErrorDirective } from "./Node/Directive/ErrorDirective";
import { IfDirective } from "./Node/Directive/IfDirective";
import { PrintDirective } from "./Node/Directive/PrintDirective";
import { RemDirective } from "./Node/Directive/RemDirective";
import { BinaryExpression } from "./Node/Expression/BinaryExpression";
import { BooleanLiteral } from "./Node/Expression/BooleanLiteral";
import { Expression } from "./Node/Expression/Expression";
import { FloatLiteral } from "./Node/Expression/FloatLiteral";
import { GroupingExpression } from "./Node/Expression/GroupingExpression";
import { IntegerLiteral } from "./Node/Expression/IntegerLiteral";
import { StringLiteral } from "./Node/Expression/StringLiteral";
import { UnaryOpExpression } from "./Node/Expression/UnaryOpExpression";
import { Variable } from "./Node/Expression/Variable";
import { PreprocessorModule } from "./Node/PreprocessorModule";
import { Token } from "./Token";
import { TokenKind } from "./TokenKind";

export interface ConfigurationVariables {
    HOST: string;
    LANG: string;
    TARGET: string;
    CONFIG: string;
    CD: string;
    MODPATH: string;

    [key: string]: any;
}

export class PreprocessorParserTokenizer {
    private document: string;
    private configVars: ConfigurationVariables;

    * getTokens(document: string, module: PreprocessorModule, configVars: ConfigurationVariables): IterableIterator<Token> {
        this.document = document;
        this.configVars = Object.assign(configVars);

        for (const member of this.readMember(module.members)) {
            yield member;
        }

        yield module.eofToken;
    }

    /**
     * TODO: Ensure operator semantics and implicit type conversions match Monkey X behavior.
     */

    private * readMember(members: Array<Directive | Token>): IterableIterator<Token> {
        for (const member of members) {
            if (member instanceof IfDirective) {
                let branchMembers: Array<Directive | Token> | undefined;

                if (this.eval(member.expression)) {
                    branchMembers = member.members;
                } else {
                    for (const elseIfDirective of member.elseIfDirectives) {
                        if (this.eval(elseIfDirective.expression)) {
                            branchMembers = elseIfDirective.members;
                            break;
                        }
                    }

                    if (!branchMembers) {
                        if (member.elseDirective) {
                            branchMembers = member.elseDirective.members;
                        }
                    }
                }

                if (branchMembers) {
                    for (const branchMember of this.readMember(branchMembers)) {
                        yield branchMember;
                    }
                }
            } else if (member instanceof AssignmentDirective) {
                /**
                 * TODO: Verify Monkey X transpiler behavior wrt setting CD and MODPATH.
                 *       Looks like CD and MODPATH are settable but are always overwritten.
                 */
                const varName = member.name.getText(this.document);
                const value = this.eval(member.expression);

                const kind = member.operator.kind;
                switch (kind) {
                    case TokenKind.EqualsSign: {
                        this.configVars[varName] = value;
                        break;
                    }
                    case TokenKind.PlusSignEqualsSign: {
                        let v = value as string;
                        if (!v.startsWith(';')) {
                            v = ';' + v;
                        }
                        this.configVars[varName] += v;
                        break;
                    }
                    default: {
                        console.log(`Unexpected binary operator ${JSON.stringify(TokenKind[kind])}`);
                        break;
                    }
                }
            } else if (member instanceof PrintDirective) {
                const message = this.eval(member.expression);
                console.log(message);
            } else if (member instanceof ErrorDirective) {
                const message = this.eval(member.expression);
                console.error(message);
            } else if (member instanceof RemDirective) {
                // Ignore
            } else if (!(member instanceof Directive)) {
                yield member;
            } else {
                console.log(`Skipped ${JSON.stringify(member.constructor.name)}`);
            }
        }
    }

    private eval(expression: Expression | MissingToken): any {
        if (expression instanceof GroupingExpression) {
            return this.eval(expression.expression);
        } else if (expression instanceof BinaryExpression) {
            const leftValue = this.eval(expression.leftOperand);
            const rightValue = this.eval(expression.rightOperand);

            const kind = expression.operator.kind;
            switch (kind) {
                case TokenKind.Asterisk: {
                    return leftValue * rightValue;
                }
                case TokenKind.Slash: {
                    return leftValue / rightValue;
                }
                case TokenKind.ModKeyword: {
                    return leftValue % rightValue;
                }
                case TokenKind.ShlKeyword: {
                    return leftValue << rightValue;
                }
                case TokenKind.ShrKeyword: {
                    return leftValue >> rightValue;
                }
                case TokenKind.PlusSign: {
                    return leftValue + rightValue;
                }
                case TokenKind.HyphenMinus: {
                    return leftValue - rightValue;
                }
                case TokenKind.Ampersand: {
                    return leftValue & rightValue;
                }
                case TokenKind.Tilde: {
                    return leftValue ^ rightValue;
                }
                case TokenKind.VerticalBar: {
                    return leftValue | rightValue;
                }
                case TokenKind.EqualsSign: {
                    return leftValue === rightValue;
                }
                case TokenKind.LessThanSign: {
                    return leftValue < rightValue;
                }
                case TokenKind.GreaterThanSign: {
                    return leftValue > rightValue;
                }
                case TokenKind.LessThanSignEqualsSign: {
                    return leftValue <= rightValue;
                }
                case TokenKind.GreaterThanSignEqualsSign: {
                    return leftValue >= rightValue;
                }
                case TokenKind.LessThanSignGreaterThanSign: {
                    return leftValue !== rightValue;
                }
                case TokenKind.AndKeyword: {
                    return leftValue && rightValue;
                }
                case TokenKind.OrKeyword: {
                    return leftValue || rightValue;
                }
                default: {
                    console.log(`Unexpected binary operator ${JSON.stringify(TokenKind[kind])}`);
                    break;
                }
            }
        } else if (expression instanceof UnaryOpExpression) {
            const operand = this.eval(expression.operand);
            const kind = expression.operator.kind;
            switch (kind) {
                case TokenKind.PlusSign: {
                    return +operand;
                }
                case TokenKind.HyphenMinus: {
                    return -operand;
                }
                case TokenKind.Tilde: {
                    return ~operand;
                }
                case TokenKind.NotKeyword: {
                    return !operand;
                }
                default: {
                    console.log(`Unexpected unary operator ${JSON.stringify(TokenKind[kind])}`);
                    break;
                }
            }
        } else if (expression instanceof StringLiteral) {
            let value = '';
            for (const child of expression.children) {
                const kind = child.kind;
                switch (kind) {
                    case TokenKind.StringLiteralText: {
                        value += child.getFullText(this.document);
                        break;
                    }
                    case TokenKind.EscapeNull: { value += '\0'; break; }
                    case TokenKind.EscapeCharacterTabulation: { value += '\t'; break; }
                    case TokenKind.EscapeLineFeedLf: { value += '\n'; break; }
                    case TokenKind.EscapeCarriageReturnCr: { value += '\r'; break; }
                    case TokenKind.EscapeQuotationMark: { value += '"'; break; }
                    case TokenKind.EscapeTilde: { value += '~'; break; }
                    case TokenKind.EscapeUnicodeHexValue: {
                        const text = child.getText(this.document);
                        value += JSON.parse(`"\\${text.slice(1)}"`);
                        break;
                    }
                    default: {
                        console.log(`Skipped ${JSON.stringify(TokenKind[kind])}`);
                        break;
                    }
                }
            }

            return value;
        } else if (expression instanceof BooleanLiteral) {
            const kind = expression.value.kind;
            switch (kind) {
                case TokenKind.TrueKeyword: {
                    return true;
                }
                case TokenKind.FalseKeyword: {
                    return false;
                }
                default: {
                    console.log(`Skipped ${JSON.stringify(TokenKind[kind])}`);
                    break;
                }
            }
        } else if (expression instanceof IntegerLiteral) {
            return parseInt(expression.value.getText(this.document));
        } else if (expression instanceof FloatLiteral) {
            return parseFloat(expression.value.getText(this.document));
        } else if (expression instanceof Variable) {
            const varName = expression.name.getText(this.document);
            if (varName in this.configVars) {
                return this.configVars[varName];
            }
        } else {
            console.log(`Skipped ${JSON.stringify(expression.constructor.name)}`);
        }

        return false;
    }
}
