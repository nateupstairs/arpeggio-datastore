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
    } else if (config.projectId) {
      gcloud = require('google-cloud')({
        projectId: config.projectId
      });
    } else {
      throw new Error('cannot initialize');
    }
    this.datastore = gcloud.datastore();
  }

  _createClass(Adapter, [{
    key: 'getKey',
    value: function getKey(key) {
      return key.id;
    }
  }, {
    key: 'create',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type) {
        var _this = this;

        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var data = arguments[2];
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new Promise(function (resolve, reject) {
                  var key = void 0;

                  try {
                    var finalPath = void 0;

                    if (path.length > 0) {
                      finalPath = path;
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
                      key = _this2.datastore.key(type, readArgs);
                    }
                  } catch (err) {
                    return reject(err);
                  }

                  _this2.datastore.get(key, function (err, entity) {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(entity);
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function read(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(type, keyData, data) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                  var key = void 0;

                  try {
                    key = _this3.datastore.key(keyData.path);
                  } catch (err) {
                    return reject(err);
                  }

                  _this3.datastore.save({
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
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function update(_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(type, keyData) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', new Promise(function (resolve, reject) {
                  var key = void 0;

                  try {
                    key = _this4.datastore.key(keyData.path);
                  } catch (err) {
                    return reject(err);
                  }

                  _this4.datastore.delete(key, function (err) {
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

      function destroy(_x10, _x11) {
        return _ref4.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'query',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(args) {
        var builtQuery;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                builtQuery = args[0];
                return _context5.abrupt('return', new Promise(function (resolve, reject) {
                  builtQuery.run(function (err, entities, info) {
                    if (err) {
                      return reject(err);
                    }

                    var cursor = false;

                    if (info.moreResults === 'MORE_RESULTS_AFTER_LIMIT') {
                      cursor = info.endCursor;
                    }
                    return resolve({
                      results: entities,
                      cursor: cursor
                    });
                  });
                }));

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function query(_x12) {
        return _ref5.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'buildQuery',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(type) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', this.datastore.createQuery(type));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function buildQuery(_x13) {
        return _ref6.apply(this, arguments);
      }

      return buildQuery;
    }()
  }]);

  return Adapter;
}();