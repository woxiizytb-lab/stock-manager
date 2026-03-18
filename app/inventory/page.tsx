import prisma from '../../lib/prisma';
import { createCategory, createProduct } from '../actions/inventory';

export default async function InventoryPage() {
  const products = await prisma.product.findMany({ include: { category: true } }).catch(() => []);
  const categories = await prisma.category.findMany().catch(() => []);

  return (
    <div>
      <h1 className="title">Inventaire (Références)</h1>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <h2>Créer une Catégorie</h2>
          <form action={createCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" name="name" placeholder="Nom (ex: Bureau, Voiture...)" required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
            <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Ajouter Catégorie</button>
          </form>
        </div>

        <div className="glass-card">
          <h2>Ajouter un Produit</h2>
          <form action={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" name="referenceName" placeholder="Nom du produit" required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
            <input type="number" step="0.01" name="defaultPurchasePrice" placeholder="Prix d'achat unitaire (€)" required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
            <select name="categoryId" required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white' }}>
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Ajouter Produit</button>
          </form>
        </div>
      </div>

      <div className="glass-card">
        <h2>Liste des Produits Référencés</h2>
        {products.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Aucun produit stocké pour le moment.</p>
        ) : (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.5rem 0' }}>Référence</th>
                <th>Catégorie</th>
                <th>Prix Achat Unitaire</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{p.referenceName}</td>
                  <td>{p.category?.name}</td>
                  <td>{p.defaultPurchasePrice.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
