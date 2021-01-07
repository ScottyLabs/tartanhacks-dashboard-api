const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Projects = require('../models/projectsmodel');
const Prizes = require('../models/prizesmodel');

/**
 * @swagger
 * tags:
 *  name: Projects Module
 *  description: Endpoints to manage project data.
 */




//Create Project endpoint - /projects/new

/**
 * @swagger
 * /projects/new:
 *   post:
 *     summary: Create a new Project
 *     tags: [Projects Module]
 *     description: Adds a new project to database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               team_id:
 *                 type: string
 *               github_url:
 *                 type: string
 *               slides_url:
 *                 type: string
 *               video_url:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       400:
 *          description: Team already has a project.
 *       500:
 *          description: Internal Server Error.
 */

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

//Get Project Info endpoint - /projects/get

/**
 * @swagger
 * /projects/get:
 *   post:
 *     summary: Retrieve a list of projects
 *     tags: [Projects Module]
 *     description: Searches projects database and retrieves list of projects. Specify optional search parameters in request body
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               team_id:
 *                 type: string
 *               github_url:
 *                 type: string
 *               slides_url:
 *                 type: string
 *               video_url:
 *                 type: string
 *               status:
 *                 type: number
 *               eligible_prizes:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/get', (req, res, next)=>{
    Projects.find(req.body)
        .populate({
            path: 'eligible_prizes',
            model: 'Prizes',
        })
        .then(results=>{
            console.log(results);
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

/**
 * @swagger
 * /projects/edit:
 *   post:
 *     summary: Edit existing projects
 *     tags: [Projects Module]
 *     description: Include Project ID in request body along with the fields with updated data. This endpoint cannot be used to enter/remove projects for certain prizes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               team_id:
 *                 type: string
 *               github_url:
 *                 type: string
 *               slides_url:
 *                 type: string
 *               video_url:
 *                 type: string
 *               status:
 *                 type: number
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Not found.
 *       500:
 *          description: Internal Server Error.
 */

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

/**
 * @swagger
 * /projects/delete:
 *   get:
 *     summary: Delete a project
 *     tags: [Projects Module]
 *     description: Delete a project from the database
 *     parameters:
 *       - in: query
 *         name: project_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: project not found.
 *       400:
 *          description: Bad Request.
 *       500:
 *          description: Internal Server Error.
 */

