const express = require('express');
const router = express.Router();
const passport = require('passport');
const Bookmark = require('../models/bookmarkModel');
const Collection = require('../models/collectionModel');

require('../security/auth');
router.use(passport.initialize());


router.get('/api/collection/all',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    const order = req.user.collOrder;
    Collection.find({'owner': req.user.id}, (err, collections) => {
      err
        ? res.json({message: 'Could not find collections'})
        : res.json({collections: collections, order: order});
    });
  });

router.post('/api/collection/create',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    Collection.create(
      {
        owner: req.user.id,
        title: req.body.title,
        sequence: req.body.sequence
      }, (err, collection) =>
      err
        ? res.json({message: 'Could not create collection', success: false})
        : res.json({collection: collection, success: true})
    );
  });

router.post('/api/collection/delete/:id', (req, res) => {
  passport.authenticate('jwt', {session: false}),
    Collection.findByIdAndDelete(req.params.id, err =>
      err
        ? res.json({message: 'Could not delete collection', success: false})
        : res.json({message: 'Collection deleted', success: true})
    );
});

router.post('/api/collection/update/:id',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    Collection.findByIdAndUpdate(req.params.id, {title: req.body.title}, err =>
      err
        ? res.json({message: 'Could not update collection', success: false})
        : res.json({title: req.body.title, success: true})
    );
  });


router.post('/api/collection/collapse/:id',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    Collection.findByIdAndUpdate(req.params.id, {vis: req.body.vis}, err =>
      err
        ? res.json({message: 'Error updating collapse state', success: false})
        : res.json({message: 'Successfully updated collapse sate', success: true})
    );
  });

router.post('/api/bookmark/create',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    const newBookmark = new Bookmark({
      title: req.body.title,
      url: req.body.url,
      parentId: req.body.parentId,
      addDate: new Date()
    });
    Collection.findByIdAndUpdate(req.body.parentId, {$push: {bookmarks: newBookmark}}, {new: true}, (err, collection) =>
      err
        ? res.json({message: 'Could not add bookmark', success: false})
        : res.json({bookmarks: collection.bookmarks, success: true})
    );
  });

router.post('/api/bookmark/update',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    Collection.findOneAndUpdate({'_id': req.body.parentId, 'bookmarks.addDate': req.body.addDate}, {
      $set: {
        'bookmarks.$.title': req.body.title,
        'bookmarks.$.url': req.body.url
      }
    }, err =>
      err
        ? res.json({message: 'Could not update bookmark', success: false})
        : res.json({message: 'Bookmark successfully updated,', success: true})
    );
  });

router.post('/api/bookmark/fave',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    Collection.findOneAndUpdate({'_id': req.body.parentId, 'bookmarks.addDate': req.body.addDate}, {
      $set: {
        'bookmarks.$.fave': req.body.fave
      }
    }, err =>
      err
        ? res.json({message: 'Could not update favorite state', success: false})
        : res.json({message: 'Successfully updated bookmark!', success: true})
    );
  });

router.post('/api/bookmark/delete',
  passport.authenticate('jwt', {session: false}), (req, res) => {
    Collection.findOneAndUpdate({'_id': req.body.parentId}, {
      $pull: {
        'bookmarks': {'addDate': req.body.addDate}
      }
    }, err =>
      err
        ? res.json({message: 'Could not delete bookmark', success: false})
        : res.json({message: 'Bookmark successfully deleted', success: true})
    );
});


module.exports = router;