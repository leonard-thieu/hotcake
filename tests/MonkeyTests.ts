import fs = require('fs');
import path = require('path');
import { executeBinderTestCases, executeParserTestCases, executePreprocessorParserTestCases, executePreprocessorTokenizerTestCases, getCasePaths, getFrameworkDirectory } from './shared';

const name = 'MonkeyX';
const rootPath = getFrameworkDirectory();
const casePaths = getCasePaths(rootPath).filter((casePath) => {
    const relativePath = path.relative(rootPath, casePath);
    switch (relativePath) {
        case path.normalize('bananas/devolonter/matchup/fontmachine/bitmapfont.monkey'):    // False positive, has Function Main() in comment
        case path.normalize('bananas/mak/gles20cube/gles20cube.monkey'):                    // Requires non-existent variable (jk)
        case path.normalize('bananas/skn3/gamepad/gamepad.monkey'):                         // Requires non-existent module (mojo2)
        case path.normalize('bananas/skn3/monkenstein/monkenstein.monkey'):                 // Requires non-existent variable (level)
        case path.normalize('bananas/skn3/texteffect/texteffect.monkey'):                   // Requires non-existent function (print)
        case path.normalize('docs/html/examples/mojo_app_OpenUrl.monkey'):                  // Uses Markdown to escape '<'
        case path.normalize('modules/dom/mkwebgl.monkey'):                                  // Requires non-existent module (trans.system)
        case path.normalize('src/rebuildall.monkey'):                                       // Cannot build on Windows
            return false;
    }

    const document = fs.readFileSync(casePath, 'utf8');

    return document.includes('Function Main()');
});

executePreprocessorTokenizerTestCases(name, rootPath, casePaths);
executePreprocessorParserTestCases(name, rootPath, casePaths);
executeParserTestCases(name, rootPath, casePaths);
executeBinderTestCases(name, rootPath, casePaths);