router.get('/delete', (req, res, next)=>{

    const id = req.query.project_id;

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

//Create Prize endpoint - /projects/prizes/new

/**
 * @swagger
 * /projects/prizes/new:
 *   post:
 *     summary: Create a new Prize
 *     tags: [Projects Module]
 *     description: Adds a new prize to database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               eligibility_criteria:
 *                 type: string
 *               provider:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/prizes/new', (req, res, next)=>{

    const name = req.body.name;
    const description = req.body.description;
    const eligibility_criteria = req.body.eligibility_criteria;
    const provider = req.body.provider;

    const prize = new Prizes({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        eligibility_criteria: eligibility_criteria,
        provider: provider,
        contestants: 0,
        is_active: true
    });

    prize.save()
        .then(result =>{
            console.log(result);
            res.status(200).json({
                message:"Successfully saved new prize",
                projectInfo:prize
            });
        })
        .catch(err=>{
            res.status(500).json({
                message: "We encountered an error while creating this prize called "+name,
                error: err
            });
        });

});

//Get Prize Info endpoint - /projects/prizes/get

/**
 * @swagger
 * /projects/prizes/get:
 *   post:
 *     summary: Retrieve a list of prizes
 *     tags: [Projects Module]
 *     description: Searches prizes database and retrieves list of projects. Specify optional search parameters in request body
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               eligibility_criteria:
 *                 type: string
 *               provider:
 *                 type: string
 *               contestants:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *               winner:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/prizes/get', (req, res, next)=>{
    Prizes.find(req.body)
        .then(results=>{
            if(results.length != 0){
                res.status(200).json(results);
            }else{
                res.status(404).json({
                    message: "We couldn't find any prize data that matched your query."
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

//Edit prize info endpoint - /projects/prizes/edit

/**
 * @swagger
 * /projects/prizes/edit:
 *   post:
 *     summary: Edit existing prizes
 *     tags: [Projects Module]
 *     description: Include Prize ID in request body along with the fields with updated data. This endpoint cannot be used to enter/remove projects for certain prizes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               eligibility_criteria:
 *                 type: string
 *               provider:
 *                 type: string
 *               contestants:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *               winner:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/prizes/edit', (req, res, next)=>{

    const id = req.body._id;

    if(id === undefined){
        res.status(400).json({
            message: "Please specify the id of the prize you wish to edit"
        });
    }else{
        Prizes.find({_id: id})
            .then(results => {

                if(results.length === 0){
                    res.status(404).json({
                        message: "We couldn't find records of a prize with id:"+id
                    });
                }else{
                    let prize = results[0];


                    if(req.body.name !== undefined){
                        prize.name = req.body.name;
                    }

                    if(req.body.description !== undefined){
                        prize.description = req.body.description;
                    }

                    if(req.body.eligibility_criteria !== undefined){
                        prize.eligibility_criteria = req.body.eligibility_criteria;
                    }

                    if(req.body.provider !== undefined){
                        prize.provider = req.body.provider;
                    }


                    prize.save()
                        .then(result =>{
                            console.log(result);
                            res.status(200).json({
                                message:"Successfully saved new information",
                                projectInfo:prize
                            });
                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: "We encountered an error while editing the prize with id: "+id,
                                error: err
                            });
                        });


                }

            })
            .catch(err=>{
                res.status(500).json({
                    message: "We encountered an error while editing the prize with id:  "+id,
                    error: err
                });
            });
    }


});

//Submit project for a prize - /projects/prizes/enter

/**
 * @swagger
 * /projects/prizes/enter:
 *   get:
 *     summary: Enter project for a prize
 *     tags: [Projects Module]
 *     description: Endpoint to enter project for a certain prize
 *     parameters:
 *       - in: query
 *         name: project_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: prize_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: project or prize not found.
 *       400:
 *          description: Bad Request.
 *       500:
 *          description: Internal Server Error.
 */

router.get('/prizes/enter', (req, res, next)=>{

    const project_id = req.query.project_id;
    const prize_id = req.query.prize_id;

    if(project_id === undefined || prize_id === undefined){
        res.status(400).json({
            message: "Please specify the id of the project you wish to submit and the id of the prize you wish to enter for."
        });
    }else{
        Prizes.find({_id: prize_id})
            .then(prizes => {

                if(prizes.length === 0){
                    res.status(404).json({
                        message: "We couldn't find records of a prize with id: "+prize_id
                    });
                }else{

                    let prize = prizes[0];

                    Projects.find({_id: project_id})
                        .then(projects => {

                            if(projects.length === 0){
                                res.status(404).json({
                                    message: "We couldn't find records of a project with id:"+project_id
                                });
                            }else {

                                let project = projects[0];

                                if(project.eligible_prizes.includes(prize_id)){
                                    res.status(400).json({
                                        message: "This project has already been entered to win this prize."
                                    });
                                }else{
                                    prize.contestants = prize.contestants + 1;

                                    prize.save()
                                        .then(result => {

                                            project.eligible_prizes.push(prize_id);
                                            console.log(project.eligible_prizes);

                                            project.save()
                                                .then(result => {

                                                    res.status(200).json({
                                                        message: "Successfully entered project with id "+project_id+ " to prize with id "+prize_id,
                                                    });


                                                })
                                                .catch(err => {
                                                    res.status(500).json({
                                                        message: "We encountered an error occurred while entering this project for this prize",
                                                        error: err
                                                    });
                                                });


                                        })
                                        .catch(err => {
                                            res.status(500).json({
                                                message: "We encountered an error occurred while entering this project for this prize",
                                                error: err
                                            });
                                        });
                                }

                            }

                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: "We encountered an error occurred while entering this project for this prize",
                                error: err
                            });
                        });



                }

            })
            .catch(err=>{
                res.status(500).json({
                    message: "We encountered an error occurred while entering this project for this prize",
                    error: err
                });
            });
    }



});


module.exports = router;