/**
 * Arpeggio Adapter for Google Cloud Datastore
 */

const _ = require('lodash')

export class Adapter {

  constructor(config) {
    let gcloud

    if (config.gcloud) {
      gcloud = config.gcloud
    }
    else if (config.projectId) {
      gcloud = require('google-cloud')({
        projectId: config.projectId
      })
    }
    else {
      throw new Error('cannot initialize')
    }
    this.datastore = gcloud.datastore()
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
        return resolve(entity)
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
        return resolve(entities)
      })
    })
  }

  async update(type, keyData, data) {
    return new Promise((resolve, reject) => {
      let key

      try {
        key = this.datastore.key(keyData.path)
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

  async destroy(type, keyData) {
    return new Promise((resolve, reject) => {
      let key

      try {
        key = this.datastore.key(keyData.path)
      }
      catch (err) {
        return reject(err)
      }

      this.datastore.delete(key, err => {
        if (err) {
          return reject(err)
        }
        return resolve(key)
      })
    })
  }

  async destroyMany(type, args) {
    let readArgs = args

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
      builtQuery.run((err, entities, info) => {
        if (err) {
          return reject(err)
        }

        let cursor = false

        if (info.moreResults === 'MORE_RESULTS_AFTER_LIMIT') {
          cursor = info.endCursor
        }
        return resolve({
          results: entities,
          cursor: cursor
        })
      })
    })
  }

  buildQuery(type) {
    return this.datastore.createQuery(type)
  }

}
