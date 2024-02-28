const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    userId:{
        type:String
    },
    blog:{
        type:String,
        default:0
    },
    todos: [{
        checked: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            required: true
        }
    }],
    dueDate: {
        type: String,
        default:''
    },
    dateOfCreation: {
        type: Date,
        default: Date.now     // if i use Date.now() then it would save the date when schema is created.
                              // while Date.now will store the date when the document is created
    },
    updatedAt:{
        type:Date,
        default:null
    }
})

module.exports = mongoose.model('Task', taskSchema)
