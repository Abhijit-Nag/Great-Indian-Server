const User = require("../models/User");

const userSignup = async (request, response) => {
    try {
        const userCheck = await User.findOne({ $or: [{ username: request.body.username }, { email: request.body.email }] });
        if (!userCheck) {
            const user = request.body;
            const newUser = await new User(user);
            await newUser.save();
            console.log(user);

            response.status(200).json({ message: user });
        }
        else {
            if (userCheck.email == request.body.email ) {
                response.status(201).json('email already exists!!');
                console.log('email already exists!!');
            }
            else if (userCheck.username == request.body.username) {
                response.status(201).json('username already exists!!');
                console.log('username already exists!!');
            }
            else if (userCheck.username == request.body.username && userCheck.email == request.body.email) {
                response.status(201).json('username and email both exist!!');
                console.log('email and username both already exists!!');
            }
        }

    } catch (err) {
        response.status(500).json({ message: err });
        console.log('error while userSignUp api calling: ' + err);
    }
}

const userLogin = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await User.findOne({ username: username, password: password });
        if (user) {
            console.log(user);
            return res.status(200).json( {data:user});
        }
        else {
            return  res.status(401).json({errorResponse: "Invalid Credentials! Or If you are first here please do sign Up!"});
        }
    } catch (err) {
        res.status(500).json(`error while calling login api in server side` + err);
    }
}
module.exports = userSignup;
module.exports = userLogin;