import prisma from '../lib/prisma';

export default async function Dashboard() {
  let categoriesCount = 0;
  let productsCount = 0;
  let totalValorisation = 0;

  try {
    categoriesCount = await prisma.category.count();
    productsCount = await prisma.product.count();
    // Simplified fetch for demo, normally we'd compute total stock for each product
  } catch (error) {
    console.error("Database not ready yet", error);
  }

  return (
    <div>
      <h1 className="title">Tableau de Bord</h1>
      
      <div className="stats-grid">
        <div className="glass-card stat-item">
          <span className="stat-label">Valorisation Totale</span>
          <span className="stat-value">€ {totalValorisation.toFixed(2)}</span>
        </div>
        
        <div className="glass-card stat-item">
          <span className="stat-label">Catégories</span>
          <span className="stat-value">{categoriesCount}</span>
        </div>
        
        <div className="glass-card stat-item">
          <span className="stat-label">Produits Référencés</span>
          <span className="stat-value">{productsCount}</span>
        </div>
      </div>
      
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>Vue d'ensemble et Actions</h2>
        <p style={{ marginTop: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
          Bienvenue dans votre outil de gestion de stock. Pour démarrer, assurez-vous d'avoir créé des catégories 
          dans l'onglet <strong>Inventaire</strong>. <br/>
          Vous pourrez ensuite enregistrer vos produits et commencer à effectuer des <strong>Mouvements (Entrées / Sorties)</strong>.
        </p>
      </div>
    </div>
  );
}
