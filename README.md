# graph_app
[![build](https://github.com/datavisyn/app_template/actions/workflows/build.yml/badge.svg)](https://github.com/datavisyn/app_template/actions/workflows/build.yml)

Interactive graph for pleiotrope genes. The repository is split into frontend (`src`, `package.json`, ...) and backend (`app_template`, `Makefile`, `requirements.txt`, ...). Make sure you have Node 16 and the latest yarn version installed (and run `corepack enable`). We are using `make` for our backend scripts, which you should have installed already (or [install](https://gnuwin32.sourceforge.net/packages/make.htm) on Windows).

## Frontend

The frontend is a React application built and managed via [visyn_scripts](https://github.com/datavisyn/visyn_scripts). All relevant scripts can be found in the package.json.

### Installation

yarn 3 is used as package manager, such that you can simply install the frontend via `yarn install`.

### Development

The application has many package.json scripts available, with one of them being `yarn start`. This will start the webpack dev-server.

## Backend

The backend is a FastAPI server managed via [visyn_core](https://github.com/datavisyn/visyn_core). All relevant scripts can be found in the Makefile.

### Installation

It is recommended to create a virtual environment to avoid cluttering the global installation directory.

```bash
python -m venv .venv  # create a new virtual environment
.\.venv\Scripts\Activate.ps1  # active it  (for Windows)
make develop  # install all dependencies
```

### Development

To start the development server, simply run `make start` which will execute a uvicorn runner.

## Network expansion
The paper https://www.nature.com/articles/s41588-023-01327-9 describes the expansion of protein interaction networks using GWAS-linked
genes as seeds. The expansion is run per trait/disease and uses googles pagerank algorithm followed by iterative clustering using the walktrap algorithm.

For the source code of network expansion see the function `astro` in the R script `./r_scripts/Script_1_SEED.R`.


