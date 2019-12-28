import express from 'express';
import bodyParser from 'body-parser';
const URL = require("url").URL;

import {filterImageFromURL, deleteLocalFiles} from './util/util';

const isValidURL = (s: string): boolean => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage?", async ( req, res ) => {
    const {image_url} = req.query;
    if (image_url == null) {
      res.status(400).send('Missing \'image_url\' param');
      return;
    }
    if (!isValidURL(image_url)) {
      res.status(400).send(`Invalid 'image_url' param '${image_url}'`);
      return;
    }
    const filtered_image = await filterImageFromURL(image_url);
    res.status(200).sendFile(filtered_image, async function(err) {
      if (err) {
        res.status(500).send('Failed to send file!');
      } else {
        await deleteLocalFiles([filtered_image]);
      }
    });
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();