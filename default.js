
const products = require('./constants/data.js');
const product = require('./models/product.js');

const DefaultData = async () => {

    products.forEach(async (doc) => {
        const productCheck = await product.findOne({ id: doc.id });
        if (!productCheck) {
            try {
                await product.insertMany(doc);
                console.log(`Data imported Successfully!`);
            } catch (err) {
                console.log(err);
            }
        }
        else {
            console.log(`Product with id ${doc.id} already exists!`);
        }
    })

}

module.exports = DefaultData;