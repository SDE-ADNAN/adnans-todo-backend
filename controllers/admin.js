const path = require("../utils/path");



exports.getJson = (req, res, next) => {
    res.send({
        name:"adnan",
        path:path,
        desiredLPA:"55LPA"
    });
  };