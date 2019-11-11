require('dotenv').config();

const knex = require('knex');
const ArticlesService = require('./articles-service');
const ShoppingListService = require('./shopping-list-service');

const knexInstance = knex({
    client:'pg',
    connection: process.env.DB_URL,
});

ArticlesService.getAllArticles(knexInstance)
    .then(articles => console.log(articles))
    .then(() => ArticlesService.insertArticle(knexInstance, {
            title: 'New Title',
            content: 'New Content',
            date_published: new Date(),
        })
    )
    .then(newArticle => {
        console.log(newArticle);
        return ArticlesService.updateArticle(knexInstance, newArticle.id, {title:'Updated Title'})
            .then(() => ArticlesService.getById(knexInstance, newArticle.id))
    })
    .then(updatedArticle => {
        console.log(updatedArticle)
        return ArticlesService.deleteArticle(knexInstance, updatedArticle.id);
    })
    .then(() => ArticlesService.getAllArticles(knexInstance))
    .then(articles => console.log(articles))