const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

// import validators
const {validationResult} = require('express-validator');
const { idParamValidator } = require("../validators");
const {imageValidator} = require("../validators/imageValidator");

/**
 * @swagger
 * /api/images:
 *  get:
 *    description: Use to request all images
 *    tags:
 *      - Images
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Image not found
 *      '500':
 *        description: Server error
 */
router.get("/", async (req, res, next) => {
    try {
        const data = await imageController.getImages();
        res.send(data);
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/images/{id}:
 *  get:
 *    description: Use to request a image by ID
 *    tags:
 *      - Images
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of image to fetch
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Image not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.get("/:id", idParamValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const data = await imageController.getImage(req.params.id);
            if (!data) {
                res.sendStatus(404);
            } else {
                res.send({ result: 200, data: data });
            }
        } else {
            res.status(422).json({errors: errors.array()});
        }
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/images/event/{id}:
 *  get:
 *    description: Use to request images for a given event ID
 *    tags:
 *      - Images
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the event the images are attached to
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Images not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.get("/:id", idParamValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const data = await imageController.getImagesByEvent(req.params.id);
            if (!data) {
                res.sendStatus(404);
            } else {
                res.send({ result: 200, data: data });
            }
        } else {
            res.status(422).json({errors: errors.array()});
        }
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/images:
 *  post:
 *    description: Use to create a new image
 *    tags:
 *      - Images
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - eventId
 *         - url
 *        properties:
 *         eventId:
 *          type: integer
 *          example: 3
 *         image:
 *          type: string
 *          example: image.jpg
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Invalid JSON
 *      '404':
 *        description: Images not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.post("/", imageValidator, async (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()){
            const data = await imageController.createImage(req.body);
            if (!data){
                res.sendStatus(404);
            } else {
                res.send({result:200, data:data});
            }
        } else {
            res.status(422).json({errors: errors.array()});
        }
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/images/{id}:
 *  delete:
 *    description: Use to delete a image by ID
 *    tags:
 *      - Images
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of image to delete
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Image not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.delete("/:id", idParamValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()){
            const data = await imageController.deleteImage(req.params.id);
            if (!data){
                res.sendStatus(404);
            } else {
                res.send({result: 200, data: data});
            }
        } else {
            res.status(422).json({errors: errors.array()});
        }
    } catch(err) {
        next(err);
    }
});

module.exports = router;