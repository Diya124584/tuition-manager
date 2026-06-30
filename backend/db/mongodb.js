const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://diya:Diya132005@tuitiondb.mxgrba4.mongodb.net/tuitiondb?retryWrites=true&w=majority"
)
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch((err) => {
  console.log("MongoDB Error ❌");
  console.log(err);
});

module.exports = mongoose;