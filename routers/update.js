const User = require('../models/User');
const product = require('../models/product');

const router = require('express').Router();
router.put('/pushdata', async (req, res) => {

    try {

        const item = await product.findOne({ id: req.body.productId });
        // console.log(item);
        const { userId } = req.body;
        const { cartProduct } = await User.findOne({ _id: userId });
        let updatedUser;
        let found = false;
        // cartProduct.forEach( async (element) => {
        //     if(element.id == req.body.productId) {
        //         console.log(`${req.body.productId} exists already`);
        //          updatedUser=await User.updateOne({_id:userId},{
        //             $inc:{"cartProduct.quantity":1}
        //         });
        //         found=true;
        //     }

        // });

        for (let i = 0; i < cartProduct.length; i++) {
            if (cartProduct[i].id == req.body.productId) {
                console.log(`${req.body.productId} exists already`);
                updatedUser = await User.updateOne({ _id: userId }, {
                    $inc: { [`cartProduct.${i}.quantity`]: 1 }
                })
                found = true;
            }
        }

        if (!found) {
            updatedUser = await User.updateOne({ _id: userId }, {
                $push: {
                    cartProduct: item
                }
            })
        }

        // console.log(cartProduct)
        // const updated_user = await User.updateOne({ _id: id }, {
        //     $push: {cartProduct: req.body}
        // });

        const user = await User.findOne({ _id: userId });


        res.status(200).json({ success: true, data: user.cartProduct });

    } catch (error) {
        res.status(501).json({ error: error.message });
    }

})

router.post('/getcart', async (req, res) => {
    try {
        const { userId } = req.body;
        // console.log(`userId for google auth cart product fetch :  ${userId}`);
        // const cartItem= await User.findOne({_id: "646a2b16b6a804a5df47223b"});

        const { cartProduct } = await User.findOne({ _id: userId });
        res.status(200).json(cartProduct);
    } catch (err) {
        res.status(501).json({ error: err.message });
    }
})

router.post('/getbuyorders', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findOne({ _id: userId });
        res.status(200).json({
            success: true,
            products: user.boughtProduct
        });
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
})

// router.put('/cart/quantityupdate', async (req, res) => {

//     try {


//         const { userId } = req.body;
//         const { productId } = req.body;
//         const { task } = req.body;
//         const { cartProduct } = await User.findOne({ _id: userId });
//         const serializedData = JSON.parse(JSON.stringify(cartProduct));

//         let response;
//         for (let i = 0; i < serializedData.length; i++) {
//             if (serializedData[i].id == productId) {
//                 if (task == "inc") {

//                      response = await User.updateOne({ _id: userId }, {
//                         $inc: { [`serializedData.${i}.quantity`]: 1 }
//                     });
//                     console.log(response);
//                 }
//                 else  {
//                     if (serializedData[i].quantity > 0) {

//                          response = await User.updateOne({ _id: userId }, {
//                             $inc: { [`serializedData.${i}.quantity`]: -1 }
//                         })
//                     }
//                 }
//             }
//         }

//         const user= User.find({_id:userId});
//         res.status(200).json( user);
//     } catch (err) {
//         res.status(501).json({ error: err.message });
//     }

// })

router.put('/cart/quantityupdate', async (req, res) => {
    try {
        const { userId, productId, task } = req.body;

        const user = await User.findOne({ _id: userId });
        const cartProduct = user.cartProduct;

        let response;

        for (let i = 0; i < cartProduct.length; i++) {
            if (cartProduct[i].id == productId) {
                if (task == 'inc') {
                    response = await User.updateOne(
                        { _id: userId },
                        { $inc: { [`cartProduct.${i}.quantity`]: 1 } }
                    );
                } else {
                    if (cartProduct[i].quantity > 0) {
                        response = await User.updateOne(
                            { _id: userId },
                            { $inc: { [`cartProduct.${i}.quantity`]: -1 } }
                        );
                    }
                }
            }
        }

        const updatedUser = await User.findOne({ _id: userId });

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(501).json({ error: err.message });
    }
});


router.put('/pulldata', async (req, res) => {
    try {


        const { productId, userId } = req.body;
        const user = await User.findOne({ _id: userId });
        // const item = await product.findOne({ id: productId });
        const cartProduct = user.cartProduct;
        let response;
        for (let i = 0; i < cartProduct.length; i++) {
            if (cartProduct[i].id == productId) {
                const item = cartProduct[i];
                response = await User.updateOne({ _id: userId }, {
                    $pull: {
                        cartProduct: item
                    }
                })
            }
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
})

router.post("/setaddress", async (req, res) => {
    try {
        const { address, userId } = req.body;
        const { country, state, district, postalCode, fullAddress } = address;
        const userData = await User.findOne({ _id: userId });
        for (let i = 0; i < userData.address.length; i++) {
            if (userData.address[i].country === country && userData.address[i].state === state && userData.address[i].district === district && userData.address[i].postalCode === postalCode && userData.address[i].fullAddress === fullAddress) {
                const user = await User.updateOne({ _id: userId }, {
                    $pull: {
                        address: address
                    }
                })
            }
        };
        const user = await User.updateOne({ _id: userId }, {
            $push: {
                address: address
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
})

module.exports = router;