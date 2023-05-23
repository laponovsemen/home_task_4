import {APIErrorResultType, userInputModel, usersPaginationCriteriaType} from "../appTypes";


import {mongoBlogSlicing, mongoUserSlicing} from "../common";
import {ObjectId} from "mongodb";
import {createEmailSendCode} from "../auth/authDomain";
import add from 'date-fns/add'
import {usersModel} from "../mongo/mongooseSchemas";


export async function getAllUsersDB(paginationCriteria : usersPaginationCriteriaType) {
    const sortBy :string =  paginationCriteria.sortBy
    const sortDirection : 1 | -1 =  paginationCriteria.sortDirection === "asc" ? 1 : -1
    const pageNumber  =  paginationCriteria.pageNumber
    const pageSize  =  paginationCriteria.pageSize
    const searchLoginTerm  =  paginationCriteria.searchLoginTerm
    const searchEmailTerm  =  paginationCriteria.searchEmailTerm


    let searchParams = []
    if (searchEmailTerm) searchParams.push({"accountData.email" : {$regex : searchEmailTerm, $options : "i"}})
    if (searchLoginTerm) searchParams.push({"accountData.login" : {$regex : searchLoginTerm, $options : "i"}})

    let filter: {$or? : any[]}  = {$or : searchParams}
    if(searchParams.length === 0 ) filter = {}
    const totalCount = await usersModel.countDocuments(filter)
    const ToSkip = (paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1))
    const pagesCount = Math.ceil(totalCount / pageSize)

    const result = await usersModel
        .find(filter)
        .sort({[sortBy] : sortDirection})
        .skip(ToSkip)
        .limit(pageSize)


    return {
        pagesCount : pagesCount,
        page : pageNumber,
        pageSize : pageSize,
        totalCount : totalCount,
        items : result.map(item => mongoUserSlicing(item))
    }
}

export async function deleteAllUsers() {
    await usersModel.deleteMany({})
}

export async function findUserByIdDB(userId : string){
    return await usersModel.findOne({_id : new ObjectId(userId)})
}

export async function createUnconfirmedUser(login : string, password : string, email: string) {
    const dateOfCreation = new Date()
    const codeToSend = await createEmailSendCode()
    const newUnconfirmedUser : userInputModel = {
        accountData : {
            createdAt: dateOfCreation,
            email: email,
            login: login,
            password: password,
        },
        accountConfirmationData: {
            isConfirmed : false,
            code : codeToSend,
            codeDateOfExpiary : add(dateOfCreation, {
                minutes : 10
            })
        }
    }
    const newlyCreatedUser = await usersModel.collection.insertOne(newUnconfirmedUser)
    return {
        id : newlyCreatedUser.insertedId,
        accountData : {
            createdAt: dateOfCreation,
            email: email,
            login: login,

        },
        accountConfirmationData: {
            isConfirmed : false,
            code : codeToSend,
            codeDateOfExpiary : add(dateOfCreation, {
                minutes : 10
            })
        }
    }
}
export async function checkUserExistance(login : string, password : string, email: string) {
    const foundUserByLogin = await usersModel.findOne({"accountData.login" : login})
    const foundUserByEmail = await usersModel.findOne({"accountData.email" : email})
    let errors: APIErrorResultType = {errorsMessages : []}
    if(foundUserByLogin) errors.errorsMessages.push({message: "user with such login already exists", field : "login"})
    if(foundUserByEmail) errors.errorsMessages.push({message: "user with such email already exists", field : "email"})
    if(errors.errorsMessages.length === 0){
        return null
    } else {
        return errors
    }
}

export async function codeVerification(code : string)  {
    const userExists = await findUserExistanceByVerificationCode(code)
    const userCodeSpoilness = await finduserCodeSpoilness(code)
    return (userExists && userCodeSpoilness);
}
export async function findUserExistanceByVerificationCode(code : string)  {
    // @ts-ignore
    return !!await usersModel.findOne({"accountConfirmationData.code" : code})// question
}
export async function finduserCodeSpoilness(code : string)  {
    // @ts-ignore
    const foundUser = await usersModel.findOne({"accountConfirmationData.code": code})// question
    if(foundUser && foundUser.accountConfirmationData.codeDateOfExpiary) {
        return foundUser.accountConfirmationData.codeDateOfExpiary >= new Date();
    } else {
        return false
    }

}

export async function confirmUserStatus(code : string)  {
    const foundUser = await usersModel.findOne({"accountConfirmationData.code": code})
    if(foundUser) {
        const confirmedUser = await usersModel.updateOne({_id: new ObjectId(foundUser!._id)},
            {
                $set: {
                    accountConfirmationData: {
                        isConfirmed: true,
                        code: null,
                        codeDateOfExpiary: null
                    }
                }
            })
        return true
    } else {
        return false
    }

}
export async function updateUserAsUnconfirmed(email : string, code : string, dateOfExpiary : Date)  {
    const foundUser = await usersModel.findOne({"accountData.email": email})
    if(foundUser) {
        const confirmedUser = await usersModel.updateOne({_id: new ObjectId(foundUser!._id)},
            {
                $set: {
                    accountConfirmationData: {
                        isConfirmed: false,
                        code: code,
                        codeDateOfExpiary: dateOfExpiary
                    }
                }
            })
        return true
    } else {
        return false
    }

}

export async function checkUserExistanceByEmail(email : string) {
    return !!await usersModel.findOne({"accountData.email": email})
}
export async function findUserByCode(code : string) {
    return await usersModel.findOne({"accountConfirmationData.code": code})
}
export async function updateCodeOfUserConfirmation(email : string, code : string) {
    await usersModel.updateOne({"accountData.email" : email}, {$set : {"accountConfirmationData.code" : code}})
}
export async function updateUserPasswordByEmail(email : string, password : string) {
    await usersModel.updateOne({"accountData.email" : email}, {$set : {"accountData.password" : password}})
}

export async function checkingForUserConfirmationStatus(email : string) {
    const foundUser = await usersModel.findOne({"accountData.email" : email})
    return foundUser!.accountConfirmationData.isConfirmed
}




