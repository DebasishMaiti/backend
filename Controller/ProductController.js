const ProductModel = require("../Model/ProductModel");
const OrderModel = require("../Model/OrderModel")
const fs = require("fs");
const slugify = require("slugify")
const braintree = require("braintree");
require('dotenv').config();
const { ok } = require("assert");

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MARCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.getProduct = async (req, res) => {
    let page = req.query.page;
    page = page ? page - 1 : 0;
    let perPage = 8;
    let startPoint = page * perPage;
    let query = req.query.q ? { name: { $regex: req.query.q, $options: 'i' } } : {};

    try {
        let totalRecord = await ProductModel.countDocuments(query);
        const product = await ProductModel.find(query).skip(startPoint).limit(perPage);
        res.status(200).send({
            message: "All products",
            product,
            totalRecord
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in getting products",
            error
        });
    }
};

exports.filterProduct = async (req, res) => {
    try {
        const { checked, radio, subcategory } = req.body;
        let page = req.query.page;
        page = page ? page - 1 : 0;
        let perPage = 8;
        let startPoint = page * perPage;
        let query = {};
        if (checked.length > 0) query.category = checked;
        if (subcategory.length > 0) query.subcategory = subcategory;
        if (radio.length > 0) query.price = { $gte: radio[0], $lte: radio[1] };
        const product = await ProductModel.find(query).skip(startPoint).limit(perPage)
        const totalRecord = await ProductModel.countDocuments(query)
        res.status(200).send({
            product, totalRecord
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error in filter product",
            error
        })
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await ProductModel.findOne({ slug }).select("-photo").populate("category")
        res.status(200).send({
            message: "single product",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: " Error in single product",
            error
        })
    }
};

exports.getProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: " Error in product photo",
            error
        })
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, quantity, shipping } = req.body;
        const { file } = req; // Access the file from multer

        if (!name || !description || !price || !category || !quantity || !file || !shipping) {
            return res.status(400).send({ message: "Please provide all details" });
        }

        const product = new ProductModel({
            name,
            description,
            price,
            category,
            subcategory,
            quantity,
            shipping,
            slug: slugify(name)
        });

        if (file) {
            product.photo.data = fs.readFileSync(file.path);
            product.photo.contentType = file.mimetype;
        }

        await product.save();
        res.status(201).send({
            message: "New product Created",
            product
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Create Product",
            error
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, quantity, shipping } = req.body;

        // Validate input
        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).send({ message: "Please provide all details" });
        }

        // Find the product by ID
        let product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Update fields
        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        product.quantity = quantity;
        product.shipping = shipping === '1';
        product.slug = slugify(name);

        // Handle file upload
        if (req.file) {

            if (!product.photo) {
                product.photo = {};
            }
            product.photo.data = fs.readFileSync(req.file.path);
            product.photo.contentType = req.file.mimetype;
        }

        // Save the updated product
        await product.save();

        res.status(200).send({
            message: "Product Updated",
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error in Update Product",
            error
        });
    }
};



exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByIdAndDelete(id);
        res.status(200).send({
            message: "Product deleted Successfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: " Error in delete product",
            error
        })
    }
}

exports.similerProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const product = await ProductModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').limit(3).populate('category')
        res.status(200).send({
            message: "similer products",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in related Product",
            error
        })
    }
}

exports.braintreetoken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(400).send(err)
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error);
    }

}

exports.braintreepayment = async (req, res) => {
    const { cart, nonce } = req.body
    const { uid } = req.params
    try {
        let total = 0;
        cart.map((i) => {
            total += i.price
        })
        // for (let i = 0; i < cart.length; i++) {
        //     total += cart[i].price;


        //     await ProductModel.findByIdAndUpdate(cart[i]._id, {
        //         $inc: { salesCount: 1 }
        //     })
        // }
        let newTransaction = await gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            async function (error, result) {
                if (result) {
                    const order = await new OrderModel({
                        products: cart,
                        payment: result,
                        buyer: uid,

                    }).save();

                    res.status(200).send({
                        message: 'Order placed successfully',
                        order: order
                    });
                } else {
                    res.status(400).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error);

    }
}

exports.braintreepayments = async (req, res) => {
    const { cart, nonce } = req.body
    const { uid } = req.params
    try {
        let total = 0;
        cart.map((i) => {
            total += i.price
        })
        // for (let i = 0; i < cart.length; i++) {
        //     total += cart[i].price;

        //     console.log(cart[i]._id, "test");

        //     await ProductModel.findByIdAndUpdate(cart[i]._id, {
        //         $inc: { salesCount: 1 }
        //     })
        //}
        let newTransaction = await gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            async function (error, result) {
                if (result) {
                    const order = await new OrderModel({
                        products: cart,
                        payment: result,
                        Buyer: uid,

                    }).save();

                    res.status(200).send({
                        message: 'Order placed successfully',
                        order: order // Send the full order details in the response
                    });
                } else {
                    res.status(400).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error);

    }
}

exports.getBestSellingProducts = async (req, res) => {
    try {
        const now = new Date();


        const startOfThreeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month


        const bestSellingProducts = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfThreeMonthsAgo, $lte: endOfLastMonth },
                },
            },
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products',
                    totalSold: { $sum: 1 },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 4 },
        ]);

        const populatedProducts = await ProductModel.populate(bestSellingProducts, {
            path: '_id',
            select: 'name price description slug',
        });

        res.status(200).send(bestSellingProducts);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in getBestSellingProducts",
            error,
        });
    }
};



// exports.getBestSellingProducts = async (req, res) => {
//     try {
//         const products = await ProductModel.find().sort({ salesCount: -1 }).limit(4);
//         res.status(200).send({
//             message: "best Selling Products",
//             products
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             message: "Error in getBestSellingProduct",
//             products
//         })
//     }
// }

exports.getPriceRanges = async (req, res) => {
    try {
        // Find the minimum and maximum prices from the products collection
        const minPrice = await ProductModel.findOne().sort({ price: 1 }).select('price').limit(1);
        const maxPrice = await ProductModel.findOne().sort({ price: -1 }).select('price').limit(1);

        if (!minPrice || !maxPrice) {
            return res.status(404).send({ message: "No products found" });
        }

        // Define dynamic price ranges based on min and max prices
        const priceRanges = generatePriceRanges(minPrice.price, maxPrice.price);

        res.status(200).send({ priceRanges });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in getting price ranges",
            error
        });
    }
};



const generatePriceRanges = (min, max) => {
    const ranges = [];
    const rangeSize = 50; // Define the range size, e.g., 50 in this case

    // Start from the minimum value and increment by the range size
    for (let i = min; i < max; i += rangeSize) {
        const start = i;
        const end = i + rangeSize - 1;

        // Push each range into the ranges array
        ranges.push([start, Math.min(end, max)]);
    }

    return ranges;
};
