import path = require('path');
import { executeParserTestCases, getCasePaths } from './shared';

const name = 'Parser';

{
    const rootPath = path.resolve(__dirname, '..', 'vscode', 'test', 'colorize-fixtures');
    const casePaths = getCasePaths(rootPath);
    executeParserTestCases(name, rootPath, casePaths);
}

{
    const rootPath = path.resolve(__dirname, 'cases', name);
    const casePaths = getCasePaths(rootPath);
    executeParserTestCases(name, rootPath, casePaths);
}
