// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// var validateEmail = function (email) {
//   var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//   return re.test(email)
// }

// // var address = new Schema({
// // hfk
// //     location: {
// //         type: String,
// //         required: [true, 'Location is required'],
// //     },
// //     postal_code: {
// //         type: String,
// //     },
// //     state: {
// //         type: String,
// //         required: [true, 'State is required'],
// //     },
// //     country: {
// //         type: String,
// //         required: [true, 'Country is required'],
// //     },
// // }, {
// //     _id: false, // this will not create _id for this schema
// // }, )

// // var product_details = new Schema({
// //     price: {
// //         type: Number,
// //         required: [true, 'Price is required'],
// //     },
// //     quantity: {
// //         type: Number,
// //         required: [true, 'Quantity is required'],
// //     },
// //     production_date: {
// //         type: String,
// //         default: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
// //             .toISOString()
// //             .substr(0, 10),
// //         required: [true, 'Production Date is required'],
// //     },
// //     expiry_date: {
// //         type: String,
// //         default: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
// //             .toISOString()
// //             .substr(0, 10),
// //         required: [true, 'Expiry Date is required'],
// //     },
// //     ratings: {
// //         type: Number,
// //         default: 0,
// //     },
// // }, {
// //     _id: false, // this will not create _id for this schema
// // }, )

// // var contact_info = new Schema({
// //     phone: {
// //         type: String,
// //         required: [true, 'phone number is required'],
// //     },
// //     email: {
// //         type: String,
// //         trim: true,
// //         lowercase: true,
// //         unique: true,
// //         required: 'Email address is required',
// //         // validate: [validateEmail, 'Please fill a valid email address'],
// //         match: [/.+@.+\..+/, 'Please fill a valid email address'],
// //     },
// //     website_url: {
// //         type: String,
// //     },
// //     website_title: {
// //         type: String,
// //     },
// // }, {
// //     _id: false, // this will not create _id for this schema
// // }, )

// // var product_category = new Schema({
// //     category: {
// //         type: String,
// //         required: [true, 'product category is required'],
// //     },
// //     type: {
// //         type: String,
// //         required: [true, 'product type is required'],
// //     },
// // }, {
// //     _id: false, // this will not create _id for this schema
// // }, )

// // var product_image_details = new Schema({
// //     src: {
// //         type: String,
// //         required: [true, 'image src is required'],
// //     },
// //     name: {
// //         type: String,
// //         required: [true, 'image name is required'],
// //     },
// //     size: {
// //         type: Number,
// //         required: [true, 'image size is required'],
// //     },
// //     type: {
// //         type: String,
// //         required: [true, 'image type is required'],
// //     },
// // }, {
// //     _id: false, // this will not create _id for this schema
// // }, )

// var test1 = new Schema({
//   title: {
//     type: String,
//     required: [true, 'Location is required'],
//   },
// })

// var test2 = new Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Location is required'],
//     },
//   },
//   {
//     _id: false,
//   },
// )
// const RelatedPostSchema = new Schema(
//   {
//     post_id: {
//       type: String,
//       required: [true, `post_id is required`],
//     },
//     user_id: {
//       type: String,
//       required: [true, `user_is is required`],
//     },
//   },
//   {
//     _id: false,
//   },
// )

// const ProductSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   test1: test1,
//   test2: test2,
//   related_posts: [RelatedPostSchema],
// })

// /*
//  {
//   "@context":"http://schema.org",
//   "@type":"Organization",
//   "url":"https://www.example.com",
//   "name":"Example Store",
//   "logo":"https://www.example.com/example.svg",
//   "contactPoint":[
//    {"@type":"ContactPoint",
//    "telephone":"+X-XXX-XXX-XXX",
//    "contactType":"customer service"}
//   ],
//   "address":{
//    "addressCountry":"Country",
//    "postalCode":"XXXXX",
//    "addressRegion":"Region",
//    "addressLocality":"Locality"}
//  }
//   */

// module.exports = mongoose.model('ProductTest', ProductSchema)
// // module.exports = mongoose.model('Product', ProductSchema)
