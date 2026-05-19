"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks, Plus, Search, Edit2, Trash2, Package, Star,
  TrendingUp, AlertTriangle, RefreshCw, ImageIcon, LogOut,
  LayoutDashboard, ShoppingCart, List, Minus, Printer, CheckCircle, Clock
} from "lucide-react";
import Image from "next/image";
import ProductModal from "./components/ProductModal";
import InvoicePrint from "./components/InvoicePrint";

type Product = {
  id: number; name: string; price: number; category: string;
  image: string; imageUrl?: string; stock: number; pieces: number;
  ageRange: string; rating: number; createdAt: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type TransactionHistory = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
};

const categoryEmojis: Record<string, string> = {
  technic:"🏎️", starwars:"🚀", city:"🏙️", creator:"🎢",
  harrypotter:"🏰", architecture:"🗽", ninjago:"🐉", friends:"🌸",
  minecraft:"⛏️", ideas:"💡", icons:"⭐", duplo:"🧒",
};

const categoryColors: Record<string, string> = {
  technic:"#FF7E14", starwars:"#0055BF", city:"#00852B", creator:"#FFD500",
  harrypotter:"#8B4DBF", architecture:"#A0A5A9", ninjago:"#D1120D", friends:"#E85298",
  minecraft:"#00852B", ideas:"#FFD500", icons:"#0055BF", duplo:"#D1120D",
};

