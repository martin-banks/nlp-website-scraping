const fs = require('fs')
const path = require('path')
const blacklist = require('../app/blacklist')

const dataStore = path.join(__dirname, '../data_store')
const session = id => path.join(dataStore, `${id}/session.json`)

function readSession(sessionId, res) {
	fs.readFile(session(sessionId), (fileErr, data) => {
		if (fileErr) {
			res.send(`id not found,\n ${fileErr}`)
			return console.log(fileErr)
		}
		const d = JSON.parse(data)
		const topNames = Object.keys(d)
			.map(key => {
				const newItem = d[key]
				newItem.name = key
				return newItem
			})
			.sort((a, b) => b.count - a.count)
		res.render('topNames', { topNames, session: sessionId })
	})
}
function newestFirst(a, b) {
	return parseInt(b.split('__').join(''), 10) - parseInt(a.split('__').join(''), 10)
}
function notInBlacklist(item) {
	return item !== '.DS_Store'
}

exports.lastSession = (req, res) => {
	fs.readdir(dataStore, (dirErr, dirData) => {
		if (dirErr) return console.log(dirErr)
		const ordered = dirData
			.filter(notInBlacklist)
			.sort(newestFirst)
		readSession(ordered[0], res)
	})
}

exports.sessionList = (req, res) => {
	fs.readdir(dataStore, (err, data) => {
		if (err) return console.log(err)
		const sessions = data
			.filter(notInBlacklist)
			.sort(newestFirst)
		res.render('sessions', { sessions })
	})
}

exports.getSession = (req, res) => {
	readSession(req.params.id, res)
	console.log('params', req.params)
}
