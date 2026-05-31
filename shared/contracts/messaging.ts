export { type DinnerRegisteredEvent, type RewardProcessedEvent } from '../events';

export const REWARD_EXCHANGE = 'reward-system';
export const DINNER_REGISTERED_ROUTING_KEY = 'dinner.registered';
export const REWARD_PROCESSED_ROUTING_KEY = 'reward.processed';

export const DINNER_REGISTERED_QUEUE = 'dinner-registered';
export const REWARD_PROCESSED_QUEUE = 'reward-processed';
