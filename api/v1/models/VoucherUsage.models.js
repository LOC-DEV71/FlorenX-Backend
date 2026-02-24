const mongoose = require("mongoose")
const voucherUsageSchema = new mongoose.Schema({
  voucher_id: String,
  user_id: String,
  used_at: {
    type: Date,
    default: Date.now
  }
});
const VouchersUsage = mongoose.model("voucher_usages", voucherUsageSchema, "voucher_usages");
module.exports = VouchersUsage
