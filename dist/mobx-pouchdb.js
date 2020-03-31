(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx"], factory);
	else if(typeof exports === 'object')
		exports["pouch"] = factory(require("mobx"));
	else
		root["pouch"] = factory(root["mobx"]);
})((typeof window !== 'undefined' ? window : this), function(__WEBPACK_EXTERNAL_MODULE__1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(6);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = __webpack_require__(3);

Object.defineProperty(exports, 'Model', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Model).default;
  }
});

var _ModelStore = __webpack_require__(13);

Object.defineProperty(exports, 'ModelStore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ModelStore).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(1);

var _shortid = __webpack_require__(4);

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
    function Model(doc) {
        var _this = this;

        _classCallCheck(this, Model);

        this.__edit = new Map();
        this.E = new Proxy({}, {
            get: function get(obj, prop) {
                if (_this.__edit.get(prop) !== undefined) {
                    return _this.__edit.get(prop);
                }
                return _this[prop];
            },
            set: function set(obj, prop, val) {
                (0, _mobx.runInAction)(function () {
                    return _this.__edit.set(prop, val);
                });
                return true;
            }
        });

        this.generateId();
        this.updateFromDoc(doc);
    }

    _createClass(Model, [{
        key: 'generateId',
        value: function generateId() {
            this._id = (0, _shortid2.default)();
        }
    }, {
        key: 'save',
        value: function save() {
            var editCount = 0;
            var entries = Array.from(this.__edit);
            for (var i = 0; i < entries.length; ++i) {
                var key = entries[i][0];
                var val = entries[i][1];
                this[key] = val;
                ++editCount;
            }
            this.clearE();
            return !!editCount;
        }
    }, {
        key: 'updateFromDoc',
        value: function updateFromDoc(doc) {
            var _this2 = this;

            if (doc) {
                if (!!doc.toJS) {
                    doc = doc.toJS();
                }
                var keys = [].concat(_toConsumableArray(new Set(Object.keys(doc).concat(Object.keys(this.toJS())))));
                var selfProto = Object.getPrototypeOf(this);

                keys.forEach(function (key) {
                    // If the key doesn't exist but it's getter exists 
                    // then it's computed and it can't be overridden
                    var isComputed = !Object.getOwnPropertyDescriptor(_this2, key) && Object.getOwnPropertyDescriptor(selfProto, key);

                    if (isComputed || !doc[key] && key === '_id') {
                        return;
                    } else if (!!_this2[key] && !!_this2[key].updateFromDoc) {
                        _this2[key].updateFromDoc(doc[key]);
                    } else {
                        _this2[key] = doc[key] === undefined ? '' : doc[key];
                    }
                });
            }
        }
    }, {
        key: 'toJS',
        value: function toJS() {
            var __edit = this.__edit,
                E = this.E,
                doc = _objectWithoutProperties(this, ['__edit', 'E']);

            Object.keys(doc).forEach(function (key) {
                if (doc[key] && !!doc[key].toJS) {
                    doc[key] = doc[key].toJS();
                } else if (doc[key] && !!doc[key].$mobx) {
                    doc[key] = (0, _mobx.toJS)(doc[key]);
                }
                if (Array.isArray(doc[key])) {
                    doc[key] = doc[key].map(function (val) {
                        if (val && !!val.toJS) {
                            return val.toJS();
                        }
                        return val;
                    });
                }
            });
            return doc;
        }
    }, {
        key: 'clearE',
        value: function clearE() {
            this.__edit = new Map();
        }
    }, {
        key: 'setE',
        value: function setE(propertyName, property) {
            this.E[propertyName] = property;
        }
    }, {
        key: 'getE',
        value: function getE(property) {
            return this.E[property];
        }
    }]);

    return Model;
}();

exports.default = Model;


