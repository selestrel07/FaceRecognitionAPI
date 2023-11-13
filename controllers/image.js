const { response } = require("express");

const MODEL_ID = 'face-detection';

const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = "9069e85c21cd43efaeed1ac125a78984";
  const USER_ID = "selestrel";
  const APP_ID = "test";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

const handleApiCall = () => (req, res) => {
    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, returnClarifaiRequestOptions(req.body.input))
        .then(response => response.json())
        .then(response => res.json(response))
        .catch(err => {
          console.log('error: ', err);
          res.status(400).json('unable to work with api');
        });
}
    
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
  handleApiCall: handleApiCall
};
