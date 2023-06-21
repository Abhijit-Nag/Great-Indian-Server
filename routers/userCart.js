const router = require('express').Router();
const User = require('../models/User');
router.put('/addtocart', async (req, res) => {
    try {


        const { product } = req.body;
        const { user } = req.body;
        console.log(` product added to the cart for the user from the server side : ${req.body}`);
        const filter = {
            _id: user
        }
        const update = {
            $set: {
                cartProduct: product
            }
        }
        const updatedUser = await User.updateOne(filter, update);
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})


module.exports = router;