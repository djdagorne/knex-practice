const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})
//creating PostgreSQL scripts using knex!

//search products by name!
function searchByProductName(searchTerm) {
    knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
        console.log(result)
    })
}
//searchProductByName('holo');

//now to make pages for our search results!
function paginateProducts(page) {
    const productsPerPage = 10;
    const offset = productsPerPage * (page -1);
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        then(results => {
            console.log(results);
        })
}
//paginateProducts(2);

//now build a query that lets us filter products with images!
function filterProductsWithImages(products) {
    knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
        console.log(result)
    })
}
//filterProductsWithImages()

// //find most popular whopipe videos!
// in SQL:
// SELECT video_name, region, count(date_viewed) AS views
// FROM whopipe_video_views
//   WHERE date_viewed > (now() - '30 days'::INTERVAL) 
// GROUP BY video_name, region
// ORDER BY region ASC, views DESC;

function mostPopularVideoForDays(days){
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where('date_viewed', '>', 
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        ) 
        //this is refered to as a prepared statement, when a 
        //user input is input as a second argument to a .raw function.
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order:'DESC' },
        ])
        .then(result => {
            console.log(result)
        })
}

//mostPopularVideoForDays(30);