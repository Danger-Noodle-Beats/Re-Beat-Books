const fetch = require('node-fetch');
const env = require('../../.env');
const models = require('../models/model');
// const { locals } = require('../server');
const { Rec } = models;

const controller = {};

let tokenMadeAt;
let token;
controller.getAuthToken = async (req, res, next) => {
	console.log(env.clientID);
	console.log(env.clientSecret);
	const currentDate = new Date();
	const timeToRefresh = 3.5 * 10 ** 6;
	if (!tokenMadeAt || tokenMadeAt - currentDate < timeToRefresh) {
		try {
			await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				body:
					'grant_type=client_credentials&client_id=' +
					env.clientID +
					'&client_secret=' +
					env.clientSecret,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
				.then((r) => r.json())
				.then((r) => {
					// console.log(r.access_token);
					tokenMadeAt = new Date();
					token = r.access_token;
					res.locals.token = r.access_token;
					return next();
				});
		} catch (err) {
			return next({
				log: 'Express error handler caught error in controller.getAuthToken',
				status: 500,
				message: { err: `An error occurred in getAuthToken, ${err}` },
			});
		}
	}
	res.locals.token = token;
	next();
};
controller.getGutenAPI = async (req, res, next) => {
	try {
		const { searchString } = req.body;
		// let resultFromBooks = '';
		console.log('Trying to get book: ', searchString);
		const searchUrl = `https://gutendex.com/books?search=${searchString}`; // fetching guten API
		console.log('searchUrl: ', searchUrl);
		const bookResponse = await fetch(searchUrl); // setting data into bookResponse
		const bookParsed = await bookResponse.json();
		const listOfSubjects = [...bookParsed.results[0].subjects];
		console.log('List of Subjects: ', listOfSubjects);
		// setSubjects(listOfSubjects);
		res.locals.listOfSubjects = listOfSubjects;
		return next();
	} catch (err) {
		return next({
			log: 'Express error handler caught error in controller.getGutenAPI',
			status: 500,
			message: { err: `An error occurred in getGutenAPI, ${err}` },
		});
	}
};
controller.getSpotAPI = async (req, res, next) => {
	const { resultFromBooks, token } = req.body;
	try {
		const spotifySearchUrl = `https://api.spotify.com/v1/search?type=album&q=${resultFromBooks}`;
		const config = {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
		};
		const spotifyResponse = await fetch(spotifySearchUrl, config);
		console.log('Spotify resonse: ', spotifyResponse);
		const spotifyParsed = await spotifyResponse.json();
		// assigning responses from spotifyAPI to spotifyParse veriable
		const albums = [];
		for (let i = 0; i < spotifyParsed.albums.items.length; i++) {
			const artistName = '' + spotifyParsed.albums.items[i].artists[0].name;
			const albumName = '' + '' + spotifyParsed.albums.items[i].name;
			const albumURI = '' + '' + spotifyParsed.albums.items[i].uri.slice(14);
			const albumArtURL = '' + spotifyParsed.albums.items[i].images[0].url;
			const spotifyURL =
				'' + spotifyParsed.albums.items[i].external_urls.spotify;
			const albumInfo = {
				artistName,
				albumName,
				albumArtURL,
				spotifyURL,
				albumURI,
			};
			albums.push(albumInfo);
		}
		res.locals.albums = albums;
		return next();
	} catch (err) {
		return next({
			log: 'Express error handler caught error in controller.getGutenAPI',
			status: 500,
			message: { err: `An error occurred in getGutenAPI, ${err}` },
		});
	}
};

controller.saveRec = async (req, res, next) => {
	const { book, author } = req.body;
	const album = req.body.currentAlbum;
	console.log(req.body);
	try {
		// await newRec.save();
		Rec.create(
			{
				book: book,
				author: author,
				artistName: album.artistName,
				albumName: album.albumName,
				albumArtURL: album.albumArtURL,
				spotifyURL: album.spotifyURL,
				albumURI: album.albumURI,
			},
			(err, newRec) => {
				console.log('saved Rec: ', newRec);
				res.locals.savedRec = newRec;
				return next();
			},
		);
	} catch (err) {
		return next({
			log: 'Express error handler caught error in controller.saveRec',
			status: 500,
			message: { err: `Error occurred in saveRec, ${err}` },
		});
	}
};

controller.getAllRecs = (req, res, next) => {
	try {
		Rec.find({}, (err, recs) => {
			// console.log('all saved recs', recs);
			res.locals.allRecs = recs;
			return next();
		});
	} catch (err) {
		return next({
			log: 'Express error handler caught error in controller.getAllRecs',
			status: 500,
			message: { err: `Error occurred in getAllRecs, ${err}` },
		});
	}
};

controller.deleteRec = async (req, res, next) => {
	console.log(req.params.albumName);
	const targetRec = req.params.albumName;
	try {
		await Rec.findOneAndDelete({ albumName: targetRec });
		return next();
	} catch (err) {
		return next({
			log: 'Express error handler caught error in controller.deleteRecs',
			status: 500,
			message: { err: `Error occurred in deleteRecs, ${err}` },
		});
	}
};

module.exports = controller;
