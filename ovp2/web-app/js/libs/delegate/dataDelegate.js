/*
 * COPYRIGHT 2014.  ALL RIGHTS RESERVED.  THIS MODULE CONTAINS
 * TIME WARNER CABLE CONFIDENTIAL AND PROPRIETARY INFORMATION.
 * THE INFORMATION CONTAINED HEREIN IS GOVERNED BY LICENSE AND
 * SHALL NOT BE DISTRIBUTED OR COPIED WITHOUT WRITTEN PERMISSION
 * FROM TIME WARNER CABLE.
 */

define(function (require, exports, module) {
    'use strict';

    /**
     * DataDelegates are defined using {@see DelegateDefinition} to build a custom Delegate prototype.
     * {@see DelegateDefinition} also acts as a factory for creating {@see DataDelegate} instances.
     *
     * {@see DelegateDefinition} are initialized or later installed with {@see AttributeGetters} which define
     * the operation of the data delegate.  Once initialized, this data definition should be cached, because the process
     * of creating the DataDelegate prototype involves many calls to Object.defineProperties, which is a known
     * Javascript bottleneck.  However, once the prototype is configured, new {@see DataDelegate} instances can be
     * created with the usual speed of creating a Javascript object.
     *
     * @usage
     * var Model = Backbone.Model.extend({
     *   initialize: function () {
     *     this._delegate = modelDelegateDefinition.createInstance(function () {
     *       return this.attributes;
     *    }.bind(this), this);
     *   }
     * });
     *
     * // Create the DelegateDefinition
     * var modelDelegateDefinition = new DelegateDefinition(
     *   DelegateDefintion.install({
     *     'foo': {
     *       '_mutator': function (data) {
     *         return data.foo;
     *       },
     *       'bar': DelegateDefinition.install(function (data) {
     *         return '<<' + data.bar + '>>;
     *       }).withName('getFoo').cached()
     *     }
     *   })
     *   .toPrototype(Model.prototype)
     *   .getters());
     *
     * // This method must be installed on model in order to toPrototype installation of accessor methods to work
     * Model.prototype.get = function (key) {
     *   return selectn(key, this._delegate);
     * }
     *
     * // Delegate JSONification to the delegate
     * Model.prototype.toJSON = function () {
     *   return this._delegate;
     * };
     *
     * var model = new Model({
     *   'foo': {
     *     'bar': 'foobar'
     *   }
     * });
     * model.getFoo();
     *  => returns '<<foobar>>';
     *
     *  JSON.stringify(model); // The DataDelegate defines the JSON interface of the model
     *   => returns '{"foo":{"bar":"<<foobar>>"}}'
     */


    /**
     * AttributeGetters is an object used by DataDelegate to define a functional mapping between backing data and a custom
     * view of the backing data.
     *
     * FORM
     * ------------------------------------------------------------------------------------------------------------------
     * AttributeGetters consist of functions, or objects of functions.  AttributeGetters can be composited from other
     * AttributeGetters creating a multi-level hierarchy of functions.  The hierarchy of keys existing in the
     * AttributeGetters object define a key path for retrieving data.  The "leaf" functions define what data is returned
     * by that key path.
     *
     * MUTATORS
     * ------------------------------------------------------------------------------------------------------------------
     * Additionally, objects withing the AttributeGetters definition can specify a `_mutator` method.  This method has a
     * special meaning because it will not be exposted as an available key path.  Instead, the `_mutator` method is
     * responsible for transforming an input to an output and is used to create "smart" key paths which map to specific
     * business rules or application needs.
     *
     * When an object in an AttributesGetters definition contains a `_mutator` method, that method will be called before
     * iterating any further.  The `_mutator` method will be called with the current data.  The `_mutator` method is
     * expected to return some data (which could be the same or most likely entirely different than the passed in data).
     * When traversing further down the key path, the data returned by the `_mutator` method will be passed into children
     * attribute getters.  If a `_mutator` method exists downstream from another `_mutator` then the second mutator will
     * be called with the data mutated from the first mutator.
     *
     *
     * EXAMPLE
     * ------------------------------------------------------------------------------------------------------------------
     * var attributeGetter = {
     *  'foo': {
     *    '_mutator': function (data) {
     *       // return the foo from data.
     *        return data && data.foo || 'foo';
     *     },
     *     'bar': {
     *       '_mutator': function (foo) {
     *          // expect, foo data to be mutated from foo._mutator
     *          return foo + 'bar';
     *       },
     *       'description': function (context) {
     *          return context;
     *       }
     *     }
     *   }
     * };
     *
     * If a DataDelegate is installed with the above example as it's attribute getter, then accessing
     * 'foo.bar.description' will return 'foobar'.  If the an object { foo: 'sweet' } is installed as the backing data,
     * then accessing 'foo.bar.description' will return 'sweetbar'.
     *
     * @typedef {Object} AttributeGetters
     */

    var is = require('object/is');
    var selectn = require('selectn');
    var _ = require('_');
    var Options = require('object/options');

    /**
     * Helper method for generating delegate prototypes
     *
     * @param {Object} getter Defines the delegate
     * @param {Object} prototype The prototype of the Delegate to extend
     * @param {Object} instance The instance of delegate
     */
    var layerData = function (getter, prototype, parentDefinition) {

        /**
         * Locate the root context object of a delegate.  Walks up the delegate chain to find a suitable `this` for delegate getters
         *
         * @param {Object} current
         * @returns {Object}
         */
        var locateRoot = function (current) {
            if (current instanceof DataDelegate && current._context.parent != current) {
                return locateRoot(current._context.parent);
            } else {
                return current;
            }
        };

        // Extend the prototype based on the delegate getter definition
        Object.defineProperties(prototype, Object.keys(_.extend({}, getter))
            // Don't include "_mutator" keys, they are handled specially
            .filter(noMetaFilter)
            // This method will create property descriptor
            .reduce(function (propertyDescriptor, handleKey) {
                var thisGetter = getter[handleKey];

                // Create a data accessor which will go through the mutator, if necessary
                var getData = (function () {
                    var dataFromContext = function (context) {
                        if (is.function(context.data)) {
                            return context.data();
                        }
                        return context.data;
                    };

                    if (is.string(getter._mutator)) {
                        getter._mutator = DelegateDefiner.getter(getter._mutator);
                    }

                    return is.function(getter._mutator) ? function () {
                        // mutator accessor
                        return getter._mutator.call(locateRoot(this), dataFromContext(this._context));
                    } : function () {
                        // non-mutated data accessor
                        return dataFromContext(this._context);
                    };
                }());

                // Do some helpful conversions for user
                if (is.string(thisGetter)) {
                    thisGetter = DelegateDefiner.getter(thisGetter);
                }

                // Check if this getter field is a function, if so then create a basic property accessor
                if (is.function(thisGetter)) {
                    propertyDescriptor[handleKey] = {
                        get: function () {
                            // Find the root DataDelegate this
                            var context = locateRoot(this);
                            // The Backing data
                            var data = getData.call(this);
                            // Delegate access to getter
                            return thisGetter.call(context, data);

                        },
                        enumerable: true,
                        configurable: true
                    };
                } else if (is.object(thisGetter)) { // When we find an object, we will create a sub-delegate
                    // Create the Sub-delegate definition
                    var delegateDefiner = new DelegateDefiner(thisGetter);
                    // This property will create sub-delegates as necessary
                    propertyDescriptor[handleKey] = {
                        get: function () {
                            return delegateDefiner.createInstance(getData.call(this), this);
                        },
                        enumerable: true,
                        configurable: true
                    }
                }

                return propertyDescriptor;
            }, {}));
    };

    /**
     * Filter for removing meta fields from getter objects
     * @param i
     * @returns {boolean}
     */
    var noMetaFilter = function (i) { return i !== '_mutator' };

    /**
     * DelegateDefiner owns a Delegate's prototype and is used to define the operation of the DataDelegate
     *
     * @class
     * @param {Object} [getters] The getters definition for the delegate.  Can also be set later with `installGetter`
     */
    var DelegateDefiner = module.exports = function (getters, ParentDelegate, parentDefinition) {
        ParentDelegate = ParentDelegate || DataDelegate;
        this._ParentDelegate = ParentDelegate;
        this.Delegate = function () {
            ParentDelegate.apply(this, arguments);
        };
        this.Delegate.prototype = Object.create(ParentDelegate.prototype);
        this.Delegate.prototype.constructor = ParentDelegate;
        this.installGetter(getters, parentDefinition);
    };

    _(DelegateDefiner.prototype).extend(/** @lends DelegateDefiner.prototype */{
        /**
         * Extend the definition of the Delegate prototype of objects returned by {@see DelegateDefiner#createInstance}
         * @param getter
         */
        installGetter: function (getter, parentDefinition) {
            if (getter) {
                this.getter = getter;
                layerData(getter, this.Delegate.prototype, parentDefinition);
            }
        },
        /**
         * Create a new instance of the Delegate with a defined data and parent
         * @param {Object} [attributes]   the backing data
         * @param {Object} [parent] the object which owns this delegate
         * @returns {Delegate}
         */
        createInstance: function (attributes, parent) {
            var Delegate = this.Delegate;
            return new Delegate(attributes, parent);
        },
        extend: function (getters, proto) {
            var combinedGetters = DelegateDefiner.install(this.getter).extend(getters);
            if (_.isObject(proto)) {
                combinedGetters.toPrototype(proto);
            }
            return new DelegateDefiner(combinedGetters.getters(), this.Delegate, this);
        }
    });


    /**
     * In order to make the delegate look a pure JSON object, declare all non-data fields should be declared as
     * non-enumerable.  In order to facilitate that, this method will return the PropertyDescriptor of hidden, locked
     * property
     */
    function hiddenLockedValue(value) {
        return {
            enumerable: false,
            writable: false,
            configurable: false,
            value: value
        };
    }

    /**
     * Transforms an object of values into a Object.defineProperties PropertyDescriptor
     *
     * input: { foo: function () { return 'bar'; } }
     * returns: {
    *   foo: {
    *     enumerable: false,
    *     writable: false,
    *     configurable: false,
    *     value: function () { return 'bar'; }
    *   }
    * };
     *
     * Which, as you can see, saves a lot on typing
     */
    function withHiddenLockedProperties(propertyDescriptor) {
        return Object.keys(propertyDescriptor).reduce(function (newDescriptor, key) {
            newDescriptor[key] = hiddenLockedValue(propertyDescriptor[key]);
            return newDescriptor;
        }, {})
    }

    /**
     * The Data Delegate.  Maps getter methods to JSON data
     * @param {function|Object} attributes The backing data or a function to retrieve the backing data
     * @param {Object} parent The object which owns this delegate (either another delegate or a model)
     * @constructor
     */
    var DataDelegate = function (attributes, parent) {
        // Hide this._context from toJSON()
        this._context = {};
        this._context.parent = parent || this;
        this.installData(attributes);
    };

    Object.defineProperties(DataDelegate.prototype, withHiddenLockedProperties(/** @lends DataDelegate.prototype */{
        /**
         * Install backing data
         * @param data
         */
        installData: function (data) {
            this._context.data = data;
        },
        /**
         * Returns the backing data.  Use with caution.
         *
         * @returns {*}
         */
        getData: function () {
            if (is.function(this._context.data)) {
                return this._context.data();
            }
            return this._context.data;
        },
        /**
         * Allows JSON.stringify to return the data on the prototype
         * @returns {Object}
         */
        toJSON: function () {
            // Grabs that delegate properties on the prototype (from this) and omits the private context
            return _({}).chain().extend(this).omit('_context').value();
        }
    }));

    /**
     * Helper method to walk an object's keys recursively and act on each one
     * @param {function} callback
     * @returns {function}
     */
    var walk = function (callback) {
        var appendKey = function (keyPath, key) {
            if (keyPath === "") {
                return key;
            }
            return keyPath + "." + key;
        };
        var recurse = function (getter, mirror, keyPath) {
            keyPath = keyPath || "";
            for (var key in getter) {
                var value = getter[key];
                if (is.function(value)) {
                    callback(value, getter, appendKey(keyPath, key), key, mirror);
                } else if (is.object(value)) {
                    if (mirror) {
                        if (_.isUndefined(mirror[key]) || _.isNull(mirror[key])) {
                            mirror[key] = {};
                        }
                    }
                    recurse(value, mirror ? mirror[key] : null, appendKey(keyPath, key));
                }
            }
        };
        return recurse;
    };


    var mixInDelegateGetterBuilder = function (func) {
        func.withName = function (name) {
            func.accessor = name;
            return func;
        };
        func.cached = function () {
            func._cached = true;
            return func;
        };
        return func;
    };

    /**
     * Helper method for creating attribute getter functions with getter functions to install to a prototype
     *
     * When creating an attributes getter object, instead of passing in a function, use this method to create a function
     * with meta-data which can be used to generate accessor functions for a prototype
     *
     * @usage Delegate.getter('details.title').withName('getTitle').cached() // automatically generates both the delegate and the public accessor
     * @usage Delegate.getter({ getter: function () { return // ..custom getter }, accessor: function (data) { return data.foo; }})
     * @usage Delegate.getter({ accessor: 'getFoo', getter: function (data) { return data.foo; }})
     * @usage Delegate.getter('foo').withName('getFoo');
     * @usage Delegate.getter('foo').withName('getFoo').cached()
     * @param options
     * @returns {*}
     */
    DelegateDefiner.getter = function (options) {
        if (is.function(options)) {
            // Function parameter, use the passed in function as the getter delegate
            return mixInDelegateGetterBuilder(options);
        } else if (is.object(options)) {
            // Options object style getter
            options = Options.for(options);
            var func = options.expect('getter');
            func.accessor = options.get('accessor');
            return mixInDelegateGetterBuilder(func);
        } else if (is.string(options)) {
            // Automatically generated getter using selectn
            var keyPath = options;
            return mixInDelegateGetterBuilder(function (data) {
                return selectn(keyPath, data);
            });
        } else {
            throw new Error('Unsupported argument ' + options.toString())
        }

    };

    /**
     * Create a mutator attribute for a Delegate attributes getter with an associated setter for controlling the
     * state of the mutator.  The setter is installed on the prototype of an object.
     *
     * @param {Object} options
     * @param {Object} options.attributes The attributes for this mutator
     * @param {function) options.setter The associated setter function for the mutator
    * @returns {*}
     */
    DelegateDefiner.setter = function (options) {
        options = Options.for(options);
        var mutator = options.get('mutator') || {};
        var attributes = options.expect('attributes');
        var setter = options.get('setter');
        attributes._mutator.setter = setter;
        return attributes;
    };

    /**
     * Creates a builder for creating helper methods for Delegates.
     *
     * @param {Object} [getters]
     * @returns {builder}
     */
    DelegateDefiner.install = function (getters) {

        getters = getters || {};
        var alwaysCached = false;
        var provider = function (keyPath) {
            return this.get(keyPath);
        };

        /**
         * Return the Default getter method for attribute getters
         * @param {String} keyPath
         * @returns {Function}
         */
        var keyPathGetter = function (keyPath, cached) {
            /**
             * The default getter method for attribute getters
             */
            var defaultKeyPathGetter =  cached ? function () {
                this._cachedValue = this._cachedValue || {};
                if (!Object.hasOwnProperty(this._cachedValue, keyPath)) {
                    this._cachedValue[keyPath] = provider.call(this, keyPath);
                }
                return this._cachedValue[keyPath];
            } : function () {
                return provider.call(this, keyPath);
            };
            // This is used to mark the anonymous function, above as the default
            defaultKeyPathGetter._dataDelegateDefaultGetter = true;

            return defaultKeyPathGetter;
        };

        /**
         * @type {builder}
         */
        var builder = {
            /**
             * Extend the
             * @param {Object} definition
             * @returns {builder}
             */
            extend: function (definition) {
                // To support complex use cases, we will walk both objects and perform a deep-merge.  The original getter
                //  being extended is not modified.  The definition passed in will inherit all elements from base not present

                walk(function (value, getter, keyPath, key, mirror) {
                    if (_.isUndefined(mirror[key]) || _.isNull(mirror[key])) {
                        mirror[key] = value;
                    }
                })(getters, definition);

                // Since definition now contains the merged object, assign getters to the new merged object
                getters = definition;

                return builder;
            },

            /**
             * Turns on caching for all getters
             * @returns {builder}
             */
            defaultCached: function () {
                alwaysCached = true;
                return builder;
            },

            /**
             * Provider a custom provider method for API access, defaults to:
             *    return this.get(key);
             *
             * @param {function} funcProvider
             */
            withProvider: function (funcProvider) {
                provider = funcProvider;
            },

            /**
             * Installs getter/setter methods on to the passed in prototype.  For performance reasons, never install to an
             * object.  Always install to a prototype and create new objects from that prototype's constructor.
             *
             * @param {Object} proto The prototype to extend with accessors and mutators defined by the dataDelegate
             * @returns {builder}
             */
            toPrototype: function (proto) {
                // Walk the attribute getters
                walk(function (value, getter, keyPath, key) {
                    // Only look at valid values
                    if (!is.undefined(value) && is.function(value)) {
                        // For mutator attribute getters, look for a setter
                        if (key == '_mutator') {
                            if (is.function(value.setter)) {
                                if (!is.string(value.setter.name)) {
                                    throw new Error('Custom attribute setter functions must be named: '
                                        + value.accessor.toString()
                                        + '\nTry using function setMyProperty() { ... } instead');
                                }

                                // Assign the custom setter
                                proto[value.setter.name] = value.setter;
                            } else if (is.object(value.setter)) {
                                Object.keys(value.setter).forEach(function (key) {
                                    // Assign the custom setter, but only if it does not already exist on the prototype chain
                                    if (proto[key] !== value.setter[key]) {
                                        proto[key] = value.setter[key];
                                    }
                                });
                            }
                        } else { // For all else, treat as a getter
                            // If accessor is a string, use default getter with the name of the string
                            if (is.string(value.accessor)) {

                                // Assign the default getter using the provided name, but only if it does not already exist on the prototype chain
                                if (!(proto[value.accessor] && proto[value.accessor]._dataDelegateDefaultGetter)) {
                                    proto[value.accessor] = keyPathGetter(keyPath, value._cached || alwaysCached);
                                }

                            } else if (is.function(value.accessor)) { // Else treat as a custom getter method
                                // First, check of we have a named function (we only support named functions)
                                if (!is.string(value.accessor.name)) {
                                    throw new Error('Custom attribute getter functions must be named: '
                                        + value.accessor.toString()
                                        + '\nTry using function getMyProperty() { ... } instead');
                                }

                                // Assign the custom getter, but only if it does not already exist on the prototype chain
                                if (proto[value.accessor.name] !== value.accessor) {
                                    proto[value.accessor.name] = value.accessor;
                                }
                            }
                        }

                    }
                })(getters); // Parse the attributes object using the walk function, above

                return builder;
            },
            /**
             * Ready to create a DelegateDefinition, which can be used as a factory for DataDelegates
             *
             * @returns {DelegateDefiner}
             */
            define: function () {
                return new DelegateDefiner(getters);
            },
            /**
             * The attributes getter object wrapped by this builder
             * @returns {Object}
             */
            getters: function () {
                return getters;
            }
        };

        return builder;
    };

});
