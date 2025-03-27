const User = require("../model/user");

module.exports.signup = async (req, res) => {
    try {
        console.log("Received signup request:", req.body);

        let { username, email, number, password } = req.body;

        if (!username || !email || !number || !password) {
            console.log("Missing required fields!");
            req.flash("error", "All fields are required.");
            return res.redirect("/user/register");
        }

        const newUser = new User({ username, email, number });

        const registeredUser = await User.register(newUser, password);
        
        console.log("User registered successfully:", registeredUser);
        req.flash("success", "User registered successfully!");
        return res.redirect("/");
    } catch (err) {
        console.error("Error during user signup:", err);
        req.flash("error", err.message);
        return res.redirect("/user/register");
    }
};



module.exports.login=async(req, res) => {
    req.flash("success", "Welcome User");

    res.redirect("/dashboard"); // Redirect to user dashboard
};

module.exports.update=async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        req.flash("success", "User updated successfully!");
        res.redirect("/");
    } catch (err) {
        req.flash("error", "Error updating user.");
        res.redirect("/");
    }
};


module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            req.flash("error", "Logout failed!");
            return res.redirect("/");
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/");
    });
};



module.exports.delete=async (req, res) => {
    try {
        let deletedUser=await User.findByIdAndDelete(req.params.id);
        console.log(deletedUser);
        req.flash("success", "User deleted successfully!");
        res.redirect("/");
    } catch (err) {
        req.flash("error", "Error deleting user.");
        res.redirect("/");
    }
};