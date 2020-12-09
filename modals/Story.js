const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    title:{
        type: String,
        trim:true,
        default:"",
    },
    body:{
        type: String,
        default:""
    },
    status:{
        type:String,
        default:"public",
        enum:['public', 'private']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Stories = mongoose.model('Story', StorySchema)
module.exports = Stories