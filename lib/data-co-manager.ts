import fs from 'fs-extra'
import * as globModule from 'glob'
import path from 'path'

import CONST from './constant'

// glob@7/8 export a callable with `.sync`, glob@9+ export a named `globSync`.
// Resolve at runtime so the plugin works whichever version poi provides.
/* eslint-disable @typescript-eslint/no-explicit-any */
const globAny = globModule as any
const globSync: (pattern: string) => string[] =
  globAny.globSync || globAny.sync || globAny.default?.globSync || globAny.default?.sync
/* eslint-enable @typescript-eslint/no-explicit-any */

// glob@9+ treats `\` as an escape character, so patterns must use `/`
// on every platform. glob@7 accepts `/` on Windows too.
const globPath = (...segments: string[]) => path.join(...segments).replace(/\\/g, '/')

const { APPDATA_PATH, config } = window

const DATA_PATH = config.get("plugin.Akashic.dataPath", APPDATA_PATH)

export type DataRow = [number, ...(number | string)[]]
export type DataTable = DataRow[]
export interface Data {
  [key: string]: DataTable
}

/**
 * Encodes one cell for the comma separated log files.
 *
 * `getData` turns `%2C` back into a comma when it reads a row, so a comma has
 * to be encoded on the way out. This used to run the *decode* in both
 * directions, which meant any value containing a comma was written verbatim
 * and split into extra columns when read back.
 *
 * `%` itself is deliberately left alone: escaping it would change how every
 * already written file decodes.
 */
export const encodeCell = <T>(value: T): T | string =>
  typeof value === 'string' ? value.replace(/,/g, '%2C') : value

class DataCoManager {
  private nickNameId = ''

  setNickNameId(id: string) {
    this.nickNameId = id
  }

  getParsedTimestamp(ts: string): number {
    if (/^[1-9]+[0-9]*$/.test(ts)) {
      return parseInt(ts)
    } else if (/^[1-9]+[0-9]*\.[0-9]$/.test(ts)) {
      return parseFloat(ts)
    } {
      return 0
    }
  }

  async getData(type: string): Promise<DataTable> {
    const datalogsPromise = globSync(
      globPath(DATA_PATH, 'akashic-records', this.nickNameId, type, '*')
    ).map(async (filePath) => {
      try {
        const fileContent = await fs.readFile(filePath, 'utf8')
        const logs = fileContent.split("\n")
        const parsed = logs.map((logItem) => {
          const splitedLogItem = logItem.split(',')
          const parsedLogItem: DataRow = [
            this.getParsedTimestamp(splitedLogItem[0]),
            ...splitedLogItem.slice(1).map(s => s.replace(/%2C/g, ',')),
          ]
          return parsedLogItem
        })
        return parsed.filter((log) => log.length > 2)
      } catch (e) {
        if (process.env.DEBUG) {
          console.warn(`Read and decode file:${filePath} error!${(e as string).toString()}`)
        }
        return []
      }
    })
    const datalogs = (await Promise.all(datalogsPromise))
      .reduce((ret, cur) => ret.concat(cur), [] as DataTable)
      .reverse()
      .sort((a, b) => {
        if (isNaN(a[0]))
          a[0] = (new Date(a[0])).getTime()
        if (isNaN(b[0]))
          b[0] = (new Date(b[0])).getTime()
        return (b[0]) - (a[0])
      })
      .map((log, index, logs) => logs[index - 1] && logs[index - 1][0] === log[0] ? null : log)
      .filter(logs => logs !== null) as DataTable
    return datalogs
  }

  async initializeData(id: string) {
    this.setNickNameId(id)
    const data: Data = {}
    for (const type of Object.values(CONST.typeList)) {
      data[type] = await this.getData(type)
    }
    return data
  }

  /**
   * Development aid: appends the untouched api payload a row was derived from,
   * so a reward the resolver could not name can be inspected afterwards. Off
   * unless `plugin.Akashic.recordRawResponses` is set, and read per call so the
   * setting takes effect without a restart.
   *
   * Written under `raw` rather than the log type's own directory because
   * `getData` globs every file below a type directory and parses it as csv.
   */
  saveRaw(kind: string, payload: unknown) {
    if (!config.get('plugin.Akashic.recordRawResponses', false)) {
      return
    }
    try {
      const dir = path.join(DATA_PATH, 'akashic-records', this.nickNameId, 'raw')
      fs.ensureDirSync(dir)
      fs.appendFileSync(path.join(dir, `${kind}.jsonl`), `${JSON.stringify(payload)}\n`, 'utf8')
    } catch (e) {
      console.error('Failed to record raw response', e)
    }
  }

  saveLog(type: string, log: DataRow) {
    log = [log[0], ...log.slice(1).map(item => typeof item == 'string' ? encodeCell(item.trim()) : item)] as DataRow
    fs.ensureDirSync(path.join(DATA_PATH, 'akashic-records', this.nickNameId, type))
    if (type === 'attack') {
      const date = new Date(log[0])
      const year = date.getFullYear()
      const month = date.getMonth() < 9 ?
        `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
      const day = date.getDate() < 10 ?
        `0${date.getDate()}` : `${date.getDate()}`
      fs.appendFile(
        path.join(DATA_PATH, 'akashic-records', this.nickNameId, type, `${year}${month}${day}`),
        `${log.join(',')}\n`,
        { encoding: 'utf8' },
        (err) => {
          if (process.env.DEBUG) {
            if (err) {
              console.error("Write attack-log file error!")
            } else {
              // eslint-disable-next-line no-console
              console.log("Write attack-log file successful!")
            }
          }
        }
      )
    } else {
      fs.appendFile(path.join(DATA_PATH, 'akashic-records', this.nickNameId, type, "data"),
        `${log.join(',')}\n`,
        { encoding: 'utf8' },
        (err) => {
          if (process.env.DEBUG) {
            if (err) {
              console.error(`Write ${type}-log file error!`)
            } else {
              // eslint-disable-next-line no-console
              console.log(`Write ${type}-log file successful!`)
            }
          }
        }
      )
    }
    if (process.env.DEBUG) {
      // eslint-disable-next-line
      console.log(`save one ${type} log`)
    }
  }
}

export default new DataCoManager()
