import path = require('path');
import { executeTokenizerTestCases, getCasePaths } from './shared';

const name = 'Tokenizer';

{
    const rootPath = path.resolve(__dirname, 'cases', 'PreprocessorParser');
    const casePaths = getCasePaths(rootPath);
    executeTokenizerTestCases(name, rootPath, casePaths);
}

{
    const rootPath = path.resolve(__dirname, 'cases', name);
    const casePaths = getCasePaths(rootPath);
    executeTokenizerTestCases(name, rootPath, casePaths);
}
