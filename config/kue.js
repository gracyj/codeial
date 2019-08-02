// setting up kue & using it
const kue = require("kue");

const queue = kue.createQueue();

module.exports = queue;