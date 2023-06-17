class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    search(){
        const keyword = this.queryString ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        }:{}
        this.query = this.query.find({...keyword}); 
        return this;
    }
    filter(){
        const queryCopy = {...this.queryString}
        console.log(queryCopy)
        //Removing some fields from the queryString
        const removeFields = ['keyword', 'limit', 'page']

    }
} 
module.exports = APIFeatures