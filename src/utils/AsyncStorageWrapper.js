var React = require('react-native');

var {
	AsyncStorage
} = React;

var StorageHelper = {
	get: function(key) {
		return AsyncStorage.getItem(key).then(function(value) {
		   if(value !== null && value.length >0){
             return(JSON.parse(value));  
           }
		});
	},

    save: function(key, value) {
		return AsyncStorage.setItem(key, JSON.stringify(value));
	},

	delete: function(key) {
		return AsyncStorage.removeItem(key);
	}, 	

	update: function(key, value) {
		return StorageHelper.get(key).then((item) => {
			value = typeof value === 'string' ? value : Object.assign({}, item, value);
			return AsyncStorage.setItem(key, JSON.stringify(value));
		});
	},
	clear: function(){
		return AsyncStorage.clear();
	}
};

module.exports = StorageHelper;