function StockBadge({ stock }: { stock: number }) {
  const color = stock > 20 ? "#00852B" : stock > 5 ? "#FFD500" : "#D1120D";
  const label = stock > 20 ? "In Stock" : stock > 5 ? "Low Stock" : "Critical";
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

export default function POSPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pos" | "products" | "history">("dashboard");
  const [history, setHistory] = useState<TransactionHistory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [userRole, setUserRole] = useState("staff");

  // Cart & Transaction state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactionId, setTransactionId] = useState<string>("24737");
  const [checkoutModal, setCheckoutModal] = useState<"hidden" | "confirm" | "success">("hidden");
  const invoiceRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        showToast("error", data?.error || "Failed to load products");
        setProducts([]);
      } else {
        setProducts(data);
      }
    } catch {
      showToast("error", "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { 
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole") || "staff");
    }
    fetchProducts(); 
  }, [fetchProducts]);

  const handleSave = async (form: Omit<Product, "id" | "createdAt">) => {
    const url = editProduct ? `/api/products/${editProduct.id}` : "/api/products";
    const method = editProduct ? "PUT" : "POST";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error("Save failed");
    showToast("success", editProduct ? "Product updated!" : "Product created!");
    setEditProduct(null);
    await fetchProducts();
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      showToast("success", "Product deleted");
      await fetchProducts();
    } catch {
      showToast("error", "Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartTax = cartTotal * 0.10;
  const cartGrandTotal = cartTotal + cartTax;

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setCheckoutModal("confirm");
  };

  const handleCompleteTransaction = () => {
    const newTx: TransactionHistory = {
      id: transactionId,
      date: new Date().toLocaleString(),
      items: [...cart],
      total: cartGrandTotal
    };
    setHistory(prev => [newTx, ...prev]);
    setCheckoutModal("success");
  };

  const handlePrintInvoice = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleNewTransaction = () => {
    setCart([]);
    setTransactionId(Math.random().toString(10).substring(2, 7)); // New random ID
    setCheckoutModal("hidden");
  };

  const filtered = products.filter((p) => {
    const pCategory = p.category || "";
    const pName = p.name || "";
    const matchesSearch = pName.toLowerCase().includes(search.toLowerCase()) || pCategory.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || pCategory.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["All", ...Array.from(new Set(products.map(p => p.category || "")))];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#08080f] via-[#11111a] to-[#08080f] text-[#F8F8F8]">
      {/* Thin Sidebar (Icons only) */}
      <aside className="w-24 flex-shrink-0 flex flex-col items-center py-6 h-screen sticky top-0 bg-[#0d0d14]/80 backdrop-blur-xl border-r border-white/5 shadow-2xl z-20">
        {/* Logo */}
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-8" style={{ border: "1px solid rgba(255,213,0,0.3)" }}>
          <Blocks className="w-6 h-6 text-lego-yellow" />
        </div>

        {/* Nav Icons */}
        <nav className="flex-1 w-full flex flex-col items-center gap-6 mt-4">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "pos", icon: ShoppingCart, label: "POS" },
            { id: "products", icon: Package, label: "Inventory" },
            { id: "history", icon: Clock, label: "History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="relative flex flex-col items-center justify-center group w-full py-2"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-br from-lego-yellow to-yellow-600 text-black shadow-[0_0_20px_rgba(255,213,0,0.3)] scale-110"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
              }`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-2 font-bold tracking-wider uppercase transition-colors ${
                activeTab === tab.id ? "text-lego-yellow" : "text-white/40 group-hover:text-white"
              }`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-lego-yellow rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer Icons */}
        <div className="mt-auto flex flex-col gap-4 w-full items-center mb-4">
          <button onClick={() => { window.location.href = '/' }} className="relative flex flex-col items-center group w-full py-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 bg-red-500/10 text-red-500/60 hover:bg-red-500/20 hover:text-red-400 group-hover:scale-110">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-2 font-bold tracking-wider uppercase text-red-500/40 group-hover:text-red-400 transition-colors">
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TAB: POS */}
        {activeTab === "pos" && (
          <div className="flex-1 flex h-full">
            {/* Left side: POS Grid */}
            <div className="flex-1 flex flex-col h-full overflow-hidden p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">Point of Sale</h1>
                  <p className="text-white/40 text-sm">Fulfill orders with precision.</p>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-20 content-start auto-rows-max">
                {loading ? (
                   <div className="col-span-full flex justify-center py-20 text-white/30">Loading...</div>
                ) : filtered.length === 0 ? (
                   <div className="col-span-full flex justify-center py-20 text-white/30">No products found.</div>
                ) : (
                  filtered.map(p => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-3 flex flex-col border border-white/10 transition-all hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                    >
                      <div className="w-full h-24 mb-3 relative rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center border border-white/5">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-2 drop-shadow-2xl" />
                        ) : (
                          <div className="text-4xl drop-shadow-xl">{categoryEmojis[p.category || ""] || "📦"}</div>
                        )}
                      </div>
                      <div className="text-[9px] font-black text-lego-yellow uppercase tracking-widest mb-1">{p.category || "UNKNOWN"}</div>
                      <h4 className="font-bold text-sm text-white line-clamp-1 mb-2 flex-1">{p.name}</h4>
                      
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                        <span className="font-black text-lg text-white">${p.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(p)}
                          className="w-8 h-8 rounded-xl bg-lego-yellow text-black flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-[0_0_10px_rgba(255,213,0,0.3)]"
                        >
                          <Plus className="w-4 h-4 font-bold" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Right side: Cart */}
            <div className="w-96 flex-shrink-0 flex flex-col h-full bg-[#0d0d14]/60 backdrop-blur-2xl border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] z-10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div>
                  <h3 className="font-black text-xl">Current Order</h3>
                  <div className="text-xs text-white/30 font-mono mt-1 uppercase">ORDER #{transactionId}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20">
                      <ShoppingCart className="w-12 h-12 mb-4 opacity-30" />
                      <p className="text-sm font-bold">No items in order</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        className="flex gap-4 items-center"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden flex-shrink-0 border border-white/10">
                          {item.product.imageUrl ? (
                            <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-1.5 drop-shadow-md" />
                          ) : (
                            <span className="text-xl">{categoryEmojis[item.product.category || ""] || "📦"}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="text-sm font-bold truncate pr-2">{item.product.name}</h5>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-white/20 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-1">
                              <button onClick={() => updateCartQuantity(item.product.id, -1)} className="text-white/40 hover:text-white"><Minus className="w-3 h-3" /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item.product.id, 1)} className="text-white/40 hover:text-white"><Plus className="w-3 h-3" /></button>
                            </div>
                            <span className="font-bold text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="p-6 bg-black border-t border-white/5">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                    <span>Service Tax</span>
                    <span>${cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/10">
                    <span className="text-base font-bold text-white">Payable Total</span>
                    <span className="text-3xl font-black text-white">${cartGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  disabled={cart.length === 0}
                  className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-lego-yellow to-yellow-500 text-black shadow-[0_0_20px_rgba(255,213,0,0.2)] hover:shadow-[0_0_30px_rgba(255,213,0,0.4)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Complete Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS (Inventory) */}
        {activeTab === "products" && (
          <div className="flex-1 p-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">Inventory</h1>
                  <p className="text-white/40 text-sm">Manage your products.</p>
                </div>
                {userRole === "admin" && (
                  <motion.button
                    onClick={() => { setEditProduct(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black bg-white text-black hover:bg-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </motion.button>
                )}
              </div>

              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <div className="grid grid-cols-[60px_1fr_120px_100px_80px_100px] gap-4 px-5 py-4 text-xs font-bold text-white/40 uppercase tracking-wider border-b border-white/5">
                  <span>Image</span>
                  <span>Name</span>
                  <span>Category</span>
                  <span>Price</span>
                  <span>Stock</span>
                  <span className="text-right">Actions</span>
                </div>
                <div className="divide-y divide-white/5">
                  {products.map((p) => (
                    <div key={p.id} className="grid grid-cols-[60px_1fr_120px_100px_80px_100px] gap-4 px-5 py-3 items-center hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-black/50 overflow-hidden relative border border-white/10">
                        {p.imageUrl ? <Image src={p.imageUrl} alt={p.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center">{categoryEmojis[p.category || ""] || "📦"}</div>}
                      </div>
                      <div className="font-bold text-sm truncate">{p.name}</div>
                      <div className="text-xs text-white/50 capitalize">{p.category || "unknown"}</div>
                      <div className="font-mono text-sm">${p.price}</div>
                      <div><StockBadge stock={p.stock} /></div>
                      <div className="flex justify-end gap-2">
                        {userRole === "admin" ? (
                          <>
                            <button onClick={() => { setEditProduct(p); setModalOpen(true); }} className="p-2 text-white/30 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 text-white/30 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <span className="text-xs text-white/20 px-2 py-1 font-bold">View Only</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {activeTab === "history" && (
          <div className="flex-1 p-8 overflow-y-auto">
             <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-1">Transaction History</h1>
                <p className="text-white/40 text-sm">View past orders and receipts.</p>
             </div>
             
             <div className="rounded-2xl overflow-hidden bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="grid grid-cols-[120px_1fr_120px_150px] gap-4 px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider border-b border-white/10 bg-black/40">
                  <span>Order ID</span>
                  <span>Date & Time</span>
                  <span>Items</span>
                  <span className="text-right">Total Amount</span>
                </div>
                <div className="divide-y divide-white/5">
                  {history.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-white/30">
                      <Clock className="w-12 h-12 mb-4 opacity-20" />
                      <div className="font-bold">No transactions yet.</div>
                    </div>
                  ) : (
                    history.map(tx => (
                      <div key={tx.id} className="grid grid-cols-[120px_1fr_120px_150px] gap-4 px-6 py-5 items-center hover:bg-white/5 transition-colors">
                        <div className="font-mono text-lego-yellow font-bold text-lg">#{tx.id}</div>
                        <div className="text-sm text-white/70">{tx.date}</div>
                        <div className="text-sm font-bold bg-white/10 w-max px-3 py-1 rounded-full">{tx.items.reduce((s,i) => s + i.quantity, 0)} items</div>
                        <div className="text-right font-black text-xl text-white">${tx.total.toFixed(2)}</div>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        )}

        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex-1 p-6 sm:p-8 overflow-y-auto"
          >
             <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-lego-yellow to-yellow-500 capitalize">{userRole}</span> 👋
                  </h1>
                  <p className="text-white/40 text-sm">Here's what's happening with your store today.</p>
                </div>
                <div className="hidden lg:flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10 backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                  <span className="text-xs font-bold text-white/60 tracking-wide uppercase">System Online</span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Products", value: products.length, icon: Package, color: "#0055BF", trend: "+4 this week" },
                  { label: "Total Stock",    value: products.reduce((s, p) => s + p.stock, 0), icon: TrendingUp, color: "#00852B", trend: "+12% vs last month" },
                  { label: "Avg Rating",     value: products.length > 0 ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) : "—", icon: Star, color: "#FFD500", trend: "Based on all reviews" },
                  { label: "Low Stock Items",value: products.filter((p) => p.stock <= 5).length, icon: AlertTriangle, color: "#D1120D", trend: "Needs restock soon" },
                ].map((s, i) => (
                  <motion.div 
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden group rounded-3xl"
                  >
                    {/* Glass Background */}
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl group-hover:bg-white/10 transition-colors duration-500" />
                    
                    {/* Glowing Orb */}
                    <div 
                      className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ background: s.color }}
                    />
                    
                    <div className="p-6 relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}>
                          <s.icon className="w-6 h-6" />
                        </div>
                        <div className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                          {s.trend}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-bold text-white/50 uppercase tracking-wider mb-1">{s.label}</div>
                        <div className="text-4xl font-black text-white">{s.value}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
             </div>

             <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
                {/* Chart 1: Sales */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0d0d14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-white">Weekly Revenue</h3>
                      <p className="text-xs text-white/40 mt-1">Est. income over the last 7 days</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-lego-yellow">$3,420</div>
                      <div className="text-xs font-bold text-green-400">+14% vs last week</div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-end justify-between h-48 mt-auto relative z-10 gap-2 sm:gap-4">
                    {[
                      { day: 'Mon', val: 35 }, { day: 'Tue', val: 45 }, { day: 'Wed', val: 30 }, 
                      { day: 'Thu', val: 60 }, { day: 'Fri', val: 80 }, { day: 'Sat', val: 50 }, { day: 'Sun', val: 70 }
                    ].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: `${d.val}%` }} 
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1), type: "spring", stiffness: 50 }}
                          className="w-full max-w-[40px] rounded-t-xl transition-all duration-300 relative border-t border-lego-yellow/50"
                          style={{ 
                            background: `linear-gradient(180deg, rgba(255,213,0,0.8) 0%, rgba(255,213,0,0.1) 100%)`,
                            boxShadow: `0 0 20px rgba(255,213,0,0.15)`
                          }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white text-xs font-bold py-1.5 px-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/20 shadow-2xl pointer-events-none">
                            ${(d.val * 12).toFixed(0)}
                          </div>
                        </motion.div>
                        <span className="text-[10px] text-white/40 mt-3 font-bold uppercase group-hover:text-lego-yellow transition-colors">
                          {d.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Chart 2: Categories */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#0d0d14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-white">Top Categories</h3>
                      <p className="text-xs text-white/40 mt-1">Distribution of products in inventory</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(
                      products.reduce((acc, p) => {
                        const cat = p.category || "unknown";
                        acc[cat] = (acc[cat] || 0) + p.stock;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort(([,a], [,b]) => b - a).slice(0, 5).map(([cat, stock], i) => (
                      <div key={cat} className="group flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner shrink-0">
                          {categoryEmojis[(cat || "").toLowerCase()] || "📦"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold uppercase text-white/80 group-hover:text-white transition-colors truncate pr-2">{cat}</span>
                            <span className="text-xs font-black text-white shrink-0">{stock} <span className="text-white/40 font-normal">units</span></span>
                          </div>
                          <div className="h-2.5 bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((stock / 50) * 100, 100)}%` }}
                              transition={{ duration: 1.2, delay: 0.6 + (i * 0.1), ease: "easeOut" }}
                              className="h-full rounded-full relative"
                              style={{ 
                                background: `linear-gradient(90deg, ${categoryColors[cat.toLowerCase()] || "#FFD500"}aa, ${categoryColors[cat.toLowerCase()] || "#FFD500"})`,
                                boxShadow: `0 0 15px ${categoryColors[cat.toLowerCase()] || "#FFD500"}66` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="text-white/30 text-sm font-bold text-center py-8">No stock data available.</div>
                    )}
                  </div>
                </motion.div>
             </div>
          </motion.div>
        )}
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutModal !== "hidden" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a24] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              {checkoutModal === "confirm" && (
                <>
                  <h2 className="text-2xl font-black mb-2">Confirm Payment</h2>
                  <p className="text-white/40 text-sm mb-8">Order #{transactionId}</p>
                  
                  <div className="bg-black/50 rounded-2xl p-6 mb-8 text-center border border-white/5">
                    <div className="text-sm font-bold text-white/40 uppercase mb-2">Amount Due</div>
                    <div className="text-5xl font-black text-lego-yellow">${cartGrandTotal.toFixed(2)}</div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setCheckoutModal("hidden")} className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleCompleteTransaction} className="flex-1 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors">
                      Confirm Pay
                    </button>
                  </div>
                </>
              )}

              {checkoutModal === "success" && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black mb-2">Transaction Successful!</h2>
                  <p className="text-white/40 text-sm mb-8">Payment of ${cartGrandTotal.toFixed(2)} received.</p>
                  
                  <div className="flex flex-col gap-3">
                    <button onClick={handlePrintInvoice} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors">
                      <Printer className="w-5 h-5" /> Print Invoice
                    </button>
                    <button onClick={handleNewTransaction} className="w-full py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">
                      New Transaction
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Invoice for Printing */}
      <InvoicePrint
        ref={invoiceRef}
        cart={cart}
        total={cartTotal}
        tax={cartTax}
        grandTotal={cartGrandTotal}
        transactionId={transactionId}
      />

      {/* Product Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: 30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white z-[9999]"
            style={{
              background: toast.type === "success" ? "rgba(0,133,43,0.95)" : "rgba(209,18,13,0.95)",
              backdropFilter: "blur(16px)",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
