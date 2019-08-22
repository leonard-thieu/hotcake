import { Diagnostic, DiagnosticKind } from '../Diagnostics';
import { assertNever } from '../util';
import { AccessibilityDirective, AccessibilityKeywordToken } from './Node/Declaration/AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from './Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration, ClassMethodDeclaration } from './Node/Declaration/ClassDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from './Node/Declaration/DataDeclarationSequence';
import { ExternClassDeclaration, ExternClassMethodDeclaration } from './Node/Declaration/ExternClassDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationKeywordToken, ExternDataDeclarationSequence } from './Node/Declaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './Node/Declaration/ExternFunctionDeclaration';
import { FriendDirective } from './Node/Declaration/FriendDirective';
import { FunctionDeclaration } from './Node/Declaration/FunctionDeclaration';
import { ImportStatement } from './Node/Declaration/ImportStatement';
import { InterfaceDeclaration, InterfaceMethodDeclaration } from './Node/Declaration/InterfaceDeclaration';
import { ModuleDeclaration } from './Node/Declaration/ModuleDeclaration';
import { PreprocessorModuleDeclaration } from './Node/Declaration/PreprocessorModuleDeclaration';
import { StrictDirective } from './Node/Declaration/StrictDirective';
import { TypeParameter } from './Node/Declaration/TypeParameter';
import { Expressions } from './Node/Expression/Expressions';
import { IdentifierStartToken } from './Node/Identifier';
import { ModulePath } from './Node/ModulePath';
import { NodeKind, Nodes } from './Node/Nodes';
import { AssignableExpression, AssignmentOperatorToken, AssignmentStatement } from './Node/Statement/AssignmentStatement';
import { ContinueStatement } from './Node/Statement/ContinueStatement';
import { DataDeclarationSequenceStatement } from './Node/Statement/DataDeclarationSequenceStatement';
import { EmptyStatement } from './Node/Statement/EmptyStatement';
import { ExitStatement } from './Node/Statement/ExitStatement';
import { ExpressionStatement } from './Node/Statement/ExpressionStatement';
import { ForEachInLoop, ForLoopOperatorToken, NumericForLoop } from './Node/Statement/ForLoops';
import { ElseClause, ElseIfClause, IfStatement } from './Node/Statement/IfStatement';
import { RepeatLoop } from './Node/Statement/RepeatLoop';
import { ReturnStatement } from './Node/Statement/ReturnStatement';
import { CaseClause, DefaultClause, SelectStatement } from './Node/Statement/SelectStatement';
import { Statements } from './Node/Statement/Statements';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchClause, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { LonghandTypeAnnotation, ShorthandTypeAnnotation, ShorthandTypeToken, TypeAnnotation } from './Node/TypeAnnotation';
import { ParseContextElementMapBase, ParseContextKind, ParserBase } from './ParserBase';
import { MissingToken, MissingTokenKind, MissingTokenKinds } from './Token/MissingToken';
import { ModKeywordEqualsSignToken } from './Token/ModKeywordEqualsSignToken';
import { ShlKeywordEqualsSignToken } from './Token/ShlKeywordEqualsSignToken';
import { ShrKeywordEqualsSignToken } from './Token/ShrKeywordEqualsSignToken';
import { SkippedToken } from './Token/SkippedToken';
import { AliasKeywordToken, CaseKeywordToken, CatchKeywordToken, ClassKeywordToken, ColonToken, ConstKeywordToken, ContinueKeywordToken, DefaultKeywordToken, ElseIfKeywordToken, ElseKeywordToken, ExitKeywordToken, ForKeywordToken, FriendKeywordToken, FunctionKeywordToken, IfKeywordToken, ImportKeywordToken, InterfaceKeywordToken, LocalKeywordToken, MethodKeywordToken, RepeatKeywordToken, ReturnKeywordToken, SelectKeywordToken, StrictKeywordToken, ThrowKeywordToken, TokenKind, Tokens, TryKeywordToken, WhileKeywordToken } from './Token/Tokens';

export class Parser extends ParserBase {
    private accessibility: AccessibilityKeywordToken['kind'] = undefined!;
    private moduleDeclaration: ModuleDeclaration = undefined!;

    parse(preprocessorModuleDeclaration: PreprocessorModuleDeclaration, tokens: Tokens[]): ModuleDeclaration {
        this.tokens = [...tokens];
        this.position = 0;
        this.parseContexts = [];
        this.accessibility = TokenKind.PublicKeyword;

        return this.parseModuleDeclaration(preprocessorModuleDeclaration);
    }

    // #region Module declaration

    private parseModuleDeclaration(preprocessorModuleDeclaration: PreprocessorModuleDeclaration): ModuleDeclaration {
        const moduleDeclaration = new ModuleDeclaration();
        this.moduleDeclaration = moduleDeclaration;
        moduleDeclaration.preprocessorModuleDeclaration = preprocessorModuleDeclaration;

        moduleDeclaration.strictNewlines = this.parseList(ParseContextKind.NewlineList, moduleDeclaration);
        const strictKeyword = this.getToken();
        if (strictKeyword.kind === TokenKind.StrictKeyword) {
            this.advanceToken();

            moduleDeclaration.strictDirective = this.parseStrictDirective(moduleDeclaration, strictKeyword);
        }
        moduleDeclaration.members = this.parseListWithSkippedTokens(ParseContextKind.ModuleDeclarationHeader, moduleDeclaration);
        moduleDeclaration.members.push(...this.parseListWithSkippedTokens(ParseContextKind.ModuleDeclaration, moduleDeclaration));
        moduleDeclaration.eofToken = this.eat(TokenKind.EOF);

        return moduleDeclaration;
    }

    // #region Module declaration header members

    private isModuleDeclarationHeaderTerminator(token: Tokens): boolean {
        return !this.isModuleDeclarationHeaderMemberStart(token);
    }

    private isModuleDeclarationHeaderMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ImportKeyword:
            case TokenKind.FriendKeyword:
            case TokenKind.AliasKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseModuleDeclarationHeaderMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ImportKeyword: {
                this.advanceToken();

                return this.parseImportStatement(parent, token);
            }
            case TokenKind.FriendKeyword: {
                this.advanceToken();

                return this.parseFriendDirective(parent, token);
            }
            case TokenKind.AliasKeyword: {
                this.advanceToken();

                return this.parseAliasDirectiveSequence(parent, token);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword: {
                this.advanceToken();

                this.accessibility = token.kind;

                return this.parseAccessibilityDirective(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    // #endregion

    // #region Module declaration members

    private isModuleDeclarationMembersListTerminator(): boolean {
        return false;
    }

    private isModuleDeclarationMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword:
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.InterfaceKeyword:
            case TokenKind.ClassKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseModuleDeclarationMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword: {
                this.advanceToken();

                this.accessibility = token.kind;

                return this.parseAccessibilityDirective(parent, token);
            }
            case TokenKind.ConstKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.GlobalKeyword: {
                this.advanceToken();

                if (this.accessibility === TokenKind.ExternKeyword) {
                    return this.parseExternDataDeclarationSequence(parent, token);
                }

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                if (this.accessibility === TokenKind.ExternKeyword) {
                    return this.parseExternFunctionDeclaration(parent, token);
                }

                return this.parseFunctionDeclaration(parent, token);
            }
            case TokenKind.InterfaceKeyword: {
                this.advanceToken();

                return this.parseInterfaceDeclaration(parent, token);
            }
            case TokenKind.ClassKeyword: {
                this.advanceToken();

                if (this.accessibility === TokenKind.ExternKeyword) {
                    return this.parseExternClassDeclaration(parent, token);
                }

                return this.parseClassDeclaration(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    // #endregion

    // #endregion

    // #region Strict directive

    private parseStrictDirective(parent: Nodes, strictKeyword: StrictKeywordToken): StrictDirective {
        const strictDirective = new StrictDirective();
        strictDirective.parent = parent;
        strictDirective.strictKeyword = strictKeyword;

        return strictDirective;
    }

    // #endregion

    // #region Import statement

    private parseImportStatement(parent: Nodes, importKeyword: ImportKeywordToken): ImportStatement {
        const importStatement = new ImportStatement();
        importStatement.parent = parent;
        importStatement.importKeyword = importKeyword;

        const token = this.getToken();
        switch (token.kind) {
            // Native file path
            case TokenKind.QuotationMark: {
                this.advanceToken();

                importStatement.path = this.parseStringLiteralExpression(importStatement, token);
                break;
            }
            // Module path
            case TokenKind.Identifier: {
                importStatement.path = this.parseModulePath(importStatement);
                break;
            }
            default: {
                importStatement.path = this.createMissingToken(token.fullStart, MissingTokenKind.ImportStatementPath);
                break;
            }
        }

        return importStatement;
    }

    // #endregion

    // #region Friend directive

    private parseFriendDirective(parent: Nodes, friendKeyword: FriendKeywordToken): FriendDirective {
        const friendDirective = new FriendDirective();
        friendDirective.parent = parent;
        friendDirective.friendKeyword = friendKeyword;
        friendDirective.modulePath = this.parseModulePath(friendDirective);

        return friendDirective;
    }

    // #endregion

    // #region Module path

    private parseModulePath(parent: Nodes): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;
        modulePath.children = this.parseList(ParseContextKind.ModulePathSequence, modulePath, TokenKind.Period);

        const { children } = modulePath;
        const lastChild = children.pop();
        if (lastChild &&
            lastChild.kind === TokenKind.Identifier
        ) {
            modulePath.moduleIdentifier = lastChild;
        } else {
            if (lastChild) {
                // Give the child back
                children.push(lastChild);
            }

            const token = this.getToken();
            modulePath.moduleIdentifier = this.createMissingToken(token.fullStart, TokenKind.Identifier);
        }

        return modulePath;
    }

    private isModulePathSequenceTerminator(token: Tokens): boolean {
        return !this.isModulePathSequenceMemberStart(token);
    }

    protected isModulePathSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Period: {
                return true;
            }
        }

        return false;
    }

    protected parseModulePathSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Period: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Alias directive sequence

    private parseAliasDirectiveSequence(parent: Nodes, aliasKeyword: AliasKeywordToken): AliasDirectiveSequence {
        const aliasDirectiveSequence = new AliasDirectiveSequence();
        aliasDirectiveSequence.parent = parent;
        aliasDirectiveSequence.aliasKeyword = aliasKeyword;
        aliasDirectiveSequence.children = this.parseList(ParseContextKind.AliasDirectiveSequence, aliasDirectiveSequence, TokenKind.Comma);

        return aliasDirectiveSequence;
    }

    // #region Alias directive sequence members

    private isAliasDirectiveSequenceTerminator(token: Tokens): boolean {
        return !this.isAliasDirectiveSequenceMemberStart(token);
    }

    private isAliasDirectiveSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseAliasDirectiveSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseAliasDirective(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Alias directive

    private parseAliasDirective(parent: Nodes, identifierStart: IdentifierStartToken): AliasDirective {
        const aliasDirective = new AliasDirective();
        aliasDirective.parent = parent;
        aliasDirective.identifier = this.parseIdentifier(aliasDirective, identifierStart);
        aliasDirective.equalsSign = this.eatMissable(TokenKind.EqualsSign);
        aliasDirective.children = this.parseList(ParseContextKind.AliasDirective, aliasDirective, TokenKind.Period);

        return aliasDirective;
    }

    // #region Alias directive members

    private isAliasDirectiveTerminator(token: Tokens): boolean {
        return !this.isAliasDirectiveMemberStart(token);
    }

    private isAliasDirectiveMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Period: {
                return true;
            }
        }

        return false;
    }

    private parseAliasDirectiveMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseIdentifier(parent, token);
            }
            case TokenKind.Period: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #endregion

    // #endregion

    // #region Accessibility directive

    private parseAccessibilityDirective(parent: Nodes, accessibilityKeyword: AccessibilityKeywordToken): AccessibilityDirective {
        const accessibilityDirective = new AccessibilityDirective();
        accessibilityDirective.parent = parent;
        accessibilityDirective.accessibilityKeyword = accessibilityKeyword;
        if (accessibilityDirective.accessibilityKeyword.kind === TokenKind.ExternKeyword) {
            accessibilityDirective.externPrivateKeyword = this.eatOptional(TokenKind.PrivateKeyword);
        }

        return accessibilityDirective;
    }

    // #endregion

    // #region Extern data declaration sequence

    private parseExternDataDeclarationSequence(parent: Nodes, dataDeclarationKeyword: ExternDataDeclarationKeywordToken): ExternDataDeclarationSequence {
        const externDataDeclarationSequence = new ExternDataDeclarationSequence();
        externDataDeclarationSequence.parent = parent;
        externDataDeclarationSequence.dataDeclarationKeyword = dataDeclarationKeyword;
        externDataDeclarationSequence.children = this.parseList(ParseContextKind.ExternDataDeclarationSequence, externDataDeclarationSequence, TokenKind.Comma);

        return externDataDeclarationSequence;
    }

    // #region Extern data declaration sequence members

    private isExternDataDeclarationSequenceTerminator(token: Tokens): boolean {
        return !this.isExternDataDeclarationSequenceMemberStart(token);
    }

    private isExternDataDeclarationSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseExternDataDeclarationSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseExternDataDeclaration(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Extern data declaration

    private parseExternDataDeclaration(parent: Nodes, identifierStart: IdentifierStartToken): ExternDataDeclaration {
        const externDataDeclaration = new ExternDataDeclaration();
        externDataDeclaration.parent = parent;
        externDataDeclaration.identifier = this.parseIdentifier(parent, identifierStart);
        externDataDeclaration.typeAnnotation = this.parseTypeAnnotation(externDataDeclaration);
        externDataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externDataDeclaration.equalsSign) {
            externDataDeclaration.nativeSymbol = this.parseMissableStringLiteralExpression(externDataDeclaration);
        }

        return externDataDeclaration;
    }

    // #endregion

    // #endregion

    // #region Extern function declaration

    private parseExternFunctionDeclaration(parent: Nodes, functionKeyword: FunctionKeywordToken): ExternFunctionDeclaration {
        const externFunctionDeclaration = new ExternFunctionDeclaration();
        externFunctionDeclaration.parent = parent;
        externFunctionDeclaration.functionKeyword = functionKeyword;
        externFunctionDeclaration.identifier = this.parseMissableIdentifier(externFunctionDeclaration)
        externFunctionDeclaration.returnType = this.parseTypeAnnotation(externFunctionDeclaration);
        externFunctionDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        externFunctionDeclaration.parameters = this.parseDataDeclarationSequence(externFunctionDeclaration);
        externFunctionDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        externFunctionDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externFunctionDeclaration.equalsSign) {
            externFunctionDeclaration.nativeSymbol = this.parseMissableStringLiteralExpression(externFunctionDeclaration);
        }

