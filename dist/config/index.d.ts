declare const _default: {
    env: string | undefined;
    port: string | undefined;
    base_url: string | undefined;
    bycrypt_salt_rounds: string | undefined;
    jwt: {
        access_secret: string | undefined;
        access_expires_in: string | undefined;
        refresh_secret: string | undefined;
        refresh_expires_in: string | undefined;
        reset_pass_secret: string | undefined;
        reset_pass_expires_in: string | undefined;
    };
    reset_pass_link: string | undefined;
    emailSender: {
        email: string | undefined;
        app_pass: string | undefined;
    };
    cloudinary_cloud_name: string | undefined;
    cloudinary_api_key: string | undefined;
    cloudinary_api_secret: string | undefined;
    stripe: {
        secret_key: string | undefined;
        webhook_secret: string | undefined;
        success_url: string | undefined;
        fail_url: string | undefined;
    };
    google: {
        api_key: string | undefined;
    };
    oauth: {
        google: {
            client_id: string | undefined;
            client_secret: string | undefined;
        };
        apple: {
            client_id: string | undefined;
            team_id: string | undefined;
            key_id: string | undefined;
            private_key: string | undefined;
            callback_url: string | undefined;
        };
        facebook: {
            client_id: string | undefined;
            client_secret: string | undefined;
        };
        github: {
            client_id: string | undefined;
            clientSecret: string | undefined;
        };
        twitter: {
            consumer_key: string | undefined;
            client_secret: string | undefined;
        };
        linkedin: {
            client_id: string | undefined;
            client_secret: string | undefined;
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map