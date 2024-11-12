'use server'
import { client } from '@/lib/prisma'
import { extractEmailsFromString } from '@/lib/utils'
import OpenAi from 'openai'
import { handleAssistantLogic } from './assistantLogic'
import { ChatBotResponse } from '@/hooks/chatbot/use-chatbot';

const openai = new OpenAi({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

const initialModel = 'gpt-4-mini';

export const onStoreConversations = async (
  id: string,
  message: string,
  role: 'assistant' | 'user'
) => {
  await client.chatRoom.update({
    where: { id },
    data: {
      messages: {
        create: {
          message,
          role,
        },
      },
    },
  })
}

export const onGetCurrentChatBot = async (id: string) => {
  try {
    const chatbot = await client.chatBot.findUnique({
      where: { id },
      select: {
        id: true,
        welcomeMessage: true,
        icon: true,
        textColor: true,
        background: true,
        helpdesk: true,
      },
    })
    return chatbot
  } catch (error) {
    console.log(error)
  }
}

let customerEmail: string | undefined
let customerFirstName: string | undefined
let emailConfirmed: boolean = false
let customerExists: boolean = false

export const onChatBot = async (
  id: string,
  chat: { role: 'assistant' | 'user'; content: string }[],
  author: 'user',
  message: string
): Promise<ChatBotResponse> => {
  try {
    const chatBot = await client.chatBot.findUnique({
      where: { id },
      select: {
        welcomeMessage: true,
        helpdesk: true,
      },
    });

    if (!chatBot) {
      return {
        response: {
          role: 'assistant',
          content: 'Chatbot not found.',
        }
      };
    }

    if (chatBot) {
      const extractedEmail = extractEmailsFromString(message)
      if (extractedEmail && !emailConfirmed) {
        customerEmail = extractedEmail[0]
        return {
          response: {
            role: 'assistant',
            content: `Thank you for providing your email address. To confirm, is ${customerEmail} correct? Please respond with 'Yes' or 'No'.`,
          }
        }
      }

      if (message.toLowerCase() === 'yes' && customerEmail && !emailConfirmed) {
        emailConfirmed = true
        const existingCustomer = await client.customer.findFirst({
          where: { email: customerEmail },
          select: {
            fname: true,
            chatRoom: {
              select: { id: true },
            },
          },
        })
        
        if (existingCustomer) {
          customerExists = true
          customerFirstName = existingCustomer.fname || undefined
          return {
            response: {
              role: 'assistant',
              content: `Welcome back${customerFirstName ? ', ' + customerFirstName : ''}! How can I assist you today?`,
            }
          }
        } else {
          return {
            response: {
              role: 'assistant',
              content: `Great! Your email ${customerEmail} has been confirmed. Could you please provide your first name?`,
            }
          }
        }
      }

      if (message.toLowerCase() === 'no' && customerEmail && !emailConfirmed) {
        customerEmail = undefined
        return {
          response: {
            role: 'assistant',
            content: `Okay. Could you please provide your correct email address?`,
          }
        }
      }

      if (emailConfirmed && !customerFirstName && !customerExists) {
        customerFirstName = message.trim()
        const newCustomer = await client.customer.create({
          data: {
            email: customerEmail!,
            fname: customerFirstName,
            chatRoom: {
              create: {},
            },
          },
        })

        return {
          response: {
            role: 'assistant',
            content: `Thank you, ${customerFirstName}! How can I assist you today?`,
          }
        }
      }

      if (customerEmail && emailConfirmed) {
        const customer = await client.customer.findFirst({
          where: { email: customerEmail },
          include: {
            chatRoom: true,
          },
        });

        if (customer && customer.chatRoom[0]) {
          await onStoreConversations(
            customer.chatRoom[0].id,
            message,
            author
          );

          // Simplified logic for chat handling
          const chatCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant. ${chatBot.welcomeMessage || 'How can I help you today?'}`
              },
              ...chat,
              {
                role: 'user',
                content: message,
              },
            ],
            model: initialModel,
          });

          return {
            response: {
              role: 'assistant',
              content: chatCompletion.choices[0].message.content ?? 'No response generated.',
            },
            chatRoom: customer.chatRoom[0].id,
          };
        }
      }
    }


    const checkCustomer = await client.customer.findFirst({
      where: { email: customerEmail },
      include: { chatRoom: true },
    });

    const response = await handleAssistantLogic(
      message, // User message
      chat, // Previous chat messages
      checkCustomer!.id, // Customer ID directly from checkCustomer
      false, // isLive flag
      checkCustomer // Pass the checkCustomer object
    );
    
    // Store user message in conversation history
    if (checkCustomer?.chatRoom[0]) {
      await onStoreConversations(
        checkCustomer.chatRoom[0].id,
        message,
        'user' // Assuming 'user' is the author for the user message
      );
    }

    return {
      response: {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      }
    };

  } catch (error) {
    console.log(error);
    return {
      response: {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      }
    };
  }
}