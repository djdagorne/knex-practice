const ShoppingListService = {
    getAllItems(knex){
        //get complete array of items in shopping-list table
        return knex.select('*').from('shopping_list')
    },
    insertNewItem(knex, newItem){
        //insert new item to table and have it assigned an id
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getItemById(knex, item_id){
        //look up an item in table by id number
        return knex
            .from('shopping_list')
            .select('*')
            .where('item_id', item_id)
            .first();
    },
    updateItem(knex, item_id, newItemInformation){
        //update an item after looking it up by id
        return knex('shopping_list')
            .where({item_id})
            .update(newItemInformation)
    },
    deleteItem(knex, item_id){
        //find item by id and filter it from array
        return knex('shopping_list')
            .where({item_id})
            .delete()
    }
};

module.exports = ShoppingListService;