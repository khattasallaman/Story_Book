const moment = require('moment')

module.exports = {    
    formateDate: function (date, formate) {
        return moment(date).format(formate)
    },
    truncate: (str, len)=> {
        if (str.length > len && str.length > 0){
            let new_str = str + ' '
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = new_str.length > 0 ? new_str : str.substr(0, len);
            return new_str + "..."
        }
        return str
    },
    stripTags: (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: (storyUser, loggedUser, storyId)=> {
        if(storyUser._id.toString() === loggedUser._id.toString()){
            return `<form class="mb-0" action="/stories/edit/${storyId}" > <button class="btn btn-sm btn-primary"><i class="fas fa-edit"></i></button></form>`
            
        }
        else {
            return ''
        }

    },
    delIcon: (storyUser, loggedUser, storyId, fromPrivate)=> {
        if(storyUser._id.toString() === loggedUser._id.toString()){
            return `<form action=${ !fromPrivate ? "stories/" + storyId : storyId} method="POST" class="mb-0">
            <input type="hidden" name="_method" value="DELETE">
            <button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
        </form>`
        }
        else {
            return 
        }
    },
    userN: (storyUser, loggedUser, storyId)=> {
        if(storyUser._id.toString() !== loggedUser._id.toString()){
            return `<span> <a href="/stories/user/${storyUser._id}" class="btn btn-primary mr-1 mt-1 btn-sm text-capitalize">${storyUser.displayName}</a></span>`
        }
        else {
            return ''
        }
    }
    ,
    select: (cselected, options) => {
        return options.fn(this).replace(
            new RegExp(' value="'+ cselected + '"'),
            '$& selected="selected"'
        ).
        replace(
            new RegExp('>' + cselected + '</option>'),
            ' selected="selected"$&'
        )
    },
    eq :(a, b) =>{
        if(a === b){
            return true
        }
        else {
            return false
        }
    },
    toString: (str) => {
        return str.toString()
    }
}
