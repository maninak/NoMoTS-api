
<div style="text-align: center; margin: 40px 0px">
  <img src="./src/assets/img/NoMoTS.png" alt="NoMoTS logo" height="250" width="250"></img>
</div>

# NoMoTS API Boilerplate


## Table of Contents
- [Description](#description)
    - [Technologies](#technologies)
- [Getting Started](#getting-started)
    - [Dependencies](#dependencies)
    - [Deploy](#deploy)
    - [Develop](#develop)
    - [NPM Scripts](#npm-scripts)
    - [Environment](#environment)
    - [Demo API specification](#demo-api-specification)
    - [Contributing](#contributing)
        - [Commit Guidelines](#commit-guidelines)
        - [Git Flow](#git-flow)
        - [Release Versioning](#release-versioning)
    - [Helpful Resources](#helpful-resources)

----------

## Description

**NoMoTS is a Node.js API [boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code), connected to MongoDB using Mongoose and implemented in Typescript.**

NoMoTS provides the rich custom tooling needed for node + Typescript development from the get-go. It features dead-easy support for `development`, `production` and `test` environments and an automatic versioning system following the [SemVer](http://semver.org/) specification. Moreover it includes an example CRUD implementation of a simple API for `Company` documents, paired with its integration and unit tests.

All code is littered with comments to help you understand what's going on and show you the way forward. If you already have experience with express.js you should feel right at home, only with less doubts and fear of touching the code due to the confidence boost that typings can provide.

### Technologies

This is a [Node.js](https://nodejs.org/) project written in [Typescript](http://www.typescriptlang.org/) and built with the help of [gulp](http://gulpjs.com/). The API is served by an [Express](http://expressjs.com/) web server and is designed to connect to a [MongoDB](https://www.mongodb.com/) database (see section [Environment](#environment) for more). The database schema validation and connection with the database is achieved with [mongoose](http://mongoosejs.com/). Project tests are run by [Mocha](https://mochajs.org/) against the [Chai](http://chaijs.com/) assertion library.

# Getting Started

## Dependencies

In order to launch NoMoTS API for production or development the following software need to be installed on the machine:

1. **Node.js** v6.9.2 or greater [[Download](https://nodejs.org/en/download/)]
	1.1. If you already have another node version installed you can use the tool [n](https://www.npmjs.com/package/n) to download additional node versions and easily switch between them
2. **Git** [[Download](https://git-scm.com/download)]
3. **MongoDB** [[Download](https://www.mongodb.com/download-center?jmp=nav)]

## Deploy

To deploy in production copy and paste the following single command in your Unix terminal:

`git clone https://github.com/maninak/NoMoTS-api.git && cd NoMoTS-api && npm i --only=production && npm build && npm start`

This will:
1. clone the source code
2. change into the source code directory
3. install project dependencies
4. build source code
5. launch NoMoTS API

## Develop

You can get set-up for development and extend the boilerplate by copy-pasting the following three commands into three (3) **separate** Unix terminals:

#### Terminal 1:

`git clone https://github.com/maninak/NoMoTS-api.git && cd NoMoTS-api && npm i && cp env/dev.template.env env/.env && npm run watch`

This will:
1. clone the source code
2. change into the source code directory
3. install project dependencies
4.  launch watch task which upon each source code change will:
    * delete `dist` folder that contains the resulting files of a previous build (this folder is *NOT* version-controlled)
    * run a linter against all `.ts` files, as per the rules specified in `tslint.json`
    * copy any assets from `src/assets` into `dist/src/assets`
    * set development environment variables using the template `dev.template.env` found in the `env` folder.
    * transpile all `.ts` file to `.js` files (with inline sourcemaps) and place them into the `dist` folder
    * run all tests found in the `test` folder

#### Terminal  2: 

`npm run localmongo`

This will create and use a ephemeral `mongo-test` folder at the project's root directory and then launch a `mongod` mongoDB demon that uses this folder as its `db` directory. This folder is *NOT* version-controlled.

#### Terminal 3:

`npm run demon`

This will launch the API web server using [nodemon](https://nodemon.io/) instead of node and will automatically restart the API upon each source code change (practically every time `npm run watch` recompiles any changed .ts files).

## NPM Scripts
The file `package.json` found in root directory contains many useful scripts which can be executed from the terminal with the format `npm run <script_name>`.

Here is a brief description of what each does:

* **`postinstall`** is called automatically upon each `npm install` command and is hooked to a custom script. This script is useful to enforce repository state that all other tools cannot (e.g. install git hooks, apply simple edits on dependencies' source code using sed etc).,
* **`localmongo`** see section [Terminal 2](#terminal-2)
* **`start`** launches the API web server (must have been built first)
* **`demon`** see section [Terminal 3](#terminal-3)
* **`watch`** see section [Terminal 1](#terminal-1)
* **`build`** builds a production version of the app from source into `dist` folder.
* **`build:dev`** builds a development version of the app from source into `dist` folder, including inline javascript source maps.
* **`test`** runs all test present in the `test` folder
* **`release`** see section [Release Versioning](#release-versioning)
* **`clean`** deletes `dist` folder
* **`clean:node`** deletes `node_modules` folder (`rm -rf` is dangerous, stay safe)
* **`clean:purge`** deletes everything that isn't tracked by git or is ignored by git (useful to fall back to git clone state)

## Environment

Upon launch, NoMoTS API looks for the file `.env` inside the `env/` folder from which it loads any specified environment variables. If no file is found, then the application falls back to using hardcoded development values. There is also a suggested production configuration template found in `env/prod.template.env`.

Contrary to the template files, the `env/.env` file (if you create one) is *NOT* version-controlled.

 **NOTE:** *Never* store private secrets such as API keys, tokens, passwords etc in the `*.template.env` files! Always store such data in gitignored files for security concerns!

 ## Demo API specification

### Headers

 For every request wherein API callers supply data in the body you will need to send the data in a valid json format and to have set in your header the following:

| Key          | Value            |
|--------------|------------------|
| Content-Type | application/json |

<br><br> 
### **`/companies`** 

#### Actions

| METHOD | DESCRIPTION                             |
|--------|-----------------------------------------|
| GET    | Retrieve all existing Company documents |

#### GET request parameters

| PROPERTY     | TYPE     | REQUIRED | LOCATION       |
|--------------|----------|----------|----------------|
| -            | -        | -        | -              |

Example cURL request:

```sh
curl  --request GET \
      --url https://nomots.herokuapp.com/api/companies
```

<br><br> 
### **`/companies/:id`**

#### Actions

| METHOD | DESCRIPTION                                              |
|--------|----------------------------------------------------------|
| GET    | Retrieve a single existing Company document              |
| PUT    | Overwrite an existing Company document                   |
| PATCH  | Update the beneficiaries of an existing Company document |
| DELETE | Delete an existing Company document                      |

<br>

#### GET request parameters

| PROPERTY     | TYPE     | REQUIRED | LOCATION       |
|--------------|----------|----------|----------------|
| id           | string   | true     | URL parameters |

Example cURL request:

```sh
curl  --request GET \
      --url https://nomots.herokuapp.com/api/companies/594fd05c485492725edd8d20 \
      --header 'content-type: application/json'
```

<br>
 
#### PUT request parameters

| PROPERTY     | TYPE     | REQUIRED | LOCATION       |
|--------------|----------|----------|----------------|
| id           | string   | true     | URL parameters |
| name         | string   | true     | body           |
| address      | string   | true     | body           |
| city         | string   | true     | body           |
| country      | string   | true     | body           |
| email        | string   | false    | body           |
| phone        | string   | false    | body           |
| benef_owners | [string] | false    | body           |

Example cURL request:

```sh
curl  --request PUT \
      --url https://nomots.herokuapp.com/api/companies/594fd05c485492725edd8d20 \
      --header 'content-type: application/json' \
      --data '{
          "name": "New Company LTD",
          "address": "Markonian 88",
          "city": "Milan",
          "country": "Italy",
          "email": "info@newcompany.com",
          "phone": "+55 123 45 67 890",
          "benef_owners": [
              "Mitsos",
              "Dick"
          ]
      }'
```

<br>
 
#### PATCH request parameters

| PROPERTY     | TYPE     | REQUIRED | LOCATION       |
|--------------|----------|----------|----------------|
| id           | string   | true     | URL parameters |
| benef_owners | [string] | true     | body           |

Example cURL request:

```sh
curl  --request PATCH \
      --url https://nomots.herokuapp.com/api/companies/594fd05c485492725edd8d20 \
      --header 'content-type: application/json' \
      --data '{
          "benef_owners": [
              "Mitsos",
              "Dick"
          ]
      }'
```

<br>
 
#### DELETE request parameters

| PROPERTY     | TYPE     | REQUIRED | LOCATION       |
|--------------|----------|----------|----------------|
| id           | string   | true     | URL parameters |

Example cURL request:

```sh
curl  --request DELETE \
      --url https://nomots.herokuapp.com/api/companies/594fd05c485492725edd8d20
```

<br><br>
### **`/companies/create`**

#### Actions

| METHOD       | DESCRIPTION                          |
|--------------|--------------------------------------|
| POST         | Create a new Company document        |

<br>
 
#### POST request parameters

| PROPERTY     | TYPE     | REQUIRED | LOCATION       |
|--------------|----------|----------|----------------|
| name         | string   | true     | body           |
| address      | string   | true     | body           |
| city         | string   | true     | body           |
| country      | string   | true     | body           |
| email        | string   | false    | body           |
| phone        | string   | false    | body           |
| benef_owners | [string] | false    | body           |

Example cURL request:

```sh
curl  --request POST \
      --url https://nomots.herokuapp.com/api/companies/create \
      --header 'content-type: application/json' \
      --data '{
          "name": "New Company LTD",
          "address": "Markonian 88",
          "city": "Milan",
          "country": "Italy",
          "email": "info@newcompany.com",
          "phone": "+55 123 45 67 890",
          "benef_owners": [
              "Mitsos",
              "Dick"
          ]
      }'
```

## Contributing

### Commit Guidelines

We hold very precise rules over how our git commit messages can be formatted.  This leads to **more readable messages** that are easy to follow when looking through the **project history**.  But also, we use the git commit messages to **automatically generate the change log**.

You can read more about the git commit guidelines in [`CONTRIBUTING.md`](CONTRIBUTING.md) found in project root.

Upon npm install, a `commit-msg` git hook is automatically installed that lints commit messages as per the rules defined in the `CONTRIBUTING.md`.

To disable the commit message linter:
1. Delete the `"postinstall"` script from inside your `package.json`
2. Delete the file `commit-msg` located at `NoMoTS-api/.git/hooks`

#### Commit Message Convention, at a Glance

_patches:_

```sh
git commit -a -m "fix(parsing): fix a bug in the parser"
```

_features:_

```sh
git commit -a -m "feat(parser): implement new parser \o/"
```

_breaking changes:_

```sh
git commit -a -m "feat(new-parser): introduce a new parsing library
BREAKING CHANGE: new library does not support foo-construct"
```

_other changes:_

You decide, e.g., docs, chore, etc.

```sh
git commit -a -m "docs: fixed up the docs a bit"
```

### Git Flow

We use [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) (with default settings) to create feature, bugfix, etc branches.

Git flow can be practiced manually, but to make your life easy it's best to use automated tools that support it like [GitKraken](https://www.gitkraken.com/) or a [command-line tool](https://github.com/nvie/gitflow/wiki/Installation).

### Release Versioning

Because of the fact that git commit messages are structured, versioning is done automatically using [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog). 

Running `npm run release` in your terminal will get the latest available develop, scan its commits, bump bugfix or minor (or none) version number in `package.json` depending on whether there are new features or not, update the `CHANGELOG.md` file with the latest changes since last release and merge everything *locally* in the lastest available master. It then also applies a git-tag with the version number.

If you feel it is needed feel free to make corrections/additions by amending the master commit. If everything looks good, push the master branch upstream with the command
`git checkout master && git push --follow-tags origin master`

## Helpful Resources

* a preconfigured [`.gitconfig`](https://gist.github.com/maninak/ef1c6d1ec312fa0e3a716688fbc62e59) with useful git aliases and scripts
* nifty Visual Studio Code [settings](https://gist.github.com/maninak/e494d759caa9f04b9bb0d253e8fcf35e)
* helpful Visual Studio Code [plugin set](https://gist.github.com/maninak/3d01c9639a1f1271698f1ef6c4743e73) you can import using [this vscode plugin](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
