---
name: Deploy Checklist Experiment
about: A checklist of steps that are needed for this openbases experiment template

---

## Repository
 - [ ] add the experiment static files, minimally an index.html to master
 - [ ] turn on Github pages
 - [ ] add a link to preview the experiment to the repository description
 - [ ] add a description and tags

## Docker Hub
 - [ ] create a Docker Hub container repository to receive the container build

## Continuous Integration
 - [ ] (as your user) add a bot (username) Github contributor to handle Github Pages deployment
 - [ ] (as the bot) accept the Github invitation
 - [ ] add the repository to build on CircleCI
 - [ ] define environment variables in CircleCI
      - [ ] CONTAINER_NAME
      - [ ] DOCKER_USER
      - [ ] DOCKER_PASS
      - [ ] GITHUB_USER
      - [ ] GITHUB_EMAIL
 - [ ] (as the bot) follow the repository in CircleCI
 - [ ] (as the bot) go to Settings --> Checkout SSH key and add an ssh key
