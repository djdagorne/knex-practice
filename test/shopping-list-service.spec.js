require('dotenv').config();
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`ShoppingListServices object`, function() {
    let db
    let testShoppingList = [
        {
            item_id: 1,
            name: 'Turkey',
            checked: false,
            price: '10.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Main'
        },
        {
            item_id: 2,
            name: 'Bacon',
            checked: false,
            price: '3.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Snack'
        },
        {
            item_id: 3,
            name: 'Chicken',
            checked: false,
            price: '9.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Breakfast'
        },
        {
            item_id: 4,
            name: 'Ranch',
            checked: false,
            price: '1.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Lunch'
        },
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })
    before(() => db('shopping_list').truncate())
    afterEach(() => db('shopping_list').truncate())
    after(() => db.destroy())

    it(`insertNewItem() inserts a new item and resolves the new item with an id and checked status`, () => {
        const newItem = {
            name: 'New Food',
            price: '10.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Main'
        }
        return ShoppingListService.insertNewItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    item_id: 1,
                    name: newItem.name,
                    checked: false,
                    price: newItem.price,
                    date_added: newItem.date_added,
                    category: newItem.category
                })
            })
    })
    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })

        it(`getAllItems() resolves all items from 'shopping-list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testShoppingList.map(item => ({
                        ...item,
                        checked: false, //since we dont specify in the test List
                    })))
                })
        })
        it(`getById() resolves an item by its item_id from 'shopping_list' table`, () => {
            const secondId = 2;
            const secondItem = testShoppingList[secondId - 1];

            return ShoppingListService.getItemById(db, secondId)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: secondItem.item_id,
                        name: secondItem.name,
                        checked: secondItem.checked,
                        price: secondItem.price,
                        category: secondItem.category,
                        date_added: secondItem.date_added,
                    })
                })
        })
        it(`deleteItem() removes an item by its item_id from 'shopping_list' table`, () => {
            const itemId = 2;
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testShoppingList.filter(item => item.item_id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })
        it(`updateItem() updates an item from 'shopping_list' table`, () => {
            const idOfItemToUpdate = 1;
            const newData = {
                name: 'Test item',
                checked: false,
                price: '11.11',
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                category: 'Main'
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newData)
                .then(() => ShoppingListService.getItemById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        item_id: idOfItemToUpdate,
                        ...newData
                    })
                })
        })
    })
    context(`Given 'shopping_list' has NO data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    })
})