// src/components/MessagesView.js
import React, { useEffect, useRef } from 'react';
import { useSubscription, gql } from '@apollo/client';

// GraphQL subscription to get messages in real-time
const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      sender
    }
  }
`;

const MessagesView = ({ chatId }) => {
  const { data, loading, error } = useSubscription(GET_MESSAGES, {
    variables: { chat_id: chatId },
  });

  // Ref to scroll to the bottom of the message list
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]); // Scroll whenever new data arrives

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="messages-list">
      {data?.messages.map((msg) => (
        <div key={msg.id} className={`message-item ${msg.sender === 'user' ? 'sent' : 'received'}`}>
          <div className="message-bubble">
            <p>{msg.content}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesView;