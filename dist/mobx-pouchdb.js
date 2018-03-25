(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx"], factory);
	else if(typeof exports === 'object')
		exports["pouch"] = factory(require("mobx"));
	else
		root["pouch"] = factory(root["mobx"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__2__) {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(9);

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

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(8);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(2);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelStore = function () {
    function ModelStore(propertyName, Model, db) {
        _classCallCheck(this, ModelStore);

        this.lists = [];

        this.propertyName = propertyName;
        this.Model = Model;
        this.db = db;
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
            var _extendObservable2,
                _this = this;

            var stringOptions = JSON.stringify(filterOptions);
            var queryResults = {
                filterOptions: filterOptions,
                mapFunc: mapFunc
            };
            (0, _mobx.extendObservable)(queryResults, (_extendObservable2 = {}, _defineProperty(_extendObservable2, this.propertyName, []), _defineProperty(_extendObservable2, 'results', null), _extendObservable2));

            if (filterOptions.live) {
                if (!!this.lists[mapFunc] && !!this.lists[mapFunc].queries[stringOptions]) {
                    return this.lists[mapFunc].queries[stringOptions];
                }
                if (!this.lists[mapFunc]) {
                    this.lists[mapFunc] = {
                        mapFunc: mapFunc,
                        queries: {}
                    };
                }
                this.lists[mapFunc].queries[stringOptions] = queryResults;
            }
            if (filterOptions.local_query) {
                queryResults.results = this.__localQuery(mapFunc, filterOptions);
                queryResults[this.propertyName] = queryResults.results.rows.map(function (d) {
                    return _this.get(d.doc._id) || _this.__sideLoad(d.doc);
                });
            } else {
                this.service.db.query(mapFunc, filterOptions).then(function (results) {
                    queryResults.results = results;
                    queryResults[_this.propertyName] = queryResults.results.rows.map(function (d) {
                        return _this.get(d.doc._id) || _this.__sideLoad(d.doc);
                    });
                });
            }
            return queryResults;
        }
    }, {
        key: 'removeQuery',
        value: function removeQuery(mapFuncOrQueryResults, filterOptions) {
            var mapFunc = mapFuncOrQueryResults;
            if (!filterOptions) {
                mapFunc = mapFuncOrQueryResults.mapFunc;
                filterOptions = mapFuncOrQueryResults.filterOptions;
            }
            var stringOptions = JSON.stringify(filterOptions);
            if (!!this.lists[mapFunc] && !!this.lists[mapFunc].queries[stringOptions]) {
                if (Object.keys(this.lists[mapFunc].queries).length === 1) {
                    delete this.lists[mapFunc];
                } else {
                    delete this.lists[mapFunc].queries[stringOptions];
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
            var _this2 = this;

            var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var doc = this.get(docId);
            if (doc) {
                return doc;
            }
            return this.db.get(docId, settings).then(function (docObj) {
                var docModel = new _this2.Model(docObj);
                _this2[_this2.propertyName].push(docModel);
                return docModel;
            });
        }
    }, {
        key: 'add',
        value: function add(doc) {
            var _this3 = this;

            var jsDoc = doc.toJS && doc.toJS() || doc;
            return this.db.put(jsDoc).then(function (status) {
                if (status.ok) {
                    jsDoc._rev = status.rev;
                } else {
                    throw new Error(status);
                }
                return _this3.__sideLoad(jsDoc);
            });
        }
    }, {
        key: 'loadAll',
        value: function loadAll() {
            var _this4 = this;

            var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { include_docs: true, decending: true };

            return this.db.allDocs(settings).then(function (allDocs) {
                (0, _mobx.runInAction)(function () {
                    return _this4[_this4.propertyName] = allDocs.rows.map(function (doc) {
                        return new _this4.Model(doc.doc);
                    });
                });
                allDocs.rows.forEach(function (doc) {
                    return _this4.__queryDocOnChange(doc);
                });
                return _this4[_this4.propertyName];
            });
        }
    }, {
        key: '__sideLoad',
        value: function __sideLoad(doc) {
            var sideLoadedDoc = new this.Model(doc);
            this[this.propertyName].push(sideLoadedDoc);
            return sideLoadedDoc;
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
            var storeDoc = this[this.propertyName].filter(function (storeDoc) {
                return storeDoc._id === doc._id;
            })[0];
            if (storeDoc) {
                storeDoc.updateFromDoc(doc);
            }
            this.__queryDocOnChange(doc);
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
            this.__queryDocOnDelete(doc, true);
        }
    }, {
        key: '__queryDocOnDelete',
        value: function __queryDocOnDelete(doc) {
            var _this5 = this;

            var queryMaps = Object.keys(this.lists);
            queryMaps.forEach(function (map) {
                var mapObj = _this5.lists[map];
                var queryKeys = Object.keys(mapObj.queries);
                queryKeys.forEach(function (queryKey) {
                    var query = mapObj.queries[queryKey];
                    var docIndex = query[_this5.propertyName].findIndex(function (rdoc) {
                        return rdoc._id === doc._id;
                    });
                    if (docIndex > -1) {
                        query[_this5.propertyName].splice(docIndex, 1);
                    }
                });
            });
        }
    }, {
        key: '__queryDocOnChange',
        value: function __queryDocOnChange(doc) {
            var _this6 = this;

            var queryMaps = Object.keys(this.lists);
            queryMaps.forEach(function (map) {
                if (!map.startsWith('function')) {
                    throw new Error('Updating stored queries not yet supported');
                }
                var mapObj = _this6.lists[map];
                var queryKeys = Object.keys(mapObj.queries);
                queryKeys.forEach(function (queryKey) {
                    var query = mapObj.queries[queryKey];
                    var docIndex = query[_this6.propertyName].findIndex(function (rdoc) {
                        return rdoc._id === doc._id;
                    });
                    if (_this6.__queryDocument(doc, mapObj.mapFunc, query.filterOptions)) {
                        if (docIndex === -1) {
                            query[_this6.propertyName].push(_this6.get(doc._id) || _this6.__sideLoad(doc));
                        }
                    } else {
                        if (docIndex > -1) {
                            query[_this6.propertyName].splice(docIndex, 1);
                        }
                    }
                });
            });
        }
    }, {
        key: '__queryDocument',
        value: function __queryDocument(doc, mapFunc, filterOptions) {
            var keysEmitted = [];
            var key = filterOptions.key;
            var emit = function emit(key) {
                return keysEmitted.push(key);
            };
            mapFunc(doc, emit);
            if (!keysEmitted.length) {
                return false;
            }
            return keysEmitted.includes(key);
        }
    }, {
        key: '__localQuery',
        value: function __localQuery(mapFunc, filterOptions) {
            var _this7 = this;

            var docs = this[this.propertyName].filter(function (doc) {
                return _this7.__queryDocument(doc, mapFunc, filterOptions);
            });
            return {
                total_rows: this[this.propertyName].length,
                offset: 0,
                rows: docs.map(function (doc) {
                    return { id: doc._id, key: filterOptions.key, doc: doc };
                })
            };
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
    __onDelete: _mobx.action,
    __queryDocOnChange: _mobx.action,
    __queryDocOnDelete: _mobx.action
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(1);
var alphabet = __webpack_require__(0);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

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

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var encode = __webpack_require__(1);
var decode = __webpack_require__(7);
var build = __webpack_require__(6);
var isValid = __webpack_require__(5);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(4) || 0;

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
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(10);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(2);

var _shortid = __webpack_require__(11);

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
            var _this2 = this;

            var editCount = 0;
            this.__edit.forEach(function (val, key) {
                _this2[key] = val;
                ++editCount;
            });
            this.clearE();
            return !!editCount;
        }
    }, {
        key: 'updateFromDoc',
        value: function updateFromDoc(doc) {
            var _this3 = this;

            if (doc) {
                if (!!doc.toJS) {
                    doc = doc.toJS();
                }
                var keys = [].concat(_toConsumableArray(new Set(Object.keys(doc).concat(Object.keys(this.toJS())))));
                keys.forEach(function (key) {
                    if (!doc[key] && key === '_id') {
                        return;
                    } else if (!!_this3[key] && !!_this3[key].updateFromDoc) {
                        _this3[key].updateFromDoc(doc[key]);
                    } else {
                        _this3[key] = doc[key] === undefined ? '' : doc[key];
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
                    if (Array.isArray(doc[key])) {
                        doc[key] = doc[key].map(function (val) {
                            if (val && !!val.toJS) {
                                return val.toJS();
                            }
                            return val;
                        });
                    }
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = __webpack_require__(12);

Object.defineProperty(exports, 'Model', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Model).default;
  }
});

var _ModelStore = __webpack_require__(3);

Object.defineProperty(exports, 'ModelStore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ModelStore).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {};

/***/ })
/******/ ]);
});
//# sourceMappingURL=mobx-pouchdb.js.map