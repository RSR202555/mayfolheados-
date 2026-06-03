import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://mayfolheados-topaz.vercel.app"),
  title: "may's joias & acessórios | semijoias de luxo",
  description: "Joias banhadas a ouro com acabamento artesanal, desenhadas para elevar a sua essência com um brilho atemporal e delicado.",
  openGraph: {
    title: "may's joias & acessórios | semijoias de luxo",
    description: "Joias banhadas a ouro com acabamento artesanal, desenhadas para elevar a sua essência com um brilho atemporal e delicado.",
    url: "https://mayfolheados-topaz.vercel.app",
    siteName: "may's joias & acessórios",
    images: [
      {
        url: "/logo_rosa_may.png",
        width: 800,
        height: 800,
        alt: "may's joias & acessórios logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/logo_rosa_may.png",
    shortcut: "/logo_rosa_may.png",
    apple: "/logo_rosa_may.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400..900;1,400..900&amp;family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&amp;family=Montserrat:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
