const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const Review = require("./review");

const mechanicSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type:Number,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});


mechanicSchema.plugin(passportLocalMongoose);

mechanicSchema.post("findOneAndDelete",async(mechanic)=>{
    if(mechanic){
        await Review.deleteMany({_id:{$in:mechanic.reviews}});
    }
});

const Mechanic = mongoose.model("Mechanic", mechanicSchema);
module.exports = Mechanic;
