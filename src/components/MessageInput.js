// src/components/MessageInput.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useMutation, gql } from '@apollo/client';

const ADD_USER_MESSAGE = gql`
  mutation AddUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, content: $content, sender: "user" }) {
      id
    }
  }
`;

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

    setMessage('');

    try {
      await addUserMessage({
        variables: { chat_id: chatId, content: trimmedMessage }
      });
      await triggerBot({
        variables: { chat_id: chatId, message: trimmedMessage }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(trimmedMessage);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={botIsTyping}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <IconButton
          type="submit"
          disabled={!message.trim() || botIsTyping}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'action.disabled' },
            width: 48,
            height: 48,
          }}
        >
          {botIsTyping ? <CircularProgress size={20} /> : <Send />}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default MessageInput;
