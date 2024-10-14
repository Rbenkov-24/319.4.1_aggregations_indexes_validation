import { Router } from "express"; //kanjibo class router mn express
import db from "../db/conn.js";
import { ObjectId } from "mongodb"; //kanjibo objectid bash nkhdmo m3a mongodb document ids

//kansaybo router jdid
const router = new Router();

//GET route bash njiibo 10 grades loulin
router.get("/", async (req, res) => {
  try {
    //kanchdo collection grades
    const gradesCollection = await db.collection("grades");
    //kanjibo 10 loulin mn grades
    const grades = await gradesCollection.find().limit(10).toArray();
    //kanjibo grades f format json
    res.json({ grades });
  } catch (e) {
    console.log(e);
  }
});

//GET route bash njiibo grade b-id
router.get("/:id", async (req, res) => {
  //kanchdo id mn req
  const { id } = req.params;

  const gradesCollection = await db.collection("grades");
  //kanlo9o grade b id
  const grade = await gradesCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  //ila mafroodch grade
  if (!grade) {
    //ila maflatch,kanrddo 404 error
    res.status(404).json({ error: `grade b id: ${id} mafrach` });
  } else {
    res.json({ grade });
  }
});

//====GET grades dyal student ma3a id specific============

router.get("/student/:id", async (req, res) => {
  const { id } = req.params;

  const gradesCollection = await db.collection("grades");

  const studentGrades = await gradesCollection
    .find({ student_id: Number(id) })
    .toArray();

  res.json({ studentGrades });
});

//=====GET grades dyal class specific=======

router.get("/class/:id", async (req, res) => {
  const { id } = req.params;

  const gradesCollection = await db.collection("grades");

  const classGrades = await gradesCollection
    .find({ class_id: Number(id) })
    .toArray();

  res.json({ classGrades });
});

//PATCH route bash update document dyal grade
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  let collection = await db.collection("grades");
  let newDocument = req.body;
  let result = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $push: { scores: newDocument } }
  );
  res.send(result).status(204);
});

//=========PATCH route bach nupdateiw scores============

//PATCH route bash update score specific
router.patch("/scores/:id", async (req, res) => {
  const { id } = req.params;
  const { type, newScore, oldScore } = req.body; //kantchdo mn req body type new score w old score

  try {
    const gradesCollection = await db.collection("grades");

    const result = await gradesCollection.updateOne(
      {
        _id: ObjectId.createFromHexString(id),
        "scores.type": type,
        "scores.score": oldScore,
      },
      { $set: { "scores.$.score": newScore } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "score mafrach wla makainch tbdel" });
    } else {
      res.json({ message: "score it3del mzyan" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//===== Aggregation bach ndiro statistics =====

//route bach njiibo stats dyal lmdrasa kamla
router.get("/stats", async (req, res) => {
  try {
    const gradesCollection = await db.collection("grades");
    const stats = await gradesCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalLearners: { $sum: 1 },
            above70: {
              $sum: { $cond: [{ $gt: ["$weighted_average", 70] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            totalLearners: 1,
            above70: 1,
            percentageAbove70: {
              $multiply: [{ $divide: ["$above70", "$totalLearners"] }, 100],
            },
          },
        },
      ])
      .toArray();
    res.json(stats[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Route bach njiibo stats dyal class wa7da
router.get("/stats/:id", async (req, res) => {
  const classId = Number(req.params.id);
  try {
    const gradesCollection = await db.collection("grades");
    const stats = await gradesCollection
      .aggregate([
        { $match: { class_id: classId } },
        {
          $group: {
            _id: null,
            totalLearners: { $sum: 1 },
            above70: {
              $sum: { $cond: [{ $gt: ["$weighted_average", 70] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            totalLearners: 1,
            above70: 1,
            percentageAbove70: {
              $multiply: [{ $divide: ["$above70", "$totalLearners"] }, 100],
            },
          },
        },
      ])
      .toArray();
    res.json(stats[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


export default router;
