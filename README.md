[![NPM](https://nodei.co/npm/poi-plugin-akashic-records-ex.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/poi-plugin-akashic-records-ex/)

plugin-Akashic-records
===========
Logbook plugin for [POI](https://github.com/poooi/poi)

## About this fork

This is a fork of [yudachi/plugin-Akashic-records](https://github.com/yudachi/plugin-Akashic-records),
created to extend the original plugin with abilities beyond plain logging.

The original plugin records what happened — sorties, battles, drops, construction,
development and remodelling — and lets you browse and filter that history. This fork
aims to build on those records to answer questions about them, for example:

- **Tracing the progress of a given quest**, by counting the logged events that
  contribute to it (such as sorties to a particular map, or the number of ships
  scrapped) rather than reading the counter the game exposes.

Everything the upstream plugin does is expected to keep working; the fork only adds to it.
