# Deploy scripts

This action deploys season metadata to your tentant's database. See main readme for information on how to set up a season.yaml file.

## Prerequisites

Contcat talent::digital support to get the required input values.

## Usage

```yaml
name: Canary

on:
  push:
    branches: ["main"]

jobs:
  extract-microlearning:
    runs-on: ubuntu-latest
    name: Extract Microlearning
    steps:
      - uses: actions/checkout@v3
      - uses: talent-digital/extract-microlearning@v1.0
      - uses: pnpm/action-setup@v2
        with:
          version: 7.26.3
      - uses: actions/setup-node@v3
        with:
          node-version: 19
          cache: "pnpm"
      - uses: talent-digital/extract-microlearning@v1.0
      - uses: EndBug/add-and-commit@v9
```

## Inputs

- `season_file_path`: (Optional) Custom path for `season.yaml`, default to root directory.

## Development

### Running locally

To run the script locally for windows, run the following command:

`export GITHUB_WORKSPACE=../my-season-path && node extract-microlearning.mjs`

_Note_
Replace `GITHUB_WORKSPACE` with the path to the folder with your season.yaml file.

### Releasing new version

After merging your changes to the main branch use the github.com release / tag functionality. These tags are available in the workflows of the season repositories.