        return externFunctionDeclaration;
    }

    // #endregion

    // #region Extern class declaration

    private parseExternClassDeclaration(parent: Nodes, classKeyword: ClassKeywordToken): ExternClassDeclaration {
        const externClassDeclaration = new ExternClassDeclaration();
        externClassDeclaration.parent = parent;
        externClassDeclaration.classKeyword = classKeyword;
        externClassDeclaration.identifier = this.parseMissableIdentifier(externClassDeclaration);

        externClassDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (externClassDeclaration.extendsKeyword) {
            externClassDeclaration.superType = this.eatOptional(TokenKind.NullKeyword);
            if (!externClassDeclaration.superType) {
                externClassDeclaration.superType = this.parseMissableTypeReference(externClassDeclaration);
            }
        }

        externClassDeclaration.attribute = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword);
        externClassDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externClassDeclaration.equalsSign) {
            externClassDeclaration.nativeSymbol = this.parseMissableStringLiteralExpression(externClassDeclaration);
        }
        externClassDeclaration.members = this.parseListWithSkippedTokens(ParseContextKind.ExternClassDeclaration, externClassDeclaration);
        externClassDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (externClassDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            externClassDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);
        }

        return externClassDeclaration;
    }

    // #region Extern class declaration members

    private isExternClassDeclarationMembersListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    private isExternClassDeclarationMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseExternClassDeclarationMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                this.advanceToken();

                return this.parseAccessibilityDirective(parent, token);
            }
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                this.advanceToken();

                return this.parseExternDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                return this.parseExternFunctionDeclaration(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseExternClassMethodDeclaration(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    // #endregion

    // #region Extern class method declaration

    private parseExternClassMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): ExternClassMethodDeclaration {
        const externClassMethodDeclaration = new ExternClassMethodDeclaration();
        externClassMethodDeclaration.parent = parent;
        externClassMethodDeclaration.methodKeyword = methodKeyword;
        externClassMethodDeclaration.identifier = this.parseMissableIdentifier(externClassMethodDeclaration);
        externClassMethodDeclaration.returnType = this.parseTypeAnnotation(externClassMethodDeclaration);
        externClassMethodDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        externClassMethodDeclaration.parameters = this.parseDataDeclarationSequence(externClassMethodDeclaration);
        externClassMethodDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        externClassMethodDeclaration.attributes = this.parseList(ParseContextKind.ClassMethodAttributes, externClassMethodDeclaration);
        externClassMethodDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externClassMethodDeclaration.equalsSign) {
            externClassMethodDeclaration.nativeSymbol = this.parseMissableStringLiteralExpression(externClassMethodDeclaration);
        }

        return externClassMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #region Data declaration sequence

    private parseDataDeclarationSequence(parent: Nodes, dataDeclarationKeyword: DataDeclarationKeywordToken | null = null): DataDeclarationSequence {
        const dataDeclarationSequence = new DataDeclarationSequence();
        dataDeclarationSequence.parent = parent;
        dataDeclarationSequence.dataDeclarationKeyword = dataDeclarationKeyword;
        dataDeclarationSequence.children = this.parseList(ParseContextKind.DataDeclarationSequence, dataDeclarationSequence, TokenKind.Comma);

        return dataDeclarationSequence;
    }

    // #region Data declaration sequence members

    private isDataDeclarationSequenceTerminator(token: Tokens): boolean {
        return !this.isDataDeclarationSequenceMemberStart(token);
    }

    private isDataDeclarationSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseDataDeclarationSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseDataDeclaration(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Data declaration

    private parseMissableDataDeclaration(parent: Nodes): DataDeclaration | MissingToken {
        const name = this.getToken();
        switch (name.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseDataDeclaration(parent, name);
            }
        }

        return this.createMissingToken(name.fullStart, MissingTokenKind.DataDeclaration);
    }

    private parseDataDeclaration(parent: Nodes, identifierStart: IdentifierStartToken): DataDeclaration {
        const dataDeclaration = new DataDeclaration();
        dataDeclaration.parent = parent;
        dataDeclaration.identifier = this.parseIdentifier(dataDeclaration, identifierStart);
        dataDeclaration.typeAnnotation = this.parseTypeAnnotation(dataDeclaration);
        if (parent.kind === NodeKind.DataDeclarationSequence &&
            parent.dataDeclarationKeyword &&
            parent.dataDeclarationKeyword.kind === TokenKind.ConstKeyword
        ) {
            dataDeclaration.operator = this.eatMissable(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
            dataDeclaration.expression = this.parseExpression(dataDeclaration);
        } else {
            dataDeclaration.operator = this.eatOptional(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
            if (dataDeclaration.operator) {
                dataDeclaration.expression = this.parseExpression(dataDeclaration);
            }
        }

        return dataDeclaration;
    }

    // #endregion

    // #endregion

    // #region Function declaration

    private parseFunctionDeclaration(parent: Nodes, functionKeyword: FunctionKeywordToken): FunctionDeclaration {
        const functionDeclaration = new FunctionDeclaration();
        functionDeclaration.parent = parent;
        functionDeclaration.functionKeyword = functionKeyword;
        functionDeclaration.identifier = this.parseMissableIdentifier(functionDeclaration);
        functionDeclaration.returnType = this.parseTypeAnnotation(functionDeclaration);
        functionDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        functionDeclaration.parameters = this.parseDataDeclarationSequence(functionDeclaration);
        functionDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        functionDeclaration.statements = this.parseListWithSkippedTokens(ParseContextKind.FunctionDeclaration, functionDeclaration);
        functionDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (functionDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            functionDeclaration.endFunctionKeyword = this.eatOptional(TokenKind.FunctionKeyword);
        }

        return functionDeclaration;
    }

    // #endregion

    // #region Interface declaration

    private parseInterfaceDeclaration(parent: Nodes, interfaceKeyword: InterfaceKeywordToken): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = interfaceKeyword;
        interfaceDeclaration.identifier = this.parseMissableIdentifier(interfaceDeclaration);
        interfaceDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (interfaceDeclaration.extendsKeyword) {
            interfaceDeclaration.implementedTypes = this.parseList(ParseContextKind.TypeReferenceSequence, interfaceDeclaration, TokenKind.Comma);
        }
        interfaceDeclaration.members = this.parseListWithSkippedTokens(ParseContextKind.InterfaceDeclaration, interfaceDeclaration);
        interfaceDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (interfaceDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            interfaceDeclaration.endInterfaceKeyword = this.eatOptional(TokenKind.InterfaceKeyword);
        }

        return interfaceDeclaration;
    }

    // #region Interface declaration members

    private isInterfaceDeclarationMembersListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    private isInterfaceDeclarationMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseInterfaceDeclarationMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseInterfaceMethodDeclaration(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    // #endregion

    // #region Interface method declaration

    private parseInterfaceMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): InterfaceMethodDeclaration {
        const interfaceMethodDeclaration = new InterfaceMethodDeclaration();
        interfaceMethodDeclaration.parent = parent;
        interfaceMethodDeclaration.methodKeyword = methodKeyword;
        interfaceMethodDeclaration.identifier = this.parseMissableIdentifier(interfaceMethodDeclaration)
        interfaceMethodDeclaration.returnType = this.parseTypeAnnotation(interfaceMethodDeclaration);
        interfaceMethodDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        interfaceMethodDeclaration.parameters = this.parseDataDeclarationSequence(interfaceMethodDeclaration);
        interfaceMethodDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);

        return interfaceMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class declaration

    private parseClassDeclaration(parent: Nodes, classKeyword: ClassKeywordToken): ClassDeclaration {
        const classDeclaration = new ClassDeclaration();
        classDeclaration.parent = parent;
        classDeclaration.classKeyword = classKeyword;
        classDeclaration.identifier = this.parseMissableIdentifier(classDeclaration);

        classDeclaration.lessThanSign = this.eatOptional(TokenKind.LessThanSign);
        if (classDeclaration.lessThanSign) {
            classDeclaration.typeParameters = this.parseList(ParseContextKind.TypeParameterSequence, classDeclaration, TokenKind.Comma);
            classDeclaration.greaterThanSign = this.eatMissable(TokenKind.GreaterThanSign);
        }

        classDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (classDeclaration.extendsKeyword) {
            classDeclaration.superType = this.parseMissableTypeReference(classDeclaration);
        }

        classDeclaration.implementsKeyword = this.eatOptional(TokenKind.ImplementsKeyword);
        if (classDeclaration.implementsKeyword) {
            classDeclaration.implementedTypes = this.parseList(ParseContextKind.TypeReferenceSequence, classDeclaration, TokenKind.Comma);
        }

        classDeclaration.attribute = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword);
        classDeclaration.members = this.parseListWithSkippedTokens(ParseContextKind.ClassDeclaration, classDeclaration);
        classDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (classDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            classDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);
        }

        return classDeclaration;
    }

    // #region Type parameter sequence

    // #region Type parameter sequence members

    private isTypeParameterSequenceTerminator(token: Tokens): boolean {
        return !this.isTypeParameterSequenceMemberStart(token);
    }

    private isTypeParameterSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseTypeParameterSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseTypeParameter(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Type parameter

    private parseTypeParameter(parent: Nodes, identifierStart: IdentifierStartToken): TypeParameter {
        const typeParameter = new TypeParameter();
        typeParameter.parent = parent;
        typeParameter.identifier = this.parseIdentifier(typeParameter, identifierStart);

        return typeParameter;
    }

    // #endregion

    // #endregion

    // #region Class declaration members

    private isClassDeclarationMembersListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    private isClassDeclarationMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseClassDeclarationMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                return this.parseFunctionDeclaration(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseClassMethodDeclaration(parent, token);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                this.advanceToken();

                return this.parseAccessibilityDirective(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    // #endregion

    // #region Class method declaration

    private parseClassMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): ClassMethodDeclaration {
        const classMethodDeclaration = new ClassMethodDeclaration();
        classMethodDeclaration.parent = parent;
        classMethodDeclaration.methodKeyword = methodKeyword;
        const newKeyword = this.eatOptional(TokenKind.NewKeyword);
        if (newKeyword) {
            classMethodDeclaration.identifier = newKeyword;
        } else {
            classMethodDeclaration.identifier = this.parseMissableIdentifier(classMethodDeclaration);
            classMethodDeclaration.returnType = this.parseTypeAnnotation(classMethodDeclaration);
        }
        classMethodDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        classMethodDeclaration.parameters = this.parseDataDeclarationSequence(classMethodDeclaration);
        classMethodDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);

        classMethodDeclaration.attributes = this.parseList(ParseContextKind.ClassMethodAttributes, classMethodDeclaration);
        if (classMethodDeclaration.attributes.findIndex(attribute => attribute.kind === TokenKind.AbstractKeyword) === -1) {
            classMethodDeclaration.statements = this.parseListWithSkippedTokens(ParseContextKind.ClassMethodDeclaration, classMethodDeclaration);
            classMethodDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
            if (classMethodDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
                classMethodDeclaration.endMethodKeyword = this.eatOptional(TokenKind.MethodKeyword);
            }
        }

        return classMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class method attributes

    private isClassMethodAttributesTerminator(token: Tokens): boolean {
        return !this.isClassMethodAttributeStart(token);
    }

    private isClassMethodAttributeStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.AbstractKeyword:
            case TokenKind.FinalKeyword:
            case TokenKind.PropertyKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseClassMethodAttribute(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.AbstractKeyword:
            case TokenKind.FinalKeyword:
            case TokenKind.PropertyKeyword: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Statements

    private isFunctionLikeStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #region Statement list members

    private isStatementListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.LocalKeyword:
            case TokenKind.ReturnKeyword:
            case TokenKind.IfKeyword:
            case TokenKind.SelectKeyword:
            case TokenKind.WhileKeyword:
            case TokenKind.RepeatKeyword:
            case TokenKind.ForKeyword:
            case TokenKind.ContinueKeyword:
            case TokenKind.ExitKeyword:
            case TokenKind.ThrowKeyword:
            case TokenKind.TryKeyword:
            case TokenKind.Semicolon:
            case TokenKind.Newline:

            // Expression statement start
            case TokenKind.OpeningParenthesis:
            case TokenKind.NewKeyword:
            case TokenKind.SelfKeyword:
            case TokenKind.SuperKeyword:
            case TokenKind.Period:
            // Escaped identifiers (prefixed with '@') cannot start an expression statement
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseStatementListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.LocalKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequenceStatement(parent, token);
            }
            case TokenKind.ReturnKeyword: {
                this.advanceToken();

                return this.parseReturnStatement(parent, token);
            }
            case TokenKind.IfKeyword: {
                this.advanceToken();

                return this.parseIfStatement(parent, token);
            }
            case TokenKind.SelectKeyword: {
                this.advanceToken();

                return this.parseSelectStatement(parent, token);
            }
            case TokenKind.WhileKeyword: {
                this.advanceToken();

                return this.parseWhileLoop(parent, token);
            }
            case TokenKind.RepeatKeyword: {
                this.advanceToken();

                return this.parseRepeatLoop(parent, token);
            }
            case TokenKind.ForKeyword: {
                this.advanceToken();

                return this.parseForLoop(parent, token);
            }
            case TokenKind.ContinueKeyword: {
                this.advanceToken();

                return this.parseContinueStatement(parent, token);
            }
            case TokenKind.ExitKeyword: {
                this.advanceToken();

                return this.parseExitStatement(parent, token);
            }
            case TokenKind.ThrowKeyword: {
                this.advanceToken();

                return this.parseThrowStatement(parent, token);
            }
            case TokenKind.TryKeyword: {
                this.advanceToken();

                return this.parseTryStatement(parent, token);
            }
            case TokenKind.Semicolon:
            case TokenKind.Newline: {
                return this.parseEmptyStatement(parent);
            }
        }

        const assignmentStatement = this.tryParseAssignmentStatement(parent);
        if (assignmentStatement) {
            return assignmentStatement;
        }

        const newlines = this.parseList(ParseContextKind.NewlineList, parent);
        let expression = this.parsePrimaryExpression(parent, /*isStatement*/ true);

        const rightExpression: Expressions | MissingToken = this.getRightExpression(expression);
        if (rightExpression.kind === TokenKind.Missing) {
            throw new Error(`Expression is missing.`);
        }

        const rightParent = rightExpression.parent!;

        if (rightExpression.kind === NodeKind.IdentifierExpression &&
            rightParent.kind !== NodeKind.InvokeExpression
        ) {
            const invokeExpression = this.parseInvokeExpression(rightExpression, /*isStatement*/ true);

            if (rightExpression === expression) {
                expression = invokeExpression;
            } else {
                switch (rightParent.kind) {
                    case NodeKind.ScopeMemberAccessExpression: { rightParent.member = invokeExpression; break; }
                    case NodeKind.IndexExpression: { rightParent.indexableExpression = invokeExpression; break; }
                    case NodeKind.SliceExpression: { rightParent.sliceableExpression = invokeExpression; break; }
                }
            }
        }

        expression.newlines = newlines;

        if (rightExpression.parent!.kind !== NodeKind.InvokeExpression) {
            throw new Error(`${expression.kind} cannot be used as a statement.`);
        }

        return this.parseExpressionStatement(parent, expression);
    }

    private getRightExpression(expression: Expressions | MissingToken) {
        while (true) {
            switch (expression.kind) {
                case NodeKind.ScopeMemberAccessExpression: { expression = expression.member; break; }
                case NodeKind.IndexExpression: { expression = expression.indexableExpression; break; }
                case NodeKind.SliceExpression: { expression = expression.sliceableExpression; break; }
                case NodeKind.InvokeExpression: { expression = expression.invocableExpression; break; }
                default: { return expression; }
            }
        }
    }

    // #endregion

    // #region Data declaration sequence statement

    private parseDataDeclarationSequenceStatement(
        parent: Nodes,
        dataDeclarationKeyword: ConstKeywordToken | LocalKeywordToken,
    ): DataDeclarationSequenceStatement {
        const dataDeclarationSequenceStatement = new DataDeclarationSequenceStatement();
        dataDeclarationSequenceStatement.parent = parent;
        dataDeclarationSequenceStatement.dataDeclarationSequence = this.parseDataDeclarationSequence(dataDeclarationSequenceStatement, dataDeclarationKeyword);
        dataDeclarationSequenceStatement.terminator = this.eatStatementTerminator();

        return dataDeclarationSequenceStatement;
    }

    // #endregion

    // #region Return statement

    private parseReturnStatement(parent: Nodes, returnKeyword: ReturnKeywordToken): ReturnStatement {
        const returnStatement = new ReturnStatement();
        returnStatement.parent = parent;
        returnStatement.returnKeyword = returnKeyword;

        const token = this.getToken();
        if (this.isExpressionStart(token)) {
            returnStatement.expression = this.parseExpression(returnStatement) as Expressions;
        }

        returnStatement.terminator = this.eatStatementTerminator();

        return returnStatement;
    }

    // #endregion

    // #region If statement

    private parseIfStatement(parent: Nodes, ifKeyword: IfKeywordToken): IfStatement {
        const ifStatement = new IfStatement();
        ifStatement.parent = parent;
        ifStatement.ifKeyword = ifKeyword;
        ifStatement.expression = this.parseExpression(ifStatement);
        ifStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);

        if (this.getToken().kind === TokenKind.Newline) {
            ifStatement.statements = this.parseListWithSkippedTokens(ParseContextKind.IfStatement, ifStatement);
            ifStatement.elseIfClauses = this.parseList(ParseContextKind.ElseIfClauseList, ifStatement);

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseClause = this.parseElseClause(ifStatement, elseKeyword);
            }

            ifStatement.endKeyword = this.eatMissable(TokenKind.EndIfKeyword, TokenKind.EndKeyword);
            if (ifStatement.endKeyword.kind === TokenKind.EndKeyword) {
                ifStatement.endIfKeyword = this.eatOptional(TokenKind.IfKeyword);
            }
        } else {
            const statement = this.parseStatementListMember(ifStatement);
            this.uneatStatementTerminator(statement);
            ifStatement.statements = [statement];

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseClause = this.parseElseClause(ifStatement, elseKeyword, /*isSingleLine*/ true);
            }
        }

        ifStatement.terminator = this.eatStatementTerminator();

        return ifStatement;
    }

    // #region ElseIf clause list members

    private isElseIfClauseListTerminator(token: Tokens): boolean {
        return !this.isElseIfClauseListMemberStart(token);
    }

    private isElseIfClauseListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ElseIfKeyword: {
                return true;
            }
            case TokenKind.ElseKeyword: {
                const nextToken = this.getToken(/*offset*/ 1);
                switch (nextToken.kind) {
                    case TokenKind.IfKeyword: {
                        return true;
                    }
                }
                break;
            }
        }

        return false;
    }

    private parseElseIfClauseListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ElseIfKeyword: {
                this.advanceToken();

                return this.parseElseIfClause(parent, token);
            }
            case TokenKind.ElseKeyword: {
                const nextToken = this.getToken(/*offset*/ 1);
                switch (nextToken.kind) {
                    case TokenKind.IfKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseElseIfClause(parent, token, nextToken);
                    }
                }
                break;
            }
        }

        return this.parseCore(parent, token);
    }

    private parseElseIfClause(
        parent: Nodes,
        elseIfKeyword: ElseIfKeywordToken | ElseKeywordToken,
        ifKeyword?: IfKeywordToken,
    ): ElseIfClause {
        const elseIfClause = new ElseIfClause();
        elseIfClause.parent = parent;
        elseIfClause.elseIfKeyword = elseIfKeyword;
        elseIfClause.ifKeyword = ifKeyword;
        elseIfClause.expression = this.parseExpression(elseIfClause);
        elseIfClause.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);
        elseIfClause.statements = this.parseListWithSkippedTokens(ParseContextKind.ElseIfClause, elseIfClause);

        return elseIfClause;
    }

    // #endregion

    private parseElseClause(parent: IfStatement, elseKeyword: ElseKeywordToken, isSingleLine?: true): ElseClause {
        const elseClause = new ElseClause();
        elseClause.parent = parent;
        elseClause.elseKeyword = elseKeyword;

        if (!isSingleLine) {
            elseClause.statements = this.parseListWithSkippedTokens(ParseContextKind.ElseClause, elseClause);
        } else {
            const statement = this.parseStatementListMember(elseClause);
            this.uneatStatementTerminator(statement);
            elseClause.statements = [statement];
        }

        return elseClause;
    }

    private isIfStatementLikeStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ElseIfKeyword:
            case TokenKind.ElseKeyword:
            case TokenKind.EndIfKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Select statement

    private parseSelectStatement(parent: Nodes, selectKeyword: SelectKeywordToken): SelectStatement {
        const selectStatement = new SelectStatement();
        selectStatement.parent = parent;
        selectStatement.selectKeyword = selectKeyword;
        selectStatement.expression = this.parseExpression(selectStatement);
        selectStatement.newlines = this.parseList(ParseContextKind.NewlineList, selectStatement);
        selectStatement.caseClauses = this.parseList(ParseContextKind.CaseClauseList, selectStatement);

        const defaultKeyword = this.getToken();
        if (defaultKeyword.kind === TokenKind.DefaultKeyword) {
            this.advanceToken();

            selectStatement.defaultClause = this.parseDefaultClause(selectStatement, defaultKeyword);
        }

        selectStatement.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (selectStatement.endKeyword.kind === TokenKind.EndKeyword) {
            selectStatement.endSelectKeyword = this.eatOptional(TokenKind.SelectKeyword);
        }
        selectStatement.terminator = this.eatStatementTerminator();

        return selectStatement;
    }

    // #region Case clause list members

    private isCaseClauseListTerminator(token: Tokens): boolean {
        return !this.isCaseClauseListMemberStart(token);
    }

    private isCaseClauseListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CaseKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseCaseClauseListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.CaseKeyword: {
                this.advanceToken();

                return this.parseCaseClause(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseCaseClause(parent: Nodes, caseKeyword: CaseKeywordToken): CaseClause {
        const caseClause = new CaseClause();
        caseClause.parent = parent;
        caseClause.caseKeyword = caseKeyword;
        caseClause.expressions = this.parseList(ParseContextKind.ExpressionSequence, caseClause, TokenKind.Comma);
        caseClause.statements = this.parseListWithSkippedTokens(ParseContextKind.CaseClause, caseClause);

        return caseClause;
    }

    // #endregion

    private parseDefaultClause(parent: Nodes, defaultKeyword: DefaultKeywordToken): DefaultClause {
        const defaultClause = new DefaultClause();
        defaultClause.parent = parent;
        defaultClause.defaultKeyword = defaultKeyword;
        defaultClause.statements = this.parseListWithSkippedTokens(ParseContextKind.DefaultClause, defaultClause);

        return defaultClause;
    }

    private isCaseOrDefaultClauseStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CaseKeyword:
            case TokenKind.DefaultKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Loops

    // #region While loop

    private parseWhileLoop(parent: Nodes, whileKeyword: WhileKeywordToken): WhileLoop {
        const whileLoop = new WhileLoop();
        whileLoop.parent = parent;
        whileLoop.whileKeyword = whileKeyword;
        whileLoop.expression = this.parseExpression(whileLoop);
        whileLoop.statements = this.parseListWithSkippedTokens(ParseContextKind.WhileLoop, whileLoop);
        whileLoop.endKeyword = this.eatMissable(TokenKind.WendKeyword, TokenKind.EndKeyword);
        if (whileLoop.endKeyword.kind === TokenKind.EndKeyword) {
            whileLoop.endWhileKeyword = this.eatOptional(TokenKind.WhileKeyword);
        }
        whileLoop.terminator = this.eatStatementTerminator();

        return whileLoop;
    }

    private isWhileLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.WendKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Repeat loop

    private parseRepeatLoop(parent: Nodes, repeatKeyword: RepeatKeywordToken): RepeatLoop {
        const repeatLoop = new RepeatLoop();
        repeatLoop.parent = parent;
        repeatLoop.repeatKeyword = repeatKeyword;
        repeatLoop.statements = this.parseListWithSkippedTokens(ParseContextKind.RepeatLoop, repeatLoop);
        repeatLoop.foreverOrUntilKeyword = this.eatMissable(TokenKind.ForeverKeyword, TokenKind.UntilKeyword);
        if (repeatLoop.foreverOrUntilKeyword.kind === TokenKind.UntilKeyword) {
            repeatLoop.untilExpression = this.parseExpression(repeatLoop);
        }
        repeatLoop.terminator = this.eatStatementTerminator();

        return repeatLoop;
    }

    private isRepeatLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ForeverKeyword:
            case TokenKind.UntilKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region For loop

    private parseForLoop(parent: Nodes, forKeyword: ForKeywordToken): NumericForLoop | ForEachInLoop {
        let forLoop: NumericForLoop | ForEachInLoop = undefined!;

        const localKeyword = this.eatOptional(TokenKind.LocalKeyword);
        const indexVariable = this.parseMissableIdentifier(forLoop);

        let typeAnnotation: TypeAnnotation | undefined = undefined;
        let operator: ForLoopOperatorToken | undefined;

        if (localKeyword) {
            typeAnnotation = this.parseTypeAnnotation(forLoop);
            operator = this.eatMissable(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
        } else {
            operator = this.eatAssignmentOperatorTokenOptional();
            if (!operator) {
                const token = this.getToken();
                operator = this.createMissingToken(token.fullStart, TokenKind.EqualsSign);
            }
        }

        const eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);

        if (!eachInKeyword) {
            forLoop = new NumericForLoop();
            forLoop.parent = parent;
            forLoop.forKeyword = forKeyword;
            forLoop.localKeyword = localKeyword;

            if (indexVariable.kind === NodeKind.EscapedIdentifier) {
                indexVariable.parent = forLoop;
            }
            forLoop.indexVariable = indexVariable;

            if (typeAnnotation) {
                typeAnnotation.parent = forLoop;
            }
            forLoop.typeAnnotation = typeAnnotation;

            forLoop.operator = operator;
            forLoop.firstValueExpression = this.parseExpression(forLoop);
            forLoop.toOrUntilKeyword = this.eatMissable(TokenKind.ToKeyword, TokenKind.UntilKeyword);
            forLoop.lastValueExpression = this.parseExpression(forLoop);
            forLoop.stepKeyword = this.eatOptional(TokenKind.StepKeyword);
            if (forLoop.stepKeyword) {
                forLoop.stepValueExpression = this.parseExpression(forLoop);
            }
        } else {
            forLoop = new ForEachInLoop();
            forLoop.parent = parent;
            forLoop.forKeyword = forKeyword;
            forLoop.localKeyword = localKeyword;

            if (indexVariable.kind === NodeKind.EscapedIdentifier) {
                indexVariable.parent = forLoop;
            }
            forLoop.indexVariable = indexVariable;

            if (typeAnnotation) {
                typeAnnotation.parent = forLoop;
            }

            forLoop.typeAnnotation = typeAnnotation;
            forLoop.operator = operator;
            forLoop.eachInKeyword = eachInKeyword;
            forLoop.collectionExpression = this.parseExpression(forLoop);
        }

        forLoop.statements = this.parseListWithSkippedTokens(ParseContextKind.ForLoop, forLoop);
        forLoop.endKeyword = this.eatMissable(TokenKind.NextKeyword, TokenKind.EndKeyword);
        if (forLoop.endKeyword.kind === TokenKind.EndKeyword) {
            forLoop.endForKeyword = this.eatOptional(TokenKind.ForKeyword);
        }
        forLoop.terminator = this.eatStatementTerminator();

        return forLoop;
    }

    private isForLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NextKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    private parseContinueStatement(parent: Nodes, continueKeyword: ContinueKeywordToken): ContinueStatement {
        const continueStatement = new ContinueStatement();
        continueStatement.parent = parent;
        continueStatement.continueKeyword = continueKeyword;
        continueStatement.terminator = this.eatStatementTerminator();

        return continueStatement;
    }

    private parseExitStatement(parent: Nodes, exitKeyword: ExitKeywordToken): ExitStatement {
        const exitStatement = new ExitStatement();
        exitStatement.parent = parent;
        exitStatement.exitKeyword = exitKeyword;
        exitStatement.terminator = this.eatStatementTerminator();

        return exitStatement;
    }

    // #endregion

    // #region Throw statement

    private parseThrowStatement(parent: Nodes, throwKeyword: ThrowKeywordToken): ThrowStatement {
        const throwStatement = new ThrowStatement();
        throwStatement.parent = parent;
        throwStatement.throwKeyword = throwKeyword;
        throwStatement.expression = this.parseExpression(throwStatement);
        throwStatement.terminator = this.eatStatementTerminator();

        return throwStatement;
    }

    // #endregion

    // #region Try statement

    private parseTryStatement(parent: Nodes, tryKeyword: TryKeywordToken): TryStatement {
        const tryStatement = new TryStatement();
        tryStatement.parent = parent;
        tryStatement.tryKeyword = tryKeyword;
        tryStatement.statements = this.parseListWithSkippedTokens(ParseContextKind.TryStatement, tryStatement);
        tryStatement.catchClauses = this.parseList(ParseContextKind.CatchClauseList, tryStatement);
        tryStatement.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (tryStatement.endKeyword.kind === TokenKind.EndKeyword) {
            tryStatement.endTryKeyword = this.eatOptional(TokenKind.TryKeyword);
        }
        tryStatement.terminator = this.eatStatementTerminator();

        return tryStatement;
    }

    private isTryStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CatchKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #region Catch clause list members

    private isCatchClauseListTerminator(token: Tokens): boolean {
        return !this.isCatchClauseListMemberStart(token);
    }

    private isCatchClauseListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CatchKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseCatchClauseListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.CatchKeyword: {
                this.advanceToken();

                return this.parseCatchClause(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseCatchClause(parent: Nodes, catchKeyword: CatchKeywordToken): CatchClause {
        const catchClause = new CatchClause();
        catchClause.parent = parent;
        catchClause.catchKeyword = catchKeyword;
        catchClause.parameter = this.parseMissableDataDeclaration(catchClause);
        catchClause.statements = this.parseListWithSkippedTokens(ParseContextKind.CatchClause, catchClause);

        return catchClause;
    }

    // #endregion

    // #endregion

    // #region Assignment statement

    private tryParseAssignmentStatement(parent: Nodes): AssignmentStatement | undefined {
        const { position } = this;

        const expression = this.parsePrimaryExpression(parent);
        const token = this.eatAssignmentOperatorTokenOptional();

        if (token) {
            // TODO: Is this still correct?
            switch (expression.kind) {
                case NodeKind.IdentifierExpression:
                case NodeKind.ScopeMemberAccessExpression:
                case NodeKind.IndexExpression:
                case NodeKind.GlobalScopeExpression: {
                    return this.parseAssignmentStatement(parent, expression, token);
                }
                default: {
                    throw new Error(`'${expression.kind}' cannot be assigned to.`);
                }
            }
        }

        this.position = position;
    }

    private eatAssignmentOperatorTokenOptional() {
        let token = this.getToken();

        switch (token.kind) {
            case TokenKind.ShlKeyword: {
                const nextToken = this.getToken(/*offset*/ 1);
                if (nextToken.kind === TokenKind.EqualsSign) {
                    token = new ShlKeywordEqualsSignToken(token, nextToken);
                }
                break;
            }
            case TokenKind.ShrKeyword: {
                const nextToken = this.getToken(/*offset*/ 1);
                if (nextToken.kind === TokenKind.EqualsSign) {
                    token = new ShrKeywordEqualsSignToken(token, nextToken);
                }
                break;
            }
            case TokenKind.ModKeyword: {
                const nextToken = this.getToken(/*offset*/ 1);
                if (nextToken.kind === TokenKind.EqualsSign) {
                    token = new ModKeywordEqualsSignToken(token, nextToken);
                }
                break;
            }
        }

        switch (token.kind) {
            case TokenKind.EqualsSign:
            case TokenKind.AmpersandEqualsSign:
            case TokenKind.AsteriskEqualsSign:
            case TokenKind.PlusSignEqualsSign:
            case TokenKind.HyphenMinusEqualsSign:
            case TokenKind.SlashEqualsSign:
            case TokenKind.VerticalBarEqualsSign:
            case TokenKind.TildeEqualsSign: {
                this.advanceToken();

                return token;
            }
            case TokenKind.ShlKeywordEqualsSign:
            case TokenKind.ShrKeywordEqualsSign:
            case TokenKind.ModKeywordEqualsSign: {
                this.advanceToken();
                this.advanceToken();

                return token;
            }
        }
    }

    private parseAssignmentStatement(
        parent: Nodes,
        leftOperand: AssignableExpression,
        token: AssignmentOperatorToken,
    ): AssignmentStatement {
        const assignmentStatement = new AssignmentStatement();
        assignmentStatement.parent = parent;
        assignmentStatement.leftOperand = leftOperand;
        leftOperand.parent = assignmentStatement;
        assignmentStatement.operator = token;
        assignmentStatement.rightOperand = this.parseExpression(assignmentStatement);
        assignmentStatement.terminator = this.eatStatementTerminator();

        return assignmentStatement;
    }

    // #endregion

    // #region Expression statement

    private parseExpressionStatement(
        parent: Nodes,
        expression: Expressions | MissingToken,
    ): ExpressionStatement {
        const expressionStatement = new ExpressionStatement();
        expressionStatement.parent = parent;
        expressionStatement.expression = expression;
        expressionStatement.terminator = this.eatStatementTerminator();

        return expressionStatement;
    }

    // #endregion

    // #region Empty statement

    private parseEmptyStatement(parent: Nodes): EmptyStatement {
        const emptyStatement = new EmptyStatement();
        emptyStatement.parent = parent;
        emptyStatement.terminator = this.eatStatementTerminator();

        return emptyStatement;
    }

    // #endregion

    // #endregion

    // #region Type annotation

    private parseTypeAnnotation(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.QuestionMark:
            case TokenKind.PercentSign:
            case TokenKind.NumberSign:
            case TokenKind.DollarSign: {
                this.advanceToken();

                return this.parseShorthandTypeAnnotation(parent, token);
            }
            case TokenKind.OpeningSquareBracket: {
                return this.parseShorthandTypeAnnotation(parent);
            }
            case TokenKind.Colon: {
                this.advanceToken();

                return this.parseLonghandTypeAnnotation(parent, token);
            }
        }

        return undefined;
    }

    private parseShorthandTypeAnnotation(parent: Nodes, shorthandType?: ShorthandTypeToken): ShorthandTypeAnnotation {
        const shorthandTypeAnnotation = new ShorthandTypeAnnotation();
        shorthandTypeAnnotation.parent = parent;
        shorthandTypeAnnotation.shorthandType = shorthandType;
        shorthandTypeAnnotation.arrayTypeAnnotations = this.parseList(ParseContextKind.ArrayTypeAnnotationList, shorthandTypeAnnotation);

        return shorthandTypeAnnotation;
    }

    private parseLonghandTypeAnnotation(parent: Nodes, colon: ColonToken): LonghandTypeAnnotation {
        const longhandTypeAnnotation = new LonghandTypeAnnotation();
        longhandTypeAnnotation.parent = parent;
        longhandTypeAnnotation.colon = colon;
        longhandTypeAnnotation.typeReference = this.parseMissableTypeReference(longhandTypeAnnotation);

        return longhandTypeAnnotation;
    }

    // #endregion

    // #region Core

    // #region Parse lists

    protected isListTerminator(parseContext: ParserParseContext, token: Tokens): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case ParseContextKind.ModuleDeclaration: {
                return this.isModuleDeclarationMembersListTerminator();
            }
            case ParseContextKind.ModuleDeclarationHeader: {
                return this.isModuleDeclarationHeaderTerminator(token);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.isModulePathSequenceTerminator(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceTerminator(token);
            }
            case ParseContextKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceTerminator(token);
            }
            case ParseContextKind.AliasDirective: {
                return this.isAliasDirectiveTerminator(token);
            }
            case ParseContextKind.ExternDataDeclarationSequence: {
                return this.isExternDataDeclarationSequenceTerminator(token);
            }
            case ParseContextKind.ExternClassDeclaration: {
                return this.isExternClassDeclarationMembersListTerminator(token);
            }
            case ParseContextKind.InterfaceDeclaration: {
                return this.isInterfaceDeclarationMembersListTerminator(token);
            }
            case ParseContextKind.ClassDeclaration: {
                return this.isClassDeclarationMembersListTerminator(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceTerminator(token);
            }
            case ParseContextKind.FunctionDeclaration:
            case ParseContextKind.ClassMethodDeclaration: {
                return this.isFunctionLikeStatementsListTerminator(token);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.isClassMethodAttributesTerminator(token);
            }
            case ParseContextKind.IfStatement:
            case ParseContextKind.ElseIfClause:
            case ParseContextKind.ElseClause: {
                return this.isIfStatementLikeStatementsListTerminator(token);
            }
            case ParseContextKind.ElseIfClauseList: {
                return this.isElseIfClauseListTerminator(token);
            }
            case ParseContextKind.CaseClause:
            case ParseContextKind.DefaultClause: {
                return this.isCaseOrDefaultClauseStatementsListTerminator(token);
            }
            case ParseContextKind.CaseClauseList: {
                return this.isCaseClauseListTerminator(token);
            }
            case ParseContextKind.WhileLoop: {
                return this.isWhileLoopStatementsListTerminator(token);
            }
            case ParseContextKind.RepeatLoop: {
                return this.isRepeatLoopStatementsListTerminator(token);
            }
            case ParseContextKind.ForLoop: {
                return this.isForLoopStatementsListTerminator(token);
            }
            case ParseContextKind.TryStatement:
            case ParseContextKind.CatchClause: {
                return this.isTryStatementStatementsListTerminator(token);
            }
            case ParseContextKind.CatchClauseList: {
                return this.isCatchClauseListTerminator(token);
            }
        }

        return super.isListTerminatorCore(parseContext, token);
    }

    protected isValidListElement(parseContext: ParserParseContext, token: Tokens): boolean {
        switch (parseContext) {
            case ParseContextKind.ModuleDeclaration: {
                return this.isModuleDeclarationMemberStart(token);
            }
            case ParseContextKind.ModuleDeclarationHeader: {
                return this.isModuleDeclarationHeaderMemberStart(token);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.isModulePathSequenceMemberStart(token);
            }
            case ParseContextKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceMemberStart(token);
            }
            case ParseContextKind.AliasDirective: {
                return this.isAliasDirectiveMemberStart(token);
            }
            case ParseContextKind.ExternDataDeclarationSequence: {
                return this.isExternDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.ExternClassDeclaration: {
                return this.isExternClassDeclarationMemberStart(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.InterfaceDeclaration: {
                return this.isInterfaceDeclarationMemberStart(token);
            }
            case ParseContextKind.ClassDeclaration: {
                return this.isClassDeclarationMemberStart(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceMemberStart(token);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.isClassMethodAttributeStart(token);
            }
            case ParseContextKind.FunctionDeclaration:
            case ParseContextKind.ClassMethodDeclaration:
            case ParseContextKind.IfStatement:
            case ParseContextKind.ElseIfClause:
            case ParseContextKind.ElseClause:
            case ParseContextKind.CaseClause:
            case ParseContextKind.DefaultClause:
            case ParseContextKind.WhileLoop:
            case ParseContextKind.RepeatLoop:
            case ParseContextKind.ForLoop:
            case ParseContextKind.TryStatement:
            case ParseContextKind.CatchClause: {
                return this.isStatementListMemberStart(token);
            }
            case ParseContextKind.ElseIfClauseList: {
                return this.isElseIfClauseListMemberStart(token);
            }
            case ParseContextKind.CaseClauseList: {
                return this.isCaseClauseListMemberStart(token);
            }
            case ParseContextKind.CatchClauseList: {
                return this.isCatchClauseListMemberStart(token);
            }
        }

        return super.isValidListElementCore(parseContext, token);
    }

    protected parseListElement(parseContext: ParserParseContext, parent: Nodes) {
        switch (parseContext) {
            case ParseContextKind.ModuleDeclaration: {
                return this.parseModuleDeclarationMember(parent);
            }
            case ParseContextKind.ModuleDeclarationHeader: {
                return this.parseModuleDeclarationHeaderMember(parent);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.parseModulePathSequenceMember(parent);
            }
            case ParseContextKind.AliasDirectiveSequence: {
                return this.parseAliasDirectiveSequenceMember(parent);
            }
            case ParseContextKind.AliasDirective: {
                return this.parseAliasDirectiveMember(parent);
            }
            case ParseContextKind.ExternDataDeclarationSequence: {
                return this.parseExternDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.ExternClassDeclaration: {
                return this.parseExternClassDeclarationMember(parent);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.parseDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.InterfaceDeclaration: {
                return this.parseInterfaceDeclarationMember(parent);
            }
            case ParseContextKind.ClassDeclaration: {
                return this.parseClassDeclarationMember(parent);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.parseTypeParameterSequenceMember(parent);
            }
            case ParseContextKind.FunctionDeclaration:
            case ParseContextKind.ClassMethodDeclaration:
            case ParseContextKind.IfStatement:
            case ParseContextKind.ElseIfClause:
            case ParseContextKind.ElseClause:
            case ParseContextKind.CaseClause:
            case ParseContextKind.DefaultClause:
            case ParseContextKind.WhileLoop:
            case ParseContextKind.RepeatLoop:
            case ParseContextKind.ForLoop:
            case ParseContextKind.TryStatement:
            case ParseContextKind.CatchClause: {
                return this.parseStatementListMember(parent);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.parseClassMethodAttribute(parent);
            }
            case ParseContextKind.ElseIfClauseList: {
                return this.parseElseIfClauseListMember(parent);
            }
            case ParseContextKind.CaseClauseList: {
                return this.parseCaseClauseListMember(parent);
            }
            case ParseContextKind.CatchClauseList: {
                return this.parseCatchClauseListMember(parent);
            }
        }

        return super.parseListElementCore(parseContext, parent);
    }

    // #endregion

    protected isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean {
        switch (expression.kind) {
            case NodeKind.NullExpression:
            case NodeKind.BooleanLiteralExpression:
            case NodeKind.SelfExpression:
            case NodeKind.SuperExpression:
            case NodeKind.IntegerLiteralExpression:
            case NodeKind.FloatLiteralExpression:
            case NodeKind.StringLiteralExpression:
            case NodeKind.ArrayLiteralExpression:
            case NodeKind.InvokeExpression:
            case NodeKind.IndexExpression:
            case NodeKind.SliceExpression:
            case NodeKind.GroupingExpression:
            case NodeKind.UnaryExpression:
            case NodeKind.BinaryExpression:
            case NodeKind.GlobalScopeExpression: {
                return false;
            }

            case NodeKind.NewExpression: {
                return true;
            }

            case NodeKind.IdentifierExpression:
            case NodeKind.ScopeMemberAccessExpression: {
                break;
            }

            default: {
                assertNever(expression);
                break;
            }
        }

        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        return false;
    }

    private eatStatementTerminator() {
        return this.eatOptional(TokenKind.Newline, TokenKind.Semicolon);
    }

    private uneatStatementTerminator(statement: Statements): void {
        if (statement.terminator) {
            statement.terminator = undefined;
            this.position--;
        }
    }

    // #region Tokens

    protected createMissingToken(fullStart: number, originalKind: MissingTokenKinds): MissingToken {
        this.addDiagnostic(
            DiagnosticKind.Error,
            `Missing token: '${originalKind}'.`,
            fullStart,
            /*length*/ 0,
        );

        return super.createMissingToken(fullStart, originalKind);
    }

    protected createSkippedToken(token: Tokens): SkippedToken {
        this.addDiagnostic(
            DiagnosticKind.Error,
            `Skipped token: '${token.kind}'.`,
            token.fullStart,
            token.length,
        );

        return super.createSkippedToken(token);
    }

    private addDiagnostic(kind: DiagnosticKind, message: string, start: number, length: number) {
        const diagnostic = new Diagnostic(kind, message, start, length);
        this.moduleDeclaration.parseDiagnostics.add(diagnostic);
    }

    // #endregion

    // #endregion
}

// #region Parse contexts

interface ParserParseContextElementMap extends ParseContextElementMapBase {
    [ParseContextKind.ModuleDeclaration]: ReturnType<Parser['parseModuleDeclarationMember']>;
    [ParseContextKind.ModuleDeclarationHeader]: ReturnType<Parser['parseModuleDeclarationHeaderMember']>;
    [ParseContextKind.ModulePathSequence]: ReturnType<Parser['parseModulePathSequenceMember']>;
    [ParseContextKind.AliasDirectiveSequence]: ReturnType<Parser['parseAliasDirectiveSequenceMember']>;
    [ParseContextKind.AliasDirective]: ReturnType<Parser['parseAliasDirectiveMember']>;
    [ParseContextKind.DataDeclarationSequence]: ReturnType<Parser['parseDataDeclarationSequenceMember']>;
    [ParseContextKind.ExternDataDeclarationSequence]: ReturnType<Parser['parseExternDataDeclarationSequenceMember']>;
    [ParseContextKind.FunctionDeclaration]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.InterfaceDeclaration]: ReturnType<Parser['parseInterfaceDeclarationMember']>;
    [ParseContextKind.ClassDeclaration]: ReturnType<Parser['parseClassDeclarationMember']>;
    [ParseContextKind.TypeParameterSequence]: ReturnType<Parser['parseTypeParameterSequenceMember']>;
    [ParseContextKind.ClassMethodDeclaration]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.ExternClassDeclaration]: ReturnType<Parser['parseExternClassDeclarationMember']>;
    [ParseContextKind.ClassMethodAttributes]: ReturnType<Parser['parseClassMethodAttribute']>;
    [ParseContextKind.IfStatement]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.ElseIfClauseList]: ReturnType<Parser['parseElseIfClauseListMember']>;
    [ParseContextKind.ElseIfClause]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.ElseClause]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.CaseClauseList]: ReturnType<Parser['parseCaseClauseListMember']>;
    [ParseContextKind.CaseClause]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.DefaultClause]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.WhileLoop]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.RepeatLoop]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.ForLoop]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.TryStatement]: ReturnType<Parser['parseStatementListMember']>;
    [ParseContextKind.CatchClauseList]: ReturnType<Parser['parseCatchClauseListMember']>;
    [ParseContextKind.CatchClause]: ReturnType<Parser['parseStatementListMember']>;
}

