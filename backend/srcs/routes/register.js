import { users, createUser } from "../models/user.js";

export function registerRoutes(fastify) {
  fastify.post("/register", async (request, reply) => {
    try {
      const body = request.body;
      const firstName =body.firstName || "";
      const lastName =body.lastName || "";
      const userName =body.userName || "";
      const email = (body.email || "").toLowerCase();
      const password = body.password || "";
      const confirmPassword = body.confirmPassword || "";
      if (!firstName)
        return reply.code(400).send({error: "First name is required"});
      if (!lastName)
        return reply.code(400).send({error: "Last name is required"});
      if (!userName)
        return reply.code(400).send({error: "User name is required"});
      const userNameExists = [...users.values()].find(u => u.userName === userName);
      if(userNameExists)
        return reply.code(409).send({error: "user name already exist"});
      if (!email) 
        return reply.code(400).send({ error: "Email is required" });
      if (!password || !confirmPassword) 
        return reply.code(400).send({ error: "Password and confirm password are required" });
      if (users.has(email)) {
        return reply.code(409).send({ error: "User already exists" });
      }
      if(password !== body.confirmPassword)
        return reply.code(400).send({error: "Passwords do not match"});

      const user = await createUser(firstName, lastName, userName, email, password);

      return reply.code(201).send({ id: user.id, firstName: user.firstName, lastName: user.lastName, userName: user.userName, email: user.email });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}
