import './globals.css';

export const metadata = {
  title: 'Stock Manager App',
  description: 'Manage stocks, inventory, and clients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <h1 className="logo">Stock Manager</h1>
            <nav className="nav-menu">
              <a href="/" className="nav-link">Dashboard</a>
              <a href="/inventory" className="nav-link">Inventaire</a>
              <a href="/movements" className="nav-link">Mouvements (I/O)</a>
              <a href="/clients" className="nav-link">Clients</a>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