type ParserParseContext = keyof ParserParseContextElementMap;

const _ParseContextKind: { -readonly [P in keyof typeof ParseContextKind]: typeof ParseContextKind[P]; } = ParseContextKind;
_ParseContextKind.ModuleDeclaration = 'ModuleDeclaration' as ParseContextKind.ModuleDeclaration;
_ParseContextKind.ModuleDeclarationHeader = 'ModuleDeclarationHeader' as ParseContextKind.ModuleDeclarationHeader;
_ParseContextKind.ModulePathSequence = 'ModulePathSequence' as ParseContextKind.ModulePathSequence;
_ParseContextKind.AliasDirectiveSequence = 'AliasDirectiveSequence' as ParseContextKind.AliasDirectiveSequence;
_ParseContextKind.AliasDirective = 'AliasDirective' as ParseContextKind.AliasDirective;
_ParseContextKind.DataDeclarationSequence = 'DataDeclarationSequence' as ParseContextKind.DataDeclarationSequence;
_ParseContextKind.ExternDataDeclarationSequence = 'ExternDataDeclarationSequence' as ParseContextKind.ExternDataDeclarationSequence;
_ParseContextKind.FunctionDeclaration = 'FunctionDeclaration' as ParseContextKind.FunctionDeclaration;
_ParseContextKind.InterfaceDeclaration = 'InterfaceDeclaration' as ParseContextKind.InterfaceDeclaration;
_ParseContextKind.ClassDeclaration = 'ClassDeclaration' as ParseContextKind.ClassDeclaration;
_ParseContextKind.TypeParameterSequence = 'TypeParameterSequence' as ParseContextKind.TypeParameterSequence;
_ParseContextKind.ClassMethodDeclaration = 'ClassMethodDeclaration' as ParseContextKind.ClassMethodDeclaration;
_ParseContextKind.ExternClassDeclaration = 'ExternClassDeclaration' as ParseContextKind.ExternClassDeclaration;
_ParseContextKind.ClassMethodAttributes = 'ClassMethodAttributes' as ParseContextKind.ClassMethodAttributes;
_ParseContextKind.IfStatement = 'IfStatement' as ParseContextKind.IfStatement;
_ParseContextKind.ElseIfClauseList = 'ElseIfClauseList' as ParseContextKind.ElseIfClauseList;
_ParseContextKind.ElseIfClause = 'ElseIfClause' as ParseContextKind.ElseIfClause;
_ParseContextKind.ElseClause = 'ElseClause' as ParseContextKind.ElseClause;
_ParseContextKind.CaseClauseList = 'CaseClauseList' as ParseContextKind.CaseClauseList;
_ParseContextKind.CaseClause = 'CaseClause' as ParseContextKind.CaseClause;
_ParseContextKind.DefaultClause = 'DefaultClause' as ParseContextKind.DefaultClause;
_ParseContextKind.WhileLoop = 'WhileLoop' as ParseContextKind.WhileLoop;
_ParseContextKind.RepeatLoop = 'RepeatLoop' as ParseContextKind.RepeatLoop;
_ParseContextKind.ForLoop = 'ForLoop' as ParseContextKind.ForLoop;
_ParseContextKind.TryStatement = 'TryStatement' as ParseContextKind.TryStatement;
_ParseContextKind.CatchClauseList = 'CatchClauseList' as ParseContextKind.CatchClauseList;
_ParseContextKind.CatchClause = 'CatchClause' as ParseContextKind.CatchClause;

