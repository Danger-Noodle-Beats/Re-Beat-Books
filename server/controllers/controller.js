const fetch = require('node-fetch');
const controller = {};
const env = require('../../.env');
const Rec = require('../models/model');
// const { locals } = require('../server');


controller.getAuthToken = async (req, res, next) => {
  console.log(env.clientID);
  console.log(env.clientSecret);
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
        res.locals.token = r.access_token;
        return next();
      });
  } catch (error) {
    return next({
      log: 'Express error handler caught error in controller.getAuthToken',
      status: 500,
      message: { err: `An error occurred in getAuthToken, ${error}` },
    });
  }

  next();
};


controller.saveRec = async (req, res, next) => {
  const { book, author, album } = req.body;
  const newRec = new Rec({
    book: book,
    author: author,
    artistName: album.artistName,
    albumName: album.albumName,
    albumArtURL: album.albumArtURL,
    spotifyURL: album.spotifyURL,
    albumURI: album.albumURI
  })
  try {
    await newRec.save();
    res.locals.savedRec = newRec;
    return next()
  } catch (err) {
    return next({
      log: 'Express error handler caught error in controller.saveRec',
      status: 500,
      message: {err: `Error occurred in saveRec, ${err}`}
    }
      
    )
  }
};


controller.getAllRecs = async (req, res, next) => {
  try {
    await Rec.find({}, (err, recs) => {
      console.log('all saved recs', recs);
      res.locals.allRecs = recs;
      return next();
    })
  }
  catch (err) {
    return next({
      log: 'Express error handler caught error in controller.getAllRecs',
      status: 500,
      message: {err: `Error occurred in getAllRecs, ${err}`}
    })
  }
}


controller.deleteRec = async (req, res, next) => {
  const targetRec = req.params.albumName
  try {
    await Rec.findOneAndDelete({ albumName: targetRec })
    return next()
   } catch (err) {
    return next({
      log: 'Express error handler caught error in controller.deleteRecs',
      status: 500,
      message: {err: `Error occurred in deleteRecs, ${err}`}
    })
  }
}





module.exports = controller;



// const bookToMusicAsync = async (searchString) => {
//   let resultFromBooks = '';
//   console.log('Trying to get book: ', searchString);
//   const searchUrl = `https://gutendex.com/books?search=${searchString}`;
//   console.log('searchUrl: ', searchUrl);
//   const bookResponse = await fetch(searchUrl);
//   const bookParsed = await bookResponse.json();
//   const listOfSubjects = [...bookParsed.results[0].subjects];
//   console.log('List of Subjects: ', listOfSubjects);
//   listOfSubjects.forEach((el) => {
//     resultFromBooks += el.split(' ')[0] + ' ';
//   });
//   console.log('Search string for Spotify: ', resultFromBooks);
//   const spotifySearchUrl = `https://api.spotify.com/v1/search?type=album&q=${resultFromBooks}`;
//   const config = {
//     headers: {
//       Authorization: 'Bearer ' + token,
//       'Content-Type': 'application/json',
//     },
//   };
//   const spotifyResponse = await fetch(spotifySearchUrl, config);
//   console.log('Spotify resonse: ', spotifyResponse);
//   const spotifyParsed = await spotifyResponse.json();
//   const artistName = '' + spotifyParsed.albums.items[0].artists[0].name;
//   const albumName = '' + '' + spotifyParsed.albums.items[0].name;
//   const albumArtURL = '' + spotifyParsed.albums.items[0].images[0].url;
//   const spotifyURL = '' + spotifyParsed.albums.items[0].external_urls.spotify;
//   const albumInfo = { artistName, albumName, albumArtURL, spotifyURL };
//   console.log('albumInfo: ', albumInfo);
//   return albumInfo;
// };

// controllers.bookToMusic = (searchString) => {
//   let resultFromBooks = '';
//   console.log('Trying to get book: ', searchString);
//   //const searchUrl = 'https://gutendex.com/books?search='+searchString;
//   const searchUrl = `https://gutendex.com/books?search=${searchString}`;
//   console.log('searchUrl: ', searchUrl);
//   fetch(searchUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       const listOfSubjects = [...data.results[0].subjects];
//       console.log('List of Subjects: ', listOfSubjects);
//       listOfSubjects.forEach((el) => {
//         resultFromBooks += el.split(' ')[0] + ' ';
//       });
//       console.log('Search string for Spotify: ', resultFromBooks);
//       //spotify fetch goees here
//       const spotifySearchUrl = `https://api.spotify.com/v1/search?type=album&q=${resultFromBooks}`;
//       fetch(spotifySearchUrl, {
//         headers: {
//           Authorization: 'Bearer ' + token,
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((response) => {
//           //console.log('Unparsed response from spotify: ',response);
//           return response.json();
//         })
//         .then((data) => {
//           //console.log('name?: ',data.albums.items[0])
//           const artistName = '' + data.albums.items[0].artists[0].name;
//           const albumName = '' + '' + data.albums.items[0].name;
//           const albumArtURL = '' + data.albums.items[0].images[0].url;
//           const spotifyURL = '' + data.albums.items[0].external_urls.spotify;
//           const albumInfo = { artistName, albumName, albumArtURL, spotifyURL };
//           console.log('albumInfo: ', albumInfo);
//           return albumInfo;
//           // artist name
//           // album name
//           // album art
//           // uri/url to album
//         })
//         .catch((err) => {
//           console.log('Error in spotify fetch: ', err);
//         });
//     })
//     .catch((err) => {
//       console.log('Error in bookGet: ', err);
//       const albumInfo = {
//         artistName: 'Could not find book.',
//         albumName: 'Sorry :(',
//         albumArtURL: 'image of sad face',
//         spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWUZ5bk6qqDSy',
//       };
//       console.log('Album Info: ', albumInfo);
//       return albumInfo;
//     });
//   //get request to the gutendex
//   //return a genre/bookshelf/search term
//   //return resultFromBooks;
// };

// controllers.bookCover = (searchString) => {
//   console.log('Trying to get book cover: ', searchString);
//   const searchUrl = `https://gutendex.com/books?search=${searchString}`;
//   console.log('searchUrl: ', searchUrl);
//   fetch(searchUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       // console.log('Book Title: ',data.results[0].title);
//       // console.log('Book Cover URL: ',data.results[0].formats['image/jpeg'])
//       const bookInfo = {
//         title: data.results[0].title,
//         url: data.results[0].formats['image/jpeg'],
//       };
//       console.log('bookInfo: ', bookInfo);
//       return bookInfo;
//     })
//     .catch((err) => {
//       console.log('Error in bookCover fetch: ', err);
//       const bookInfo = {
//         title: 'Book not found :(',
//         url: '',
//       };
//       console.log('Book Info: ', bookInfo);
//       return bookInfo;
//     });
// };
