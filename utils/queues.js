import Bull from 'bull';

export const fileQueue = new Bull('fileQueue', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});