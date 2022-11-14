const getInputs = require('./getInputs');
const shellExec = require('./shellExec');
const core = require('@actions/core');
const { Octokit } = require("@octokit/action");
const standardVersion = require('standard-version')
const { nextStandardVersion } = require('next-standard-version');

async function run() {
    try {

        // Get action inputes
        const inputs = getInputs();

        // Checkout to origin branch
        await shellExec(`git checkout ${inputs.origin_branch}`);

        // Get the version to be released
        if (inputs.release_version) {
            version = inputs.release_version;
        }
        else {
            version = await nextStandardVersion({
                modulePath: '',
                packaged: true
            })
        }

        // Create the release branch
        release_branch = `release/v${version}`;
        await shellExec(`git checkout -b ${release_branch}`);

        // Run standard version
        options = {};
        options.releaseAs = version;

        await standardVersion(options);
        console.log();

        // Push the release branch
        if (inputs.push_tag) {
            await shellExec(`git push --set-upstream origin ${release_branch} --follow-tags`);
        }
        else {
            await shellExec(`git push --set-upstream origin ${release_branch}`);
        }

        // Create the release PR from release branch
        options = {};
        options.baseUrl = process.env.GITHUB_API_URL;

        const octokit = new Octokit(options);

        const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

        octokit.pulls.create(
            {
                owner: owner,
                repo: repo,
                title: release_branch,
                head: release_branch,
                base: inputs.target_branch,
                body: inputs.body,
                draft: inputs.as_draft
            }
        );

        console.log(`Released as: ${version}`);
        core.setOutput('released_version', version);

    } catch (error) {
        console.log(error.stack);
        setFailed(error.message);
    }
}

run()
