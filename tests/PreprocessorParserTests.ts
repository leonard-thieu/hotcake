import path = require('path');
import { executePreprocessorParserTestCases, executePreprocessorTokenizerTestCases } from './shared';

const name = 'PreprocessorParser';
const casesPath = path.resolve(__dirname, 'cases', name);

executePreprocessorTokenizerTestCases(name, casesPath);
executePreprocessorParserTestCases(name, casesPath);
