module.exports = function(mongoose) {
    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        age: String,
        email: String,
        role: String,
        answer1: String,
        answer2: String,
        answer3: String
    });

    return {
        Users: mongoose.model('User_Accounts', userSchema)
    };
}