import { messaging } from './firebase';
import logger from './logger';

export const sendNotificationToClient = (registrationToken: string, payload: any) => {
    // Send a message to the devices corresponding to the provided
    // registration tokens.
    messaging
        .sendToDevice(registrationToken, payload)
        .then(response => {
            logger.info(
                'Notifications sent:',
                `${response} successful`
            );
        })
        .catch(error => {
            logger.error('Error sending message:', error);
        });
};