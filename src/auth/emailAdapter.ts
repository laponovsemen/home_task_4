import nodemailer from "nodemailer"

export const emailAdapter = {
    async sendEmail(email : string, code : string) {
        let transport = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : "simsbury65@gmail.com",
                pass : "alayuxylcjthjcdi"
            }
        })

        const subject = "Registration"
        const message = "<h1>Thank for your registration</h1>\n<p>To finish registration please follow the link below:\n<a href=`https://home-task-4.vercel.app/registration-confirmation?code=${code}`>complete registration</a>\n</p>"
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