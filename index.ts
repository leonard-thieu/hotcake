import process = require('process');
import glob = require('glob');
import path = require('path');
import { spawn } from 'child_process';
import { performance } from 'perf_hooks';
import commondir = require('commondir');

// Based on the amount of time it takes to parse an empty file.
const OVERHEAD = 160;
const NO_BANANAS = false;

const inputFilesPattern = process.argv[2];

glob(inputFilesPattern, async (err, items) => {
    const totalStartTime = performance.now();
    let totalFiles = 0;

    const paths = items;
    const cDir = commondir(paths);

    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        const rPath = path.relative(cDir, p);

        if (NO_BANANAS) {
            const pathSegments = rPath.split(path.sep);
            if (pathSegments.findIndex((value) => value === 'bananas') !== -1) {
                console.log(`Skipping ${rPath}...`);

                continue;
            }
        }

        totalFiles++;
        console.log(`Parsing ${rPath}...`);

        const proc = new Promise((resolve) => {
            const startTime = performance.now();

            const grun = spawn('cmd.exe', [
                '/c',
                'grun.bat',
                'MonkeyX',
                'moduleDeclaration',
                p,
            ], {
                cwd: 'gen',
            });

            const maxTime = 60 * 1000;
            const timeout = setTimeout(() => {
                console.log(`Maximum time of ${maxTime} ms exceeded.`);

                spawn('taskkill', [
                    '/pid',
                    grun.pid.toString(),
                    '/f',
                    '/t',
                ]);

                resolve();
            }, maxTime);

            grun.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            grun.stderr.on('data', (data) => {
                console.log(data.toString());
            });

            grun.on('exit', (code) => {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);

                // Only log on error or
                // execution time exceeds limit.
                if (code !== 0 ||
                    duration > 500 + OVERHEAD) {
                    console.log(`Child exited with code ${code} after ${duration} ms.`);
                }

                clearTimeout(timeout);

                resolve();
            });
        });

        await proc;
    }

    const totalEndTime = performance.now();
    const totalDuration = Math.round((totalEndTime - totalStartTime) / 1000);
    // Exclude overhead that would not be incurred in a real application.
    const totalOverhead = (OVERHEAD * totalFiles) / 1000;
    const totalDurationWithoutOverhead = Math.round(totalDuration - totalOverhead);

    console.log(`Project parsed in ${totalDuration} s (${totalDurationWithoutOverhead} s without overhead).`);
});
