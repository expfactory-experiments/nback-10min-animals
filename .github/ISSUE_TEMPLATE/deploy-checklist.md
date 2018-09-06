---
name: Deploy Checklist
about: A checklist of steps that are needed for this openbases experiment template

---

## Repository
 - [x] add the experiment static files, minimally an index.html to master
 - [x] turn on Github pages
 - [x] add a link to preview the experiment to the repository description
 - [x] add a description and tags

## Docker Hub
 - [x] create a Docker Hub container repository to receive the container build

## CircleCI 
 - [x] (as your user) add a bot (username) Github contributor to handle Github Pages deployment
 - [x] (as the bot) accept the Github invitation
 - [x] add the repository to build on CircleCI
 - [x] define environment variables in CircleCI
       - [x] CONTAINER_NAME
       - [x] DOCKER_USER
       - [x] DOCKER_PASS
       - [x] GITHUB_USER
       - [x] GITHUB_EMAIL
 - [x] (as the bot) follow the repository in CircleCI
 - [x] (as the bot) go to Settings --> Checkout SSH key and add an ssh key
