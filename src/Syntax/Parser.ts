import { assertNever } from '../assertNever';
import { Diagnostic } from '../Diagnostic';
import { DiagnosticKind, DiagnosticKinds } from '../DiagnosticKind';
import { AccessibilityDirective, AccessibilityKeywordToken } from './Node/Declaration/AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence, MissableDeclarationReferenceIdentifier } from './Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from './Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from './Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence, MissableDataDeclaration } from './Node/Declaration/DataDeclarationSequence';
import { ExternClassDeclaration } from './Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternClassMethodDeclaration } from './Node/Declaration/ExternDeclaration/ExternClassMethodDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationKeywordToken, ExternDataDeclarationSequence } from './Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FriendDirective } from './Node/Declaration/FriendDirective';
import { FunctionDeclaration } from './Node/Declaration/FunctionDeclaration';
import { ImportStatement } from './Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from './Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from './Node/Declaration/ModuleDeclaration';
import { PreprocessorModuleDeclaration } from './Node/Declaration/PreprocessorModuleDeclaration';
import { StrictDirective } from './Node/Declaration/StrictDirective';
import { TypeParameter } from './Node/Declaration/TypeParameter';
import { Expressions, MissableExpression } from './Node/Expression/Expression';
import { IdentifierStartToken } from './Node/Identifier';
import { ModulePath } from './Node/ModulePath';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ContinueStatement } from './Node/Statement/ContinueStatement';
import { DataDeclarationSequenceStatement } from './Node/Statement/DataDeclarationSequenceStatement';
import { EmptyStatement } from './Node/Statement/EmptyStatement';
import { ExitStatement } from './Node/Statement/ExitStatement';
import { ExpressionStatement } from './Node/Statement/ExpressionStatement';
import { ForLoop, NumericForLoopHeader } from './Node/Statement/ForLoop';
import { ElseClause, ElseIfClause, IfStatement } from './Node/Statement/IfStatement';
import { RepeatLoop } from './Node/Statement/RepeatLoop';
import { ReturnStatement } from './Node/Statement/ReturnStatement';
import { CaseClause, DefaultClause, SelectStatement } from './Node/Statement/SelectStatement';
import { Statement } from './Node/Statement/Statement';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchClause, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { LonghandTypeAnnotation, ShorthandTypeAnnotation, ShorthandTypeToken } from './Node/TypeAnnotation';
import { ParseContextElementMapBase, ParseContextKind, ParserBase } from './ParserBase';
import { ParseTreeVisitor } from './ParseTreeVisitor';
import { MissingToken, MissingTokenKinds } from './Token/MissingToken';
import { SkippedToken } from './Token/SkippedToken';
import { AliasKeywordToken, CaseKeywordToken, CatchKeywordToken, ClassKeywordToken, ColonToken, ConstKeywordToken, ContinueKeywordToken, DefaultKeywordToken, ElseIfKeywordToken, ElseKeywordToken, ExitKeywordToken, ForKeywordToken, FriendKeywordToken, FunctionKeywordToken, IfKeywordToken, ImportKeywordToken, InterfaceKeywordToken, LocalKeywordToken, MethodKeywordToken, RepeatKeywordToken, ReturnKeywordToken, SelectKeywordToken, StrictKeywordToken, ThrowKeywordToken, Tokens, TryKeywordToken, WhileKeywordToken } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Parser extends ParserBase {
    private document: string = undefined!;
    private accessibility: AccessibilityKeywordToken['kind'] = undefined!;
    private moduleIdentifiers: string[] = undefined!;
    private moduleDeclaration: ModuleDeclaration = undefined!;

    parse(preprocessorModuleDeclaration: PreprocessorModuleDeclaration, tokens: Tokens[]): ModuleDeclaration {
        this.tokens = [...tokens];
        this.position = 0;
        this.parseContexts = [];
        this.document = preprocessorModuleDeclaration.document;
        this.accessibility = TokenKind.PublicKeyword;
        this.moduleIdentifiers = [];

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
        moduleDeclaration.headerMembers = this.parseListWithSkippedTokens(ParseContextKind.ModuleDeclarationHeader, moduleDeclaration);
        moduleDeclaration.members = this.parseListWithSkippedTokens(ParseContextKind.ModuleDeclaration, moduleDeclaration);
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

                // Needed when parsing Alias directives.
                // Allows disambiguation between a module identifier and a type identifier.
                const { moduleIdentifier } = importStatement.path;
                if (moduleIdentifier.kind === TokenKind.Identifier) {
                    this.moduleIdentifiers.push(moduleIdentifier.getText(this.document));
                }
                break;
            }
            default: {
                importStatement.path = this.createMissingToken(token.fullStart, TokenKind.ImportStatementPath);
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

        // Parse module identifier
        const identifierStartToken1 = this.getToken();
        if (identifierStartToken1.kind === TokenKind.Identifier &&
            this.moduleIdentifiers.includes(identifierStartToken1.getText(this.document))
        ) {
            this.advanceToken();
            aliasDirective.moduleIdentifier = identifierStartToken1;
            aliasDirective.moduleScopeMemberAccessOperator = this.eatMissable(TokenKind.Period);
        }

        // Parse type identifier
        const identifierStartToken2 = this.getToken();
        if ((identifierStartToken2.kind === TokenKind.CommercialAt && this.getToken(2).kind === TokenKind.Period) ||
            (identifierStartToken2.kind === TokenKind.Identifier && this.getToken(1).kind === TokenKind.Period)
        ) {
            this.advanceToken();
            aliasDirective.typeIdentifier = this.parseIdentifier(aliasDirective, identifierStartToken2);
            aliasDirective.typeScopeMemberAccessOperator = this.eat(TokenKind.Period);
        }

        // Parse target
        let target: MissableDeclarationReferenceIdentifier | undefined = this.eatOptional(TokenKind.IntKeyword, TokenKind.FloatKeyword, TokenKind.StringKeyword);
        if (!target) {
            target = this.parseMissableIdentifier(aliasDirective);
        }
        aliasDirective.target = target;

        return aliasDirective;
    }

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

    // #region Data declaration sequence

    private parseDataDeclarationSequence(parent: Nodes, dataDeclarationKeyword?: DataDeclarationKeywordToken): DataDeclarationSequence {
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

    private parseMissableDataDeclaration(parent: Nodes): MissableDataDeclaration {
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

        return this.createMissingToken(name.fullStart, NodeKind.DataDeclaration);
    }

    private parseDataDeclaration(parent: Nodes, identifierStart: IdentifierStartToken): DataDeclaration {
        const dataDeclaration = new DataDeclaration();
        dataDeclaration.parent = parent;
        dataDeclaration.identifier = this.parseIdentifier(dataDeclaration, identifierStart);
        dataDeclaration.type = this.parseTypeAnnotation(dataDeclaration);
        if (parent.kind === NodeKind.DataDeclarationSequence &&
            parent.dataDeclarationKeyword &&
            parent.dataDeclarationKeyword.kind === TokenKind.ConstKeyword
        ) {
            dataDeclaration.equalsSign = this.eatMissable(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
            dataDeclaration.expression = this.parseExpression(dataDeclaration);
        } else {
            dataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
            if (dataDeclaration.equalsSign) {
                dataDeclaration.eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);
                dataDeclaration.expression = this.parseExpression(dataDeclaration);
            }
        }

        return dataDeclaration;
    }

    // #endregion

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
        externDataDeclaration.type = this.parseTypeAnnotation(externDataDeclaration);
        externDataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externDataDeclaration.equalsSign) {
            externDataDeclaration.nativeSymbol = this.parseMissableStringLiteralExpression(externDataDeclaration);
        }

        return externDataDeclaration;
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

    // #region Interface declaration

    private parseInterfaceDeclaration(parent: Nodes, interfaceKeyword: InterfaceKeywordToken): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = interfaceKeyword;
        interfaceDeclaration.identifier = this.parseMissableIdentifier(interfaceDeclaration);
        interfaceDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (interfaceDeclaration.extendsKeyword) {
            interfaceDeclaration.baseTypes = this.parseList(ParseContextKind.TypeReferenceSequence, interfaceDeclaration, TokenKind.Comma);
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
            classDeclaration.baseType = this.parseMissableTypeReference(classDeclaration);
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

    // #region Extern class declaration

    private parseExternClassDeclaration(parent: Nodes, classKeyword: ClassKeywordToken): ExternClassDeclaration {
        const externClassDeclaration = new ExternClassDeclaration();
        externClassDeclaration.parent = parent;
        externClassDeclaration.classKeyword = classKeyword;
        externClassDeclaration.identifier = this.parseMissableIdentifier(externClassDeclaration);

        externClassDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (externClassDeclaration.extendsKeyword) {
            externClassDeclaration.baseType = this.eatOptional(TokenKind.NullKeyword);
            if (!externClassDeclaration.baseType) {
                externClassDeclaration.baseType = this.parseMissableTypeReference(externClassDeclaration);
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
            case TokenKind.Newline: {
                return true;
            }
        }

        return this.isExpressionStart(token);
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

        return this.parseExpressionStatement(parent);
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
        dataDeclarationSequenceStatement.terminator = this.eatStatementTerminator(dataDeclarationSequenceStatement);

        return dataDeclarationSequenceStatement;
    }

    // #endregion

    // #region Return statement

    private parseReturnStatement(parent: Nodes, returnKeyword: ReturnKeywordToken): ReturnStatement {
        const returnStatement = new ReturnStatement();
        returnStatement.parent = parent;
        returnStatement.returnKeyword = returnKeyword;
        if (this.isReturnStatementExpressionRequired(returnStatement)) {
            returnStatement.expression = this.parseExpression(returnStatement);
        }
        returnStatement.terminator = this.eatStatementTerminator(returnStatement);

        return returnStatement;
    }

    private isReturnStatementExpressionRequired(returnStatement: ReturnStatement) {
        const functionOrMethod = ParseTreeVisitor.getAncestor(returnStatement,
            NodeKind.FunctionDeclaration,
            NodeKind.ClassMethodDeclaration,
        ) as FunctionDeclaration | ClassMethodDeclaration;

        if (functionOrMethod.returnType &&
            functionOrMethod.returnType.kind === NodeKind.LonghandTypeAnnotation &&
            functionOrMethod.returnType.typeReference.kind !== TokenKind.Missing &&
            functionOrMethod.returnType.typeReference.identifier.kind === TokenKind.VoidKeyword
        ) {
            return false;
        }

        return true;
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
            ifStatement.isSingleLine = true;
            ifStatement.statements = [this.parseStatementListMember(ifStatement)];

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseClause = this.parseElseClause(ifStatement, elseKeyword);
            }
        }

        ifStatement.terminator = this.eatStatementTerminator(ifStatement);

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
                const nextToken = this.getToken(1);
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
                const nextToken = this.getToken(1);
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

    private parseElseClause(parent: IfStatement, elseKeyword: ElseKeywordToken): ElseClause {
        const elseClause = new ElseClause();
        elseClause.parent = parent;
        elseClause.elseKeyword = elseKeyword;

        if (!elseClause.isSingleLine) {
            elseClause.statements = this.parseListWithSkippedTokens(ParseContextKind.ElseClause, elseClause);
        } else {
            elseClause.statements = [this.parseStatementListMember(elseClause)];
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
        selectStatement.terminator = this.eatStatementTerminator(selectStatement);

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
        whileLoop.terminator = this.eatStatementTerminator(whileLoop);

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
        repeatLoop.terminator = this.eatStatementTerminator(repeatLoop);

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

    private parseForLoop(parent: Nodes, forKeyword: ForKeywordToken): ForLoop {
        const forLoop = new ForLoop();
        forLoop.parent = parent;
        forLoop.forKeyword = forKeyword;
        forLoop.header = this.parseForLoopHeader(forLoop);
        forLoop.statements = this.parseListWithSkippedTokens(ParseContextKind.ForLoop, forLoop);
        forLoop.endKeyword = this.eatMissable(TokenKind.NextKeyword, TokenKind.EndKeyword);
        if (forLoop.endKeyword.kind === TokenKind.EndKeyword) {
            forLoop.endForKeyword = this.eatOptional(TokenKind.ForKeyword);
        }
        forLoop.terminator = this.eatStatementTerminator(forLoop);

        return forLoop;
    }

    private parseForLoopHeader(parent: ForLoop) {
        let loopVariableExpression: DataDeclarationSequenceStatement | MissableExpression;
        const token = this.getToken();
        if (token.kind === TokenKind.LocalKeyword) {
            this.advanceToken();

            loopVariableExpression = this.parseDataDeclarationSequenceStatement(parent, token);
            const declaration = loopVariableExpression.dataDeclarationSequence.children[0];
            if (declaration &&
                declaration.kind === NodeKind.DataDeclaration &&
                declaration.eachInKeyword
            ) {
                return loopVariableExpression;
            }
        } else {
            const position = this.position;
            loopVariableExpression = this.parseExpression(parent);
            switch (loopVariableExpression.kind) {
                case NodeKind.AssignmentExpression: {
                    if (loopVariableExpression.eachInKeyword) {
                        return loopVariableExpression;
                    }
                    break;
                }
                default: {
                    // TODO: Implement better error handling for incomplete For loop header.
                    //       Returning a MissingToken causes the expression to be parsed as part of the For loop body.
                    //       Possible solutions:
                    //       * Refactor expression parsing to force an (incomplete) AssignmentExpression to be returned.
                    //       * Construct an (incomplete) AssignmentExpression from the expression returned.
                    //       * Return a SkippedToken covering the range of the expression.
                    //         * Requires being able to calculate the length of the expression.
                    this.position = position;

                    return this.createMissingToken(token.fullStart, TokenKind.ForLoopHeader);
                }
            }
        }

        const numericForLoopHeader = new NumericForLoopHeader();
        numericForLoopHeader.parent = parent;
        numericForLoopHeader.loopVariableExpression = loopVariableExpression;

        numericForLoopHeader.toOrUntilKeyword = this.eatMissable(TokenKind.ToKeyword, TokenKind.UntilKeyword);
        numericForLoopHeader.lastValueExpression = this.parseExpression(numericForLoopHeader);

        numericForLoopHeader.stepKeyword = this.eatOptional(TokenKind.StepKeyword);
        if (numericForLoopHeader.stepKeyword) {
            numericForLoopHeader.stepValueExpression = this.parseExpression(numericForLoopHeader);
        }

        return numericForLoopHeader;
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
        continueStatement.terminator = this.eatStatementTerminator(continueStatement);

        return continueStatement;
    }

    private parseExitStatement(parent: Nodes, exitKeyword: ExitKeywordToken): ExitStatement {
        const exitStatement = new ExitStatement();
        exitStatement.parent = parent;
        exitStatement.exitKeyword = exitKeyword;
        exitStatement.terminator = this.eatStatementTerminator(exitStatement);

        return exitStatement;
    }

    // #endregion

    // #region Throw statement

    private parseThrowStatement(parent: Nodes, throwKeyword: ThrowKeywordToken): ThrowStatement {
        const throwStatement = new ThrowStatement();
        throwStatement.parent = parent;
        throwStatement.throwKeyword = throwKeyword;
        throwStatement.expression = this.parseExpression(throwStatement);
        throwStatement.terminator = this.eatStatementTerminator(throwStatement);

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
        tryStatement.terminator = this.eatStatementTerminator(tryStatement);

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

    // #region Expression statement

    private parseExpressionStatement(parent: Nodes): ExpressionStatement {
        const expressionStatement = new ExpressionStatement();
        expressionStatement.parent = parent;
        expressionStatement.expression = this.parseExpression(expressionStatement);
        expressionStatement.terminator = this.eatStatementTerminator(expressionStatement);

        return expressionStatement;
    }

    // #endregion

    // #region Empty statement

    private parseEmptyStatement(parent: Nodes): EmptyStatement {
        const emptyStatement = new EmptyStatement();
        emptyStatement.parent = parent;
        emptyStatement.terminator = this.eatStatementTerminator(emptyStatement);

        return emptyStatement;
    }

    // #endregion

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
            case ParseContextKind.FunctionDeclaration:
            case ParseContextKind.ClassMethodDeclaration: {
                return this.isFunctionLikeStatementsListTerminator(token);
            }
            case ParseContextKind.IfStatement:
            case ParseContextKind.ElseIfClause:
            case ParseContextKind.ElseClause: {
                return this.isIfStatementLikeStatementsListTerminator(token);
            }
            case ParseContextKind.CaseClause:
            case ParseContextKind.DefaultClause: {
                return this.isCaseOrDefaultClauseStatementsListTerminator(token);
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
            case ParseContextKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceTerminator(token);
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
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceTerminator(token);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.isClassMethodAttributesTerminator(token);
            }
            case ParseContextKind.ElseIfClauseList: {
                return this.isElseIfClauseListTerminator(token);
            }
            case ParseContextKind.CaseClauseList: {
                return this.isCaseClauseListTerminator(token);
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
            case ParseContextKind.ExternDataDeclarationSequence: {
                return this.isExternDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.ExternClassDeclaration: {
                return this.isExternClassDeclarationMemberStart(token);
            }
            case ParseContextKind.InterfaceDeclaration: {
                return this.isInterfaceDeclarationMemberStart(token);
            }
            case ParseContextKind.ClassDeclaration: {
                return this.isClassDeclarationMemberStart(token);
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
            case ParseContextKind.ModuleDeclarationHeader: {
                return this.isModuleDeclarationHeaderMemberStart(token);
            }
            case ParseContextKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceMemberStart(token);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.isModulePathSequenceMemberStart(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceMemberStart(token);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.isClassMethodAttributeStart(token);
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
            case ParseContextKind.ExternDataDeclarationSequence: {
                return this.parseExternDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.ExternClassDeclaration: {
                return this.parseExternClassDeclarationMember(parent);
            }
            case ParseContextKind.InterfaceDeclaration: {
                return this.parseInterfaceDeclarationMember(parent);
            }
            case ParseContextKind.ClassDeclaration: {
                return this.parseClassDeclarationMember(parent);
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
            case ParseContextKind.AliasDirectiveSequence: {
                return this.parseAliasDirectiveSequenceMember(parent);
            }
            case ParseContextKind.ModuleDeclarationHeader: {
                return this.parseModuleDeclarationHeaderMember(parent);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.parseModulePathSequenceMember(parent);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.parseDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.parseTypeParameterSequenceMember(parent);
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
            case NodeKind.AssignmentExpression:
            case NodeKind.GlobalScopeExpression: {
                return false;
            }

            case NodeKind.NewExpression:
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

        // Parentheses-less invocations are only valid in expression statements.
        const { parent } = expression;
        if (parent &&
            parent.kind === NodeKind.ExpressionStatement
        ) {
            return this.isExpressionSequenceMemberStart(token);
        }

        return false;
    }

    private eatStatementTerminator(statement: Statement) {
        if (!this.isInlineStatement(statement)) {
            return this.eatOptional(TokenKind.Newline, TokenKind.Semicolon);
        }

        return undefined;
    }

    private isInlineStatement(statement: Statement): boolean {
        const parent = statement.parent!;

        switch (parent.kind) {
            case NodeKind.IfStatement:
            case NodeKind.ElseClause: {
                return parent.isSingleLine;
            }
            case NodeKind.ForLoop: {
                // Checks if this statement is the header.
                const currentParseContext = this.parseContexts[this.parseContexts.length - 1];

                return currentParseContext !== ParseContextKind.ForLoop;
            }
            case NodeKind.NumericForLoopHeader: {
                return true;
            }
        }

        return false;
    }

    // #region Tokens

    protected createMissingToken(fullStart: number, originalKind: MissingTokenKinds): MissingToken {
        this.addDiagnostic(
            DiagnosticKind.Error,
            `Missing token: '${originalKind}'.`,
            fullStart,
            0,
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

    private addDiagnostic(kind: DiagnosticKinds, message: string, start: number, length: number) {
        if (!this.moduleDeclaration.parseDiagnostics) {
            this.moduleDeclaration.parseDiagnostics = [];
        }

        const diagnostic = new Diagnostic(kind, message, start, length);
        this.moduleDeclaration.parseDiagnostics.push(diagnostic);
    }

    // #endregion

    // #endregion
}

// #region Parse contexts

interface ParserParseContextElementMap extends ParseContextElementMapBase {
    [ParseContextKind.ModuleDeclaration]: ReturnType<Parser['parseModuleDeclarationMember']>;
    [ParseContextKind.ModuleDeclarationHeader]: ReturnType<Parser['parseModuleDeclarationHeaderMember']>;
    [ParseContextKind.ModulePathSequence]: ReturnType<Parser['parseModulePathSequenceMember']>;
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
    [ParseContextKind.AliasDirectiveSequence]: ReturnType<Parser['parseAliasDirectiveSequenceMember']>;
}

type ParserParseContext = keyof ParserParseContextElementMap;

const _ParseContextKind: { -readonly [P in keyof typeof ParseContextKind]: typeof ParseContextKind[P]; } = ParseContextKind;
_ParseContextKind.ModuleDeclaration = 'ModuleDeclaration' as ParseContextKind.ModuleDeclaration;
_ParseContextKind.ModuleDeclarationHeader = 'ModuleDeclarationHeader' as ParseContextKind.ModuleDeclarationHeader;
_ParseContextKind.ModulePathSequence = 'ModulePathSequence' as ParseContextKind.ModulePathSequence;
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
_ParseContextKind.AliasDirectiveSequence = 'AliasDirectiveSequence' as ParseContextKind.AliasDirectiveSequence;

declare module './ParserBase' {
    enum ParseContextKind {
        ModuleDeclaration = 'ModuleDeclaration',
        ModuleDeclarationHeader = 'ModuleDeclarationHeader',
        ModulePathSequence = 'ModulePathSequence',
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
        AliasDirectiveSequence = 'AliasDirectiveSequence',
    }

    interface ParseContextElementMap extends ParserParseContextElementMap { }
}

// #endregion
