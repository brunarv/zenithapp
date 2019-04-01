var express = require("express");
var router = express.Router();
var empty = require('is-empty');
var mongojs = require("mongojs");
var myMongo = require("../db");

// ******************
// *** Events ***
// ******************

var activities;

// list all the events
router.get("/events", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_e.find( (err,data) => {
                if (err) {
                    res.send(err);
                }
                res.render("liste", {
                    title: "List Events",
                    data: data
                })
            });
        }
    });
});

// display a create form to the user
router.get("/events/create", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_a.find( (err,data) => {
                if (err) {
                    res.send(err);
                }
                activities = data;
                res.render("createe", {
                    title: "Add a event", activities: activities
                });
            });
        }
    });
    
});

// create/add event
router.post("/events", (req, res, err) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            var event = {};
         
            if(empty(req.body.EventDate)){
                req.checkBody('EventDate', 'Event Date is required.').notEmpty();
                
            } else {
                req.check('EventDate','Invalid event date format.').matches('^[1-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]$', 'i');
               }
            
            if(empty(req.body.StartHour)){
                req.checkBody('StartHour', 'Start Hour is required.').notEmpty()
            }else{
                
                req.check('StartHour','Invalid start hour format.').matches('^[0-9][0-9]\:[0-9][0-9]$', 'i');
            }
            
            if(empty(req.body.EndHour)){
                req.checkBody('EndHour', 'End Hour is required.').notEmpty();
            }else{
                req.check('EndHour','Invalid end hour format.').matches('^[0-9][0-9]\:[0-9][0-9]$', 'i');
            }

            var error = req.validationErrors();

            if (error) {
                req.flash('error', error);
                res.redirect("/forms/events/create");
            } else {
                event.Activity = req.body.Activity;
                event.EventDate  = new Date(req.body.EventDate);
                event.StartHour = req.body.StartHour;
                event.EndHour = req.body.EndHour;
                event.isActive = req.body.isActive;
                event.CreateDate = new Date();

                myMongo.zenith_e.save(event, (err, data) => {
                    if (err) {
                        res.send(err)
                    }
                    req.flash('success_msg', 'Event: Added.')
                    res.redirect("/forms/events");
                });
            }
        }
    });
});

// display a delete confirmation page
router.get("/events/delete/:id", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_e.findOne( {_id: mongojs.ObjectId(req.params.id)},
                function(err, data) {
                    if (err) {
                        res.send(err)
                    }
                    res.render("deletee", {
                        title: "Delete a event", data: data
                    });
                });
        }
    });
});

// delete a event
router.post("/events/delete", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            var event = req.body;
            myMongo.zenith_e.remove( {_id: mongojs.ObjectId(event._id)}, (err,data) => {
                if (err) {
                    res.send(err);
                }
                req.flash('success_msg', 'Event: Deleted.')
                res.redirect("/forms/events");
            });
        }
    });
});

// display edit event form
router.get("/events/edit/:id", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_e.aggregate([
                {$match: {_id: mongojs.ObjectId(req.params.id)}},
                {
                $project:{
                    Activity:1,
                    EventDate:{ $dateToString: { format:"%Y-%m-%d", date: "$EventDate"} },
                    StartHour:{ $substr: ["$StartHour", 11, 5] },
                    EndHour:{ $substr: ["$EndHour", 11, 5] },
                    isActive:1
                }
            }],
                function(err, data) {
                    if (err) {
                        res.send(err)
                    }
                    res.render("edite", {
                        title: "Edit a event", 
                        data: data[0]
                    });
                });
        }
    });
});

