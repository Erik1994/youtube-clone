import express from "express";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {

    console.log('Received request:', req.body);

    // Get the path of the input video file from the request body
    const inputFilePath = path.resolve(req.body.inputFilePath);
    const outputFilePath = path.resolve(req.body.outputFilePath);

  
    // Check if the input file path is defined
    if (!inputFilePath || !outputFilePath) {
      return res.status(400).send('Bad Request: Missing file path');
    }
  

    // Create the ffmpeg command
    ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-2:360") // 360p
    .on("start", (commandLine) => {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
    .on("end", function() {
        console.log('Processing finished successfully');
        res.status(200).send('Processing finished successfully');
    })
    .on("error", function(err: any) {
        console.log('An error occurred: ' + err.message);
        res.status(500).send('An error occurred: ' + err.message);
    })
    .save(outputFilePath);
    
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });