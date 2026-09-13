[![NPM](https://nodei.co/npm/poi-plugin-akashic-records-ex.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/poi-plugin-akashic-records-ex/)

plugin-Akashic-records
===========
Logbook plugin for [POI](https://github.com/poooi/poi)

## About this fork

This is a fork of [poooi/plugin-Akashic-records](https://github.com/poooi/plugin-Akashic-records),
created to extend the original plugin with abilities beyond plain logging.

The original plugin records what happened — sorties, battles, drops, construction,
development and remodelling — and lets you browse and filter that history. This fork
aims to build on those records to answer questions about them, for example:

- **Tracing the progress of a given quest**, by counting the logged events that
  contribute to it (such as sorties to a particular map, or the number of ships
  scrapped) rather than reading the counter the game exposes.

Everything the upstream plugin does is expected to keep working; the fork only adds to it.

It is published as `poi-plugin-akashic-records-ex` and installs alongside the original
rather than replacing it. Both read and write the same data folder and the same
`plugin.Akashic.*` settings, so switching over needs no import — but only one of them
may log at a time, so this plugin stays dormant and shows a migration notice while the
original is installed and enabled.

## Development

### Branches

| Branch | Purpose |
| --- | --- |
| `master` | An exact mirror of upstream. Never commit here; it only ever fast-forwards. |
| `dev` | The published branch: `master` plus this fork's changes, one commit per feature. |
| `feature/*` | Branched from `dev`, with as many commits as you like. Squash-merged into `dev`. |

### One-time setup

```bash
git remote add upstream https://github.com/poooi/plugin-Akashic-records.git
git config rerere.enabled true
```

`rerere` records how each rebase conflict was resolved and replays it next time. The
fork renames the i18n namespace and the redux action prefix across many files, so the
same conflicts recur on every upstream sync; without `rerere` they are resolved by hand
each time.

### Syncing an upstream release

```bash
git fetch upstream
git switch master && git merge --ff-only upstream/master && git push origin master
git switch dev && git rebase master && git push --force-with-lease origin dev
```

`--ff-only` is what keeps `master` honest: if it refuses, something was committed to
`master` that does not belong there.

### Working on a feature

```bash
git switch -c feature/<name> dev
# ... commit as often as you like ...

git switch dev
git merge --squash feature/<name>
git commit
```

The squash keeps `dev` to one commit per feature, so a rebase onto a new `master`
replays a short, readable series. The feature branch keeps the detailed history.

### Things that will bite you

- **Translation keys must not end in `.` or `:`** — poi runs every key in `i18n/*.json`
  through `escapeI18nKey`, which strips those characters, while `t()` looks the key up
  unescaped. Sentence-shaped keys silently fall back to the key itself, or render empty
  if a `:` survives into the lookup. Use symbolic keys such as `MigrationNoticeTitle`
  and put the English wording in `i18n/en-US.json`.
- **`npm run lint:styled` fails on every file**, including untouched ones. The config
  extends `stylelint-config-styled-components`, which predates stylelint 14 and needs a
  `customSyntax` that is not installed. Pre-existing; `lint:js` and `tsc --noEmit` are
  the checks that currently mean something.
