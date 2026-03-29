import multipart from "@fastify/multipart";
import "@fastify/multipart";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { b2Client } from "../../plugins/b2";

export default async function commonRoutes(fastify: FastifyInstance) {
  fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  fastify.post(
    "/upload",
    {
      preHandler: [fastify.adminAuthenticate],
      validatorCompiler: () => {
        return () => true; // disable ALL validation for this route
      },
      schema: {
        tags: ["common"],
        summary: "image upload and return url",
        consumes: ["multipart/form-data"],
        isMultipart: true,
        body: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const data = await req.file();

      if (!data) {
        return reply.status(400).send({ message: "No file uploaded" });
      }

      // ✅ Optional validation
      if (!data.mimetype.startsWith("image/")) {
        return reply.status(400).send({ message: "Only images allowed" });
      }

      const ext = data.filename.split(".").pop();
      const fileName = `uploads/${uuid()}.${ext}`;

      const buffer = await data.toBuffer();

      await b2Client.send(
        new PutObjectCommand({
          Bucket: process.env.B2_BUCKET!,
          Key: fileName,
          Body: buffer,
          ContentType: data.mimetype,
        }),
      );

      // ✅ Public URL (depends on your bucket endpoint)
      const url = `${process.env.B2_PUBLIC_URL}/${fileName}`;

      return {
        url,
        fileName,
      };
    },
  );
}
