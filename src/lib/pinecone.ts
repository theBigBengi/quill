// import { Pinecone } from "@pinecone-database/pinecone";

// const pinecone = new Pinecone();
// await pinecone.init({
// 	environment: "gcp-starter",
// 	apiKey: "********-****-****-****-************",
// });
// const index = pinecone.Index("quill");

import { Pinecone } from "@pinecone-database/pinecone";

export const getPineconeClient = async () =>
  new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: "gcp-starter",
  });

// import { PineconeClient } from "@pinecone-database/pinecone";

// export const getPineconeClient = async () => {
//   const client = new PineconeClient();

//   await client.init({
//     apiKey: process.env.PINECONE_API_KEY!,
//     environment: "gcp-starter",
//   });

//   return client;
// };
