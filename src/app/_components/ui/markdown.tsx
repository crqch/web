import { ReactNode } from "react";

export default function MarkdownRenderer({ children, className }: {
    children: string,
    className?: string
}) {
    const parseContent = (content: string) => {

        const customTags: Record<string, ({ children, value }: {
            children: string,
            value?: string
        }) => ReactNode> = {
          'h': ({ children }) => <span className={'text-2xl font-bold'}>{children}</span>,
          'b': ({ children }) => <span className={'font-bold'}>{children}</span>,
          'a': ({ children, value }) => <span><a href={value} target="_blank">{children}</a></span>,
          'i': ({ children, value }) => <span style={{ color: value }}>{children}</span>,
          'n': () => <br/>
        };
    
        const regex = /(<\/?[^>]+>)/g;
        const parts = content.split(regex).filter(Boolean);
    
        const result = [];
        let skipNext = false;
    
        for (let i = 0; i < parts.length; i++) {
          if (skipNext) {
            skipNext = false;
            continue;
          }
    
          const part = parts[i];
    
          if(part === undefined) continue;
          if (part.startsWith('<') && part.endsWith('>')) {
            // Remove the angle brackets to get the tag name
            let tagName = part.replace(/[<>/]/g, '');
    
            // If it is a closing tag, skip processing
            if (part.startsWith('</') && part !== "</n>") {
              continue;
            }
    
            let value;
            // Check if it is a custom tag
            if(tagName.includes(",")){
              [tagName, value] = tagName.split(",")
            }
            if (customTags[tagName]) {
              const Component = customTags[tagName];
              // Get the content between the tags
              const nextPart = parts[i + 1] || '';
              result.push(<Component key={i} value={value}>{nextPart}</Component>);
              if(part !== "</n>")
                skipNext = true; // Skip the content part after this tag
            } else {
              // For other HTML tags, simply render them as is
              result.push(part);
            }
          } else {
            // For plain text parts
            result.push(<span key={i}>{part}</span>);
          }
        }
    
        return result;
      }

    return <div className={className}>
        {parseContent(children.replaceAll("\n", "</n>"))}
    </div>
}