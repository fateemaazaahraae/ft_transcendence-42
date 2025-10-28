import type { FastifyInstance } from "fastify";
import { users, createUser } from "../models/user.ts";

interface RegisterBody {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.post("/register", async (request, reply) => {
    try {
      const body = request.body as RegisterBody;
      const firstName = body.firstName || "";
      const lastName = body.lastName || "";
      const userName = body.userName || "";
      const email = (body.email || "").toLowerCase();
      const password = body.password || "";
      const confirmPassword = body.confirmPassword || "";
      if (!firstName)
        return reply.code(400).send({error: "First name is required"});
      if (!lastName)
        return reply.code(400).send({error: "Last name is required"});
      if (!userName)
        return reply.code(400).send({error: "User name is required"});
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
