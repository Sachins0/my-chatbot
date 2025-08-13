// src/components/Chat.js
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useSignOut } from '@nhost/react';
// We will create these two components in the next steps
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';

// GraphQL query to get all of the user's chats
const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
    }
  }
`;

// GraphQL mutation to create a new chat
const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { signOut } = useSignOut();

  // Fetch chat list data
  const { loading, error, data, refetch } = useQuery(GET_CHATS);

  // Function to create a new chat
  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      // When a new chat is created, select it automatically
      setSelectedChatId(data.insert_chats_one.id);
      refetch(); // Refetch the chat list to include the new one
    }
  });

  if (loading) return (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <span>Loading messages...</span>
  </div>
);
  if (error) return (
  <div className="error-message">
    <strong>Error:</strong> {error.message}
  </div>
);

  return (
    <div className="chat-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Your Chats</h3>
          <button onClick={() => createChat()} disabled={creatingChat}>
            {creatingChat ? 'Creating...' : '+ New Chat'}
          </button>
        </div>
        <div className="chat-list">
          {data.chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-list-item ${selectedChatId === chat.id ? 'selected' : ''}`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <p>Chat from</p>
              <span>{new Date(chat.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button onClick={signOut} className="signout-button">
            Sign Out
          </button>
        </div>
      </div>

      <div className="main-chat-window">
        {selectedChatId ? (
          <>
            <MessagesView chatId={selectedChatId} />
            <MessageInput chatId={selectedChatId} />
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat or create a new one to start messaging!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;