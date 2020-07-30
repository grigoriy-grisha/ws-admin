const axios = require("axios");
const ramda = require("ramda");

exports.error = function (msg, errors = {}) {
  return {
    success: false,
    message: msg,
    errors,
  };
};

exports.prepareUrl = function (url) {
  return url.startsWith("http") ? url : process.env.DEV_API_HOST + url;
};

// eslint-disable-next-line max-params
exports.makeProxy = function (
  { expressMethodHandlerName, handleUrl, realServerUrl },
  app,
  modifyResponse,
  modifyRequest,
) {
  app[expressMethodHandlerName](handleUrl, (req, res) => {
    let chunks = "";
    req.on("data", (chunk) => {
      chunks += chunk;
    });
    req.on("end", async () => {
      try {
        const resultUrl = (ramda.is(Function, realServerUrl) ? realServerUrl(req) : realServerUrl) || req.originalUrl;
        const headers = {
          ...ramda.omit(["host"], req.headers),
          origin: process.env.DEV_API_HOST,
        };
        const originalRequestParams = {
          method: req.method,
          baseURL: process.env.DEV_API_HOST,
          params: req.query,
          data: chunks,
          ...(modifyRequest ? modifyRequest({ params: req.query, data: chunks }) : {}),
          headers,
        };

        const response = await axios(resultUrl, originalRequestParams);

        if (modifyResponse) {
          const result = await modifyResponse(response.data, {
            status: response.status,
            resultUrl,
            originalRequestParams,
          });
          if (!ramda.isNil(result)) {
            response.data = result;
          }
        }
        res.status(response.status).send(response.data);
      } catch (e) {
        const { response } = e;
        if (!response) {
          console.log(e);
          res.status(500).json(error("proxy - internal server error"));
          return;
        }
        res.status(response.status).send(response.data);
      }
    });
  });
};
