import DS from 'ember-data';

var pluralize = function(word) {
  return Ember.Inflector.inflector.pluralize(word);
};

export default DS.RESTAdapter.extend({
  init: function() {
    db.open( {
      server: 'uhura',
      version: 1,
      schema: {
        subscriptions: {
          key: { keyPath: 'id' , autoIncrement: true },
          indexes: {
          }
        },
        channels: {
          key: { keyPath: 'id' , autoIncrement: true },
          indexes: {
          }
        },
        episodes: {
          key: { keyPath: 'id' , autoIncrement: true },
          indexes: {
          }
        },
      }
    } ).then(  ( s ) => {
      this.server = s;
    } );
  },
  findAll: function (store, type, sinceToken) {
    return this.__callSuper(this._super, store, type, sinceToken)
  },
  find: function (store, type, id, record) {
    return this.__callSuper(this._super, store, type, id, record)
  },
  __callSuper: function() {
    var options = Array.prototype.slice.call(arguments);
    var superFn = options.shift();


    return superFn.apply(this, options).then( data => {
      this.__saveOffline(data);
      return data;
    });

  },
  __saveOffline: function(data) {
    for (var table in data) {
      console.log(table, data )
      Ember.makeArray(data[table]).forEach((record) => {
        this.server[ pluralize(table) ].update(record);
      });
    }
  }
});