import path = require('path');
import { executePreprocessorParserTestCases, getCasePaths } from './shared';

const name = 'PreprocessorParser';
const rootPath = path.resolve(__dirname, 'cases', name);
const casePaths = getCasePaths(rootPath);

executePreprocessorParserTestCases(name, rootPath, casePaths);
