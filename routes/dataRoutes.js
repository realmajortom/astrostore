// flex
const passport = require('passport');
const Bookmark = require('../models/bookmarkModel');
const Collection = require('../models/collectionModel');

module.exports = (app) => {

  app.get('/api/collection/all',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.find({'owner': req.user.id}, (err, collections) => {
        if (err) {
          res.send({message: 'Could not find collections'});
        } else {
          res.json(collections);
        };
      });
    });

  app.post('/api/collection/create',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.create(
        {
          owner: req.user.id,
          collectionTitle: req.body.collectionTitle
        }, (err, collection) =>
          err
            ? res.status(400).send({message: 'Could not create collection', success: false})
            : res.status(201).send({collection: collection, success: true})
      );
    });

  app.post('/api/collection/delete/:id', (req, res) => {
    passport.authenticate('jwt', {session: false}),
      Collection.findByIdAndDelete(req.params.id, err =>
        err
          ? res.status(400).send({message: 'Could not delete collection', success: false})
          : res.status(200).json({message: 'Collection deleted', success: true})
      );
  });

  app.post('/api/collection/update/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.findByIdAndUpdate(req.params.id, {collectionTitle: req.body.title}, err =>
        err
          ? res.status(400).send({message: 'Could not update collection', success: false})
          : res.status(200).send({title: req.body.title, success: true})
      );
    });

  app.post('/api/collection/collapse/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.findByIdAndUpdate(req.params.id, {isVis: req.body.isVis}, err =>
        err
          ? res.status(400).send({message: 'Error updating collapse state', success: false})
          : res.status(200).send({message: 'Successfully updated collapse sate', success: true})
      );
    });

  app.post('/api/bookmark/create',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      const newBookmark = new Bookmark({
        bookmarkTitle: req.body.bookmarkTitle,
        bookmarkUrl: req.body.bookmarkUrl,
        parentId: req.body.parentId,
        bookmarkMakeDate: new Date()
      });
      Collection.findByIdAndUpdate(req.body.parentId, {$push: {bookmarks: newBookmark}}, {new: true}, (err, collection) =>
        err
          ? res.status(400).send({message: 'Could not add bookmark', success: false})
          : res.status(201).json({bookmarks: collection.bookmarks, success: true})
      );
    });

  app.post('/api/bookmark/update',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.findOneAndUpdate({'_id': req.body.p, 'bookmarks.bookmarkMakeDate': req.body.d}, {
        $set: {
          'bookmarks.$.bookmarkTitle': req.body.t,
          'bookmarks.$.bookmarkUrl': req.body.u
        }
      }, err =>
          err
            ? res.status(400).send({message: 'Could not update bookmark', success: false})
            : res.status(200).json({message: 'Bookmark successfully updated,', success: true})
      );
    });

  app.post('/api/bookmark/fav',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.findOneAndUpdate({'_id': req.body.p, 'bookmarks.bookmarkMakeDate': req.body.d}, {
        $set: {
          'bookmarks.$.bookmarkFav': req.body.f
        }
      }, err =>
          err
            ? res.status(400).send({message: 'Could not update favorite state', success: false})
            : res.status(200).json({message: 'Succesfully updated bookmark!', success: true})
      );
    });

  app.post('/api/bookmark/delete',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Collection.findOneAndUpdate({'_id': req.body.parentId}, {
        $pull: {
          'bookmarks': {'bookmarkMakeDate': req.body.bookmarkMakeDate}
        }
      }, err =>
          err
            ? res.status(400).send({message: 'Could not delete bookmark', success: false})
            : res.status(200).json({message: 'Bookmark succesfully deleted', success: true})
      );
    });
};