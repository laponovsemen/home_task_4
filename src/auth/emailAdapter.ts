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
        const registrationLink = `https://somesite.com/confirm-email?code=${code}`
        let info = await transport.sendMail({
            from : 'Semen <simsbury65@gmail.com>',
            to : email,
            subject: subject,
            html: `<h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                <a href='registrationLink'>complete registration</a>
            </p>`
        })

        console.log(info)
        return info
    }
}