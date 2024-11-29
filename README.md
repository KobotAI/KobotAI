# Kobot AI 🤖💬

## Table of Contents

1. [Our Story](#our-story)  
2. [Why Kobot AI Exists](#why-kobot-ai-exists)  
3. [Our Tech Magic 🧙‍♂️](#our-tech-magic-🧙‍♂️)  
4. [Get Started in Minutes 🚀](#get-started-in-minutes-🚀)  
   - [How-To Guide](#setup-and-deployment-guide)  
   - [Code Example](#html-snippet-example)  
   - [Troubleshooting](#troubleshooting)  
5. [Join Our Mission 🤝](#join-our-mission-🤝)  
6. [License 📜](#license-📜)  
7. [Shoutouts 🙌](#shoutouts-🙌)  

---

## Our Story 

Imagine a world where engagement is instant, intelligent, and always available. That's the dream behind Kobot AI.

We've all been there - frustrated by endless wait times, and generic responses. We created Kobot AI to change that narrative. This isn't just another chatbot platform; it's a solution that empowers businesses to communicate smarter, faster, more personally, and freely.

## Why Kobot AI Exists

Technology should make human connections easier, not more complicated. Traditional engagement services feel like navigating a maze - by always clicking pre-made buttons. But what if it could be as simple and natural as having a conversation?

## Our Tech Magic 🧙‍♂️

We've carefully selected a powerful tech stack to bring Kobot AI to life:

- **Next.js**: Supercharging React with server-side rendering  
- **TypeScript**: Making our code robust and predictable  
- **Prisma**: Turning database interactions into a breeze  
- **OpenAI API**: Injecting intelligence into every conversation  
- **Tailwind CSS**: Helped craft sleek, responsive designs  
- **Pusher**: Enabling real-time  

---

## Get Started in Minutes 🚀

Setting up Kobot AI is easier than ordering coffee.

### 1. Fork and Clone the Repo

1. **Fork the Repo**:
   Visit [KobotAI Repository](https://github.com/KobotAI/KobotAI) and fork the project.

2. **Clone the Repo**:
   ```bash
   git clone https://github.com/yourusername/KobotAI.git
   cd KobotAI
   ```

### 2. Install Dependencies
```bash
bun install
```

### 3. Configure Environment
Create a `.env` file in the root directory and populate it with the required credentials. For detailed configuration, see the **Setup and Deployment Guide** below.

### 4. Launch
```bash
bun run dev
```

### 5. Explore
Open `http://localhost:3000/chatbot` and monitor the network activity

---

## [How-TO] Setup and Deployment Guide

### Prerequisites

#### Tools
- Node.js (v18+)  
- Bun or npm  
- Git  
- GitHub account  

#### Required Services
- Supabase or Neon (PostgreSQL)  
- OpenAI Account  
- Pusher (optional)  
- UploadCare (optional)  

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/KobotAI/KobotAI.git
cd KobotAI
```

#### 2. Environment Configuration
Copy `.env.sample` to `.env` and populate it with credentials. Refer to [how-to.md](./docs/how-to.md) for details.

#### 3. Database Setup
```bash
bun run prisma generate
bun run prisma db push
```

#### 4. Launch Local Development
```bash
bun run dev
```

### HTML Snippet Example

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
  
  iframe.src = "http://localhost:3000/chatbot";
  iframe.classList.add('chat-frame');
  document.body.appendChild(iframe);
  
  window.addEventListener("message", (e) => {
    if (e.origin !== "http://localhost:3000") return null;
    let dimensions = JSON.parse(e.data);
    iframe.width = dimensions.width;
    iframe.height = dimensions.height;
    iframe.contentWindow.postMessage("your-chatbot-uuid", "http://localhost:3000/"); //your-chatbot-uuid is the ChatBot id from the database
  });
</script>
```

---

### Troubleshooting

1. **Environment Variables**: Ensure all `.env` values are correct.
2. **Database Connection**: Verify the database URLs and permissions.
3. **API Keys**: Ensure OpenAI and other API keys are valid and have necessary permissions.
4. **Optional Services**: Confirm Pusher and UploadCare credentials if used.

---

## Join Our Mission 🤝

We believe in the power of community. Your contributions can help shape the future of conversational AI:

- **Spot a Bug?** Open an issue  
- **Have a Cool Feature?** Submit a pull request  
- **Improve Docs**: Every word counts  
- **Share Your Story**: Tell us how you're using Kobot AI  

---

## License 📜

We're committed to openness. Kobot AI is proudly licensed under the [GNU General Public License v3.0](./LICENSE.MD), ensuring it remains a collaborative, community-driven project.

---

## Shoutouts 🙌

Massive thanks to the incredible open-source community and the great minds behind the tech stack.
