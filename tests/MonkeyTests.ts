import fs = require('fs');
import { executeBinderTestCases, executeParserTestCases, executePreprocessorParserTestCases, executePreprocessorTokenizerTestCases, getCasePaths, getFrameworkDirectory } from './shared';

const name = 'MonkeyX';
const rootPath = getFrameworkDirectory();
const casePaths = getCasePaths(rootPath).filter((casePath) => {
    const document = fs.readFileSync(casePath, 'utf8');

    return document.includes('Function Main()');
});

executePreprocessorTokenizerTestCases(name, rootPath, casePaths);
executePreprocessorParserTestCases(name, rootPath, casePaths);
executeParserTestCases(name, rootPath, casePaths);
executeBinderTestCases(name, rootPath, casePaths);