// update event
router.post("/events/edit", (req, res, next) => { 
        myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            var event = req.body;
            var changedEvent = {};
            
            
            if(empty(req.body.EventDate)){
                req.checkBody('EventDate', 'Event Date is required.').notEmpty();
                
            } else {
                req.check('EventDate','Invalid event date format.').matches('^[1-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]$', 'i');
               }
            
            if(empty(req.body.StartHour)){
                req.checkBody('StartHour', 'Start Hour is required.').notEmpty()
            }else{
                
                req.check('StartHour','Invalid start hour format.').matches('^[0-9][0-9]\:[0-9][0-9]$', 'i');
            }
            
            if(empty(req.body.EndHour)){
                req.checkBody('EndHour', 'End Hour is required.').notEmpty();
            }else{
                req.check('EndHour','Invalid end hour format.').matches('^[0-9][0-9]\:[0-9][0-9]$', 'i');
            }

            var error = req.validationErrors();
            //console.log(event);

            if (error) {
                req.flash('error', error);
                res.redirect("/forms/events/edit/" + event._id);
            } else {
   
                changedEvent.Activity = req.body.Activity;
                changedEvent.EventDate  = new Date(req.body.EventDate);
                changedEvent.StartHour = req.body.StartHour;
                changedEvent.EndHour = req.body.EndHour;
                changedEvent.isActive = 'Yes';
         
                myMongo.zenith_e.update(
                    {_id: mongojs.ObjectId(event._id)},
                    {$set: {Activity: changedEvent.Activity, EventDate: changedEvent.EventDate, StartHour: changedEvent.StartHour,  EndHour: changedEvent.EndHour, isActive: changedEvent.isActive} }, (err,data) => {
                        if (err) {
                            res.send(err);
                        }
                        req.flash('success_msg', "Event: Updated.");
                        res.redirect("/forms/events");
                    }
                );
            }
        }
    });
});

// ******************
// *** Activities ***
// ******************

// list all the activities
router.get("/activities", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_a.find( (err,data) => {
                if (err) {
                    res.send(err);
                }
                res.render("lista", {
                    title: "List Activities",
                    data: data
                })
            });
        }
    });
});

// display a create form to the user
router.get("/activities/create", (req, res, next) => {
    res.render("createa", { title: "Add a activity" });
});

// create/add activity
router.post("/activities", (req, res, err) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            var activity = req.body;

            req.checkBody('Activity', 'Activity is required').notEmpty();
            var error = req.validationErrors();
            //console.log(error);

            if (error) {
                req.flash('error', error[0].msg);
                res.redirect("/forms/activities/create");
            } else {
                myMongo.zenith_a.findOne({Activity: activity.Activity}, (err,data) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(data);
                    if(!data) {
                        activity.CreateDate = new Date();
                        myMongo.zenith_a.save(activity, (err, data) => {
                            if (err) {
                                res.send(err)
                            }
                            req.flash('success_msg', 'Activity: Added.')
                            res.redirect("/forms/activities");
                        });
                    }else {
                        req.flash('error', "That is the existing activity.");
                        res.redirect("/forms/activities/create");
                    }
                });
            }
        }
    });
});

// display edit activity form
router.get("/activities/edit/:id", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            
            myMongo.zenith_a.findOne( {_id: mongojs.ObjectId(req.params.id)},
                function(err, data) {
                    if (err) {
                        res.send(err)
                    }
                    res.render("edita", { title: "Edit a activity", data: data});
                }
            );
        }
    });
});

// update activity
router.post("/activities/edit", (req, res, next) => { 
        myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            var activity = req.body;

            if (activity.Activity == "") {
                req.flash('error', "Activity is needed.");
                res.redirect("/forms/activities/edit/" + activity._id);
            } else {
                myMongo.zenith_a.update(
                    {_id: mongojs.ObjectId(activity._id)},
                    {$set: {Activity: activity.Activity} }, (err,data) => {
                        if (err) {
                            res.send(err);
                        }
                        req.flash('success_msg', "Activity: Updated.");
                        res.redirect("/forms/activities");
                    }
                );
            }
        }
    });
});

// display a delete confirmation page
router.get("/activities/delete/:id", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_a.findOne( {_id: mongojs.ObjectId(req.params.id)},
                function(err, data) {
                    if (err) {
                        res.send(err)
                    }
                    res.render("deletea", {
                        title: "Delete a activity", data: data
                    });
                });
        }
    });
});

// delete a activity
router.post("/activities/delete", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            var activity = req.body;
            myMongo.zenith_a.remove( {_id: mongojs.ObjectId(activity._id)}, (err,data) => {
                if (err) {
                    res.send(err);
                }
                req.flash('success_msg', "Activity: Deleted.");
                res.redirect("/forms/activities");
            });
        }
    });
});

module.exports = router;