# Chat Page Refactoring - Modular Organization

## Overview
The `Chat.ts` page has been refactored to use separate utility modules, making the code more organized, maintainable, and testable.

## File Structure

### Main Files
- **`frontend/src/pages/Chat.ts`** - Main page component with `ChatEventListener()` function
- **`frontend/src/utils/websocketHandler.ts`** - WebSocket connection and messaging
- **`frontend/src/utils/searchHandler.ts`** - Search and contact fetching
- **`frontend/src/utils/messageHandler.ts`** - Message display and updates
- **`frontend/src/utils/uiEventHandler.ts`** - UI event listeners and interactions

## Module Breakdown

### 1. **websocketHandler.ts**
Handles all WebSocket operations

**Exports:**
- `connectWS(userId, WS_URL, onMessageCallback)` - Connect to WebSocket server
- `sendMessage(receiverId, content)` - Send message via WebSocket
- `chatWebSocket` - WebSocket instance (for internal use)

**Usage:**
```typescript
import { connectWS, sendMessage } from '../utils/websocketHandler';

connectWS(userId, wsUrl, (data) => {
  // Handle incoming messages
});

sendMessage(contactId, "Hello!");
```

---

### 2. **searchHandler.ts**
Manages search and contact list operations

**Exports:**
- `debounce(fn, wait)` - Debounce function for search
- `searchUsers(query, apiUrl, userId, onResults)` - Search friends/users
- `renderSearchResults(users, containerElement)` - Display search results
- `fetchContacts(apiUrl, userId, containerElement)` - Load all contacts

**Usage:**
```typescript
import { searchUsers, fetchContacts, debounce } from '../utils/searchHandler';

// Search with debouncing
const debouncedSearch = debounce((query) => {
  searchUsers(query, apiUrl, userId, (results) => {
    // Handle results
  });
}, 250);

// Fetch all contacts
fetchContacts(apiUrl, userId, containerDiv);
```

---

### 3. **messageHandler.ts**
Handles message display and chat header updates

**Exports:**
- `renderSingleMessage(message, isSender, messagesPanel)` - Display individual message
- `fetchMessages(apiUrl, userId, contactId, messagesPanel)` - Load message history
- `updateContactStatusUI(userId, status)` - Update online/offline indicator
- `updateChatHeader(usernameElement, statusElement, avatarElement, username, status, avatar)` - Update chat header

**Usage:**
```typescript
import { renderSingleMessage, fetchMessages, updateChatHeader } from '../utils/messageHandler';

// Fetch and display messages
fetchMessages(apiUrl, currentUserId, contactId, messagesPanelDiv);

// Update header when contact is selected
updateChatHeader(usernameEl, statusEl, avatarEl, "John", "online", "/avatar.jpg");

// Update single message display
renderSingleMessage(messageObj, true, messagesPanel);
```

---

### 4. **uiEventHandler.ts**
All UI interactions and DOM event listeners

**Exports:**
- `attachContactClickListeners(containerElement, onSelect)` - Contact click handler
- `setupMenuToggle(menuElement, dropdownElement)` - Toggle menu visibility
- `setupDropdownClose(dropdownElement)` - Close dropdown on outside click
- `setupCloseChat(closeButton, onClose)` - Close chat handler
- `setupBackToContacts(backButton, onBack)` - Back button handler
- `setupMessageSend(sendButton, messageInput, onSend)` - Send message handler
- `setupWindowResize(onResize)` - Window resize handler
- `setupUIEventListeners()` - Initialize all UI listeners
- `setupSearchInput()` - Search input setup (custom implementation in Chat.ts)

**Usage:**
```typescript
import { 
  setupMessageSend, 
  setupMenuToggle, 
  attachContactClickListeners 
} from '../utils/uiEventHandler';

// Set up send button
setupMessageSend(sendBtn, inputField, (content) => {
  // Handle send
});

// Set up menu
setupMenuToggle(menuBtn, dropdownMenu);

// Handle contact selection
attachContactClickListeners(contactsList, (id, name, avatar, status) => {
  // Handle selection
});
```

---

## Before vs After

### Before (All in one function)
```typescript
export function ChatEventListener() {
  // 500+ lines of mixed concerns:
  // - WebSocket handling
  // - Search logic
  // - DOM event listeners
  // - Message rendering
  // - Status updates
}
```

### After (Organized modules)
```typescript
import { connectWS } from '../utils/websocketHandler';
import { searchUsers, fetchContacts } from '../utils/searchHandler';
import { renderSingleMessage, updateChatHeader } from '../utils/messageHandler';
import { setupMenuToggle, attachContactClickListeners } from '../utils/uiEventHandler';

export function ChatEventListener() {
  // Clear, organized code:
  // - Import specialized functions
  // - Set up handlers and callbacks
  // - Connect everything together
  // Much easier to read and maintain!
}
```

---

## Key Improvements

✅ **Separation of Concerns** - Each module handles one responsibility
✅ **Reusability** - Modules can be imported in other components
✅ **Testability** - Pure functions are easier to unit test
✅ **Maintainability** - Easier to find and fix bugs
✅ **Readability** - Clear structure and purpose
✅ **Scalability** - Easy to add new features

---

## How to Use

When working on chat features:

1. **WebSocket issues?** → Check `websocketHandler.ts`
2. **Search not working?** → Check `searchHandler.ts`
3. **Messages not displaying?** → Check `messageHandler.ts`
4. **Button/UI issues?** → Check `uiEventHandler.ts`

Each file is ~50-100 lines instead of 500+ lines in one file!

---

## Future Improvements

- Extract state management into a separate module
- Add TypeScript interfaces for all data types
- Create unit tests for each utility function
- Consider moving to a more advanced state management (e.g., Pinia/Redux if using frameworks)
