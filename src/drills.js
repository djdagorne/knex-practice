const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function takeString(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(results => {
            console.log('Searching for: ', searchTerm)
            console.log(results)
        })
}

//working
//takeString('kale');

function paginate(pages){
    const offset = 6 * (pages - 1); //this calculates where to start each page.
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(6)
        .offset(offset)
        .then(result => {
            console.log('Pages: ', pages);
            console.log(result);
        })
}
//noice
//paginate(1);

function getItemsAfterDate(daysAgo){
    knexInstance
        .select('name', 'date_added')
        .from('shopping_list')
        .where(
            'date_added',
            '>', 
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .orderBy([{column: 'date_added', order: 'ASC'},])
        .then(result => {
            console.log('DAYS AGO PRODUCT WAS ADDED: ', daysAgo)
            console.log(result);
        })
}

//getItemsAfterDate(2)

function totalCostOfGroup(){
    knexInstance
        .select('category')
        .sum('price AS cost')
        .count('category')
        .from('shopping_list')
        .groupBy('category')
        .orderBy([{column: 'cost', order:'ASC'}])
        .then(result => {
            console.log('TOTALING IT UP BY CATEGORY');
            console.log(result)
        })
}
//neato!
totalCostOfGroup();