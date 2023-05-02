import {usersPaginationCriteriaType} from "../appTypes";
import {usersCollectionOutput} from "./usersDomain";
import {blogsCollectionOutput} from "../blogs/blogsRepositoryMongoDB";
import {mongoBlogSlicing, mongoUserSlicing} from "../common";
import {ObjectId} from "mongodb";


export async function getAllUsersDB(paginationCriteria : usersPaginationCriteriaType) {
    const sortBy :string =  paginationCriteria.sortBy
    const sortDirection : 1 | -1 =  paginationCriteria.sortDirection === "asc" ? 1 : -1
    const pageNumber  =  paginationCriteria.pageNumber
    const pageSize  =  paginationCriteria.pageSize
    const searchLoginTerm  =  paginationCriteria.searchLoginTerm
    const searchEmailTerm  =  paginationCriteria.searchEmailTerm


    let searchParams = []
    if (searchEmailTerm) searchParams.push({email : {$regex : searchEmailTerm, $options : "i"}})
    if (searchLoginTerm) searchParams.push({login : {$regex : searchLoginTerm, $options : "i"}})

    let filter: {$or? : any[]}  = {$or : searchParams}
    if(searchParams.length === 0 ) filter = {}
    const totalCount = await usersCollectionOutput.countDocuments(filter)
    const ToSkip = (paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1))
    const pagesCount = Math.ceil(totalCount / pageSize)

    const result = await usersCollectionOutput
        .find(filter)
        .sort({[sortBy] : sortDirection})
        .skip(ToSkip)
        .limit(pageSize)
        .toArray()

    return {
        pagesCount : pagesCount,
        page : pageNumber,
        pageSize : pageSize,
        totalCount : totalCount,
        items : result.map(item => mongoUserSlicing(item))
    }
}

export async function deleteAllUsers() {
    await usersCollectionOutput.deleteMany({})
}

export async function findUserByIdDB(userId : string){
    return await usersCollectionOutput.findOne({_id : new ObjectId(userId)})
}