declare module './ParserBase' {
    enum ParseContextKind {
        ModuleDeclaration = 'ModuleDeclaration',
        ModuleDeclarationHeader = 'ModuleDeclarationHeader',
        ModulePathSequence = 'ModulePathSequence',
        AliasDirectiveSequence = 'AliasDirectiveSequence',
        AliasDirective = 'AliasDirective',
        DataDeclarationSequence = 'DataDeclarationSequence',
        ExternDataDeclarationSequence = 'ExternDataDeclarationSequence',
        FunctionDeclaration = 'FunctionDeclaration',
        InterfaceDeclaration = 'InterfaceDeclaration',
        ClassDeclaration = 'ClassDeclaration',
        TypeParameterSequence = 'TypeParameterSequence',
        ClassMethodDeclaration = 'ClassMethodDeclaration',
        ExternClassDeclaration = 'ExternClassDeclaration',
        ClassMethodAttributes = 'ClassMethodAttributes',
        IfStatement = 'IfStatement',
        ElseIfClauseList = 'ElseIfClauseList',
        ElseIfClause = 'ElseIfClause',
        ElseClause = 'ElseClause',
        CaseClauseList = 'CaseClauseList',
        CaseClause = 'CaseClause',
        DefaultClause = 'DefaultClause',
        WhileLoop = 'WhileLoop',
        RepeatLoop = 'RepeatLoop',
        ForLoop = 'ForLoop',
        TryStatement = 'TryStatement',
        CatchClauseList = 'CatchClauseList',
        CatchClause = 'CatchClause',
    }

    interface ParseContextElementMap extends ParserParseContextElementMap { }
}

// #endregion
