import { Evaluator } from '../Evaluator';
import { assertNever } from '../util';
import { PreprocessorModuleDeclaration } from './Node/Declaration/PreprocessorModuleDeclaration';
import { Directives } from './Node/Directive/Directive';
import { MissableExpression } from './Node/Expression/Expression';
import { NodeKind } from './Node/NodeKind';
import { Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Tokenizer {
    private document: string = undefined!;
    private configVars: ConfigurationVariableMap = undefined!;
    private tokens: Tokens[] = undefined!;

    getTokens(
        preprocessorModuleDeclaration: PreprocessorModuleDeclaration,
        configVars: ConfigurationVariables,
    ): Tokens[] {
        this.document = preprocessorModuleDeclaration.document;
        this.configVars = new ConfigurationVariableMap(Object.entries(configVars));
        this.tokens = [];

        this.readMembers(preprocessorModuleDeclaration.members);
        this.tokens.push(preprocessorModuleDeclaration.eofToken);

        return this.tokens;
    }

    // TODO: Ensure operator semantics and implicit type conversions match Monkey X behavior.
    private readMembers(members: (Directives | Tokens)[]): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.IfDirective: {
                    let branchMembers: (Directives | Tokens)[] | undefined;

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
                        this.readMembers(branchMembers);
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

                    const { kind } = member.operator;
                    switch (kind) {
                        case TokenKind.EqualsSign: {
                            this.configVars.set(varName, value);
                            break;
                        }
                        case TokenKind.PlusSignEqualsSign: {
                            let v = value as string;
                            if (!v.startsWith(';')) {
                                v = ';' + v;
                            }
                            v = this.configVars.get(varName) + v;
                            this.configVars.set(varName, v);
                            break;
                        }
                        case TokenKind.Missing: {
                            break;
                        }
                        default: {
                            assertNever(kind);
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
                default: {
                    this.tokens.push(member);
                    break;
                }
            }
        }
    }

    private eval(expression: MissableExpression): any {
        if (expression.kind === TokenKind.Missing) {
            return false;
        }

        switch (expression.kind) {
            case NodeKind.GroupingExpression: {
                return this.eval(expression.expression);
            }
            case NodeKind.BinaryExpression: {
                const leftValue = this.eval(expression.leftOperand);
                const rightValue = this.eval(expression.rightOperand);

                const { kind } = expression.operator;
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
                        return assertNever(kind);
                    }
                }
            }
            case NodeKind.UnaryExpression: {
                const operand = this.eval(expression.operand);

                const { kind } = expression.operator;
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
                        return assertNever(kind);
                    }
                }
            }
            case NodeKind.StringLiteralExpression: {
                return Evaluator.evalStringLiteral(expression, this.document, this.configVars);
            }
            case NodeKind.BooleanLiteralExpression: {
                const { kind } = expression.value;
                switch (kind) {
                    case TokenKind.TrueKeyword: {
                        return true;
                    }
                    case TokenKind.FalseKeyword: {
                        return false;
                    }
                    default: {
                        return assertNever(kind);
                    }
                }
            }
            case NodeKind.IntegerLiteralExpression: {
                return parseInt(expression.value.getText(this.document));
            }
            case NodeKind.FloatLiteralExpression: {
                return parseFloat(expression.value.getText(this.document));
            }
            case NodeKind.IdentifierExpression: {
                let identifierName: string
                if (expression.identifier.kind === NodeKind.EscapedIdentifier) {
                    identifierName = expression.identifier.name.getText(this.document);
                } else {
                    identifierName = expression.identifier.getText(this.document);
                }

                return this.configVars.get(identifierName);
            }
            case NodeKind.NewExpression:
            case NodeKind.NullExpression:
            case NodeKind.ArrayLiteralExpression:
            case NodeKind.ScopeMemberAccessExpression:
            case NodeKind.InvokeExpression:
            case NodeKind.IndexExpression:
            case NodeKind.SliceExpression:
            case NodeKind.SelfExpression:
            case NodeKind.SuperExpression:
            case NodeKind.GlobalScopeExpression: {
                throw new Error(`Unexpected expression: ${JSON.stringify(expression.kind)}`);
            }
        }

        return assertNever(expression);
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

export class ConfigurationVariableMap extends Map<string, any> {
    get(key: string): any {
        let value = super.get(key);
        if (typeof value === 'undefined') {
            value = '';
        }

        return value;
    }
}
