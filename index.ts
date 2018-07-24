import { spawn } from 'child_process';
import glob = require('glob');

const inputFilesDir = 'S:\\Projects\\_GitHub\\leonard-thieu\\ndref\\src\\**\\*.monkey';

glob(inputFilesDir, async (err, items) => {
    const paths = items;
    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        console.log(`Parsing ${p}...`);

        const proc = new Promise((resolve, reject) => {
            const grun = spawn('cmd.exe', [
                '/c',
                'grun.bat',
                'MonkeyX',
                'module',
                p,
            ], {
                cwd: 'gen',
            });

            grun.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            grun.stderr.on('data', (data) => {
                console.log(data.toString());
            });

            grun.on('exit', (code) => {
                console.log(`Child exited with code ${code}`);

                resolve();
            });
        });

        await proc;
    }
});
