//data base ma je key ni jrur hoy a key lakhvani and table nu name j bnavvu hoy a lakhvanu
module.exports = mongoose => {
    const User = mongoose.model(
        "User",
        mongoose.Schema(
            {
                email: String,
                password: String,
                // roles: {
                //     type: mongoose.Schema.Types.String,
                //     ref: "Role"
                // }
                roles: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Role"
                    }
                ]
            }
        )
    );

    return User;
};