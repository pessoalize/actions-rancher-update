const core = require('@actions/core');
const axios = require('axios');

process.on('unhandledRejection', handleError);
main().catch(handleError);

async function main() {
  const rancherUrl = core.getInput('rancher_url', {required: true});
  const rancherToken = core.getInput('rancher_token', {required: true});
  const clusterId = core.getInput('cluster_id', {required: true});
  const projectId = core.getInput('project_id', {required: true});
  const namespace = core.getInput('namespace', {required: true});
  const deployment = core.getInput('deployment', {required: true});
  const dockerImage = core.getInput('docker_image', {required: true});
  const showErrorLogs = core.getInput('error_logs', {required: false});

  await axios.patch(
    `${rancherUrl}/k8s/clusters/${clusterId}/apis/apps/v1/namespaces/${namespace}/deployments/${deployment}`,
    [
      {
        op: 'replace',
        path: '/spec/template/spec/containers/0/image',
        value: dockerImage,
      },
    ],
    {
      headers: {
        'Content-Type': 'application/json-patch+json',
        'Authorization': 'Bearer ' + rancherToken,
      },
    },
  );

  try {
      await axios.post(
      `${rancherUrl}/v3/projects/${clusterId}:${projectId}/workloads/deployment:${namespace}:${deployment}?action=redeploy`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + rancherToken,
        },
      },
    );
  } catch (e) {
     if(showErrorLogs) console.log(e);
     console.log("Provavelmente o workload é um por node")
     await axios.post(
      `${rancherUrl}/v3/projects/${clusterId}:${projectId}/workloads/daemonset:${namespace}:${deployment}?action=redeploy`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + rancherToken,
        },
      },
    );
  }
}

function handleError(err) {
  console.log(err);
  core.setFailed(err.message);
}
