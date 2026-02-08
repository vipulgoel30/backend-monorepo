// Third party imports
import express, { type Express } from "express";

const app: Express = express();

export default app;

// (async () => {
//   try {
//     const kafka = new Kafka({
//       clientId: "test-client",
//       brokers: ["localhost:9092"],
//     });
//     const consumer = kafka.consumer({ groupId: "test-group" });
//     await consumer.connect();

//     console.log("Consumer connected");

//     await consumer.subscribe({
//       topic: "test-topic",
//       fromBeginning: true,
//     });

//     await consumer.run({
//       eachMessage: async (payload) => {
//         console.log(payload.message.value?.toString("utf-8"));
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// })();
