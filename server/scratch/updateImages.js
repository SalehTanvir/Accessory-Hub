require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://salehtanvir852_db_user:salehtanvir23@cluster0.qanjyud.mongodb.net/accessoryhub?retryWrites=true&w=majority&appName=Cluster0').then(async () => {
  const Product = require('../models/Product');
  
  await Product.updateMany(
    { name: /sunglass/i }, 
    { $set: { image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80' } }
  );
  
  await Product.updateMany(
    { name: /rich dad/i }, 
    { $set: { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80' } }
  );
  
  await Product.updateMany(
    { image: { $exists: false } }, 
    { $set: { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' } }
  );
  
  // also update empty strings
  await Product.updateMany(
    { image: '' }, 
    { $set: { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' } }
  );

  console.log('Updated products with images!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
