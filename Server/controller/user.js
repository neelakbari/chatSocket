const { user } = require('../model/user');
const { token } = require('../model/token');
const userLogger = require('../log/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

exports.signup = async (req, res) => {
    try {
        const finduser = await user.findOne({ email: req.body.email });
        console.log("========Find User=========", finduser);

        if (finduser) return res.status(404).send("User AllReady Registerd...")

        const salt = await bcrypt.genSalt(10)
        const Password = await bcrypt.hash(req.body.password, salt)

        const users = new user({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: Password,
            role: req.body.role
        })

        const result = await users.save();
        console.log("**********SignUp Data*************", result);
        return res.status(200).send(result)
    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
        // userLogger.error("Error SignUp: ", error)
    }
}

exports.login = async (req, res) => {
    // console.log(req.body);
    try {
        const finduser = await user.findOne({ email: req.body.email });
        console.log("=============Find User===============", finduser);

        if (finduser) {
            const validatePassword = await bcrypt.compare(req.body.password, finduser.password)
            console.log("***********Valid Password***********", validatePassword);

            if (validatePassword) {
                const token = jwt.sign({ _id: finduser._id, email: finduser.email }, process.env.my_secret_key)
                console.log("+++++++++++Token++++++++++++", token);
                return res.status(200).send({ user: finduser, token: token })
            } else {
                res.status(404).send({ message: "Invalid Email Or Password" })
            }
        } else {
            res.status(404).send({ message: "User Does Not Exists " })
        }
    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
        userLogger.error("Error Login: ", error)
    }
}

exports.forgotpassword = async (req, res) => {
    try {
        const finduser = await user.findOne({ email: req.body.email })
        console.log("========Find User==========>>>>>", finduser);

        if (!finduser) return res.status(500).send("User Does Not Exists..")

        let Token = await token.findOne({ userId: finduser._id })
        console.log("========Token======>>>>>", Token);

        if (Token) {
            await token.deleteOne();
            return res.status(200).send("Old Token Deleted...")
        }

        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 12)
        let resetTokenExpireTime = Date.now() + 1000 * 3600;

        const newToken = await new token({
            userId: finduser._id,
            token: hash,
            resetTokenExpireTime,
        })
        const result = await newToken.save();
        console.log("******Result =====>>>>", result);

        const link = `${process.env.BASE_URL}/forgtopassword/${result.token}`;
        res.send(`password reset link sent to your ${link}`);
    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
        console.log(error);
    }
}

exports.setpassword = async (req, res) => {
    try {
        const { Token, newpassword } = req.body
        // console.log(token);

        const checkToken = await token.findOne({
            Token: Token,
            resetTokenExpireTime: { $gt: Date.now() }
        })
        console.log("======Check Token===>>>", checkToken);

        if (!checkToken) {
            throw new Error("Invalid or expired password reset token");
        }

        const finduser = await user.findOne(checkToken.userId)
        console.log("=======Find User=======>>>", finduser);

        const isValid = await bcrypt.compare(newpassword, finduser.password)
        console.log("******Isvalid=====>>>", isValid);
        if (!isValid) {
            const hash = await bcrypt.hash(newpassword, 12);
            const password = await user.updateOne(
                { _id: finduser._id },
                { $set: { password: hash } },
                { new: true }
            );
            console.log("======Update Password======>>", password);
            res.status(200).send(password)
        } else {
            return res.status(400).send("New Password And Old Password Are Same Please Change Password..")
        }

    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
        console.log(error);
    }
}

exports.changepassword = async (req, res) => {
    try {
        const data = req.user
        // console.log(req.user);

        // Enter Data req.body
        const { oldpassword, newpassword, comformpassword } = req.body

        // Finduser
        const finduser = await user.findById(data._id)
        console.log("+++++FindUser+++++", finduser);
        const password = finduser.password

        if (!finduser) return res.status(500).send("User Does Not Exists..")

        // Compare oldPassword or finduser Password
        const isValidPassword = await bcrypt.compare(oldpassword, password)
        console.log("==========Old============", isValidPassword);

        if (!isValidPassword) return res.status(500).send("Enter Correct Old Password.")

        // Compare newPassword or  conformPassword

        if (newpassword == comformpassword) {
            const hashPassword = await bcrypt.hash(comformpassword, 10)
            console.log("******Hash*******", hashPassword);

            const updateUser = await user.updateOne(data.id, { password: hashPassword }, { new: true })
            return res.status(200).send({ user: updateUser })
        } else {
            res.status(404).res({ message: "Something Went Wrong.Try Again Later..." })
        }
    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
    }
}


exports.createuser = async (req, res) => {
    console.log(req.user);
    try {
        const finduser = await user.findOne({ email: req.body.email })
        console.log("============FindUser============", finduser);

        if (finduser) return res.status(404).send("User Are Exists..")

        let users = new user({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            role: req.body.role
        });

        const result = await users.save()
        return res.status(200).send(result)
    } catch (error) {
        // userLogger.error("Error Create User: ", error)
        res.status(500).send({ message: "Please Try Again Later..." })
    }
}

exports.getuserbyid = async (req, res) => {
    try {
        const finduser = await user.findById(req.params.id);
        console.log("*********finduser***********", finduser);

        if (!finduser) return res.status(404).send("User Does Not Exists...")

        return res.status(200).send(finduser);
    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
    }
}

exports.getalluser = async (req, res) => {
    try {
        // const finduser = await user.find({}).select();
        const finduser = await user.aggregate([

            { $addFields: { Username: { $concat: ["$firstname", " ", "$lastname"] } } },
            { $project: { "firstname": 0, "lastname": 0, "email": 0, "password": 0, "role": 0, "__v": 0 } }

        ])
        console.log("*********finduser***********", finduser);
        return res.status(200).send(finduser);
    } catch (error) {
        res.status(500).send({ message: "Please Try Again Later..." })
    }
}

exports.deleteuserbyid = async (req, res) => {
    const finduser = await user.findOneAndRemove(req.params.id)
    console.log("*********finduser***********", finduser);

    if (!finduser) return res.status(200).send({ message: `Deleted a count of ${user.deletedCount} user.` })

    return res.status(200).send(finduser);
}

