const passport = require('passport');
const Bookmark = require('../models/bookmarkModel');
const Collection = require('../models/collectionModel');

module.exports = (app) => {

  app.get('/api/collection/all',
	  passport.authenticate('jwt', {session: false}), (req, res) => {
  	    const order = req.user.collOrder;
        Collection.find({'owner': req.user.id}, (err, collections) => {
            err
                ? res.status(400).json({message: 'Could not find collections'})
                : res.status(200).json({collections: collections, order: order});
        });
  });

  app.post('/api/collection/create',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      Collection.create(
        {
            owner: req.user.id,
            title: req.body.title,
            sequence: req.body.sequence
        }, (err, collection) =>
          err
            ? res.status(400).json({message: 'Could not create collection', success: false})
            : res.status(201).json({collection: collection, success: true})
      );
    });

  app.post('/api/collection/delete/:id', (req, res) => {
    passport.authenticate('jwt', {session: false}),
      Collection.findByIdAndDelete(req.params.id, err =>
        err
          ? res.status(400).json({message: 'Could not delete collection', success: false})
          : res.status(200).json({message: 'Collection deleted', success: true})
      );
  });

  app.post('/api/collection/update/:id',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      Collection.findByIdAndUpdate(req.params.id, {title: req.body.title}, err =>
        err
          ? res.status(400).json({message: 'Could not update collection', success: false})
          : res.status(200).json({title: req.body.title, success: true})
      );
    });


  app.post('/api/collection/collapse/:id',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      Collection.findByIdAndUpdate(req.params.id, {vis: req.body.vis}, err =>
        err
          ? res.status(400).json({message: 'Error updating collapse state', success: false})
          : res.status(200).json({message: 'Successfully updated collapse sate', success: true})
      );
    });

  app.post('/api/bookmark/create',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      const newBookmark = new Bookmark({
        title: req.body.title,
        url: req.body.url,
        parentId: req.body.parentId,
        addDate: new Date()
      });
      Collection.findByIdAndUpdate(req.body.parentId, {$push: {bookmarks: newBookmark}}, {new: true}, (err, collection) =>
        err
          ? res.status(400).json({message: 'Could not add bookmark', success: false})
          : res.status(201).json({bookmarks: collection.bookmarks, success: true})
      );
    });

  app.post('/api/bookmark/update',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      Collection.findOneAndUpdate({'_id': req.body.parentId, 'bookmarks.addDate': req.body.addDate}, {
        $set: {
          'bookmarks.$.title': req.body.title,
          'bookmarks.$.url': req.body.url
        }
      }, err =>
          err
            ? res.status(400).json({message: 'Could not update bookmark', success: false})
            : res.status(200).json({message: 'Bookmark successfully updated,', success: true})
      );
    });

  app.post('/api/bookmark/fave',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      Collection.findOneAndUpdate({'_id': req.body.parentId, 'bookmarks.addDate': req.body.addDate}, {
        $set: {
          'bookmarks.$.fave': req.body.fave
        }
      }, err =>
          err
            ? res.status(400).json({message: 'Could not update favorite state', success: false})
            : res.status(200).json({message: 'Successfully updated bookmark!', success: true})
      );
    });

  app.post('/api/bookmark/delete',
    passport.authenticate('jwt', {session: false}), (req, res) => {
      Collection.findOneAndUpdate({'_id': req.body.parentId}, {
        $pull: {
          'bookmarks': {'addDate': req.body.addDate}
        }
      }, err =>
          err
            ? res.status(400).json({message: 'Could not delete bookmark', success: false})
            : res.status(200).json({message: 'Bookmark successfully deleted', success: true})
      );
    });
};