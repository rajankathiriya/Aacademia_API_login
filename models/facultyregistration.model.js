//data base ma je key ni jrur hoy a key lakhvani and table nu name j bnavvu hoy a lakhvanu
module.exports = (mongoose) => {
  const FacultyRegistration = mongoose.model(
    "FacultyRegistration",
    mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      password: String,
      role: String,
      confirmPassword: String,
    })
  );

  return FacultyRegistration;
};
