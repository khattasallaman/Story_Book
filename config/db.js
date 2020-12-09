const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        // const conn = await mongoose.connect('mongodb://localhost:27017/storyBooks')
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex:true,
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log(`MongoDB connected successfully`)

    }
    catch (err) {
        // console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB