require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJs = require("swagger-jsdoc");
const mongoose = require("mongoose");
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const router = express.Router();

app.listen(5000, () => {
  console.log("Listening on Port 5000");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.erur1.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Mongoose connected"))
  .catch((e) => console.log(e));

const User = require("./user.model")(mongoose, mongoose.Schema);

const swaggerOption = swaggerJs({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learn Swagger",
    },
    host: "localhost:5000",
  },
  apis: ["app.js"],
});

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerOption));

/**
 * @swagger
 * /users:
 *    get:
 *      tags:
 *      - "users"
 *      summary: Get users list
 *      responses:
 *        "200":
 *          description: "Success"
 *        "500":
 *          description: "Internal server error"
 *    post:
 *      tags:
 *      - "users"
 *      summary: Create an user
 *      consumes:
 *         - "application/json"
 *      requestBody:
 *        description: "Body"
 *        required: true
 *        content:
 *          "application/json":
 *            schema:
 *              $ref: "#/definitions/User"
 *              required:
 *                - name
 *                - age
 *                - department
 *                - position`
 *      responses:
 *        "200":
 *          description: "Success"
 *        "500":
 *          description: "Internal server error"
 * /users/{id}:
 *    put:
 *      tags:
 *      - "users"
 *      summary: Edit an user
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Mongo ID from users list
 *      consumes:
 *         - "application/json"
 *      requestBody:
 *        description: "Body"
 *        required: true
 *        content:
 *          "application/json":
 *            schema:
 *              $ref: "#/definitions/User"
 *              required:
 *                - name
 *                - age
 *                - department
 *                - position`
 *      responses:
 *        "200":
 *          description: "Success"
 *        "404":
 *          description: "User not exist"
 *        "500":
 *          description: "Internal server error"
 *    delete:
 *      tags:
 *      - "users"
 *      summary: Delete an user
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Mongo ID from users list
 *      responses:
 *        "200":
 *          description: "Success"
 *        "404":
 *          description: "User not exist"
 *        "500":
 *          description: "Internal server error"
 * definitions:
 *  User:
 *    type: "object"
 *    properties:
 *      name:
 *        type: "string"
 *        format: "int64"
 *        example: "Jim"
 *      age:
 *        type: "integer"
 *        format: "int32"
 *        example: "20"
 *      department:
 *        type: "string"
 *        example: "Sales"
 *      position:
 *        type: "string"
 *        example: "Sales Supervisor"
 */

router
  .route("/")
  .get(async (req, res) => {
    const users = await User.find();

    res.send(users);
  })
  .post(async (req, res) => {
    const { name, age, deparment, position } = req.body;
    await User.create({
      name,
      age,
      position,
      deparment,
    });

    res.send("Users created");
  });

router
  .route("/:id")
  .put(async (req, res) => {
    const { name, age, deparment, position } = req.body;
    const { id } = req.params;
    const userExist = await User.findOne({ _id: id }).catch(() => "");
    if (!userExist) return res.status(404).send("User not exist");
    await User.findOneAndUpdate(
      { _id: id },
      {
        name,
        age,
        position,
        deparment,
      }
    );
    res.send("Users edited");
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const userExist = await User.findOne({ _id: id }).catch(() => "");
    if (!userExist) return res.status(404).send("User not exist");
    await User.findOneAndDelete({ _id: id });
    res.send("User deleted");
  });

app.use("/users", router);
