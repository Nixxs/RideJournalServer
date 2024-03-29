const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// import validators
const {validationResult} = require('express-validator');
const { idParamValidator } = require("../validators");
const {commentValidator, updateCommentValidator} = require("../validators/commentValidator");
const verifyToken = require("../auth/authMiddleware");

/**
 * @swagger
 * /api/comments:
 *  get:
 *    description: Use to request all comments
 *    tags:
 *      - Comments
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Comment not found
 *      '500':
 *        description: Server error
 */
router.get("/", async (req, res, next) => {
    try {
        const data = await commentController.getComments();
        res.send({result:200, data: data});
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/comments/{id}:
 *  get:
 *    description: Use to request a comment by ID
 *    tags:
 *      - Comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of comment to fetch
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Comment not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.get("/:id", idParamValidator, async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (errors.isEmpty()) {
            const data = await commentController.getComment(req.params.id);
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
 * /api/comments/event/{id}:
 *  get:
 *    description: Use to request comments by event by ID
 *    tags:
 *      - Comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of event to fetch events
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Comment not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.get("/event/:id", idParamValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const data = await commentController.getCommentsByEvent(req.params.id);
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
 * /api/comments/user/{id}:
 *  get:
 *    description: Use to request comments by use by ID
 *    tags:
 *      - Comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of user to fetch comments
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Comment not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.get("/user/:id", idParamValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const data = await commentController.getCommentsByUser(req.params.id);
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
 * /api/comments:
 *  post:
 *    description: Use to create a new comment
 *    tags:
 *      - Comments
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - userId
 *         - eventId
 *        properties:
 *         userId:
 *          type: integer
 *          example: 1
 *         eventId:
 *          type: integer
 *          example: 1
 *         content:
 *          type: text
 *          example: what a great car.
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Invalid JSON
 *      '404':
 *        description: Comment not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.post("/", verifyToken, commentValidator, async (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()){
            const data = await commentController.createComment(req.body, req.userId);
            switch (data) {
                case 404:
                    res.sendStatus(404);
                    break;
                case 401:
                    res.status(401).json({errors: [{"msg":"Unauthorized"}]});
                    break;
                default:
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
 * /api/comments/{id}:
 *  put:
 *    description: Use to update a comment
 *    tags:
 *      - Comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of comment to update
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - userId
 *         - eventId
 *        properties:
 *         userId:
 *          type: integer
 *          example: 1
 *         eventId:
 *          type: integer
 *          example: 1
 *         content:
 *          type: text
 *          example: what a great car.
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Invalid JSON
 *      '404':
 *        description: Comment not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.put("/:id", verifyToken, updateCommentValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()){
            const data = await commentController.updateComment(req.params.id, req.body, req.userId);
            switch (data) {
                case 404:
                    res.sendStatus(404);
                    break;
                case 401:
                    res.status(401).json({errors: [{"msg":"Unauthorized"}]});
                    break;
                default:
                    res.send({result:200, data:data});
            }
        } else {
            // there are errors in the request
            res.status(422).json({errors: errors.array()});
        }
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/comments/{id}:
 *  delete:
 *    description: Use to delete a comment by ID
 *    tags:
 *      - Comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of comment to delete
 *        required: true
 *        type: integer
 *        minimum: 1
 *        example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Comment not found
 *      '422':
 *        description: Validation error
 *      '500':
 *        description: Server error
 */
router.delete("/:id", verifyToken, idParamValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()){
            const data = await commentController.deleteComment(req.params.id, req.userId);
            switch (data) {
                case 404:
                    res.sendStatus(404);
                    break;
                case 401:
                    res.status(401).json({errors: [{"msg":"Unauthorized"}]});
                    break;
                default:
                    res.send({result:200, data:data});
            }
        } else {
            res.status(422).json({errors: errors.array()});
        }
    } catch(err) {
        next(err);
    }
});

module.exports = router;