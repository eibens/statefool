# eibens/statefool

Given the number of existing state managers for web applications it would be
foolish to build another.

So here it is.

<!-- badges -->

[![License](https://img.shields.io/github/license/eibens/statefool?color=informational)](LICENSE)
[![Repository](https://img.shields.io/github/v/tag/eibens/statefool?label&logo=github)](https://github.com/eibens/statefool)
[![ci](https://github.com/eibens/statefool/actions/workflows/ci.yml/badge.svg)](https://github.com/eibens/statefool/actions/workflows/ci.yml)

<!-- /badges -->

## Examples

- [minimal](examples/minimal): an application in a single file
- [extensible](examples/extensible): the same application but with a folder
  structure fit for a larger project

Serve the examples at [localhost:8080](http://localhost:8080):

```bash
deno task serve
```

## Future Work

- Stack trace, error handling, and logging.
- Access stores via IDs to allow for collections.
