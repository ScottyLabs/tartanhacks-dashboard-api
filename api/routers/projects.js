const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Projects = require('../models/projectsmodel');


//Create Project endpoint - /projects/new
router.post('/new', (req, res, next)=>{

    const team_id = req.body.team_id;
    const name = req.body.name;
    const desc = req.body.desc;
    const github_url = req.body.github_repo_url;
    const slides_url = req.body.slides_url;
    const video_url = req.body.video_url;


    Projects.find({team_id: team_id})
        .then(results =>{
            if(results.length != 0 && results[0].status != 0){

                res.status(400).json(
                    {
                        message: "This team already has a project. Use the Edit projects endpoint to edit project details"
                    }
                );

            }else{

                const project = new Projects({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    description: desc,
                    github_repo_url: github_url,
                    slides_url: slides_url,
                    video_url: video_url,
                    team_id: team_id,
                    status: 1
                });

                project.save()
                    .then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message:"Successfully saved new project",
                            projectInfo:project
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "We encountered an error while creating this project called "+name,
                            error: err
                        });
                    });
            }
        })
        .catch(err=>{
            res.status(500).json({
                message: "We encountered an error while creating this project called "+name,
                error: err
            });
        });

});

//Get Project Info endpoint - /projects/info
router.get('/', (req, res, next)=>{
    Projects.find(req.body)
        .then(results=>{
            if(results.length != 0){
                res.status(200).json(results);
            }else{
                res.status(404).json({
                    message: "We couldn't find any project data that matched your query."
                });
            }
        })
        .catch(err=> {

            res.status(500).json({
                message: "We encountered an error while querying the projects database.",
                error: err
            });
        });
});

//Edit project info endpoint - /projects/edit
router.post('/edit', (req, res, next)=>{

    const id = req.body._id;

    if(id === undefined){
        res.status(400).json({
            message: "Please specify the id of the project you wish to edit"
        });
    }else{
        Projects.find({_id: id})
            .then(results => {

                if(results.length === 0){
                    res.status(404).json({
                        message: "We couldn't find records of a project with id:"+id
                    });
                }else{
                    let project = results[0];


                    if(req.body.name !== undefined){
                        project.name = req.body.name;
                    }

                    if(req.body.team_id !== undefined){
                        project.team_id = req.body.team_id;
                    }

                    if(req.body.desc !== undefined){
                        project.description = req.body.desc;
                    }

                    if(req.body.github_repo_url !== undefined){
                        project.github_repo_url = req.body.github_repo_url;
                    }

                    if(req.body.slides_url !== undefined){
                        project.slides_url = req.body.slides_url;
                    }

                    if(req.body.video_url !== undefined){
                        project.video_url = req.body.video_url;
                    }

                    if(req.body.status !== undefined){
                        project.status = req.body.status;
                    }


                    project.save()
                        .then(result =>{
                            console.log(result);
                            res.status(200).json({
                                message:"Successfully saved new information",
                                projectInfo:project
                            });
                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: "We encountered an error while editing the project with id: "+id,
                                error: err
                            });
                        });


                }

            })
            .catch(err=>{
                res.status(500).json({
                    message: "We encountered an error while editing the project with id:  "+id,
                    error: err
                });
            });
    }


});

//Delete project info endpoint - /projects/delete
router.post('/delete', (req, res, next)=>{

    const id = req.body._id;

    if(id === undefined){
        res.status(400).json({
            message: "Please specify the id of the project you wish to delete"
        });
    }else{
        Projects.find({_id: id})
            .then(results => {

                if(results.length === 0){
                    res.status(404).json({
                        message: "We couldn't find records of a project with id:"+id
                    });
                }else{
                    let project = results[0];

                        project.status = 0;



                    project.save()
                        .then(result =>{
                            console.log(result);
                            res.status(200).json({
                                message:"Successfully deleted project",
                            });
                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: "We encountered an error while deleting the project with id: "+id,
                                error: err
                            });
                        });


                }

            })
            .catch(err=>{
                res.status(500).json({
                    message: "We encountered an error while deleting the project with id:  "+id,
                    error: err
                });
            });
    }


});

module.exports = router;