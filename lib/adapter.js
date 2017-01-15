'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Arpeggio Adapter for Google Cloud Datastore
 */

var _ = require('lodash');

var Adapter = exports.Adapter = function () {
  function Adapter(config) {
    _classCallCheck(this, Adapter);

    var gcloud = void 0;

    if (config.gcloud) {
      gcloud = config.gcloud;
    } else {
      gcloud = require('google-cloud')(config);
    }
    this.datastore = gcloud.datastore();
  }

  _createClass(Adapter, [{
    key: 'getKey',
    value: function getKey(key) {
      return key.id;
    }
  }, {
    key: 'mapIds',
    value: function mapIds(models) {
      var map = {};

      models.forEach(function (m) {
        map[m.key.id] = m;
      });
      return map;
    }
  }, {
    key: 'byId',
    value: function byId(map, id) {
      return map[id];
    }
  }, {
    key: 'create',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, path, data) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new Promise(function (resolve, reject) {
                  var key = void 0;

                  try {
                    var finalPath = void 0;

                    if (path.length > 0) {
                      finalPath = path[0];
                    } else {
                      finalPath = [type];
                    }

                    key = _this.datastore.key(finalPath);
                  } catch (err) {
                    return reject(err);
                  }

                  _this.datastore.save({
                    key: key,
                    data: data
                  }, function (err) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(key);
                  });
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'read',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(type, args) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                  var key = void 0;
                  var readArgs = args[0];

                  try {
                    if (_.isArray(readArgs)) {
                      key = _this2.datastore.key(readArgs);
                    } else {
                      key = _this2.datastore.key([type, readArgs]);
                    }
                  } catch (err) {
                    return reject(err);
                  }

                  _this2.datastore.get(key, function (err, entity) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(_this2.formatEntity(entity));
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function read(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: 'readMany',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(type, args) {
        var _this3 = this;

        var readArgs;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                readArgs = args[0];
                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                  var keys = [];

                  try {
                    readArgs.forEach(function (ra) {
                      var key = void 0;

                      if (_.isArray(ra)) {
                        key = _this3.datastore.key(ra);
                      } else {
                        key = _this3.datastore.key([type, ra]);
                      }
                      keys.push(key);
                    });
                  } catch (err) {
                    return reject(err);
                  }

                  _this3.datastore.get(keys, function (err, entities) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(_this3.formatEntities(entities));
                  });
                }));

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function readMany(_x6, _x7) {
        return _ref3.apply(this, arguments);
      }

      return readMany;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(type, key, data) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', new Promise(function (resolve, reject) {
                  _this4.datastore.save({
                    key: key,
                    data: data
                  }, function (err) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(key);
                  });
                }));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function update(_x8, _x9, _x10) {
        return _ref4.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(type, key) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', new Promise(function (resolve, reject) {
                  _this5.datastore.delete(key, function (err) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(key);
                  });
                }));

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function destroy(_x11, _x12) {
        return _ref5.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'destroyMany',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(type, keys) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', new Promise(function (resolve, reject) {
                  _this6.datastore.delete(keys, function (err, entities) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(entities);
                  });
                }));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function destroyMany(_x13, _x14) {
        return _ref6.apply(this, arguments);
      }

      return destroyMany;
    }()
  }, {
    key: 'query',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(args) {
        var _this7 = this;

        var builtQuery;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                builtQuery = args[0];
                return _context7.abrupt('return', new Promise(function (resolve, reject) {
                  _this7.datastore.runQuery(builtQuery, function (err, entities, info) {
                    if (err) {
                      return reject(err);
                    }

                    var cursor = false;

                    if (info.moreResults === 'MORE_RESULTS_AFTER_LIMIT') {
                      cursor = info.endCursor;
                    }
                    return resolve({
                      results: _this7.formatEntities(entities),
                      cursor: cursor
                    });
                  });
                }));

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function query(_x15) {
        return _ref7.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'buildQuery',
    value: function buildQuery(type) {
      return this.datastore.createQuery(type);
    }
  }, {
    key: 'formatEntity',
    value: function formatEntity(entity) {
      if (!entity) {
        return null;
      }
      return {
        data: entity,
        key: entity[this.datastore.KEY]
      };
    }
  }, {
    key: 'formatEntities',
    value: function formatEntities(entities) {
      var _this8 = this;

      var formattedEntities = [];

      entities.forEach(function (e) {
        formattedEntities.push(_this8.formatEntity(e));
      });
      return formattedEntities;
    }
  }]);

  return Adapter;
}();