import {countBy, keys} from 'lodash';
import {getUser} from './access';
import { User } from './models';
import io from './socketIO';
import redis from './redis';
import { supabase  } from './supabase';

const redisClient = redis.client;

const LOOKBACK_MILLIS = 1000 * 60 * 5;

async function getActiveUsers(): Promise<User[]> {
  const users = await supabase.from<User>('users').select('id, name').gt(
    'lastActivity', new Date(Date.now() - LOOKBACK_MILLIS)
  );

  supabase.from<User>('user').on('UPDATE', (payload) => {
    payload.
  })

  return users.data;
}

async function onUserChange() {
  const userCounts = await getUserCounts();
  const data = { data: { users: keys(userCounts) } };
  io.sockets.emit('change:activeusers', data);
}

export function refresh() {
  redisClient.del('users');
}

export async function onUserActivity(sessionId: string, userId: string, activity: string) {
  redisClient.hset('users', sessionId, userId, onUserChange);
  const user = await getUser(userId);
  const currentTime = new Date();
  console.log(`${currentTime.toISOString()} - onUserActivity: ${sessionId}, user: ${user.username}, activity: ${activity}`);
}

export function onUserLogout(sessionId: string) {
  redisClient.hdel('users', sessionId, onUserChange);
}
