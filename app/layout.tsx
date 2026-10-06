import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata = {
  title: "Cofetăria Dulce Gust",
  description: "Laborator artizanal premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
