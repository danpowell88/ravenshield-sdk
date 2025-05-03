const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const ini = require('ini');

async function compile(projectName, projectPath) {
    if (!projectName || !projectPath) {
        console.error('Error: Project name and path are required');
        console.log('Usage: node compile.js <projectName> <projectPath> [strip]');
        process.exit(1);
    }

    try {
        // Resolve absolute path
        const absoluteProjectPath = path.resolve(projectPath);

        if (!fs.existsSync(absoluteProjectPath)) {
            console.error(`Error: Project path ${absoluteProjectPath} does not exist`);
            process.exit(1);
        }

        // Clear and create workspace directory
        const workspaceDir = 'workspace';
        const workspaceSystemDir = path.join(workspaceDir, 'system');
        if (fs.existsSync(workspaceDir)) {
            console.log('Clearing existing workspace...');
            fs.rmSync(workspaceDir, { recursive: true, force: true });
        }
        fs.mkdirSync(workspaceDir, { recursive: true });

        // Copy sdk files to workspace
        console.log('Copying SDK files to workspace...');
        const sdkPath = path.join(__dirname, '..', 'sdk', 'system');
        fs.cpSync(sdkPath, workspaceSystemDir, { recursive: true });
        console.log('SDK files copied to workspace');

        // Copy project files to workspace
        console.log('Copying project files to workspace...');
        fs.cpSync(absoluteProjectPath, workspaceDir, { recursive: true });
        console.log('Project files copied to workspace');

        // Parse the workspace INI file
        const iniWorkspacePath = path.join(workspaceSystemDir, "ravenshield.ini");
        fs.appendFileSync(iniWorkspacePath, `\nEditPackages=${projectName}\n`);

        execSync('ucc make', {
            stdio: 'inherit',
            cwd: workspaceSystemDir
        });

        // Check for compiled .u file and move it to output
        const compiledFile = path.join(workspaceSystemDir, `${projectName}.u`);
        if (fs.existsSync(compiledFile)) {
            // Run strip command if requested
            if (strip) {
                console.log('Stripping source code...');
                const originalSize = fs.statSync(compiledFile).size;
                console.log(`Original file size: ${(originalSize / 1024).toFixed(2)} KB`);
                execSync(`ucc editor.stripsourcecommandlet ${projectName}.u`, {
                    stdio: 'inherit',
                    cwd: workspaceSystemDir
                });
                
                const strippedSize = fs.statSync(compiledFile).size;
                const sizeDiff = originalSize - strippedSize;
                const percentReduction = ((sizeDiff / originalSize) * 100).toFixed(2);
                
                console.log(`Stripped file size: ${(strippedSize / 1024).toFixed(2)} KB`);
                console.log(`Size reduction: ${(sizeDiff / 1024).toFixed(2)} KB (${percentReduction}%)`);
                console.log('Source code stripped successfully.');
                console.log('Source code stripped successfully.');
            }

            const outputDir = path.join(workspaceDir, 'output');
            fs.mkdirSync(outputDir, { recursive: true });
            fs.renameSync(compiledFile, path.join(outputDir, `${projectName}.u`));
            console.log(`Moved compiled file to ${path.join(outputDir, `${projectName}.u`)}`);
            console.log('Compilation completed successfully in workspace.');
        } else {
            console.error('No compiled .u file found');
            process.exit(1);
        }

        
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Get project name and path from command line arguments
const projectName = process.argv[2];
const projectPath = process.argv[3];
const strip = process.argv[4] === 'true' || process.argv[4] === '1';
compile(projectName, projectPath, strip);