const express = require("express");
const server = express();
server.use(express.json());

const projects = [
  {
    id: 66,
    title: "Meu primeiro projeto",
    tasks: ["Caminhar", "Correr"]
  }
];

let countRequest = 0;

function countRequests(req, res, next) {
  countRequest++;

  console.log(`Number of requisitions: ${countRequest}`);

  return next();
}

server.use(countRequests);

function checktProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  if (!project) res.status(400).json({ error: "Project does not found" });

  req.id = id;

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects/", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title });

  return res.json(projects);
});

server.post("/projects/:id/tasks", checktProjectExists, (req, res) => {
  const { title } = req.body;

  const project = projects.find(p => p.id == req.id);

  project.tasks.push(title);

  return res.json(project);
});

server.put("/projects/:id", checktProjectExists, (req, res) => {
  const { title } = req.body;

  console.log(title);

  const project = projects.find(p => p.id == req.id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checktProjectExists, (req, res) => {
  const projectIndex = projects.findIndex(p => p.id == req.id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
