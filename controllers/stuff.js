const Thing = require("../models/Thing");
const fs = require("fs");
const { error } = require("console");

// exports.createThing = (req, res, next) => {
//     delete req.body._id;
//     const thing = new Thing({
//         ...req.body
//     });
//     thing.save()
//     .then(() => res.status(201).json({ message: "Objet enregistré!" }))
//     .catch(error => res.status(400).json({error}));
// };

exports.createThing = (req, res, next) => {
    console.log(req.body);
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(thing);
    thing.save()
    .then(() => res.status(201).json({ message: "Objet enregistré!" }))
    .catch(error => res.status(400).json({ error }));
};

// exports.modifyThing = (req, res, next) => {
//     Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Objet modifié!" }))
//     .catch(error => res.status(400).json({error}));
// };

exports.modifyThing = (req, res, next) => {
    console.log(req.body);
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete thingObject.userId;
    console.log(thingObject);
    Thing.findOne({ _id: req.params.id })
    .then(thing => {
        if (thing.userId != req.auth.userId) {
            res.status(401).json({ message: "Non-authorisé" });
        } else {
            Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet modifié!"}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};

// exports.deleteThing = (req, res, next) => {
//     Thing.deleteOne({ _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Objet suprimmé!" }))
//     .catch(error => res.status(400).json({error}));
// };

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => {
        if (thing.userId != req.auth.userId) {
            res.status(401).json({ message: "Non-authorisé" });
        } else {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`image/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Objet suprimmé!" }))
                .catch(error => res.status(400).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({error}));
};

exports.getAllThings = (req, res, next) => {
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
};