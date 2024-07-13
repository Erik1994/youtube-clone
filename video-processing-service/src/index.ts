import express from "express";
import { setupDirectories } from "./storage";
import { downloadRawVideo } from "./storage";
import { uploadProcessedVideo } from "./storage";
import { convertVideo } from "./storage";
import { deleteProcessedVideo } from "./storage";
import { deleteRawVideo } from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received');
    }
  } catch(error) {
    console.error(error);
    return res.status(400).send(`Bad request: Missing filename`);
  }  

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  //Download raw video from Cloud Storage
  await downloadRawVideo(inputFileName);
  
  // Convert the video to 360p
  try {
    await convertVideo(inputFileName, outputFileName);
  } catch {
    Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    return res.status(500).send(`Internal Server Error: Video processing failed.`);
  }

  //Upload processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName);
  
  Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send(`Processing finished successfuly.`);
});
  
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
