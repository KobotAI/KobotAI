# Kobot AI: Setup and Deployment Guide

## Prerequisites

1. **Tools**:
   - Node.js (v18+)
   - Bun or npm
   - Git
   - GitHub account

2. **Required Services**:
   - Supabase or Neon (PostgreSQL)
   - OpenAI Account
   - Pusher (optional)
   - UploadCare (optional)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KobotAI/KobotAI.git
cd KobotAI
```

### 2. Environment Configuration

#### Create `.env` File
Copy `.env.sample` to `.env` and populate with credentials:

```plaintext
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Pusher Configuration
NEXT_PUBLIC_PUSHER_APP_CLUSTER=eu
PUSHER_APP_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_APP_ID=your_pusher_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# UploadCare
UPLOAD_CARE_PUBLIC_KEY=your_uploadcare_public_key
UPLOAD_CARE_SECRET_KEY=your_uploadcare_secret_key

# Database URLs
DATABASE_URL=your_supabase_connection_pooling_url
DIRECT_URL=your_supabase_direct_connection_url

# OpenAI Assistant
ASSISTANT_ID=your_openai_assistant_id
VECTOR_STORE_ID=your_openai_vector_store_id
```

### 3. Database Setup

#### Install Prisma CLI
```bash
npm install -g prisma
# or
bun add -g prisma
```

#### Generate Prisma Client
```bash
bun run prisma generate
```

#### Push Database Schema
```bash
bun run prisma db push
```

### 4. OpenAI Assistant Configuration

1. Create an OpenAI Assistant in the OpenAI platform
2. Create a Vector Store and attach documents
3. Note down the Assistant ID and Vector Store ID
4. Add these to your `.env` file

### 5. Chatbot Database Configuration

Open your database management tool (Supabase/Neon) and insert a chatbot configuration:

```sql
INSERT INTO "ChatBot" 
(welcome_message, icon, background, text_color, helpdesk)
VALUES 
(
  'Hello! How can I help you today?', 
  'https://example.com/icon.png', 
  '#F5F5F5', 
  '#333333', 
  true
);
```

### 6. Local Development

```bash
bun install
bun run dev
```

### 7. Deployment Integration

#### HTML Snippet Example
```html
<script>
  const iframe = document.createElement("iframe");
  
  const iframeStyles = (styleString) => {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }
  
  iframeStyles(`
    .chat-frame {
      position: fixed;
      bottom: 5px;
      right: 5px;
      border: none;
    }
  `);
  
  iframe.src = "https://your-deployed-domain.com/chatbot";
  iframe.classList.add('chat-frame');
  document.body.appendChild(iframe);
  
  window.addEventListener("message", (e) => {
    if (e.origin !== "https://your-deployed-domain.com") return null;
    let dimensions = JSON.parse(e.data);
    iframe.width = dimensions.width;
    iframe.height = dimensions.height;
    iframe.contentWindow.postMessage("your-chatbot-uuid", "https://your-deployed-domain.com/");
  });
</script>
```

## Troubleshooting

- Ensure all environment variables are correctly set
- Check database connection strings
- Verify OpenAI API key permissions
- Confirm Pusher and UploadCare credentials

## Next Steps

1. Customize chatbot appearance
2. Train your OpenAI assistant
3. Configure vector store documents
4. Test integration on your website

## Support

- GitHub Issues: [Repository](https://github.com/KobotAI/KobotAI)
- Community Discord: [invite link]
- Email Support: support@kobotai.co
