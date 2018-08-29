import { assertNever } from "./assertNever";
import { MissingToken } from "./MissingToken";
import { Directives } from "./Node/Directive/Directive";
import { Expressions } from "./Node/Expression/Expression";
import { NodeKind } from "./Node/NodeKind";
import { PreprocessorModule } from "./Node/PreprocessorModule";
import { Token } from "./Token";
import { TokenKind } from "./TokenKind";

export class Tokenizer {
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

    private * readMember(members: Array<Directives | Token>): IterableIterator<Token> {
        for (const member of members) {
            if (member instanceof Token) {
                yield member;

                continue;
            }

            switch (member.kind) {
                case NodeKind.IfDirective: {
                    let branchMembers: Array<Directives | Token> | undefined;

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
                    break;
                }
                case NodeKind.AssignmentDirective: {
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
                            console.log(`Unexpected binary operator ${JSON.stringify(kind)}`);
                            break;
                        }
                    }
                    break;
                }
                case NodeKind.PrintDirective: {
                    const message = this.eval(member.expression);
                    console.log(message);
                    break;
                }
                case NodeKind.ErrorDirective: {
                    const message = this.eval(member.expression);
                    console.error(message);
                    break;
                }
                case NodeKind.RemDirective: {
                    // Ignore
                    break;
                }
                case NodeKind.ElseIfDirective:
                case NodeKind.ElseDirective:
                case NodeKind.EndDirective: {
                    console.log(`Skipped ${JSON.stringify(member.kind)}`);
                    break;
                }
                default: {
                    assertNever(member);
                    break;
                }
            }
        }
    }

    private eval(expression: Expressions | MissingToken): any {
        if (expression instanceof MissingToken) {
            return false;
        }

        switch (expression.kind) {
            case NodeKind.GroupingExpression: {
                return this.eval(expression.expression);
            }
            case NodeKind.BinaryExpression: {
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
                        console.log(`Unexpected binary operator ${JSON.stringify(kind)}`);
                        break;
                    }
                }
                break;
            }
            case NodeKind.UnaryOpExpression: {
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
                        console.log(`Unexpected unary operator ${JSON.stringify(kind)}`);
                        break;
                    }
                }
                break;
            }
            case NodeKind.StringLiteral: {
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
                            console.log(`Skipped ${JSON.stringify(kind)}`);
                            break;
                        }
                    }
                }

                return value;
            }
            case NodeKind.BooleanLiteral: {
                const kind = expression.value.kind;
                switch (kind) {
                    case TokenKind.TrueKeyword: {
                        return true;
                    }
                    case TokenKind.FalseKeyword: {
                        return false;
                    }
                    default: {
                        console.log(`Skipped ${JSON.stringify(kind)}`);
                        break;
                    }
                }
            }
            case NodeKind.IntegerLiteral: {
                return parseInt(expression.value.getText(this.document));
            }
            case NodeKind.FloatLiteral: {
                return parseFloat(expression.value.getText(this.document));
            }
            case NodeKind.Variable: {
                const varName = expression.name.getText(this.document);
                if (varName in this.configVars) {
                    return this.configVars[varName];
                }
                break;
            }
            default: {
                return assertNever(expression);
            }
        }

        return false;
    }
}

export interface ConfigurationVariables {
    HOST: string;
    LANG: string;
    TARGET: string;
    CONFIG: string;
    CD: string;
    MODPATH: string;

    [key: string]: any;
}
