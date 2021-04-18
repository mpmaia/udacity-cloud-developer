import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {requireAuth} from "./auth";

const URL_REGEX = /^http(s)+:\/\/.*$/;

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    app.get("/filteredimage",
        requireAuth,
        async (req, res, next) => {

        const imageUrl = req.query.image_url;
        if (!imageUrl || !imageUrl.match(URL_REGEX)) {
            res.sendStatus(422).send({message: "Invalid or unsupported URL."});
            return;
        }

        try {
            const imageFile = await filterImageFromURL(imageUrl);
            res.sendFile(imageFile, function (err) {

                try {
                    deleteLocalFiles([imageFile]);
                } catch (e) {
                    console.log("error removing ", imageFile);
                }

                if (err) {
                    console.log("Error processing file", imageFile);
                    next(err);
                }
            });
        } catch(e) {
            console.log(e);
            res.sendStatus(500).send({message: "Failed to process image: " + e.message})
        }
    });

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
