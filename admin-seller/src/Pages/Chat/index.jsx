"use client"

import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  InputAdornment,
  Tooltip,
  useTheme,
} from "@mui/material"
import { FiSend, FiMessageCircle, FiSearch, FiMoreVertical, FiPaperclip, FiMic } from "react-icons/fi"
import { FiSmile } from "react-icons/fi"

// Initialize socket connection - update with your backend URL
const socket = io("http://localhost:8000")

const ChatComponent = () => {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef(null)
  const id = typeof window !== "undefined" ? localStorage.getItem("id") : null
  const theme = useTheme()

  useEffect(() => {
    fetch("http://localhost:8000/api/userschat")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    if (!id) return

    socket.emit("join_room", selectedUser?._id)

    socket.on("chat_history", (history) => {
      setChat(history)
    })

    socket.on("receive_message", (data) => {
      setChat((prevChat) => [...prevChat, data])
    })

    return () => {
      socket.off("chat_history")
      socket.off("receive_message")
    }
  }, [id, selectedUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.trim() !== "" && id) {
      console.log(id,selectedUser)
      socket.emit("send_message", { room: selectedUser?._id, user: id, message })
      setMessage("")
    }
  }

  // Get initials for avatar
  const getInitials = (name, userId) => {
    if (name && name.length > 0) {
      return name.substring(0, 2).toUpperCase()
    }
    return userId?.substring(0, 2).toUpperCase() || "U"
  }

  // Get avatar color based on user id
  const getAvatarColor = (userId) => {
    const colors = [
      "#3f51b5", // indigo
      "#009688", // teal
      "#e91e63", // pink
      "#673ab7", // deep purple
      "#ff5722", // deep orange
      "#2196f3", // blue
      "#00bcd4", // cyan
    ]

    // Simple hash function to get consistent color for same user
    const hash = userId?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
    return colors[hash % colors.length]
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)

    const day = String(date.getDate()).padStart(2, "0")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${day} ${month} ${year}, ${hours}:${minutes}`
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user?._id !== id &&
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user._id?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {}

    messages.forEach((msg) => {
      if (!msg.timestamp) return

      const date = new Date(msg.timestamp)
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].push(msg)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(chat)

  // Format date for message groups
  const formatDateHeader = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number)
    const date = new Date(year, month, day)

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: 600,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* LEFT: User list */}
      <Box
        sx={{
          width: 300,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Messages
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch size={18} style={{ color: theme.palette.action.active }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: theme.palette.action.hover,
              },
            }}
          />
        </Box>

        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 0,
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
              borderRadius: 3,
            },
          }}
        >
          {filteredUsers.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <FiMessageCircle
                size={40}
                style={{ color: theme.palette.text.disabled, marginBottom: theme.spacing(1) }}
              />
              <Typography color="text.secondary">
                {searchQuery ? "No contacts found" : "No contacts available"}
              </Typography>
            </Box>
          ) : (
            filteredUsers.map((user) => (
              <ListItem
                button
                key={user._id}
                selected={selectedUser?._id === user._id}
                onClick={() => setSelectedUser(user)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderLeft:
                    selectedUser?._id === user._id
                      ? `4px solid ${theme.palette.primary.main}`
                      : "4px solid transparent",
                  "&.Mui-selected": {
                    bgcolor: `${theme.palette.primary.main}10`,
                  },
                  "&:hover": {
                    bgcolor: `${theme.palette.primary.main}08`,
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={Math.random() > 0.5 ? "success" : "default"}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(user._id),
                        width: 48,
                        height: 48,
                        boxShadow: 1,
                      }}
                    >
                      {getInitials(user.name, user._id)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={500} noWrap>
                      {user.name || user._id}
                    </Typography>
                  }

                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>

      {/* RIGHT: Chat area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.background.default,
        }}
      >
        {/* Chat header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >
          {selectedUser ? (
            <>
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(selectedUser._id),
                  width: 40,
                  height: 40,
                }}
              >
                {getInitials(selectedUser.name, selectedUser._id)}
              </Avatar>
              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedUser.name || selectedUser._id}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {Math.random() > 0.5 ? "Online" : "Last seen recently"}
                </Typography> */}
              </Box>
              <IconButton>
                <FiMoreVertical />
              </IconButton>
            </>
          ) : (
            <Typography variant="h6" color="text.secondary" sx={{ flex: 1 }}>
              Select a contact to start chatting
            </Typography>
          )}
        </Box>

        {/* Chat messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: theme.palette.mode === "light" ? "#f5f7fb" : theme.palette.background.default,
            backgroundImage:
              theme.palette.mode === "light"
                ? "radial-gradient(#e5e7eb 1px, transparent 1px)"
                : "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
              borderRadius: 3,
            },
          }}
        >
          {!selectedUser ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
                p: 4,
              }}
            >
              <FiMessageCircle
                size={80}
                style={{ color: theme.palette.text.disabled, marginBottom: theme.spacing(2) }}
              />
              <Typography variant="h6" gutterBottom>
                Welcome to the Chat App
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Select a contact from the list to start a conversation
              </Typography>
            </Box>
          ) : chat.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
              }}
            >
              <FiMessageCircle
                size={60}
                style={{ color: theme.palette.text.disabled, marginBottom: theme.spacing(2) }}
              />
              <Typography variant="h6" gutterBottom>
                No messages yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start the conversation with {selectedUser.name || selectedUser._id}
              </Typography>
            </Box>
          ) : (
            Object.entries(messageGroups).map(([dateKey, messages]) => (
              <Box key={dateKey} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      px: 2,
                      py: 0.5,
                      bgcolor: "rgba(0,0,0,0.04)",
                      borderRadius: 5,
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    {formatDateHeader(dateKey)}
                  </Typography>
                </Box>

                {messages.map((msg, index) => {
                  const isCurrentUser = msg.user === id
                  const showAvatar = index === 0 || messages[index - 1]?.user !== msg.user

                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: isCurrentUser ? "row-reverse" : "row",
                        alignItems: "flex-end",
                        mb: 1.5,
                      }}
                    >
                      {showAvatar ? (
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(msg.user),
                            width: 32,
                            height: 32,
                            ml: isCurrentUser ? 1 : 0,
                            mr: isCurrentUser ? 0 : 1,
                          }}
                        >
                          {getInitials(isCurrentUser ? "You" : selectedUser?.name, msg.user)}
                        </Avatar>
                      ) : (
                        <Box sx={{ width: 32, ml: isCurrentUser ? 1 : 0, mr: isCurrentUser ? 0 : 1 }} />
                      )}

                      <Box sx={{ maxWidth: "70%" }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 2.5,
                            bgcolor: isCurrentUser ? theme.palette.primary.main : theme.palette.background.paper,
                            color: isCurrentUser ? "white" : "text.primary",
                            ...(isCurrentUser
                              ? { borderBottomRightRadius: showAvatar ? 0 : 10 }
                              : { borderBottomLeftRadius: showAvatar ? 0 : 10 }),
                            boxShadow: theme.shadows[1],
                          }}
                        >
                          <Typography variant="body1">{msg.message}</Typography>
                        </Paper>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            display: "block",
                            textAlign: isCurrentUser ? "right" : "left",
                            color: "text.secondary",
                            fontSize: "0.7rem",
                            mx: 0.5,
                          }}
                        >
                          {formatTimestamp(msg?.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message input */}
        <Box
          component="form"
          onSubmit={sendMessage}
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            alignItems: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder={selectedUser ? "Type your message..." : "Select a contact to start chatting"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedUser}

            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <Tooltip title="Send message">
            <span>
              <IconButton
                color="primary"
                type="submit"
                disabled={!message.trim() || !selectedUser}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                  "&.Mui-disabled": {
                    bgcolor: theme.palette.action.disabledBackground,
                  },
                }}
              >
                <FiSend />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatComponent
