
![dir-snap](./images/logo.png)


# dir-snap - A snappy directory snapshot tool
[![Build Status](https://travis-ci.org/LanceTurri/dir-snap.svg?branch=develop)](https://travis-ci.org/LanceTurri/dir-snap)
[![Coverage Status](https://coveralls.io/repos/github/LanceTurri/dir-snap/badge.svg?branch=develop)](https://coveralls.io/github/LanceTurri/dir-snap?branch=develop)

This module makes it easy to compare before and after snapshots of your project's filesystem. Simply use `dirsnap` to create a reference point (`dirsnap reference`), then make as many changes as you want. When you want to see what has changed, run a compare (`dirsnap compare`) and the files that have been altered will be displayed.

## Installation

Install globally via npm:

```sh
$ npm install -g dir-snap
```

Or globally via yarn:

```sh
$ yarn global add dir-snap
```

## Usage

> Please note that the command to use in the CLI is `dirsnap` with no hypen.

### Reference

`reference` is a very simple function that creates a snapshot of the current folder structure. Pass in a folder to begin searching through and an extension for the filetype you care about (`dirsnap reference -f ./myProject -e js`).

```sh
$ dirsnap reference -f [folder] -e <ext>
```

When the scanning has completed, a reference JSON file will be written in the `.dirsnap` folder of the project to be used later during a compare. This library currently uses the MD5 checksum of a file for comparison purposes.

> NOTE: The filename will be `${extension}FileReference.json`.

An example of the JSON structure looks like this:
```javascript
{
    "cwd": "/Users/FakeUser/Git/dir-snap/test/testParent",
    "date": "2017-09-03T03:06:23.079Z",
    "ext": "js",
    "files": {
        "/Users/FakeUser/Git/dir-snap/test/testParent": {
            "javascript.js": "496dd81dea39fb0b0c07be50c2fc67a3",
            "javascript.min.js": "1d6a42d2095f51127215e64c5f67da11"
        },
        "/Users/FakeUser/Git/dir-snap/test/testParent/models": {}
    },
    "folder": "./"
}
```

### Compare

`compare` scans through the folder passed in and produces an updated snapshot to compare with the latest reference file. Once the compare happens, a colorized diff will be logged for all files that have changed since the reference was made.

```sh
$ dirsnap -f [folder] -e <ext>
$ dirsnap -f ./my-project -e js
```

### List
`list` will output all reference files that are for a specific folder. This makes it easy to check what reference files have been created and can be compared against.

```javascript
$ dirsnap list -f [folder]
// Example output:
// NAME: jsFileReference.json
// EXT:  js
// DATE: 2017-09-03T03:06:23.079Z
```

### Reset
`reset` will delete one or all reference files for a specific folder. Use if you need to start over or have made significant changes to the folder structure.

```sh
$ dirsnap reset -f [folder]
```

> NOTE: If a folder is not passed in, this command will delete all reference files tied to the current working directory.

## License

Copyright Lance Turri. Released under the terms of the MIT license.