const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    const emailExist = await User.findOne({email: email});
    if(emailExist) return res.status(400).send('Email already exists');

    const hashPassword = await bcrypt.hash(password, 12);

    try {
        const newUser = await User.create({
            email,
            password: hashPassword,
        });
        res.status(201).json({
            status: 'Success register',
            data: {
                user: newUser
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "Fail register",
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({
                status: 'fail',
                message: 'Incorrect email'
            });
            return;
        }

        const isCorrect = await bcrypt.compare(password, user.password)
        if (isCorrect) {
            if (req.session) {
                req.session.user = user;
            }
            res.status(200).json({
                status: 'success'
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Incorrect password'
            });
        }
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: 'server error' + e,
        });
    }
}
