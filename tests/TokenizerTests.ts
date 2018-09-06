import path = require('path');
import { executeTokenizerTestCases } from './shared';

const name = 'Tokenizer';

executeTokenizerTestCases(name, path.resolve(__dirname, 'cases', 'PreprocessorParser'));
executeTokenizerTestCases(name, path.resolve(__dirname, 'cases', name));
