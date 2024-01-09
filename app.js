import express from "express";

import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4269;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentsPseudoDB = [...assignments];
let commentsPseudoDB = [...comments];

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message:
        "Invalid request. Can only fetch up to 10 assignment per request. ",
    });
  }

  const assignmentsWithLimit = assignmentsPseudoDB.slice(0, limit);

  return res.json({ data: assignmentsWithLimit });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let requestedAssignmentsId = Number(req.params.assignmentsId);

  let assignmentsData = assignmentsPseudoDB.filter(
    (i) => i.id === requestedAssignmentsId
  );

  return res.json({
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsPseudoDB.push({
    id: assignmentsPseudoDB[assignmentsPseudoDB.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "Succesfully created new assignment",
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let requestedAssignmentsId = Number(req.params.assignmentsId);

  const newAssignments = assignmentsPseudoDB.filter((i) => {
    return i.id !== requestedAssignmentsId;
  });
  assignmentsPseudoDB = newAssignments;

  return res.json({
    message: "Successfully deleted specified assignment",
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let requestedAssignmentsId = Number(req.params.assignmentsId);

  const assignmentIndex = assignmentsPseudoDB.findIndex((i) => {
    return i.id === requestedAssignmentsId;
  });

  assignmentsPseudoDB[assignmentIndex] = {
    id: requestedAssignmentsId,
    ...req.body,
  };

  return res.json({
    message: "Assignment successfully updated",
  });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let requestedAssignmentsId = Number(req.params.assignmentsId);

  let commentData = commentsPseudoDB.filter(
    (i) => i.id === requestedAssignmentsId
  );

  return res.json({
    message: "Complete fetching comments",
    data: commentData[0],
  });
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let requestedAssignmentsId = Number(req.params.assignmentsId);

  commentsPseudoDB.push({
    id: commentsPseudoDB[commentsPseudoDB.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: commentsPseudoDB[requestedAssignmentsId],
  });
});
