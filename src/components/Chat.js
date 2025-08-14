// src/components/Chat.js
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  ExitToApp as ExitIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useSignOut } from '@nhost/react';
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';

const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;

const drawerWidth = 320;

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useSignOut();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { loading, data, refetch } = useQuery(GET_CHATS);
  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      setSelectedChatId(data.insert_chats_one.id);
      refetch();
      if (isMobile) setMobileOpen(false);
    }
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          Chat History
        </Typography>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => createChat()}
          disabled={creatingChat}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          {creatingChat ? <CircularProgress size={20} /> : 'New Chat'}
        </Button>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {loading && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}
        {data?.chats?.map((chat) => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton
              selected={selectedChatId === chat.id}
              onClick={() => {
                setSelectedChatId(chat.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.main' },
                },
              }}
            >
              <ChatIcon sx={{ mr: 2 }} />
              <ListItemText
                primary={`Chat ${chat.id.slice(0, 8)}`}
                secondary={new Date(chat.created_at).toLocaleString()}
                secondaryTypographyProps={{
                  sx: { 
                    color: selectedChatId === chat.id ? 'rgba(255,255,255,0.7)' : 'text.secondary' 
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<ExitIcon />}
          onClick={signOut}
          color="error"
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              ChatBot
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              ...(isMobile && { mt: 8 }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(isMobile && { mt: 8 }),
        }}
      >
        {selectedChatId ? (
          <>
            <MessagesView chatId={selectedChatId} />
            <MessageInput chatId={selectedChatId} />
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            }}
          >
            <ChatIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" gutterBottom>
              Select a chat to start messaging
            </Typography>
            <Typography>
              Choose an existing conversation or create a new one
            </Typography>
          </Box>
        )}
      </Box>

      {isMobile && !selectedChatId && (
        <Fab
          color="primary"
          onClick={() => createChat()}
          disabled={creatingChat}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Chat;
