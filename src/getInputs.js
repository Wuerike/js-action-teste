const getInput = (require('@actions/core').getInput);

let getInputs = function () {
    const release_version = getInput('release_version') || null;
    const origin_branch = getInput('origin_branch', { required: true });
    const target_branch = getInput('target_branch', { required: true });
    const pr_template = getInput('pr_template');
    const as_draft = JSON.parse(getInput('as_draft'));
    const push_tag = JSON.parse(getInput('push_tag'));

    return {
        release_version,
        origin_branch,
        target_branch,
        pr_template,
        as_draft,
        push_tag,
    };
}

module.exports = getInputs;