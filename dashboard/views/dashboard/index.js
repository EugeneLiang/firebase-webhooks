var Firebase = require('firebase')
var firebase = require('../../firebase')

var events = require('./firebase-events')

function hooksRef () {
	var auth = firebase.getAuth()
	return firebase.child('hooks').child(auth.uid)
}

module.exports = {
	template: require('./dashboard.html'),
	data: function () {
		return {
			hooks: null,
			events: events,
			// init form fields
			ref: null,
			token: null,
			event: events[0],
			url: null
		}
	},
	methods: {
		add: function (event) {
			event.preventDefault()

			hooksRef().push({
				ref: this.ref,
				token: this.token && this.token !== '' ? this.token : null,
				event: this.event,
				url: this.url,
				created_at: Firebase.ServerValue.TIMESTAMP
			}, function (err) {
				if (err) console.error('Could not add hook:', err)
			})

			this.ref = null
			this.token = null
			this.url = null
		}
	},
	created: function () {
		var auth = firebase.getAuth()

		hooksRef().on('value', function (snapshot) {
			this.hooks = snapshot.val()
		}, function (err) {
			console.error('Could not get hooks:', err)
		}, this)
	}
}