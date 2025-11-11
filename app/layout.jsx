import "./globals.css";

export const metadata = {
  title: "Payload + Next Minimal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
          <h1>Templates</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
