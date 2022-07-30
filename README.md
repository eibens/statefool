# eibens/statefool

Given the large number of existing state manager solutions for React it would be
foolish to build another. So here it is.

<!-- badges -->

[![License](https://img.shields.io/github/license/eibens/statefool?color=informational)](LICENSE)
[![Repository](https://img.shields.io/github/v/tag/eibens/statefool?label&logo=github)](https://github.com/eibens/statefool)
[![ci](https://github.com/eibens/statefool/actions/workflows/ci.yml/badge.svg)](https://github.com/eibens/statefool/actions/workflows/ci.yml)

<!-- /badges -->

## Examples

- The [minimal example](examples/minimal) is an application in a single file.
- The [extensible example](examples/extensible) is an application with a folder
  structure fit for larger projects

Serve the examples at [localhost:8080](http://localhost:8080):

```bash
deno task serve
```

## Future Work

- Stack trace, error handling, and logging.
- Access stores via IDs to allow for collections.
