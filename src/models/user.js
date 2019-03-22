const mongose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongose.Schema({
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase() === "password" || value.length < 6) {
                throw new Error('Bad password. min 6 chars and dont use "password" as password')
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Wrong email Addres")
            }

        },
        trim: true,
        lowercase: true,
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must by positive value")
            }
        },
        default: 0,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]

})
userSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({
        _id: this._id.toString()
    }, 'secret')
    this.tokens.push({
        token
    })
    await this.save()
    return token
}
userSchema.statics.findAndVerifyPass = async (email, pass) => {

    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Bad login or password')
    }
    const isMatch = await bcrypt.compare(pass, user.password)

    if (!isMatch) {
        throw new Error('Bad login or password')
    }
    return user
}
// hidding private data
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

// hashing password
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = mongose.model('User', userSchema)
module.exports = User