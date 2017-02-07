/**
 * Arpeggio Adapter for Google Cloud Datastore
 */

const _ = require('lodash')
const datastore = require('@google-cloud/datastore')

export class Adapter {

  constructor(config) {
    let client

    if (config.client) {
      client = config.client
    }
    else {
      client = datastore(config)
    }
    this.datastore = client
  }

  getKey(key) {
    return key.id
  }
  
  mapIds(models) {
    let map = {}

    models.forEach(m => {
      map[m.key.id] = m
    })
    return map
  }

  byId(map, id) {
    return map[id]
  }

  async create(type, path, data) {
    return new Promise((resolve, reject) => {
      let key

      try {
        let finalPath

        if (path.length > 0) {
          finalPath = path[0]
        }
        else {
          finalPath = [type]
        }

        key = this.datastore.key(finalPath)
      }
      catch (err) {
        return reject(err)
      }

      this.datastore.save({
        key: key,
        data: data
      }, err => {
        if (err) {
          return reject(err)
        }
        return resolve(key)
      })
    })
  }

  async read(type, args) {
    return new Promise((resolve, reject) => {
      let key
      let readArgs = args[0]

      try {
        if (_.isArray(readArgs)) {
          key = this.datastore.key(readArgs)
        }
        else {
          key = this.datastore.key([type, readArgs])
        }
      }
      catch (err) {
        return reject(err)
      }

      this.datastore.get(key, (err, entity) => {
        if (err) {
          return reject(err)
        }
        return resolve(this.formatEntity(entity))
      })
    })
  }

  async readMany(type, args) {
    let readArgs = args[0]

    return new Promise((resolve, reject) => {
      let keys = []

      try {
        readArgs.forEach(ra => {
          let key

          if (_.isArray(ra)) {
            key = this.datastore.key(ra)
          }
          else {
            key = this.datastore.key([type, ra])
          }
          keys.push(key)
        })
      }
      catch (err) {
        return reject(err)
      }

      this.datastore.get(keys, (err, entities) => {
        if (err) {
          return reject(err)
        }
        return resolve(this.formatEntities(entities))
      })
    })
  }

  async update(type, key, data) {
    return new Promise((resolve, reject) => {
      this.datastore.save({
        key: key,
        data: data
      }, err => {
        if (err) {
          return reject(err)
        }
        return resolve(key)
      })
    })
  }

  async destroy(type, key) {
    return new Promise((resolve, reject) => {
      this.datastore.delete(key, err => {
        if (err) {
          return reject(err)
        }
        return resolve(key)
      })
    })
  }

  async destroyMany(type, keys) {
    return new Promise((resolve, reject) => {
      this.datastore.delete(keys, (err, entities) => {
        if (err) {
          return reject(err)
        }
        return resolve(entities)
      })
    })
  }

  async query(args) {
    let builtQuery = args[0]

    return new Promise((resolve, reject) => {
      this.datastore.runQuery(builtQuery, (err, entities, info) => {
        if (err) {
          return reject(err)
        }

        let cursor = false

        if (info.moreResults === 'MORE_RESULTS_AFTER_LIMIT') {
          cursor = info.endCursor
        }
        return resolve({
          results: this.formatEntities(entities),
          cursor: cursor
        })
      })
    })
  }

  buildQuery(type) {
    return this.datastore.createQuery(type)
  }
  
  formatEntity(entity) {
    if (!entity) {
      return null
    }
    return {
      data: entity,
      key: entity[this.datastore.KEY]
    }
  }

  formatEntities(entities) {
    let formattedEntities = []

    entities.forEach(e => {
      formattedEntities.push(this.formatEntity(e))
    })
    return formattedEntities
  }

}
