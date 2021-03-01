# rancher-update

This action helps by updating a service in the Rancher 2 environment. 

# Examples

## Update service

```yaml
on:
push:
  branches:
  - master

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: sekassel-research/actions-rancher-update@2.0.0
      with:
        rancher_url: https://rancher.test.de
        rancher_token: ${{ secrets.RANCHER_TOKEN }}
        cluster_id: ${{ secrets.CLUSTER_ID }}
        project_id: ${{ secrets.PROJECT_ID }}
        namespace: ${{ secrets.NAMESPACE }}
        deployment: ${{ secrets.DEPLOYMENT }}
        docker_image: sekassel-research/test-image:latest
```
