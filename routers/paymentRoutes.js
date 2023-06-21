const instance = require('../configuration');
const crypto = require('crypto');
const User = require('../models/User');
const product = require('../models/product');
const router = require('express').Router();

router.post('/checkout', async (req, res) => {

    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };

        const order = await instance.orders.create(options);
        console.log(order);
        res.status(200).json({
            success: true,
            payload: order
        });
    }
    catch (error) {
        res.status(500).json(error.message);
    }

})


router.get('/getkey', async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
})

router.post('/paymentverification/:userid/:productid/:quantity', async (req, res) => {
    console.log(req.body);
    const userId = req.params.userid;
    const productId = req.params.productid;
    const quantity = req.params.quantity;
    let amount = 0;

    const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest('hex');
    console.log("sig received ", req.body.razorpay_signature);
    console.log("sig generated ", expectedSignature);
    const response = { signatureIsValid: false }
    if (expectedSignature === req.body.razorpay_signature) {

        const timeOptions = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        const indianDateTime = new Date().toLocaleString('en-US', timeOptions);
        const user = await User.findOne({ _id: userId });
        console.log(productId);
        let item = await product.findOne({ id: productId });
        amount = quantity * item.price.cost;
        console.log(item);
        let productDetails = [];
        productDetails.push(item);
        item.quantity = quantity;
        let field;

        const delivery = user.address[user.address.length - 1]

        const orderPaymentDetails = {
            razorpay_order_id: req.body.razorpay_order_id,
            razorpay_payment_id: req.body.razorpay_payment_id,
            razorpay_signature: req.body.razorpay_signature,
            expectedSignature: expectedSignature,
            timeOfPayment: indianDateTime
        };
        field = {
            productDetails: productDetails,
            orderPaymentDetails: orderPaymentDetails,
            deliveryAddress: delivery
        };
        // item.orderPaymentDetails = orderPaymentDetails;

        const updatedUser = await User.updateOne({ _id: userId }, {
            $push: {
                boughtProduct: field
            }
        })

        res.redirect(`/mail/send/${userId}/${amount}`)
        // console.log(updatedUser)
        // const date = new Date();
        // res.redirect('http://localhost:3000');
        // res.status(200).json({
        //     success: true,

        // })
    }

});

router.post("/cartorder/verification/:userId/:amount", async (req, res) => {
    try {


        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId });
        const { cartProduct } = user;
        const amount = req.params.amount;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;


        const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        const response = { signatureIsValid: false }
        if (expectedSignature === razorpay_signature) {

            const timeOptions = {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };

            const indianDateTime = new Date().toLocaleString('en-US', timeOptions);

            let field;
            let productDetails = [];
            for (let i = 0; i < cartProduct.length; i++) {
                // const productId = cartProduct[i].id;
                // const item = await product.findOne({ id: productId });
                productDetails.push(cartProduct[i]);

            }

            const delivery = user.address[user.address.length - 1]

            const orderPaymentDetails = {
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
                expectedSignature: expectedSignature,
                timeOfPayment: indianDateTime
            };

            field = {
                productDetails: productDetails,
                orderPaymentDetails: orderPaymentDetails,
                deliveryAddress: delivery
            };
            // item.orderPaymentDetails = orderPaymentDetails;

            let updatedUser = await User.updateOne({ _id: userId }, {
                $push: {
                    boughtProduct: field
                },
                $set: {
                    cartProduct: []
                }
            });

            // updatedUser= await User.updateOne({_id: userId},{
            //     $pull:{
            //         cartProduct:cartProduct
            //     }
            // }) 

            res.redirect(`/mail/send/${userId}/${amount}`);


        }
        // res.status(200).json({success:true});
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
});

// router.post("/delete", async(req, res)=>{
//     const userId= "646e5fe5c730ed88990fb136";
//     const updatedUser= await User.updateOne({_id: userId},{
//         $set:{
//             boughtProduct: []
//         }
//     })
// })








// router.post('/cartorder/verification/:userid/:amount', async (req, res) => {
//     console.log(req.body);
//     res.redirect("http://localhost:3000/orders");
//     // const userId = req.params.userid;
//     // const productId = req.params.productid;
//     // const quantity = req.params.quantity;
//     // let amount = 0;

//     // const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

//     // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
//     //     .update(body.toString())
//     //     .digest('hex');
//     // console.log("sig received ", req.body.razorpay_signature);
//     // console.log("sig generated ", expectedSignature);
//     // const response = { signatureIsValid: false }
//     // if (expectedSignature === req.body.razorpay_signature) {

//     //     const timeOptions = {
//     //         timeZone: 'Asia/Kolkata',
//     //         year: 'numeric',
//     //         month: 'long',
//     //         day: 'numeric',
//     //         hour: 'numeric',
//     //         minute: 'numeric',
//     //         second: 'numeric'
//     //     };

//     //     const indianDateTime = new Date().toLocaleString('en-US', timeOptions);
//     //     const user = await User.findOne({ _id: userId });
//     //     console.log(productId);
//     //     let item = await product.findOne({ id: productId });
//     //     amount = quantity * item.price.cost;
//     //     console.log(item);
//     //     let productDetails = [];
//     //     productDetails.push(item);
//     //     item.quantity = quantity;
//     //     let field;

//     //     const delivery = user.address[user.address.length - 1]

//     //     const orderPaymentDetails = {
//     //         razorpay_order_id: req.body.razorpay_order_id,
//     //         razorpay_payment_id: req.body.razorpay_payment_id,
//     //         razorpay_signature: req.body.razorpay_signature,
//     //         expectedSignature: expectedSignature,
//     //         timeOfPayment: indianDateTime
//     //     };
//     //     field = {
//     //         productDetails: productDetails,
//     //         orderPaymentDetails: orderPaymentDetails,
//     //         deliveryAddress: delivery
//     //     };
//     //     // item.orderPaymentDetails = orderPaymentDetails;

//     //     const updatedUser = await User.updateOne({ _id: userId }, {
//     //         $push: {
//     //             boughtProduct: field
//     //         }
//     //     })

//     //     res.redirect(`/mail/send/${userId}/${amount}`)

//     // }

// });

module.exports = router;