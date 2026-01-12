const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công");
  } catch (error) {
    console.log("Kết nối MongoDB thất bại:", error);
  }
};
