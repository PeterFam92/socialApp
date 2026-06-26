export declare class NotificationService {
    sendNotification({ token, data, }: {
        token: string;
        data: {
            title: string;
            body: string;
        };
    }): Promise<string>;
    sendNotifications({ tokens, data, }: {
        tokens: string[];
        data: {
            title: string;
            body: string;
        };
    }): Promise<PromiseSettledResult<string>[]>;
}
export declare const notification: NotificationService;
