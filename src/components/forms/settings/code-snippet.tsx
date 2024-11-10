'use client'

import React from 'react'
import Image from 'next/image'
import { Copy } from 'lucide-react'
import Section from '@/components/section-label'
import { useToast } from '@/components/ui/use-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
  id: string
}

const CodeSnippet = ({ id }: Props) => {
  const { toast } = useToast()
  let snippet = `
const iframe = document.createElement("iframe");

const iframeStyles = (styleString) => {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

iframeStyles(\`
  .chat-frame {
    position: fixed;
    bottom: 5px;
    right: 5px;
    border: none;
  }
\`)

iframe.src = "http://localhost:3000/chatbot"
iframe.classList.add('chat-frame')
document.body.appendChild(iframe)

window.addEventListener("message", (e) => {
  if(e.origin !== "http://localhost:3000") return null
  let dimensions = JSON.parse(e.data)
  iframe.width = dimensions.width
  iframe.height = dimensions.height
  iframe.contentWindow.postMessage("${id}", "http://localhost:3000/")
})
  `

  let htmlExample = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Welcome to My Web Page</h1>
    <p>This is where your main content goes.</p>

    <script>
        // Paste the code snippet here
        ${snippet}
    </script>
</body>
</html>
  `

  let nextjsExample = `

  import { useEffect } from 'react'

  export default function Layout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      const iframe = document.createElement("iframe");
  
      const iframeStyles = (styleString: string) => {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
      }
  
      iframeStyles(\`
        .chat-frame {
          position: fixed;
          bottom: 5px;
          right: 5px;
          border: none;
        }
      \`)
  
      iframe.src = "http://localhost:3000/chatbot"
      iframe.classList.add('chat-frame')
      document.body.appendChild(iframe)
  
      const handleMessage = (e: MessageEvent) => {
        if(e.origin !== "http://localhost:3000") return null
        let dimensions = JSON.parse(e.data)
        iframe.width = dimensions.width
        iframe.height = dimensions.height
        iframe.contentWindow?.postMessage("8624b8bd-8063-477a-9345-74e8d979297d", "http://localhost:3000/")
      }
  
      window.addEventListener("message", handleMessage)
  
      return () => {
        window.removeEventListener("message", handleMessage)
        document.body.removeChild(iframe)
      }
    }, [])
  
    return <>{children}</>
  }  
  `

  return (
    <div className="mt-10 flex flex-col gap-10 items-start">
      <div>
        <Section
          label="Code snippet"
          message="Copy and paste this code snippet inside the body tag of your website"
        />
        <div className="bg-cream px-10 py-5 rounded-lg inline-block relative mt-5">
          <Copy
            className="absolute top-5 right-5 text-gray-400 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(snippet)
              toast({
                title: 'Copied to clipboard',
                description: 'You can now paste the code inside your website',
              })
            }}
          />
          <SyntaxHighlighter language="javascript" style={tomorrow}>
            {snippet}
          </SyntaxHighlighter>
        </div>
      </div>

      <div>
        <Section
          label="Example Integration"
          message="Here's an example of how to integrate the code snippet into your HTML file"
        />
        <div className="bg-cream px-10 py-5 rounded-lg inline-block relative mt-5">
          <Copy
            className="absolute top-5 right-5 text-gray-400 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(htmlExample)
              toast({
                title: 'Example copied to clipboard',
                description: 'You can now use this as a reference for integration',
              })
            }}
          />
          <SyntaxHighlighter language="html" style={tomorrow}>
            {htmlExample}
          </SyntaxHighlighter>
        </div>
      </div>

      <div>
        <Section
          label="Next.js TypeScript Example"
          message="Here's an example of how to integrate the code snippet into a Next.js TypeScript application"
        />
        <div className="bg-cream px-10 py-5 rounded-lg inline-block relative mt-5">
          <Copy
            className="absolute top-5 right-5 text-gray-400 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(nextjsExample)
              toast({
                title: 'Next.js example copied to clipboard',
                description: 'You can now use this as a reference for Next.js integration',
              })
            }}
          />
          <SyntaxHighlighter language="jsx" style={tomorrow}>
            {nextjsExample}
          </SyntaxHighlighter>
        </div>
      </div>

      <div>
        <Section
          label="Integration Preview"
          message="This is how the integration will look on your website"
        />
        <div className="mt-5">
          <Image
            src="/images/bot-integration.png"
            alt="Integration Preview"
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default CodeSnippet
