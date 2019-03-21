const mongose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
    }

})

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



userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = mongose.model('User', userSchema)
module.exports = User