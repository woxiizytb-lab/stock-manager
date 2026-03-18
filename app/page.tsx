import prisma from '../lib/prisma';

export default async function Dashboard() {
  let categoriesCount = 0;
  let productsCount = 0;
  let totalValorisation = 0;

  try {
    categoriesCount = await prisma.category.count();
    productsCount = await prisma.product.count();
    
    // Fetch all products with their movements to compute valuation
    const products = await prisma.product.findMany({
      include: { stockMovements: true }
    });

    products.forEach((p: any) => {
      let financialQuantity = 0;
      p.stockMovements.forEach((m: any) => {
        if (m.type === 'IN') {
          financialQuantity += m.quantityChange;
        } else if (m.type === 'OUT') {
          // Si c'est une location interne, on ne déduit pas la valeur financière du bilan !
          if (m.assignmentType !== 'LOCATION_INTERNE') {
            financialQuantity += m.quantityChange; // quantityChange is negative for OUT
          }
        }
      });
      if (financialQuantity > 0) {
        totalValorisation += (financialQuantity * p.defaultPurchasePrice);
      }
    });

  } catch (error) {
    console.error("Database not ready yet", error);
  }

  return (
    <div>
      <h1 className="title">Tableau de Bord</h1>
      
      <div className="stats-grid">
        <div className="glass-card stat-item">
          <span className="stat-label">Valorisation Globale du Stock</span>
          <span className="stat-value">€ {totalValorisation.toFixed(2)}</span>
        </div>
        
        <div className="glass-card stat-item">
          <span className="stat-label">Catégories Actives</span>
          <span className="stat-value">{categoriesCount}</span>
        </div>
        
        <div className="glass-card stat-item">
          <span className="stat-label">Produits Référencés</span>
          <span className="stat-value">{productsCount}</span>
        </div>
      </div>
      
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>Comment est calculée la valorisation ?</h2>
        <p style={{ marginTop: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
          La valorisation du stock représente le total de la <strong>quantité restante</strong> multiplié par le <strong>prix d'achat unitaire</strong> de chaque référence.
          <br/><br/>
          <strong>💡 Règle de Comptabilité :</strong> Lors d'une sortie de stock (OUT), si l'affectation au client est marquée comme <span style={{color: '#8b5cf6', fontWeight: 'bold'}}>Location interne</span>, le produit est physiquement retiré de l'entrepôt mais <strong>reste comptabilisé</strong> dans la valorisation financière de votre bilan ! <br/>En revanche, un <span style={{color: '#ef4444', fontWeight: 'bold'}}>Achat</span> (Vente) le déduira de la valeur.
        </p>
      </div>
    </div>
  );
}
