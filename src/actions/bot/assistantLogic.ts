import OpenAi from 'openai'
import { onStoreConversations } from './index'
import { AdvancedTextPreprocessor } from './AdvancedTextPreprocessor'
import { onRealTimeChat } from '../conversation'
import { client } from '@/lib/prisma'

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
})

const preprocessor = new AdvancedTextPreprocessor()
const initialModel = 'gpt-4o-mini'

const MAX_RETRIES = 5
const RETRY_DELAY = 5000; // 5 seconds
const TIMEOUT = 300000; // 5 minutes

async function waitForRunCompletion(
  threadId: string,
  runId: string,
  startTime: number = Date.now(),
  retryCount: number = 0
): Promise<any> {
  try {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    
    while (['queued', 'in_progress', 'requires_action'].includes(runStatus.status)) {
      if (Date.now() - startTime > TIMEOUT) {
        throw new Error('Run timed out');
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    if (runStatus.status === 'failed') {
      throw new Error('Run failed');
    }

    return runStatus;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return waitForRunCompletion(threadId, runId, startTime, retryCount + 1);
    }
    throw error;
  }
}

export const handleAssistantLogic = async (
  message: string,
  chat: any[],
  customerId: string,
  isLive: boolean,
  checkCustomer: any
) => {
  if (isLive) {
    onRealTimeChat(
      checkCustomer.customer[0].chatRoom[0].id,
      message,
      'user',
      'user'
    );

    return {
      live: true,
      chatRoom: checkCustomer.customer[0].chatRoom[0].id,
    };
  }

  try {
    const preprocessedMessage = preprocessor.preprocessInput(message);
    
    const systemPrompt = `
      You are a helpful assistant. Please assist the user based on their inquiries and provide relevant responses.
      Always maintain a professional and respectful demeanor.
    `;

    // Check for required IDs
    const assistantId = process.env.ASSISTANT_ID;
    const vectorStoreId = process.env.VECTOR_STORE_ID;
    
    console.log(`Assistant ID: ${assistantId}`);
    console.log(`Vector Store ID: ${vectorStoreId}`);
    
    let threadId = checkCustomer?.customer[0].threadId;

    if (!assistantId || !threadId || !vectorStoreId) {
      // Fallback to regular chat completions if any ID is missing
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...chat,
          { role: 'user', content: preprocessedMessage },
        ],
        model: initialModel,
      });

      const responseContent = chatCompletion.choices[0].message?.content || 'No response provided';

      // Store the conversation
      await onStoreConversations(customerId, responseContent, 'assistant');

      return { response: { role: 'assistant', content: responseContent } };
    }

    // Use OpenAI Assistant with threads
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    if (!threadId) {
      const thread = await openai.beta.threads.create({
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStoreId],
          },
        },
      });
      threadId = thread.id;
      // update customer thread id
      await client.customer.update({
        where: { id: checkCustomer.customer[0].id },
        data: { threadId: threadId },
      });
    }

    // Send messages to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'assistant',
      content: `System: ${systemPrompt}`,
    });

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: preprocessedMessage,
    });

    // Start the run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
    });

    // Wait for run completion
    await waitForRunCompletion(threadId, run.id);

    // Retrieve assistant messages
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');

    if (assistantMessages.length > 0) {
      // Convert content to string if it's an array
      const responseContent = assistantMessages[assistantMessages.length - 1].content;
      
      // Ensure the content is a string
      const finalResponseContent = Array.isArray(responseContent) ? responseContent.join(' ') : responseContent;

      // Store the conversation
      await onStoreConversations(customerId, finalResponseContent, 'assistant');

      return { response: { role: 'assistant', content: finalResponseContent } };
    }

    return { response: { role: 'assistant', content: 'No response from assistant.' } };

  } catch (error) {
    console.error('Error in handleAssistantLogic:', error);
    throw error;
  }
};