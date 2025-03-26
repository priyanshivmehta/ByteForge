const Mechanic = require("../model/mechanic");


module.exports.signup=async (req, res) => {
    try {
        const { username, email, number, password } = req.body;
        const newMechanic = new Mechanic({ username, email, number });
        const registeredMechanic = await Mechanic.register(newMechanic, password);
        console.log(registeredMechanic);
        req.flash("success", "Mechanic registered successfully");
        res.redirect("/");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/mechanic/register");
    }
};

module.exports.login=async(req, res) => {
    req.flash("success", "Welcome Mechanic");
    res.redirect("/mechanic-dashboard"); // Redirect to mechanic dashboard
};


module.exports.update=async (req, res) => {
    try {
        const updatedMechanic = await Mechanic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        req.flash("success", "Mechanic updated successfully!");
        res.redirect("/");
    } catch (err) {
        req.flash("error", "Error updating mechanic.");
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
        await Mechanic.findByIdAndDelete(req.params.id);
        req.flash("success", "Mechanic deleted successfully!");
        res.redirect("/");
    } catch (err) {
        req.flash("error", "Error deleting mechanic.");
        res.redirect("/");
    }
};
