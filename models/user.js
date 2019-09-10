const mongoose = require('mongoose');
const Product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items : [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

// Adding functionality to a mongoose's model object for the UserSchema

userSchema.methods.addToCart = function(product) {

    const cardProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if(cardProductIndex >=0){
        newQuantity = this.cart.items[cardProductIndex].quantity + 1;
        updatedCartItems[cardProductIndex].quantity = newQuantity;
    }
    else{
        updatedCartItems.push({
            productId:product._id,
            quantity:newQuantity
        });
    }

    const updatedCart = { items: updatedCartItems};
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.getOrders= function() {
    this.
    populate('cart.items.productId')
    .execPopulate()
    .then(user=> {
        let products=user.cart.items;
        console.log(products);
        return products;
    })
    .catch(err => console.log(err));    
}

userSchema.methods.clearCart= function(){
    this.cart={ items: [] };
    return this.save();
}

module.exports = mongoose.model('User',userSchema);