(0, _mobx.decorate)(Model, {
    _id: _mobx.observable,
    __edit: _mobx.observable,
    clearE: _mobx.action,
    setE: _mobx.action,
    save: _mobx.action,
    generateId: _mobx.action,
    updateFromDoc: _mobx.action
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var build = __webpack_require__(7);
var isValid = __webpack_require__(11);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(12) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var generate = __webpack_require__(8);
var alphabet = __webpack_require__(0);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1567752802062;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 7;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var random = __webpack_require__(9);
var format = __webpack_require__(10);

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

module.exports = randomByte;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// This file replaces `format.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

module.exports = function (random, alphabet, size) {
  // We can’t use bytes bigger than the alphabet. To make bytes values closer
  // to the alphabet, we apply bitmask on them. We look for the closest
  // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
  // 30 symbols in the alphabet, we will take 31 (00011111).
  // We do not use faster Math.clz32, because it is not available in browsers.
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
  // which is bigger than the alphabet). As a result, we will need more bytes,
  // than ID size, because we will refuse bytes bigger than the alphabet.

  // Every hardware random generator call is costly,
  // because we need to wait for entropy collection. This is why often it will
  // be faster to ask for few extra bytes in advance, to avoid additional calls.

  // Here we calculate how many random bytes should we call in advance.
  // It depends on ID length, mask / alphabet size and magic number 1.6
  // (which was selected according benchmarks).

  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  var step = -~(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var bytes = random(step)
    // Compact alternative for `for (var i = 0; i < step; i++)`
    var i = step
    while (i--) {
      // If random byte is bigger than alphabet even after bitmask,
      // we refuse it by `|| ''`.
      id += alphabet[bytes[i] & mask] || ''
      // More compact than `id.length + 1 === size`
      if (id.length === +size) return id
    }
  }
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(1);

var _Query = __webpack_require__(14);

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelStore = function () {
    function ModelStore(propertyName, Model, db) {
        var mobPouchSettings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, ModelStore);

        this.queries = {};

        this.propertyName = propertyName;
        this.Model = Model;
        this.db = db;
        this.__mobPouchSettings = mobPouchSettings;
        (0, _mobx.extendObservable)(this, _defineProperty({}, propertyName, []));
        this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', this.__handleChanges.bind(this));
    }

    _createClass(ModelStore, [{
        key: 'query',
        value: function query(mapFunc, filterOptions) {
            var query = void 0;
            if (filterOptions.live) {
                var mapFuncStr = mapFunc.toString();
                var filterOptionsStr = JSON.stringify(filterOptions);
                var queryList = this.queries[mapFuncStr] || {};
                if (queryList[filterOptionsStr]) {
                    query = queryList[filterOptionsStr];
                    return query.run(this);
                } else {
                    query = new _Query2.default(mapFunc, filterOptions, this.propertyName);
                    queryList[filterOptionsStr] = query;
                    this.queries[mapFuncStr] = queryList;
                }
            } else {
                query = new _Query2.default(mapFunc, filterOptions, this.propertyName);
            }
            return query.run(this);
        }
    }, {
        key: 'removeQuery',
        value: function removeQuery(mapFuncOrQueryResults, filterOptions) {
            var mapFunc = mapFuncOrQueryResults;
            if (!filterOptions) {
                mapFunc = mapFuncOrQueryResults._mapFunc;
                filterOptions = mapFuncOrQueryResults._filterOptions;
            }
            var filterOptionsStr = JSON.stringify(filterOptions);
            var mapFuncStr = mapFunc.toString();
            if (!!this.queries[mapFuncStr] && !!this.queries[mapFuncStr][filterOptionsStr]) {
                if (Object.keys(this.queries[mapFuncStr]).length === 1) {
                    delete this.queries[mapFuncStr];
                } else {
                    delete this.queries[mapFuncStr][filterOptionsStr];
                }
            }
        }
    }, {
        key: 'get',
        value: function get(docId) {
            var docIndex = this[this.propertyName].findIndex(function (t) {
                return t._id === docId;
            });
            if (docIndex > -1) {
                return this[this.propertyName][docIndex];
            }
            return null;
        }
    }, {
        key: 'load',
        value: function load(docId) {
            var _this = this;

            var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var doc = this.get(docId);
            if (doc) {
                return doc;
            }
            return this.db.get(docId, settings).then(function (docObj) {
                var docModel = _this.__generateModel(docObj);
                (0, _mobx.runInAction)(function () {
                    return _this[_this.propertyName].push(docModel);
                });
                _this.__allQueries().forEach(function (q) {
                    return q.onChange(_this, docObj);
                });
                return docModel;
            });
        }
    }, {
        key: 'add',
        value: function add(doc) {
            var _this2 = this;

            var jsDoc = doc.toJS && doc.toJS() || doc;
            return this.db.put(jsDoc).then(function (status) {
                if (status.ok) {
                    jsDoc._rev = status.rev;
                } else {
                    throw new Error(status);
                }
                return _this2.__sideLoad(jsDoc);
            });
        }
    }, {
        key: 'loadAll',
        value: function loadAll() {
            var _this3 = this;

            var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { include_docs: true, decending: true };
            var mobPouchSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { live: true };

            this.__mobPouchSettings = _extends({}, this.__mobPouchSettings, mobPouchSettings);
            return this.db.allDocs(settings).then(function (allDocs) {
                var rows = allDocs.rows.filter(function (doc) {
                    if (doc.id.indexOf('_design') === 0) {
                        _this3._design = _this3._design || {};
                        _this3._design[doc.id.substr(8)] = doc.doc;
                        return false;
                    }
                    return true;
                });
                (0, _mobx.runInAction)(function () {
                    return _this3[_this3.propertyName] = rows.map(function (doc) {
                        return _this3.__generateModel(doc.doc);
                    });
                });
                _this3[_this3.propertyName].forEach(function (doc) {
                    return _this3.load(doc._id);
                });
                _this3.__allQueries().forEach(function (q) {
                    return q.onChanges(_this3, rows);
                });
                return _this3[_this3.propertyName];
            });
        }
    }, {
        key: '__generateModel',
        value: function __generateModel(doc) {
            if (this.__mobPouchSettings.typed) {
                var docType = doc.type || 'default';
                if (!this.Model[docType]) {
                    throw new Error('Model type:' + docType + ' not found');
                }
                return new this.Model[docType](doc);
            } else {
                return new this.Model(doc);
            }
        }
    }, {
        key: '__sideLoad',
        value: function __sideLoad(doc) {
            var sideLoadedDoc = this.__generateModel(doc);
            this[this.propertyName].push(sideLoadedDoc);
            return this.load(doc._id);
        }
    }, {
        key: '__handleChanges',
        value: function __handleChanges(rev) {
            if (rev.deleted) {
                this.__onDelete(rev.doc, rev);
            } else if (rev.changes) {
                this.__onChange(rev.doc, rev);
            }
        }
    }, {
        key: '__onChange',
        value: function __onChange(doc, rev) {
            var _this4 = this;

            var storeDoc = this[this.propertyName].filter(function (storeDoc) {
                return storeDoc._id === doc._id;
            })[0];
            if (storeDoc) {
                storeDoc.updateFromDoc(doc);
            } else if (this.__mobPouchSettings.live) {
                this.__sideLoad(doc);
            }
            this.__allQueries().forEach(function (q) {
                return q.onChange(_this4, doc);
            });
        }
    }, {
        key: '__onDelete',
        value: function __onDelete(doc) {
            var storeDocIndex = this[this.propertyName].findIndex(function (storeDoc) {
                return storeDoc._id === doc._id;
            });
            if (storeDocIndex > -1) {
                this[this.propertyName].splice(storeDocIndex, 1);
            }
            this.__allQueries().forEach(function (q) {
                return q.onDelete(doc);
            });
        }
    }, {
        key: '__allQueries',
        value: function __allQueries() {
            var _ref;

            var queries = (_ref = []).concat.apply(_ref, _toConsumableArray(Object.values(this.queries).map(function (q) {
                return Object.values(q);
            })));
            return queries;
        }
    }]);

    return ModelStore;
}();

exports.default = ModelStore;


(0, _mobx.decorate)(ModelStore, {
    add: _mobx.action,
    load: _mobx.action,
    loadAll: _mobx.action,
    __sideLoad: _mobx.action,
    __onChange: _mobx.action,
    __onDelete: _mobx.action
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scopedEmitFunctions = {};

var Query = function () {
    function Query(mapFunc, filterOptions, propertyName) {
        var _extendObservable;

        _classCallCheck(this, Query);

        this.mapFuncPromise = null;
        this.runPromise = null;

        this._mapFunc = mapFunc;
        this._filterOptions = filterOptions;
        this.propertyName = propertyName;
        var stringOptions = JSON.stringify(filterOptions);

        (0, _mobx.extendObservable)(this, (_extendObservable = {}, _defineProperty(_extendObservable, propertyName, []), _defineProperty(_extendObservable, 'results', null), _extendObservable));
    }

    _createClass(Query, [{
        key: 'run',
        value: function run(modelStore) {
            var _this = this;

            if (!this.runPromise || !this._filterOptions.live) {
                if ((this._filterOptions.live || this._filterOptions.local_query) && typeof this._mapFunc === 'string') {
                    var parts = this._mapFunc.split('/');
                    this.mapFuncPromise;
                    if (modelStore._design && modelStore._design[parts[0]]) {
                        var doc = modelStore._design[parts[0]].views[parts[1]];
                        this.mapFuncPromise = Promise.resolve(_extends({}, doc, { map: this.__scopeMapFunc(doc.map) }));
                    } else {
                        this.mapFuncPromise = modelStore.db.get('_design/' + parts[0]).then(function (mapRes) {
                            modelStore._design = modelStore._design || {};
                            modelStore._design[parts[0]] = mapRes;
                            var doc = mapRes.views[parts[1]];
                            return _extends({}, doc, { map: _this.__scopeMapFunc(doc.map) });
                        });
                    }
                } else {
                    this.mapFuncPromise = Promise.resolve({ map: this.__scopeMapFunc(this._mapFunc) });
                }

                this.runPromise = this.mapFuncPromise.then(function (designDoc) {
                    return new Promise(function (resolve, reject) {
                        if (_this._filterOptions.local_query) {
                            resolve(_this.__localQuery(modelStore, designDoc, _this._filterOptions));
                        } else {
                            resolve(modelStore.db.query(_this._mapFunc, _this._filterOptions));
                        }
                    }).then(function (results) {
                        _this.results = results;
                        if (results.total_rows !== undefined) {
                            _this[_this.propertyName] = results.rows.map(function (d) {
                                return modelStore.get(d.doc._id) || modelStore.__sideLoad(d.doc);
                            });
                        }
                        return _this;
                    });
                });
            }
            return this.runPromise;
        }
    }, {
        key: 'onDelete',
        value: function onDelete(doc) {
            var docIndex = this[this.propertyName].findIndex(function (rdoc) {
                return rdoc._id === doc._id;
            });
            if (docIndex > -1) {
                this[this.propertyName].splice(docIndex, 1);
            }
        }
    }, {
        key: 'onChanges',
        value: function onChanges(modelStore, docArray) {
            var _this2 = this;

            docArray.forEach(function (doc) {
                return _this2.onChange(modelStore, doc);
            });
        }
    }, {
        key: 'onChange',
        value: function onChange(modelStore, doc) {
            var _this3 = this;

            this.mapFuncPromise.then(function (mapFunc) {
                if (mapFunc.reduce) {
                    return;
                }
                var docIndex = _this3[_this3.propertyName].findIndex(function (rdoc) {
                    return rdoc._id === doc._id;
                });
                if (_this3.__queryDocument(doc, mapFunc.map, _this3._filterOptions).doc) {
                    if (docIndex === -1) {
                        (0, _mobx.runInAction)(function () {
                            _this3[_this3.propertyName].push(modelStore.get(doc._id) || modelStore.__sideLoad(doc));
                        });
                    }
                } else {
                    if (docIndex > -1) {
                        (0, _mobx.runInAction)(function () {
                            _this3[_this3.propertyName] = _this3[_this3.propertyName].filter(function (_doc, ind) {
                                return ind !== docIndex;
                            });
                        });
                    }
                }
            });
        }
    }, {
        key: '__scopeMapFunc',
        value: function __scopeMapFunc(mapFunc) {
            var mapFuncStr = mapFunc.toString();
            if (!scopedEmitFunctions[mapFuncStr]) {
                // couchdb puts emit in a global scope
                scopedEmitFunctions[mapFuncStr] = eval('\n                (function queryDocumentKeys(key, doc) {\n                    var keyValues = {};\n                    function emit(key, value) {\n                        if (!keyValues[key]) {\n                            keyValues[key] = [];\n                        }\n                        keyValues[key].push(value || null);\n                    }\n                    var x = ' + mapFuncStr + ';\n                    x(doc, emit);\n                    return keyValues;\n                })\n            ');
            }
            return scopedEmitFunctions[mapFuncStr];
        }
    }, {
        key: '__queryDocument',
        value: function __queryDocument(doc, mapFunc, filterOptions) {
            var keyValues = mapFunc(filterOptions.key, doc);
            if (filterOptions.startkey && filterOptions.endkey) {
                var docKeys = Object.keys(keyValues);

                var _docKeys$filter = docKeys.filter(function (docKey) {
                    return docKey >= filterOptions.startkey && docKey <= filterOptions.endkey;
                }),
                    _docKeys$filter2 = _slicedToArray(_docKeys$filter, 1),
                    _docKeys$filter2$ = _docKeys$filter2[0],
                    firstMatchingKey = _docKeys$filter2$ === undefined ? undefined : _docKeys$filter2$;

                return { value: keyValues[firstMatchingKey], doc: keyValues[firstMatchingKey] && doc };
            } else {
                return { value: keyValues[filterOptions.key], doc: keyValues[filterOptions.key] && doc };
            }
        }
    }, {
        key: '__localQuery',
        value: function __localQuery(modelStore, designDoc, filterOptions) {
            var _this4 = this;

            var docs = modelStore[modelStore.propertyName].map(function (doc) {
                return _this4.__queryDocument(doc, designDoc.map, filterOptions);
            }).filter(function (valueDoc) {
                return valueDoc.doc;
            });
            if (designDoc.reduce) {
                var _Array$prototype;

                var rows = [];
                var values = docs.map(function (valueDoc) {
                    return valueDoc.value;
                });
                var valueArray = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, _toConsumableArray(values));

                if (designDoc.reduce === '_sum') {
                    rows.push({
                        value: valueArray.reduce(function (prev, current) {
                            return prev + current * 1;
                        }, 0),
                        key: null
                    });
                } else if (designDoc.reduce === '_count') {
                    rows.push({
                        value: valueArray.length,
                        key: null
                    });
                }
                return {
                    rows: rows
                };
            } else {
                return {
                    total_rows: this[this.propertyName].length,
                    offset: 0,
                    rows: docs.map(function (valueDoc) {
                        return { id: valueDoc.doc._id, key: filterOptions.key, doc: valueDoc.doc };
                    })
                };
            }
        }
    }]);

    return Query;
}();

exports.default = Query;


(0, _mobx.decorate)(Query, {
    onChange: _mobx.action,
    onDelete: _mobx.action
});

/***/ })
/******/ ]);
});
//# sourceMappingURL=mobx-pouchdb.js.map