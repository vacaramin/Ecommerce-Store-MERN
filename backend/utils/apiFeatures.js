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
        
        //Removing some fields from the queryString
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el]);
        console.log(queryCopy)
        
        
        //Advance filter for price and rating etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`)
        

        console.log(queryStr)
        this.query = this.query.find(JSON.parse(queryStr));
        
        return this;
    }
} 

module.exports = APIFeatures