import fastify from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify,opts)=>{

fastify.post("/messages/send", async (req, reply) => {
return require("../controllers/messageController.js").sendMessageHandler(req, reply);
});

  fastify.get("/messages/history/:userA/:userB", async (req, reply) => {
    return require("../controllers/messageController.js").getHistoryHandler(req, reply);
  });

  // block
  fastify.post("/block", async (req, reply) => {
    return require("../controllers/blockController.js").blockHandler(req, reply);
  });

  fastify.post("/unblock", async (req, reply) => {
    return require("../controllers/blockController.js").unblockHandler(req, reply);
  });

});