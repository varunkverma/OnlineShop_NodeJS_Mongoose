const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    // model created using mongoose has a static method called find(), it fetches all the documents of the collection that the model represents.

    Product.find().then(products => {
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'All Products',
            path:'/products'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req,res,next) => {
    // model created using mongoose has a static method called findbyId(), it fetches a the matching document of the collection that the model represents. Also, findById() also converts a string type id which it recieves as a parameter into an ObjectId
    
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-details',{
            product,
            pageTitle:product.title,
            path:'/products'
        });
    })        
    .catch( err => { 
        console.log(err);
    })
    
 }

exports.getIndex = (req,res,next) => {
    Product.find().then(products => {
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:'/'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCart = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then( user => {
        const products = user.cart.items;    
        res.render('shop/cart',{
            pageTitle: 'Your Cart',
            path: '/cart',
            products: products
        });
    })
    .catch( err => {
        console.log(err);
    });
        
}

exports.postCart = (req,res,next) => {
    
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then( product =>{
        return req.user.addToCart(product);
    })
    .then( result => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
    
}    

exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then( () => {
        res.redirect('/cart');
    })
    .catch( err => console.log(err));  
}

exports.getOrders = (req,res,next) => {
    Order.find({'user.userId':req.user._id})
    .then( orders => {
        res.render('shop/orders',{
            pageTitle: 'Your Orders',
            path: '/orders',
            orders
        });
    })
    .catch(err => console.log(err))
    
}

exports.postOrder = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        console.log(user.cart.items);
        const products = user.cart.items.map( cartItem => {
            // console.log(cartItem);
            return { 
                quantity: cartItem.quantity,
                product: {...cartItem.productId._doc}
            };
        });
        console.log("Products--->",products);
        const order = new Order({
            products:products,
            user:{
                name: req.user.name,
                userId: req.user
            } 
        });

        // save the order
        return order.save();
    })
    .then( result => {
        return req.user.clearCart();
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch( err => {
        console.log(err);
    })
}

