module.exports = (mongoose, Schema) => {
  const userSchema = new Schema(
    {
      name: {
        type: String,
      },
      age: {
        type: Number,
      },
      position: {
        type: String,
      },
      department: {
        type: String,
      },
    },
    { timestamps: true }
  );

  return mongoose.model("User", userSchema);
};
