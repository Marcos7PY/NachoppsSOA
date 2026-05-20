import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, ArrowLeft, Loader2, ListPlus } from 'lucide-react';
import { CategoriaDto, ProductoDto, CrearCategoriaCommand, CrearProductoCommand } from '@org/contracts';
import { InventarioApi } from '../../api/inventario.service';
import { CategoryFormModal, ProductFormModal } from './InventarioModals';
import styles from './Inventario.module.css';

export const Inventario = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [productos, setProductos] = useState<ProductoDto[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los modales
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const cargarCategorias = async () => {
    try {
      const cats = await InventarioApi.obtenerCategorias();
      setCategorias(cats);
      if (cats.length > 0 && !activeTab) {
        setActiveTab(cats[0].id);
      }
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  };

  const cargarProductos = async (catId: string) => {
    try {
      setIsLoading(true);
      const prods = await InventarioApi.obtenerProductos(catId);
      setProductos(prods);
    } catch (error) {
      console.error('Error al cargar productos', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (activeTab) {
      cargarProductos(activeTab);
    } else {
      setIsLoading(false);
    }
  }, [activeTab]);

  const handleCrearCategoria = async (data: CrearCategoriaCommand) => {
    await InventarioApi.crearCategoria(data);
    await cargarCategorias();
  };

  const handleCrearProducto = async (data: CrearProductoCommand) => {
    await InventarioApi.crearProducto(data);
    if (activeTab) await cargarProductos(activeTab);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Package size={28} className={styles.titleIcon} />
          <h1 className={styles.title}>Menú e Inventario</h1>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsCategoryModalOpen(true)}>
            <ListPlus size={18} /> Nueva Categoría
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setIsProductModalOpen(true)} disabled={!activeTab}>
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>
      </header>

      {isLoading && categorias.length === 0 ? (
        <div className={styles.loading}>
          <Loader2 size={40} className="spinner" />
        </div>
      ) : (
        <>
          {categorias.length > 0 && (
            <div className={styles.tabs}>
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.tab} ${activeTab === cat.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className={styles.loading}><Loader2 size={30} className="spinner" /></div>
          ) : (
            <div className={styles.grid}>
              {productos.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No hay productos en esta categoría</h3>
                  <p>Agrega un nuevo producto para comenzar.</p>
                </div>
              ) : (
                productos.map((prod) => (
                  <div key={prod.id} className={styles.card}>
                    <h3 className={styles.productName}>{prod.nombre}</h3>
                    {prod.descripcion && <p className={styles.productDesc}>{prod.descripcion}</p>}
                    <div className={styles.productFooter}>
                      <span className={styles.price}>S/ {prod.precio.toFixed(2)}</span>
                      {prod.stockActual !== null && (
                        <span className={`${styles.stockBadge} ${prod.stockActual < 10 ? styles.stockBadgeLow : ''}`}>
                          Stock: {prod.stockActual}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Modales */}
      <CategoryFormModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onSubmit={handleCrearCategoria} 
      />
      
      {activeTab && (
        <ProductFormModal 
          isOpen={isProductModalOpen} 
          onClose={() => setIsProductModalOpen(false)} 
          onSubmit={handleCrearProducto}
          categoriaId={activeTab}
        />
      )}
    </div>
  );
};
