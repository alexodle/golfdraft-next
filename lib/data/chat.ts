import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { ChatMessage } from '../models';
import { SupabaseClient } from '../supabase';
import { useSharedSubscription } from './subscription';

const CHAT_MESSAGES_TABLE = 'chat_message';

export function useChatMessages(tourneyIdOverride?: number) {
  const currentTourneyId = useTourneyId();
  const tourneyId = tourneyIdOverride ?? currentTourneyId;

  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getChatMessagesQueryClientKey(tourneyId), [tourneyId]);
  const supabase = useSupabaseClient();

  const result = useQuery<ChatMessage[]>(queryClientKey, async () => {
    return getChatMessages(tourneyId, supabase);
  });

  useSharedSubscription<ChatMessage>(
    CHAT_MESSAGES_TABLE,
    `tourneyId=eq.${tourneyId}`,
    useCallback(
      (ev) => {
        if (ev.eventType === 'INSERT') {
          queryClient.setQueryData<ChatMessage[]>(queryClientKey, (curr) => {
            return [...(curr || []), ev.new];
          });
        }
      },
      [queryClient, queryClientKey],
    ),
    { disabled: !result.isSuccess },
  );

  return result;
}

export function useChatMessageMutation(): UseMutationResult<unknown, unknown, string> {
  const tourneyId = useTourneyId();
  const supabase = useSupabaseClient();
  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const result = await supabase.from(CHAT_MESSAGES_TABLE).insert({ tourneyId, message });
      if (result.error) {
        console.dir(result.error);
        throw new Error(`Failed to insert chat message`);
      }
    },
  });
  return mutation;
}

export async function getChatMessages(tourneyId: number, supabase: SupabaseClient): Promise<ChatMessage[]> {
  const result = await supabase
    .from('chat_message')
    .select('*')
    .eq('tourneyId', tourneyId)
    .order('createdAt', { ascending: true });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to get chat messages for tourneyId: ${tourneyId}`);
  }
  return result.data;
}

function getChatMessagesQueryClientKey(tourneyId: number) {
  return [CHAT_MESSAGES_TABLE, tourneyId];
}
