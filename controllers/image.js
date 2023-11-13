const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const MODEL_ID = "face-detection";
const USER_ID = "selestrel";
const APP_ID = "test";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 9069e85c21cd43efaeed1ac125a78984");

const handleApiCall = () => (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: MODEL_ID,
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        { data: { image: { url: req.body.input } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return;
      }

      res.json(response);
    }
  );
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch(() => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};
