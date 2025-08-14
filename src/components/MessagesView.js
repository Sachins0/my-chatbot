// src/components/MessagesView.js
import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  useTheme,
} from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import { useSubscription, gql } from '@apollo/client';

const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      sender
      created_at
    }
  }
`;

const MessagesView = ({ chatId }) => {
  const { data, loading, error } = useSubscription(GET_MESSAGES, {
    variables: { chat_id: chatId },
  });
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
        <Typography color="error">Error loading messages</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      {data?.messages?.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            mb: 2,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              maxWidth: '75%',
              ...(message.sender === 'user' && { flexDirection: 'row-reverse' }),
            }}
          >
            <Avatar
              sx={{
                bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                width: 32,
                height: 32,
                mx: 1,
              }}
            >
              {message.sender === 'user' ? <Person /> : <SmartToy />}
            </Avatar>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                ...(message.sender === 'user' && {
                  borderBottomRightRadius: 4,
                }),
                ...(message.sender !== 'user' && {
                  borderBottomLeftRadius: 4,
                }),
              }}
            >
              <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                {message.content}
              </Typography>
            </Paper>
          </Box>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessagesView;
