interface IEmailSender {
    subject: string;
    email: string;
    html: string;
}
export declare const EmailSender: {
    emailSender: ({ subject, email, html }: IEmailSender) => Promise<void>;
};
export {};
//# sourceMappingURL=emailSender.d.ts.map