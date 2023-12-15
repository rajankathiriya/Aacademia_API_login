//data base ma je key ni jrur hoy a key lakhvani and table nu name j bnavvu hoy a lakhvanu
module.exports = (mongoose) => {
  const StudentRegistration = mongoose.model(
    "StudentRegistration",
    mongoose.Schema({
      name: Object,
      studentmobile: Number,
      email: String,
      fees: String,
      gender: String,
      password: String,
      dumID: String,
    })
  );

  return StudentRegistration;
};
