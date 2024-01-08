import express from "express";
import { assignments } from "./data/assignments.js";

let assignmentsMockDatabase = [...assignments];

const app = express();
const port = 3000;

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request. Can get data up to 100 posts per request",
    });
  }

  const assignments = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    data: assignments,
    message: "Complete Fetching assignments " + assignments[0].title,
  });
});

app.get("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let postData = assignmentsMockDatabase.filter((item) => item.id === assignmentsIdFromClient);

  return res.json({
    data: postData[0],
    message: "Complete Fetching assignment " + assignments[0].title,
  });
});

app.post("/assignments", function (req, res) {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "Blog post has been created successfully",
  });
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);

  const newBlogPosts = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentsIdFromClient;
  });

  assignmentsMockDatabase = newBlogPosts;

  return res.json({
    message: "Blog post has been deleted successfully",
  });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const blogPostIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentsIdFromClient;
  });

  assignmentsMockDatabase[blogPostIndex] = { id: assignmentsIdFromClient, ...req.body };

  return res.json({
    message: `Assignment Id : ${assignmentsMockDatabase[blogPostIndex].id}  has been updated successfully`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
