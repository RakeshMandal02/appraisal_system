import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Appraisal System",
  description: "Role-based Appraisal System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
