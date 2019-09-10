const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
        res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price; 
    const description = req.body.description;
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId:req.user
    });
    
    // models created through mongoose, interally have a save().
    product.save()
    .then( result => {
        console.log('Created Product');
        res.redirect('/admin/products');
    })
    .catch( err => {
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    // Get edit value from url using key
    const editMode = req.query.edit === "true" ? true : false; 
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    
    // for getting products related to user only:

    Product.findById(prodId)
    .then(product => {
        console.log(product);
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing:editMode,
            product
        });
    })
    .catch(err => {
        console.log(err);
    })
      
}

exports.postEditProduct = (req, res, next) => {
    
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = parseFloat(req.body.price);
    const updatedDescription = req.body.description;
    
    // the document returned by findById(), is not a JS object, but a mongoose object which has a save method. If we invoke save() on a mongoose object returned by findById(), it updates the document instead of creating a new one.
    Product.findById(prodId)
    .then( product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;

        return product.save();
    })
    .then(result => {
        console.log("UPDATED");
        res.redirect('/admin/products');
    })
    .catch(err => {
        // will catch error for both promises
        console.log(err);
    })
    
}

exports.getProducts = (req,res,next) => {
    // Get all products using mongoose model's find()

    Product.find() 
    .then( products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
    .catch( err => {
        console.log(err);
    });
}


exports.deleteProduct =(req,res,next)=>{
    const prodId = req.body.productId;

    // mongoose's model has a static method called findByIdAndRemove, which ill find a dcoument with the passed id as a parameter and then remove the document.

    Product.findByIdAndRemove(prodId)
    .then(result => {
        console.log("Product Deleted");
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}