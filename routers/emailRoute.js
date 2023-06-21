const router = require('express').Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');
router.get('/send/:userid/:amount', async (req, res) => {
  // const{firstname, lastname, email, phone}= req.body;
  const userId = req.params.userid;
  const amount = req.params.amount;
  const user = await User.findOne({ _id: userId });
  const date = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);

  // const productId= req.params.productid;
  const productBoughtIndex = user.boughtProduct.length - 1;
  const product = user.boughtProduct[productBoughtIndex];
  const delivery = product.deliveryAddress;
  // const productDetails= JSON.stringify(products[productBoughtIndex]);
  console.log(`userId: ${userId} ,  index: ${productBoughtIndex} , email:${process.env.EMAIL}, PASS:${process.env.PASS}`);
  // const imageUrl= "https://media.licdn.com/dms/image/C560BAQF6H8gAs-JyFg/company-logo_200_200/0/1627543110554?e=2147483647&v=beta&t=8-XBSF4YBb0Jxbok0ztoN4N_l8VArFvim4q9HBIAxBM";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    }
  });
  const option = {
    from: "GreatIndian_support@gmail.com",
    to: user.email,
    subject: "Great Indian Product Order Invoice",
    text: `Hello ${user.firstname} ${user.lastname}, Thanks for your Order!`,
    html: `



    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stylish Colorful Invoice</title>
  <style>
    /* CSS styles for the invoice */




    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        padding: 20px;
      }
      
      .invoice-container {
        background-color: #f2f2f2;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      
      h1 {
        color: #333;
        text-align: center;
      }
      
      .company-info {
        text-align: right;
        margin-bottom: 20px;
      }
      
      .customer-info {
        margin-bottom: 20px;
      }
      
      .product-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      
      th {
        background-color: #f2f2f2;
      }
      
      .total {
        margin-top: 20px;
        text-align: right;
      }
      
      .delivery-info {
        margin-top: 20px;
      }
      
      .cost-info {
        margin-top: 20px;
        text-align: right;
      }
      
      /* Additional styles for colorfulness */
      .highlight {
        font-size: 30px;
        color: green;
        font-weight: 600;
      }
      
      .accent-color {
        color: #e6007e;
      }
      
      .bordered-table {
        border: 1px solid #ddd;
        border-collapse: collapse;
      }
      
      .bordered-table th, .bordered-table td {
        border: 1px solid #ddd;
      }
      
      .colorful-row {
        background-color: #e6f7ff;
      }
  
      .heading{
          
      }
      .invoiceHeader{
          margin-right: 10px;
      }
     
      .logo {
        background-color: #0C1D36;

      }

      .company-name {
        color: #f9cc0b;
        font-size:50px;
        font-weight: bold;
        font-family:Fira Sans Extra Light;
      }

      .slogan {
        color: #f9cc0b;
        font-size: 25px;
        font-weight: 500;
        font-family:Alegreya SC Medium;
      }



    /* Add your CSS styles here */
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="heading">
    <div class="logo">
      <p class="company-name">Great Indian</p>
      <p class="slogan">Where Quality is King, Speed is Key, and Customer Service is Supreme!</p>
    </div>
      <h1 class="invoiceHeader">Product Invoice</h1>
    </div>
    
    <div class="company-info">
      <p>Great Indian</p>
      <p>New Delhi</p>
      <p>+9144112554412544</p>
    </div>
    
    <div class="customer-info">
      <h3 class="accent-color">Customer Information:</h3>
      <p>Customer Name: ${user.firstname} ${user.lastname}</p>
      <p>Customer Address: ${delivery.fullAddress} &nbsp; Country: ${delivery.country} &nbsp; State: ${delivery.state} &nbsp; District: ${delivery.district} &nbsp; Postal_Code: ${delivery.postalCode}</p>
      <p>Customer Phone No: ${user.phone}</p>
      <!-- Add more customer details as needed -->
    </div>
    
    <table class="product-table bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${product.productDetails
        .map(
          (item) => `
              <tr class="colorful-row">
                <td>${item.title.longTitle}</td>
                <td>${item.quantity}</td>
                <td>${item.price.cost}</td>
                <td>${item.price.cost * item.quantity}</td>
              </tr>
            `
        )
        .join('')}
        <!-- Add more rows for additional products -->
      </tbody>
    </table>
    
    <div class="delivery-info">
      <p>Delivery Date: ${date}</p>
      <!-- Add more delivery information as needed -->
    </div> 
    
    <div class="total">
      <p><strong>Subtotal: ${amount - 3.5}</strong></p>
      <p><strong>Tax:</strong> $3.50</p>
      <p class="highlight">Total: ${amount}</p>
    </div>
    
    <div class="cost-info">
      <p>Order Id: ${product.orderPaymentDetails.razorpay_order_id}</p>
      <p>Paid on Time : ${product.orderPaymentDetails.timeOfPayment}</p>
      <!-- Add more cost information as needed -->
    </div>
  </div>
</body>
</html>


        `
  };
  transporter.sendMail(option, function (err, info) {
    if (err) {
      console.log(err, 'error');
    }
    else {
      console.log(info, 'mail sent finally!')
    }
  })

  res.redirect('http://localhost:3000/orders');
  // res.status(200).json({success: true});
})
module.exports = router;