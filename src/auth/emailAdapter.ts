import nodemailer from "nodemailer"

export const emailAdapter = {
    async sendEmail(email : string, subject : string, message : string) {
        let transport = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : "simsbury65@gmail.com",
                pass : "alayuxylcjthjcdi"
            }
        })

        let info = await transport.sendMail({
            from : 'Semen <simsbury65@gmail.com>',
            to : email,
            subject: subject,
            html: message
        })

        console.log(info)
        return info
    }
}