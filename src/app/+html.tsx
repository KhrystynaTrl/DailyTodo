import { ScrollViewStyleReset } from "expo-router/html";
import { PropsWithChildren } from "react";

// Nasconde la scrollbar visiva sul web (finestra e ogni ScrollView interna),
// mantenendo lo scroll utilizzabile con rotellina/touch/tastiera.
const hideScrollbars = `
  html, body, #root, * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: hideScrollbars }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
