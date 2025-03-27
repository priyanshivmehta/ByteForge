const Mechanic = require("../model/mechanic");
const Review=require("../model/review");

module.exports.signup = async (req, res) => {
    try {
        console.log("Received mechanic signup request:", req.body);

        const { username, email, number, password } = req.body;

        if (!username || !email || !number || !password) {
            console.log("Missing required fields!");
            req.flash("error", "All fields are required.");
            return res.redirect("/mechanic/register");
        }

        console.log("Creating new mechanic object...");
        const newMechanic = new Mechanic({ username, email, number });

        console.log("Registering mechanic with passport-local-mongoose...");
        const registeredMechanic = await Mechanic.register(newMechanic, password);
        
        console.log("Mechanic registered successfully:", registeredMechanic);
        req.flash("success", "Mechanic registered successfully!");
        return res.redirect("/");
    } catch (err) {
        console.error("Error during mechanic signup:", err);
        req.flash("error", err.message);
        return res.redirect("/mechanic/register");
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


module.exports.reviews = async (req, res) => {
    try {
        let mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            req.flash("error", "Mechanic not found.");
            return res.redirect("/");
        }

        let newReview = new Review(req.body.review);
        await newReview.save();

        mechanic.reviews.push(newReview);
        await mechanic.save();

        req.flash("success", "New review added!");
        //res.send("new review added");
         res.redirect("/");
    } catch (err) {
        console.error("Error adding review:", err);
        req.flash("error", "Failed to add review.");
        res.redirect("/mechanic${id}");
    }
};


module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    const mechanic = await Mechanic.findById(id);
    if (!mechanic) {
        req.flash("error", "Mechanic not found.");
        return res.redirect("/");
    }

    const reviewExists = mechanic.reviews.includes(reviewId);
    if (!reviewExists) {
        req.flash("error", "Review not found.");
        return res.redirect("/");
    }

    await Mechanic.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/mechanic/${id}`);
};
