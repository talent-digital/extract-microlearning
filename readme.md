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
      - uses: talent-digital/extract-microlearning@v0.1.3
      - uses: EndBug/add-and-commit@v9
```

## Inputs

- `season_file_path`: (Optional) Custom path for `season.yaml`, default to root directory.

## Development

### Running locally

To run the script locally for windows, run the following command:

`export GITHUB_WORKSPACE=../my-season-path && pnpm run deploy`

_Note_
Replace `GITHUB_WORKSPACE` with the path to the folder with your season.yaml file.

### Making changes

After you make changes in the src files, you need to update the `dist/index.js` file. This is the file that is used by the action. To update this file, run `pnpm build`.

### Releasing new version

After merging your changes to the main branch use the github.com release / tag functionality. These tags are available in the workflows of the season repositories.
