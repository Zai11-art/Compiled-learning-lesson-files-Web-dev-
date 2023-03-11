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

const personSchema = new mongoose.Schema({
    first: String,
    last: String
})

personSchema.virtual('fullName').get(function() {
    return `${this.first} ${this.last}`;
})

personSchema.pre('save', async function () {
    this.first = 'YO';
    this.last = 'MAMA';
    console.log('About to Save!');
})

personSchema.post('save', async function () {
    console.log('Saved!');
})

const Person = mongoose.model('Person', personSchema);