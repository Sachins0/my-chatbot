// src/components/MessageInput.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// Mutation to add the user's message to the database
const ADD_USER_MESSAGE = gql`
  mutation AddUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, content: $content, sender: "user" }) {
      id
    }
  }
`;

// Mutation that calls our Hasura Action to trigger the bot
const TRIGGER_BOT_RESPONSE = gql`
  mutation TriggerBotResponse($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      reply
    }
  }
`;

const MessageInput = ({ chatId }) => {
  const [message, setMessage] = useState('');

  const [addUserMessage] = useMutation(ADD_USER_MESSAGE);
  const [triggerBot, { loading: botIsTyping }] = useMutation(TRIGGER_BOT_RESPONSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || botIsTyping) return;

    // Clear the input field immediately
    setMessage('');

    try {
      // Save the user's message
      await addUserMessage({ variables: { chat_id: chatId, content: trimmedMessage } });
      // Trigger the bot workflow
      await triggerBot({ variables: { chat_id: chatId, message: trimmedMessage } });
    } catch (error) {
      console.error('Error sending message:', error);
      // If something fails, put the message back in the input box
      setMessage(trimmedMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={botIsTyping ? "Bot is typing..." : "Type your message..."}
        disabled={botIsTyping}
      />
      <button type="submit" disabled={!message.trim() || botIsTyping}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;