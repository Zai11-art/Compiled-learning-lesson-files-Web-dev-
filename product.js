const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
 
main().catch(err => console.log(err));


async function main() {
    try {
        console.log('connection open')
        await mongoose.connect('mongodb://127.0.0.1:27017/shopApp');
    } catch (e) {
        console.log('error caught:', e)
    }     
}

const productSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be positive']
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
});

// productSchema.methods.greet = function () {
//     console.log('hello!');
//     console.log(`- from ${this.name}`);
// }

productSchema.methods.toggleOnSale = function() {
    this.onSale = !this.onSale;
    return this.save()
}

productSchema.methods.addCategory = function(newCat) {
    this.categories.push(newCat);
    return this.save()
}

productSchema.statics.fireSale = function () {
    return this.updateMany({}, {onSale: true, price: 0});
}

const Product = mongoose.model('Product', productSchema);

const findProduct = async () => {
    const foundProduct = await Product.findOne({name:'Bike Helmet'});
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
    await foundProduct.addCategory('Outdoors');
    console.log(foundProduct);
}

Product.fireSale().then(res => console.log(res))

// findProduct();

// const bike = new Product({name: 'Tire Pump', price: 20.00, categories: ['Cycling'], size: 'XS'})
// bike.save()
// .then(data => {
//     console.log('It worked!')
//     console.log(data)
// })
// .catch (e => {
//     console.log('did not work', e)
// })
// Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: 9 }, { new: true, runValidators: true })

// Product.findOneAndUpdate({name: 'Cycling Jersey'}, {price: 28.59}, {categories: ['Cycling']}, {size:'XS'}, )
//     .then(data => {
//         console.log('It worked!')
//         console.log(data)
//     })
//     .catch (e => {
//         console.log('did not work', e)
//     })
