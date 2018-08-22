import glob = require('glob');
import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import { orderBy } from 'natural-orderby';

export function executeTestCases(options: TestCaseOptions): void;
export function executeTestCases(type: string, ext: string, testCallback: TestCallback): void;

export function executeTestCases(type: TestCaseOptions | string, ext?: string, testCallback?: TestCallback): void {
    let name: string;
    let casesPath: string;
    let outputBasePath: string;
    let skippedCases: string[] | undefined;

    if (typeof type !== 'string') {
        const options = type;
        name = options.name;
        casesPath = options.casesPath;
        outputBasePath = options.outputBasePath;
        ext = options.ext;
        testCallback = options.testCallback;
    } else {
        name = type;
        casesPath = path.join(__dirname, 'cases', type);
        outputBasePath = casesPath;
        skippedCases = require(`./${type}.skipped.json`);
    }

    describe(name, function () {
        const casesGlobPath = path.join(casesPath, '**', '*.monkey');
        const sourcePaths = orderBy(glob.sync(casesGlobPath));
    
        for (const sourcePath of sourcePaths) {
            const sourceBasename = path.basename(sourcePath);
            const outputDir = path.join(outputBasePath, path.relative(casesPath, path.dirname(sourcePath)));
            mkdirp.sync(outputDir);
            const outputPath = path.join(outputDir, `${sourceBasename}.${ext}.json`);
    
            let _it: Mocha.PendingTestFunction = it;
            if (skippedCases && skippedCases.includes(sourceBasename)) {
                _it = xit;
                try {
                    fs.unlinkSync(outputPath);
                } catch (error) {
                    switch (error.code) {
                        case 'ENOENT': { break; }
                        default: {
                            console.log(error);
                            break;
                        }
                    }
                }
            }
    
            // TODO: Should this fail/warn if baselines have changed?
            _it(sourceBasename, function () {
                const contents = fs.readFileSync(sourcePath, 'utf8');
                const result = testCallback!(contents);
    
                const json = JSON.stringify(result, null, 2);
                fs.writeFileSync(outputPath, json);
            });
        }
    });
}

interface TestCaseOptions {
    name: string;
    casesPath: string;
    outputBasePath: string;
    ext: string;
    testCallback: TestCallback;
}

type TestCallback = (contents: string) => any;
