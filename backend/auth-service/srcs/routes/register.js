import {createUser, findUserByEmail, findUserByUserName } from "../models/user.js";

export function registerRoutes(fastify) {
  fastify.post("/register", async (request, reply) => {
    try {
      const body = request.body;
      const firstName = body.firstName || "";
      const lastName = body.lastName || "";
      const userName = body.userName || "";
      const email = (body.email || "").toLowerCase();
      const password = body.password || "";
      const confirmPassword = body.confirmPassword || "";
      if (!firstName || !lastName || !userName || !email || !password || !confirmPassword)
        return reply.code(400).send({error: "All fields are required"});
      const userNameExists = await findUserByUserName(userName);
      if(userNameExists)
        return reply.code(409).send({error: "UserName already taken"});
      const emailExists = await findUserByEmail(email);
      if (emailExists) {
        return reply.code(409).send({ error: "Email already registered" });
      }
      if(password !== confirmPassword)
        return reply.code(400).send({error: "Passwords do not match"});

      const newuser = await createUser(firstName, lastName, userName, email, password);

      const token = fastify.jwt.sign({
        id: newuser.id,
        email: newuser.email,
        userName: newuser.userName,
      });
      return reply.code(201).send({
        message: "User registred Successfully",
        user: {
          id: newuser.id,
          firstName: newuser.firstName,
          lastName: newuser.lastName,
          userName: newuser.userName,
          email: newuser.email,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}