import { Kafka, Producer } from "kafkajs";
import { retryAsync } from "../utils/utils.js";

const kafka: Kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER], // SEED broker - rest all the information about kafka cluster is retrieved from this seed broker
});

let producer: Producer | null = null;

const kafkaConnect = async () => {
  retryAsync(async () => {
    const producer = kafka.producer();
    await producer.connect();
  }, );
};
